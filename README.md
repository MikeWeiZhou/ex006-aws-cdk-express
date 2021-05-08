# Express API Reference
An exercise in creating a small Express.js API with AWS Cloud Development Kit (CDK).


## Table of Contents
- [Development Setup](#development-setup)
  - Prerequisites
  - Setup Development Environment
- [Run API Server](#run-api-server)
- [Testing](#testing)
  - TODO
- [Deployments](#deployments)
  - Prerequisites
  - Deploy to region `us-west-2`
- [Database Migrations](#database-migrations)
  - Migration in Deployments
  - Migration in Local
  - Create New Migration
  - Migration Strategy


## Development Setup
> If using git *signed commits*, do not commit inside the devcontainer. See existing [bug](https://github.com/microsoft/vscode-remote-release/issues/2925).

> This has been tested on Linux environments (Ubuntu 20.04, WSL2) but not directly running on Windows.

### Prerequisites
- [Install VSCode](https://code.visualstudio.com)
- [Install VSCode extension: Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Install Docker Engine](https://docs.docker.com/engine/install) (tested version 20.10.2)
  - If you don't have sufficient permissions to reach Docker daemon, [create docker user group]https://stackoverflow.com/questions/48957195/how-to-fix-docker-got-permission-denied-issue)
- [Install Docker Compose](https://docs.docker.com/compose/install) (tested version 1.29.1)
- [Configure AWS credentials](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites)
  - Ensure `.devcontainer/.env` `AWS_DEV_ACCOUNT_ID` is set, all development deployments will push to that account
  - Using credential files in `~/.aws`, is the recommended way for storing credentials
  - Restart VSCode after setting credentials (ensure devcontainer Docker processes have exited before starting VSCode again by waiting 30 seconds)
- Account admin needs to [grant the user some permissions](docs/aws-deployment-account-permissions.md)

### Setup Development Environment
1. Open folder in VSCode
2. Run **Remote-Containers: Open Folder in Container...** from command palette (`F1`)

VSCode will build a development container (sandboxed development environment) and a MySQL database service. After which will setup the environment by creating '.env' files and running npm install. The entire process may take some time depending on internet connection speed and workstation specifications. However, it should take no longer than 10 minutes on a development workstation.

VSCode will load the workspace once both containers are built and automatically launched. The terminal inside VSCode will now run inside the development container (which has AWS CLI2 and CDK preinstalled).

Simply closing the VSCode IDE will automatically shutdown the services. To use the development container again, simply re-open the folder in VSCode and run **Remote-Containers: Reopen Folder in Container** from command palette (`F1`)


## Run API Server
In VSCode, run **Remote-Containers: Open Folder in Container** from command palette (`F1) to enter development container and auto start the MySQL database service. Commands must be run inside VSCode terminals, which actually is inside the development container.

- Run API in development mode (no compilation, hot-reloads)
    ```
    npm run dev
    ```
- Run API normally
    ```
    npm run build
    npm start
    ```

Database migrations must be manually run.


## Testing
TODO.


## Deployments

### Prerequisites
- [Create new Secret](https://us-west-2.console.aws.amazon.com/secretsmanager/home?region=us-west-2#!/listSecrets) named `dev/api/usw2` (the values are arbitrary, change it as you please):
    ```json
    {
      "EAR_DB_NAME": "express_api_ref",
      "EAR_DB_USER": "madison",
      "EAR_DB_PASSWORD": "reasonablylongpassword"
    }
    ```
    The Secret name is defined in [cdk/main.ts](cdk/main.ts) per-environment.

### Deploy to region `us-west-2`
In VSCode, run **Remote-Containers: Open Folder in Container** from command palette (`F1) to enter development container and auto start the MySQL database service. Commands must be run inside VSCode terminals, which actually is inside the development container.

1. In `cdk` directory, run:
    ```
    cdk bootstrap
    cdk deploy dev-api-usw2
    ```
    Database migrations are run as part of the deployment. Database schema version is defined in [cdk/main.ts](cdk/main.ts) per-environment.

2. Find API server URL:
    1. Visit EC2 > Load Balancing > [Load Balancers](https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#LoadBalancers:)
    2. Select the Load Balancer named something like `dev-a-ApiFa-1GQ2S7MAC0J4W`
    3. Scroll down on Description > Basic Configuration to find the **DNS name**, it should be something like `dev-a-ApiFa-1GQ2S7MAC0J4W-925956588.us-west-2.elb.amazonaws.com`

3. Test with the API then destroy it to save money:
    ```
    cdk destroy dev-api-usw2
    ```
    If stacks fail to be deleted, manually delete them in [CloudFormation](https://us-west-2.console.aws.amazon.com/cloudformation/home?region=us-west-2).

## Database Migrations
If database has no migrations run, and we have database schema version 1, 2, and 3. If we target DB schema version 2, both 1 and 2 upgrade scripts will run.

If database is at schema version 3, and we target DB schema version 1, both 3 and 2 downgrade scripts will run.

### Migration in Deployments
Database migration scripts are automatically run when deploying through CDK. The database schema target version is defined in [cdk/main.ts](cdk/main.ts) per-environment.
```typescript
new MainStack(app, 'dev-api-usw1', {
  env: {
    dbSchemaVersion: '20210503101932-init',
    ...
  },
});
```

### Migration in Local
For the local development environment, it must be done manually by defining the database schema target version in [.devcontainer/.env](.devcontainer/.env):
```
EAR_DB_VERSION=20210503101932-init
```

Then run the database migration script in `db` directory:
```
npm run migrate
```

### Create New Migration
1. In `db` directory, run (name can be anything):
    ```
    npx db-migrate create [name] --sql-file
    npx db-migrate create init --sql-file
    ```
    This will generate 3 files with filename consiting of [timestamp]-[name].
    ```
    Example of generated files:
    db/migrations/20210503101932-init.js
    db/migrations/sqls/20210503101932-init-down.sql
    db/migrations/sqls/20210503101932-init-up.sql
    ```
2. Add SQL code to the migration up and down script.
3. Change the target database schma version for local development environment ([.devcontainer/.env](.devcontainer/.env)) and deployments ([cdk/main.ts](cdk/main.ts)).
    ```
    The schema version is the the filename of the js file without extension:
    20210503101932-init-up.sql
    ```

### Migration Strategy
[Expand and Contract](https://www.tim-wellhausen.de/papers/ExpandAndContract/ExpandAndContract.html). Besides the regular database backup, any breaking changes should be implemented in multiple steps and individual steps are not breaking changes themselves.

For example, to rename `table.col1` to `table.col2`, we would have these individual migration points:
1. add `table.col2` and copy all data from `table.col1`, ensure that `table.col1` is no longer used
2. drop `table.col1`
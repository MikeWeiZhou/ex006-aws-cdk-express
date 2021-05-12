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

> This has been tested only on Ubuntu 20.04.

> If you encounter issues when starting/building the devcontainer, ensure your Docker- engine and compose versions are no older than the one stated.

### Prerequisites
- [Install VSCode](https://code.visualstudio.com)
- [Install VSCode extension: Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Install Docker Engine](https://docs.docker.com/engine/install) (tested version 20.10.2)
  - If you don't have sufficient permissions to run Docker without root user, [add your user to docker group](https://docs.docker.com/engine/install/linux-postinstall)
    ```
    sudo groupadd docker
    sudo usermod -aG docker $USER
    ```
- [Install Docker Compose](https://docs.docker.com/compose/install) (tested version 1.29.1)
- [Configure AWS credentials](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites)
  - Only credentials stored in `~/.aws` will work, environment variables will not be forwarded to devcontainer for security reasons
  - Ensure `.devcontainer/.env` `AWS_DEV_ACCOUNT_ID` is also set, all development deployments will push to that account
- Account admin needs to [grant the user some permissions](docs/aws-deployment-account-permissions.md)

### Setup Development Environment
The entire local development environment will be sandboxed inside a development Docker container (devcontainer). One exception is running Docker commands inside the devcontainer, commands will be forwarded to the host's Docker daemon.

1. Open folder in VSCode
2. Run **Remote-Containers: Open Folder in Container...** from command palette (`F1`)

The automated process of building and installing the development environment should take no longer than 10 minutes on a modern workstation and high speed internet connection.

Once the build completes, VSCode will automatically start and enter into the devcontainer. All terminals opened in VSCode is a shell inside the devcontainer.

Simply closing the VSCode IDE will automatically shutdown the services (devcontainer and databases). To use the development container again, simply re-open the folder in VSCode and run **Remote-Containers: Reopen Folder in Container** from command palette (`F1`)


## Run API Server
In VSCode, run **Remote-Containers: Open Folder in Container** from command palette (`F1) to enter development container and auto start the MySQL database service. Commands must be run inside VSCode terminals, which actually is inside the development container.

- Run API in development mode (auto db-migrations, no compilation, hot-reloads)
    ```
    npm run dev:server
    ```
- Run in production mode (Docker container - deployments to AWS use this)
    ```
    npm run dev:server:production
    ```


## Testing
TODO.


## Deployments

### Prerequisites
- [Create new AWS Secret](https://us-west-2.console.aws.amazon.com/secretsmanager/home?region=us-west-2#!/listSecrets) named `dev/api/usw2` (the values are arbitrary, change it as you please):
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

1. Run:
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
For the local development environment, change the database schema target version in [.devcontainer/.env](.devcontainer/.env):
```
EAR_DB_VERSION=20210503101932-init
```

To run database migrations, simply start the API server in a new terminal after updating the environment variable.


### Create New Migration
Ensure the development database has the latest database migrations. To generate database migration scripts, TypeORM compares the development database with current database models (TypeScript files in src/modules/**/*.model.ts) and generates sql code. No file will be generated if there are no changes needed.

1. In root directory, run (name can be anything):
    ```
    npm run migrations:generate [name]
    npm run migrations:generate init
    ```
    This will generate 3 files with filename consiting of [timestamp]-[name].
    ```
    Example of generated files:
    db/migrations/20210503101932-init.js
    db/migrations/sqls/20210503101932-init-down.sql
    db/migrations/sqls/20210503101932-init-up.sql
    ```
2. Change the target database schma version for local development environment ([.devcontainer/.env](.devcontainer/.env)) and deployments ([cdk/main.ts](cdk/main.ts)).
    ```
    The schema version is the the filename of the js file without extension:
    20210503101932-init.js
    ```

### Migration Strategy
[Expand and Contract](https://www.tim-wellhausen.de/papers/ExpandAndContract/ExpandAndContract.html). Besides the regular database backup, any breaking changes should be implemented in multiple steps and individual steps are not breaking changes themselves.

For example, to rename `table.col1` to `table.col2`, we would have these individual migration points:
1. add `table.col2` and copy all data from `table.col1`, ensure that `table.col1` is no longer used
2. drop `table.col1`
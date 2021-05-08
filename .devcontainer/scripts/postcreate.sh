#!/bin/bash
#
# This file setups the development environment, including running npm installs and 
# database migrations. Script working directory is the root workspace.

# root workspace (API source)
rm -rf node_modules
npm install

# db and db-migrations
cd db
rm -rf node_modules
npm install
npm run migrate
cd ..

# AWS CDK for deployments
cd cdk
rm -rf node_modules
npm install
cd ..
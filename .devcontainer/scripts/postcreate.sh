#!/bin/bash
#
# This file setups the development environment, including running npm installs and 
# database migrations. Script working directory is the root workspace.


# Set working directory to root directory
cd "$(dirname $0)"
cd ../..

# Make binary scripts executable
cd .devcontainer
chmod -R +x bin
cd ..

# root directory
rm -rf node_modules
npm install

# db and db-migrations
cd db
rm -rf node_modules
npm install
cd ..

# AWS CDK for deployments
cd cdk
rm -rf node_modules
npm install
cd ..

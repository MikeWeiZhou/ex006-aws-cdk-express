#!/bin/bash

# This file contains steps to setup the development environment.

rm -rf node_modules
npm install

cd db
rm -rf node_modules
npm install
cd ..

cd cdk
rm -rf node_modules
npm install
cd ..
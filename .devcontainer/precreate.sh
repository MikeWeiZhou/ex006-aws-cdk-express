#!/bin/bash

# Creates .env files based off .env.example

cp -n .env.example .env

cd db
cp -n .env.example .env
cd ..

cd .devcontainer
cp -n .env.example .env
cd ..
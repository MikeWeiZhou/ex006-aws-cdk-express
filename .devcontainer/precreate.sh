#!/bin/bash

# Creates .env files based off .env.example

cd .devcontainer
cp -n .env.example .env
cd ..
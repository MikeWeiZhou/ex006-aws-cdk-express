#!/bin/bash
#
# Create .env file based off .env.example, if .env doesn't already exist.
# Script working directory is the root workspace.

cd .devcontainer
cp -n .env.example .env
cd ..
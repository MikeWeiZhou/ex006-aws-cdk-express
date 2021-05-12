#!/bin/bash
#
# Create .env file based off .env.example, if .env doesn't already exist.
# Script working directory is the root workspace.

# Set working directory to .devcontainer
cd "$(dirname $0)"
cd ..

cp -n .env.example .env
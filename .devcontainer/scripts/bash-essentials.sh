#!/bin/bash
#
# 
# Append bash aliases to ~/.bashrc
printf '\n\nalias ear="npm run --prefix /workspace"\n' >> /home/node/.bashrc
printf 'alias cdk="npm run --prefix /workspace/cdk cdk --"\n' >> /home/node/.bashrc

# Update env on every terminal; avoids restarting devcontainer
printf 'export $(grep -v "^#" /workspace/.devcontainer/.env | xargs)\n' >> /home/node/.bashrc
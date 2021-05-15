#!/bin/bash
#
# 
# Append bash aliases to ~/.bashrc
printf '\n\n' >> /home/node/.bashrc
printf 'dev(){\n' >> /home/node/.bashrc
printf '  npm run --prefix /workspace dev:$1 $2 $3 $4 $5 $6 $7 $8 $9\n' >> /home/node/.bashrc
printf '}\n' >> /home/node/.bashrc

printf '\n' >> /home/node/.bashrc
printf 'test(){\n' >> /home/node/.bashrc
printf '  npm run --prefix /workspace test:$1 $2 $3 $4 $5 $6 $7 $8 $9\n' >> /home/node/.bashrc
printf '}\n' >> /home/node/.bashrc

printf '\n' >> /home/node/.bashrc
printf 'alias cdk="npm run --prefix /workspace/cdk cdk --"\n' >> /home/node/.bashrc

# Update env on every terminal; avoids restarting devcontainer
printf '\n' >> /home/node/.bashrc
printf 'export $(grep -v "^#" /workspace/.devcontainer/.env | xargs)\n' >> /home/node/.bashrc

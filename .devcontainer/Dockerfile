FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-14

# Install AWS CLI version 2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    sudo ./aws/install

# Install AWS CDK
RUN su node -c "npm install -g aws-cdk"

# Docker from docker install script
#
# Adds the Docker CLI to a container along with a script to enable using a forwarded Docker socket
# within a container to run Docker commands.
COPY .devcontainer/scripts/docker-debian.sh /tmp/library-scripts/
RUN apt-get update && bash /tmp/library-scripts/docker-debian.sh
ENTRYPOINT ["/usr/local/share/docker-init.sh"]
CMD ["sleep", "infinity"]
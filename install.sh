#!/bin/bash

echo "Starting setup for Flock Build Repository. Please make sure you have node installed."

type /usr/bin/env node &> /dev/null

if [ "$?" -eq "0" ]; then
   npm install yarn
   yarn install
   cd app/
   yarn install
   echo "Creating production build for react app"
   yarn build
   cd ../
   echo "Install successful, please start the server using yarn start <PORT_NUMBER>"
   exit
fi
echo "Node is not installed. Please install node"
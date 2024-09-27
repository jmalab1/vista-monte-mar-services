#!/bin/bash

# source code
pushd /app

npm install
npm run build

while true; do
    sleep 60
done
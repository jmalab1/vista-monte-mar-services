#!/bin/bash

# source code
pushd /app

npm ci
npm run build

service nginx start

while true; do
    sleep 60
done
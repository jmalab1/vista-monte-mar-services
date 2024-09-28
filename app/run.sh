#!/bin/bash

echo creating build package
pushd /app

npm install
npm run build

service nginx start

while true; do
    sleep 60
done
#!/bin/bash

echo creating build package
pushd /app

rm -rf /dist /node_modules

npm install
npm run build

service nginx start

while true; do
    sleep 60
done
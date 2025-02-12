#!/bin/bash

cd ../vista-monte-mar-be; npm install; cd -;

docker build -t vista-monte-mar-server -f ../vista-monte-mar-be/Dockerfile ../vista-monte-mar-be --no-cache

# cd ../vista-monte-mar-app; npm install; npm run build; cd -;

# docker build -t vista-monte-mar-app -f ../vista-monte-mar-app/Dockerfile ../vista-monte-mar-app --no-cache

docker compose up -d --force-recreate --build
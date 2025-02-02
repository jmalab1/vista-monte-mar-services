#!/bin/bash

docker build -t vista-monte-mar-server -f ../vista-monte-mar-be/Dockerfile ../vista-monte-mar-be
docker build -t vista-monte-mar-app -f ../vista-monte-mar-app/Dockerfile ../vista-monte-mar-app

docker compose up -d --force-recreate --build
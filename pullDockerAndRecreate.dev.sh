#!/bin/bash
docker pull jmalab24/vista-monte-mar-app:latest
docker pull jmalab24/vista-monte-mar-be:latest
docker compose -f docker-compose.dev.yml up --build --force-recreate -d
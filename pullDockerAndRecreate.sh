#!/bin/bash
docker pull jmalab24/costa-rica-condo-app:latest
docker compose -f docker-compose.prod.yml up --build app --force-recreate -d
#!/bin/bash

cd app

npm install
npm run build

cd ..

docker build -t jmalab24/costa-rica-condo-app:latest .
docker push jmalab24/costa-rica-condo-app:latest
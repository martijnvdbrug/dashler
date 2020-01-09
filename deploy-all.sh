#!/bin/bash
cd landingpage
./deploy.sh
cd ../app-frontend
yarn deploy
cd ../app-backend
yarn deploy
cd ../uptime
yarn deploy:all

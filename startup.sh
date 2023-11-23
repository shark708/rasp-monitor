#!/bin/sh

PORT=${1:-80}

cd fe
npm install
npm run build
echo "Frontend pages built successfully."

cd ../be
sudo npm install -g pm2
npm install
pm2 start server.js --name rasp-monitor --env PORT=$PORT --watch

echo "Server is running on port: $PORT"

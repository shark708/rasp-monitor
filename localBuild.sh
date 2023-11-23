#!/bin/sh

cd fe
npm install
npm run build
echo "Frontend pages built successfully."

cd ../be
zip -r ../monitor.zip . -x node_modules
echo "Monitor package built successfully."
# pm2 start server.js --name rasp-monitor --env PORT=80 --watch

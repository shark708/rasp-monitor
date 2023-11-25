#!/bin/sh

PORT=${1:-80}

# 安装vue环境
npm install -g @vue/cli

# 构建前端页面
cd fe
npm install
npm run build
echo "Frontend pages built successfully."

# 构建后端服务
cd ../be
sudo npm install -g pm2
npm install

# 启动服务
pm2 start server.js --name rasp-monitor --env PORT=$PORT --watch

echo "Server is running on port: $PORT"

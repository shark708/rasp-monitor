#!/bin/sh

# 检查是否提供了端口参数，如果未提供则使用默认端口 80
PORT=${1:-80}

# 进入前端目录，安装依赖并构建前端页面
cd fe
npm install
npm run build
echo "Frontend pages built successfully."

# 返回到上一级目录，进入后端目录，安装 pm2 并启动服务器
cd ../be
sudo npm install -g pm2
npm install
pm2 start server.js --watch

# 输出端口信息
echo "Server is running on port: $PORT"
pm2 start server.js --name rasp-monitor --env PORT=$PORT

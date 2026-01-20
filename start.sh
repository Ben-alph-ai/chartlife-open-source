#!/bin/bash

# 命理终端 - 一键启动脚本

echo "🔮 命理终端 OS 启动中..."
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo ""
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未检测到 .env 文件"
    echo "正在创建 .env 文件..."
    cp .env.example .env 2>/dev/null || echo "API_KEY=" > .env
    echo "请编辑 .env 文件，填入你的 Gemini API Key"
    echo ""
fi

echo "🚀 启动开发服务器..."
echo "📍 访问地址: http://localhost:3000"
echo ""

npm run dev

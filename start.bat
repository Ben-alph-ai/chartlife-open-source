@echo off
chcp 65001 >nul
echo 🔮 命理终端 OS 启动中...
echo.

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查依赖
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    call npm install
    echo.
)

:: 检查 .env 文件
if not exist ".env" (
    echo ⚠️  未检测到 .env 文件
    echo 正在创建 .env 文件...
    copy .env.example .env >nul 2>nul
    if %errorlevel% neq 0 echo API_KEY= > .env
    echo 请编辑 .env 文件，填入你的 Gemini API Key
    echo.
)

echo 🚀 启动开发服务器...
echo 📍 访问地址: http://localhost:3000
echo.

npm run dev
pause

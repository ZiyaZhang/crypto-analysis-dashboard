#!/bin/bash

# Crypto Analysis Dashboard 演示脚本 - DeepSeek版本
# 请确保已设置环境变量 DEEPSEEK_API_KEY

echo "🚀 Crypto Analysis Dashboard 演示开始 (DeepSeek版本)"
echo "=================================="

# 检查环境变量
if [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "❌ 错误: DEEPSEEK_API_KEY 环境变量未设置"
    echo "请设置: export DEEPSEEK_API_KEY='your_deepseek_api_key'"
    echo "你的API Key: sk-d4e91f892c75408c81828e8588677f79"
    echo "设置命令: export DEEPSEEK_API_KEY='sk-d4e91f892c75408c81828e8588677f79'"
    exit 1
fi

echo "✅ DeepSeek API Key 检查通过"

# 1. 安装依赖
echo ""
echo "📦 安装依赖..."
echo "安装后端依赖..."
cd backend
pip install -r requirements.txt
cd ..

echo "安装分析模块依赖..."
cd analysis_demo
pip install -r requirements.txt
cd ..

echo "安装前端依赖..."
cd frontend
npm install
cd ..

echo "✅ 依赖安装完成"

# 2. 启动后端服务
echo ""
echo "🔧 启动后端服务..."
cd backend
echo "启动 FastAPI 服务在端口 8000..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 等待后端服务启动
echo "等待后端服务启动..."
sleep 5

# 检查后端服务是否启动成功
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ 后端服务启动成功"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 3. 获取交易数据
echo ""
echo "📊 获取交易数据..."
echo "从 Etherscan 获取示例地址的交易记录..."

# 使用一个知名的以太坊地址作为示例
SAMPLE_ADDRESS="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"

echo "获取地址 $SAMPLE_ADDRESS 的交易记录..."
curl -s "http://localhost:8000/fetch_eth/$SAMPLE_ADDRESS?limit=5" | jq '.'

if [ $? -eq 0 ]; then
    echo "✅ 交易数据获取成功"
else
    echo "⚠️  交易数据获取失败，将使用示例数据"
fi

# 4. 运行分析
echo ""
echo "🧠 运行多 Agent 分析 (DeepSeek版本)..."
cd analysis_demo
python run_deepseek.py
cd ..

if [ -f "analysis_demo/result.json" ]; then
    echo "✅ 分析完成，结果已保存到 analysis_demo/result.json"
    echo "📋 分析结果预览:"
    jq '.advisor_analysis | {overall_rating, risk_assessment, recommendation, summary}' analysis_demo/result.json
else
    echo "⚠️  分析可能失败，但继续演示流程"
fi

# 5. 启动前端服务
echo ""
echo "🎨 启动前端服务..."
cd frontend
echo "启动 Next.js 开发服务器在端口 3000..."
npm run dev &
FRONTEND_PID=$!
cd ..

# 等待前端服务启动
echo "等待前端服务启动..."
sleep 10

echo ""
echo "🎉 演示环境启动完成！"
echo "=================================="
echo "📱 前端 Dashboard: http://localhost:3000"
echo "🔧 后端 API: http://localhost:8000"
echo "📚 API 文档: http://localhost:8000/docs"
echo ""
echo "💡 使用说明:"
echo "1. 打开浏览器访问 http://localhost:3000 查看 Dashboard"
echo "2. 点击 '刷新交易' 按钮获取最新交易数据"
echo "3. 点击 '刷新分析' 按钮重新运行分析"
echo "4. 查看不同标签页的分析结果"
echo ""
echo "🤖 AI 提供商: DeepSeek"
echo "🔑 API Key: ${DEEPSEEK_API_KEY:0:20}..."
echo ""
echo "🛑 停止服务:"
echo "按 Ctrl+C 停止所有服务"
echo "或运行: kill $BACKEND_PID $FRONTEND_PID"

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ 服务已停止'; exit 0" INT

# 保持脚本运行
while true; do
    sleep 1
done

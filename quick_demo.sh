#!/bin/bash

# 快速演示脚本 - 使用你的 DeepSeek API Key
echo "🚀 Crypto Analysis Dashboard 快速演示"
echo "=================================="

# 设置 DeepSeek API Key
export DEEPSEEK_API_KEY="sk-d4e91f892c75408c81828e8588677f79"
echo "✅ DeepSeek API Key 已设置"

# 选择演示方式
echo ""
echo "请选择演示方式："
echo "1. 静态HTML演示 (推荐，无需安装依赖)"
echo "2. 完整系统演示 (需要安装Python和Node.js)"
echo "3. 仅运行分析模块 (测试DeepSeek API)"
echo ""
read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 启动静态HTML演示..."
        echo "正在打开浏览器..."

        # 检查是否有可用的浏览器
        if command -v open &> /dev/null; then
            open demo.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open demo.html
        elif command -v start &> /dev/null; then
            start demo.html
        else
            echo "请手动打开 demo.html 文件"
        fi

        echo "✅ 静态演示已启动"
        echo "📱 如果浏览器没有自动打开，请手动打开 demo.html 文件"
        ;;

    2)
        echo ""
        echo "🔧 启动完整系统演示..."
        ./demo_deepseek.sh
        ;;

    3)
        echo ""
        echo "🧠 运行分析模块测试..."

        # 检查Python环境
        if ! command -v python3 &> /dev/null; then
            echo "❌ Python3 未安装，请先安装Python3"
            exit 1
        fi

        # 安装依赖
        echo "安装分析模块依赖..."
        cd analysis_demo
        pip3 install requests python-dotenv

        # 运行测试
        echo "运行DeepSeek分析测试..."
        python3 -c "
import os
os.environ['DEEPSEEK_API_KEY'] = 'sk-d4e91f892c75408c81828e8588677f79'
from agents_deepseek import position_agent
import json

# 测试数据
test_txs = [{
    'hash': '0x123...',
    'from': '0xabc...',
    'to': '0xdef...',
    'value': '1500000000000000000',
    'parsed_json': '{\"action\": \"transfer\", \"token\": \"ETH\", \"amount\": \"1.5\"}'
}]

try:
    result = position_agent(test_txs)
    print('✅ DeepSeek API 测试成功!')
    print('分析结果:')
    print(json.dumps(result, indent=2, ensure_ascii=False))
except Exception as e:
    print(f'❌ 测试失败: {e}')
"
        cd ..
        ;;

    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 演示完成！"
echo ""
echo "💡 提示："
echo "- 静态HTML演示：直接查看界面效果"
echo "- 完整系统演示：体验完整功能"
echo "- 分析模块测试：验证DeepSeek API连接"
echo ""
echo "📚 更多信息请查看 README.md"

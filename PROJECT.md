# 🚀 Crypto Analysis Dashboard

一个基于 OpenManus 框架的加密货币交易分析系统，使用多 Agent 架构进行智能分析。

## ✨ 功能特性

- 🔍 **交易数据获取**: 通过 Etherscan API 获取以太坊交易记录
- 🤖 **AI 解析**: 使用 DeepSeek API 智能解析交易类型和风险
- 🧠 **多 Agent 分析**: 持仓分析、信号分析、行业分析、投资建议
- 📊 **可视化 Dashboard**: 深色主题的现代化前端界面
- 💾 **数据存储**: SQLite 数据库存储交易和分析结果

## 🎯 快速体验

### 方案1：静态演示 (推荐)
```bash
# 直接打开HTML文件
open demo.html
```

### 方案2：v0 在线演示
1. 访问 [v0.dev](https://v0.dev)
2. 复制 `v0_dashboard.tsx` 内容
3. 实时预览和编辑

### 方案3：完整系统演示
```bash
# 设置API Key
export DEEPSEEK_API_KEY="your_deepseek_api_key"

# 启动演示
./demo_deepseek.sh
```

## 🏗️ 项目结构

```
├── backend/           # FastAPI 后端服务
├── analysis_demo/     # 多 Agent 分析模块
├── frontend/          # Next.js 前端界面
├── demo.html          # 静态演示页面
├── v0_dashboard.tsx   # v0 兼容组件
└── demo_*.sh          # 演示脚本
```

## 🛠️ 技术栈

- **前端**: Next.js + React + TypeScript + Tailwind CSS
- **后端**: FastAPI + SQLite
- **AI分析**: DeepSeek API + 多Agent架构
- **数据源**: Etherscan API

## 📱 在线演示

- **静态版本**: 直接打开 `demo.html`
- **v0版本**: 在 [v0.dev](https://v0.dev) 中使用 `v0_dashboard.tsx`
- **完整版本**: 运行演示脚本体验所有功能

## 🔧 开发说明

这是一个演示项目，展示了如何使用现代技术栈构建加密货币分析系统。所有代码都是开源的，可以自由使用和修改。

## 📄 许可证

MIT License - 仅供学习和研究使用

# 🚀 Crypto Analysis Dashboard

一个基于 OpenManus 框架的加密货币交易分析系统，使用多 Agent 架构进行智能分析。

## ✨ 功能特性

- 🔍 **交易数据获取**: 通过 Etherscan API 获取以太坊交易记录
- 🤖 **AI 解析**: 使用 DeepSeek API 智能解析交易类型和风险
- 🧠 **多 Agent 分析**: 持仓分析、信号分析、行业分析、投资建议
- 📊 **可视化 Dashboard**: 深色主题的现代化前端界面
- 💾 **数据存储**: SQLite 数据库存储交易和分析结果

## 🎯 快速体验

### 在线演示
- **Vercel 部署**: [访问在线版本](https://crypto-analysis-dashboard.vercel.app)
- **静态演示**: 直接打开 `demo.html` 文件
- **v0 版本**: 在 [v0.dev](https://v0.dev) 中使用 `v0_dashboard.tsx`

### 本地运行
```bash
# 克隆仓库
git clone https://github.com/ZiyaZhang/crypto-analysis-dashboard.git
cd crypto-analysis-dashboard

# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev
```

## 🏗️ 项目结构

```
├── frontend/          # Next.js 前端应用
├── backend/           # FastAPI 后端服务
├── analysis_demo/     # 多 Agent 分析模块
├── demo.html          # 静态演示页面
├── v0_dashboard.tsx   # v0 兼容组件
└── vercel.json        # Vercel 部署配置
```

## 🛠️ 技术栈

- **前端**: Next.js + React + TypeScript + Tailwind CSS
- **后端**: FastAPI + SQLite
- **AI分析**: DeepSeek API + 多Agent架构
- **数据源**: Etherscan API

## 📱 部署

### Vercel 部署
1. Fork 这个仓库
2. 连接 Vercel 到你的 GitHub
3. 自动部署完成

### 其他平台
- **Netlify**: 支持 Next.js 静态导出
- **GitHub Pages**: 使用静态版本
- **Docker**: 可以容器化部署

## 📄 许可证

MIT License - 仅供学习和研究使用

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。
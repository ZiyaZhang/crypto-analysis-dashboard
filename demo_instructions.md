# 🚀 Crypto Analysis Dashboard 演示方案

## 方案1：静态HTML演示 (推荐，立即可用)

**最简单的方式，无需安装任何依赖：**

```bash
# 直接打开HTML文件
open demo.html
# 或者双击 demo.html 文件
```

**特点：**
- ✅ 立即可用，无需安装依赖
- ✅ 完整的界面展示
- ✅ 模拟数据和交互效果
- ✅ 深色主题设计

## 方案2：v0 在线演示

**在 v0.dev 中使用：**

1. 访问 [v0.dev](https://v0.dev)
2. 复制 `v0_dashboard.tsx` 文件内容
3. 粘贴到 v0 编辑器中
4. 实时预览和编辑

**特点：**
- ✅ 在线实时编辑
- ✅ 响应式设计
- ✅ 交互式组件
- ✅ 可导出代码

## 方案3：快速启动脚本

**一键启动演示：**

```bash
./quick_demo.sh
```

选择演示方式：
- 静态HTML演示
- 完整系统演示
- 仅运行分析模块

## 方案4：完整系统演示

**使用你的 DeepSeek API Key：**

```bash
# 设置API Key
export DEEPSEEK_API_KEY="sk-d4e91f892c75408c81828e8588677f79"

# 启动完整演示
./demo_deepseek.sh
```

**特点：**
- ✅ 真实的AI分析
- ✅ 完整的后端API
- ✅ 实时数据更新
- ✅ 多Agent分析

## 方案5：在线部署

**部署到 Vercel/Netlify：**

1. 将 `frontend/` 目录上传到 GitHub
2. 连接 Vercel 或 Netlify
3. 自动部署和访问

## 推荐使用顺序

1. **首次体验**：使用方案1（静态HTML）
2. **界面定制**：使用方案2（v0在线）
3. **功能测试**：使用方案3（快速脚本）
4. **完整体验**：使用方案4（完整系统）

## 技术栈说明

- **前端**：Next.js + React + TypeScript + Tailwind CSS
- **后端**：FastAPI + SQLite
- **AI分析**：DeepSeek API + 多Agent架构
- **数据源**：Etherscan API

## 文件说明

- `demo.html` - 静态演示页面
- `v0_dashboard.tsx` - v0兼容组件
- `quick_demo.sh` - 快速启动脚本
- `demo_deepseek.sh` - 完整系统演示
- `backend/` - 后端API服务
- `frontend/` - 前端应用
- `analysis_demo/` - AI分析模块

## 下一步

选择你喜欢的演示方式开始体验！推荐从静态HTML开始，然后根据需要选择其他方案。

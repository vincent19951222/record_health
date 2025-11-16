# 吃树（Solo）- 个人健康管理

一个使用 React + Vite + TypeScript 构建的前端应用，用语音快速记录体重、血压、血糖、运动与睡眠等健康数据，并提供今日概览、趋势图与历史记录查看。

## 功能概览

- 语音记录：支持语音转文字并解析健康数据，确认后入库
- 今日概览：当天关键数据汇总与亮点展示
- 趋势图：近 7 天健康数据趋势曲线
- 历史记录：按类型分组显示，可增删改查
- 详情页：体重、运动、血压、血糖等数据的详细视图

## 技术栈

- 前端：React 18、React Router 7、TypeScript 5、Vite 6
- 样式：Tailwind CSS 3、PostCSS、`tailwind-merge`、`clsx`
- 工具：ESLint 9、`typescript-eslint`、`vite-tsconfig-paths`
- 部署：Vercel（仓库中包含 `.vercel/project.json`）

## 快速开始

1. 环境要求：Node.js 18+ 与 npm
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发：
   ```bash
   npm run dev
   ```
4. 构建与预览：
   ```bash
   npm run build
   npm run preview
   ```
5. 代码检查：
   ```bash
   npm run lint
   npm run check
   ```

## 项目结构

```
src/
  components/        通用与页面组件（导航栏、趋势图、语音录制等）
  pages/             路由页面（首页与各详情页）
  services/          业务服务（健康数据、语音识别）
  hooks/             自定义 Hook（主题切换等）
  types/             类型定义（健康数据模型）
  lib/               工具方法
  App.tsx            路由与全局布局
  main.tsx           应用入口
  index.css          全局样式（Tailwind）
```

## 核心模块

- 路由入口：`src/App.tsx` 使用 `react-router-dom` 配置路由与底部导航
- 健康数据服务：`src/services/healthDataService.ts` 使用 `localStorage` 持久化健康记录
- 语音识别服务：`src/services/voiceRecognitionService.ts` 提供语音识别与解析示例逻辑
- 首页视图：`src/pages/HomePage.tsx` 聚合今日概览、趋势图、历史记录与语音录制

## 部署到 Vercel

1. 在 Vercel 创建新项目并连接当前仓库
2. 框架预设选择 `Vite`，构建命令 `npm run build`，输出目录 `dist`
3. 环境变量（如需）在 Vercel 项目设置中添加
4. 推送到主分支后自动构建与部署

## 代码规范

- 使用 ESLint 与 TypeScript 保持类型安全与风格统一
- 组件使用函数式与 Hooks，样式以 Tailwind 为主
- 引入路径遵循 `vite-tsconfig-paths` 配置，避免相对路径层级过深

## 许可

本项目暂未声明具体许可协议，可根据后续需要补充。

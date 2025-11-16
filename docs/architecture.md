# 架构说明

本应用为纯前端单页应用（SPA），采用 React + Vite + TypeScript 构建，Tailwind CSS 负责样式。应用通过浏览器 `localStorage` 持久化健康数据，并提供语音识别模拟以便快速录入。

## 总体架构

- 视图层：`src/pages/*` 与 `src/components/*`
- 路由层：`src/App.tsx` 基于 `react-router-dom`
- 服务层：`src/services/*`（数据持久化与语音识别）
- 类型与工具：`src/types/*`、`src/lib/utils.ts`
- 构建与样式：Vite、Tailwind、PostCSS

## 路由与布局

- 入口：`src/main.tsx` 挂载 `App`
- 路由：`src/App.tsx` 配置主页与各详情页，并在底部渲染 `NavigationBar`

## 关键模块

- 健康数据服务：`src/services/healthDataService.ts`
  - 使用 `localStorage` 读写，提供增删改查与按类型/日期筛选
  - 单例模式，避免重复实例化

- 语音识别服务：`src/services/voiceRecognitionService.ts`
  - 模拟语音转文字与数据解析，结构化生成 `VoiceRecognitionResult`
  - 支持体重、血压、血糖、运动与睡眠信息的提取

- 首页：`src/pages/HomePage.tsx`
  - 汇总今日数据、趋势图与历史记录
  - 集成 `VoiceRecorder` 与 `VoiceConfirmModal` 完成语音录入与确认

## 数据模型

- 类型定义位于 `src/types/health.ts`，包括 `HealthRecord`、`HealthRecordType`、`VoiceRecognitionResult` 等
- `HealthRecord` 使用 `timestamp` 作为时序字段，`id` 用于唯一标识

## 状态与持久化

- 当前状态以组件内部 `useState` 为主，数据源来自 `healthDataService`
- 持久化存储为浏览器 `localStorage`，键名 `health_records`

## 依赖与构建

- 技术栈：React、React Router、TypeScript、Vite、Tailwind CSS
- 开发命令：`npm run dev` / `npm run build` / `npm run preview`

## 约定与目录

```
src/
  components/    组件（图表、记录列表、导航、录音等）
  pages/         页面（Home 与各 DetailPage）
  services/      服务（数据与语音）
  hooks/         自定义 Hook（主题切换）
  types/         数据类型定义
  lib/           工具函数
```

## 扩展建议

- 将语音识别替换为实际 API 接入
- 引入轻量状态管理（如 zustand）统一处理跨页数据
- 增加单元测试与端到端测试保障质量
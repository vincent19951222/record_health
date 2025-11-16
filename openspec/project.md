# Project Context

## Purpose
"吃树" 是一个个人健康管理工具 MVP，专注于通过语音输入快速记录健康指标。项目采用 Web 应用形式，提供无登录、纯本地存储的体验，让用户能够便捷地记录和查看体重、血压、血糖、运动和睡眠等健康数据。

**核心目标：**
- 语音优先的健康数据记录体验
- 本地存储，零 friction 的快速演示
- 聚合健康趋势概览与详细数据分析

## Tech Stack
- **前端框架：** React 18.3.1 + TypeScript 5.8.x
- **构建工具：** Vite 6.3.5
- **路由：** React Router DOM 7.3.0
- **状态管理：** Zustand 5.0.3
- **样式：** Tailwind CSS 3.4.17 + PostCSS 8.5.3
- **图标：** Lucide React 0.511.0
- **工具类：** CLSX 2.1.1 + Tailwind Merge 3.0.2
- **开发工具：** ESLint 9.25.0 + TypeScript ESLint 8.30.1

## Project Conventions

### Code Style
- **TypeScript 配置：**
  - 启用 `strict: false`（MVP 阶段放宽类型检查）
  - 使用 ES2020 target 和现代模块解析
  - 路径别名：`@/*` 映射到 `./src/*`

- **命名约定：**
  - **组件：** PascalCase (例：`VoiceRecorder`, `NavigationBar`)
  - **文件：** kebab-case (例：`health-data-service.ts`)
  - **接口/类型：** PascalCase (例：`HealthRecord`, `VoiceRecognitionResult`)
  - **变量/函数：** camelCase (例：`getHealthData`, `isRecording`)
  - **常量：** UPPER_SNAKE_CASE

- **样式规范：**
  - 优先使用 Tailwind CSS 工具类
  - 使用 `cn()` 函数合并类名
  - 响应式设计优先 (mobile-first)
  - 自定义 CSS 仅用于动画和特殊样式

### Architecture Patterns
- **目录结构：**
  ```
  src/
  ├── components/     # 可复用UI组件
  ├── pages/         # 页面组件
  ├── hooks/         # 自定义React Hooks
  ├── services/      # 业务逻辑和数据服务
  ├── types/         # TypeScript类型定义
  ├── lib/           # 工具函数
  └── assets/        # 静态资源
  ```

- **组件模式：**
  - 函数组件 + React Hooks
  - Props 接口明确定义
  - 组件职责单一，高内聚低耦合
  - 使用组合优于继承

- **数据流：**
  - 本地存储 (localStorage) 作为数据源
  - Service 层封装数据操作
  - Zustand 管理全局状态
  - 单向数据流，状态提升

### Testing Strategy
- **当前状态：** MVP 阶段暂无测试配置
- **建议测试策略：**
  - 单元测试：核心业务逻辑 (数据服务、工具函数)
  - 组件测试：关键 UI 组件 (语音录制、图表、表单)
  - 集成测试：主要用户流程 (语音记录到数据存储)
  - 建议使用 Vitest + React Testing Library

### Git Workflow
- **当前状态：** 项目未初始化 Git 仓库
- **建议工作流：**
  - **主分支：** `main`
  - **功能分支：** `feature/功能名称`
  - **提交规范：** Conventional Commits
    - `feat:` 新功能
    - `fix:` 修复
    - `refactor:` 重构
    - `docs:` 文档
    - `style:` 代码格式
    - `test:` 测试
    - `chore:` 构建工具、依赖

## Domain Context
**健康数据管理领域知识：**
- **身体指标：** 体重 (kg)、血压 (高压/低压 mmHg)、血糖 (mmol/L)
- **运动记录：** 运动类型、持续时间 (分钟)
- **睡眠数据：** 入睡时间、起床时间、睡眠时长、主观质量评价
- **数据单位：** 使用标准医疗单位，确保数据准确性
- **时间处理：** 统一使用 Unix 时间戳进行存储和计算

**用户场景：**
- 有健身习惯的上班族：关注体重、睡眠、运动记录
- 慢性病患者：需要定期记录血压、血糖指标
- 健康意识人群：希望通过语音快速记录日常健康数据

## Important Constraints
- **数据存储：** 仅限浏览器 localStorage，无服务端同步
- **隐私安全：** 所有数据本地化存储，无需担心隐私泄露
- **性能要求：** 单页应用，快速响应，支持离线使用
- **兼容性：** 现代浏览器支持，需要 Web Speech API 兼容性
- **设备限制：** 依赖设备麦克风进行语音录制
- **演示性质：** MVP 版本专注于核心功能演示，非生产环境

## External Dependencies
- **Web Speech API：** 语音识别核心依赖
- **浏览器 localStorage：** 数据持久化存储
- **Chart.js/图表库：** 健康数据趋势可视化 (项目中使用自定义图表组件)
- **AI 语音解析：** 语音转结构化数据 (需集成 AI API 或本地模型)

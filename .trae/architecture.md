# 吃树（MVP）架构文档

## 1. 系统概览
- 类型：前端单页应用（SPA），纯本地数据，无后端服务
- 核心能力：语音输入健康数据（模拟AI识别）+ 聚合趋势 + 历史管理
- 数据存储：浏览器 `localStorage`
- 目标设备：移动端优先，兼容桌面端

## 2. 技术栈
- 前端框架：React 18 + TypeScript
- 构建工具：Vite
- 路由：React Router
- 样式：Tailwind CSS
- Web API：`MediaRecorder`（录音）、`localStorage`（存储）

## 3. 目录结构
```
src/
  components/
    TodayStats.tsx              # 今日关键数据卡片
    TrendChart.tsx              # 聚合趋势图（简易SVG）
    VoiceRecorder.tsx           # 语音录制入口（底部麦克风）
    VoiceConfirmModal.tsx       # 语音识别结果确认弹窗
    HistoryRecords.tsx          # 首页历史记录（按天折叠）
    DetailChart.tsx             # 详情页通用趋势图模板
    DetailHistoryList.tsx       # 详情页历史列表（单类型）
    NavigationBar.tsx           # 底部导航栏
  pages/
    HomePage.tsx                # 首页（聚合概览）
    WeightDetailPage.tsx        # 体重详情页
    ExerciseDetailPage.tsx      # 运动详情页
    BloodPressureDetailPage.tsx # 血压详情页
    BloodSugarDetailPage.tsx    # 血糖详情页
  services/
    healthDataService.ts        # 本地数据服务（CRUD/查询）
    voiceRecognitionService.ts  # 语音→文本、健康数据解析（模拟）
  types/
    health.ts                   # 健康数据模型类型定义
  App.tsx                       # 路由与导航集成
  index.css                     # 全局样式与UI优化
```

## 4. 核心模块说明
- 数据模型（`src/types/health.ts`）
  - 定义 `WeightRecord`、`BloodPressureRecord`、`BloodSugarRecord`、`ExerciseRecord`、`SleepRecord`
  - 统一封装 `HealthRecord` 与 `HealthRecordType`
- 数据服务（`src/services/healthDataService.ts`）
  - 能力：`getAllRecords`、`saveRecord`、`saveMultipleRecords`、`updateRecord`、`deleteRecord`、`getRecordsByType`、`getTodayRecords`、`getLatestRecords`、`generateId`
  - 存储键：`health_records`
  - 可靠性：`localStorage` 读写均 `try/catch` 防止异常
- 语音识别服务（`src/services/voiceRecognitionService.ts`）
  - `speechToText(audioBlob)`：模拟语音转文本
  - `recognizeHealthData(text)`：通过正则解析文本中的体重/血压/血糖/运动/睡眠
  - 说明：MVP 阶段为模拟实现，后续可替换为真实API
- UI组件
  - `TodayStats`：今日关键数据5卡片（体重、睡眠、血压、血糖、运动）
  - `TrendChart`：近7日聚合趋势（体重折线、其他指标概览）
  - `VoiceRecorder`：长按录音、处理语音、触发识别
  - `VoiceConfirmModal`：识别结果确认与批量入库
  - `HistoryRecords`：按日期折叠展示、支持编辑/删除/补录
  - `DetailChart` + `DetailHistoryList`：详情页模板与列表
  - `NavigationBar`：底部固定导航
- 页面与路由（`src/App.tsx`）
  - `/` 首页
  - `/weight` 体重详情
  - `/exercise` 运动详情
  - `/blood-pressure` 血压详情
  - `/blood-sugar` 血糖详情

## 5. 关键数据流（语音录入）
1. 用户长按底部麦克风（`VoiceRecorder`）开始录音
2. 停止录音后生成 `audioBlob` → `speechToText`
3. 文本经 `recognizeHealthData` 解析为 `VoiceRecognitionResult`
4. 弹出 `VoiceConfirmModal` 分类型展示，用户确认
5. `saveMultipleRecords` 将多条数据一次性入库（`localStorage`）
6. 首页 `HomePage` 重新加载刷新展示

## 6. 状态管理
- 基于 React Hooks 的局部状态（无全局状态库）
- 记录增删改操作均通过服务层更新后刷新页面状态
- 弹窗/录音 UI 状态独立在各组件内维护

## 7. 错误处理与边界
- `localStorage` 读写异常捕获与降级（返回空数组）
- 麦克风权限失败时提示用户检查设置
- 语音解析失败时提示重试
- 正则解析设有范围校验（如体重 20–300kg）

## 8. 安全与隐私
- 全部数据仅存储在浏览器本地，不出网
- 清除浏览器缓存会导致数据丢失（MVP阶段可接受）
- 无账号体系与服务端，不涉及鉴权

## 9. 性能与可维护性
- 记录量较小时 `localStorage` 足够；增长后可迁移 IndexedDB
- 图表为简易SVG，渲染轻量
- 模块化：类型/服务/组件/页面分层清晰，便于替换或扩展

## 10. 可演进方向
- 替换模拟识别为真实语音/文本→结构化API
- 引入专业图表库（如 ECharts/Chart.js）
- 增加数据导出与备份（JSON/CSV）
- PWA 支持与离线能力
- IndexedDB 存储与数据迁移工具
- 可配置的单位/阈值/提醒
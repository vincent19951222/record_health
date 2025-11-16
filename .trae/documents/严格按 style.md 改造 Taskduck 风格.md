## 风格约束摘要
- 颜色：仅用于状态；默认 `bg-white text-black border-black`；需要主色/强调色时用 `bg-[#50A7C2]` 与 `bg-[#FBCB2D]`
- 边框：统一 `border-2 border-black`
- 阴影：全部移除
- 圆角：统一 `rounded-none`
- 字体与排版：结构性文本 `uppercase`，数据数字 `font-black`
- 动画：`duration-75`，交互加 `hover:bg-gray-100`、`active:translate-y-[1px]`
- 图标：使用 `lucide-react`，统一 `strokeWidth={1.5}`
- 实施方式：不改 `tailwind.config.js` 与全局 CSS；尽量直接用 Tailwind 类或必要的 `style={}` 内联

## 全局改造
- 清理页面与组件中的 `shadow-*`、`rounded-*`、彩色背景，用黑白边框与文本替换
- 页面背景统一 `bg-white`；主容器使用 `p-6`/`gap-6`
- 页头与段落标题统一 `uppercase font-semibold`，数字展示统一 `font-black`

## 组件改造清单
- `src/components/NavigationBar.tsx`
  - 顶部固定导航；移除阴影；`border-2 border-black rounded-none`
  - 导航项 `uppercase`，图标改用 Lucide（如 `Home`, `Activity`, `Droplets`, `HeartPulse`）并设置 `strokeWidth={1.5}`
  - 选中态使用 `bg-[#50A7C2] text-black`，非选中 `hover:bg-gray-100`
- `src/components/TodayStats.tsx`
  - 卡片 `border-2 border-black rounded-none bg-white`
  - 标题 `uppercase`；数值 `font-black text-black`
  - 颜色仅用于状态标识（如“未记录”用 `bg-[#FBCB2D]` 轻强调），其余保持黑白
- `src/components/TrendChart.tsx`
  - 用 Chart.js 迁移为折线图；线条 `borderColor: '#000'`，无填充；坐标轴与网格线黑白
  - 外框 `border-2 border-black rounded-none bg-white`；标题 `uppercase`
- `src/components/HistoryRecords.tsx`
  - 容器与分组项全部改为黑白边框；移除 `rounded` 与彩色标签背景
  - 标签使用 `border-2 border-black text-black uppercase`；编辑/删除/保存按钮统一黑白按钮规范
- `src/components/VoiceRecorder.tsx`
  - 录音入口改为页面内卡片，不再浮动；按钮 `border-2 border-black rounded-none bg-white uppercase`
  - 录音态/处理态使用强调色底 `bg-[#50A7C2]` 或 `bg-[#FBCB2D]`，仅用于状态
- `src/components/VoiceConfirmModal.tsx`、`src/components/ManualRecordModal.tsx`
  - 弹窗主体与分区 `border-2 border-black rounded-none bg-white`
  - 所有按钮统一黑白风格，结构性文案 `uppercase`
  - 输入框 `bg-white border-2 border-black`，聚焦用 `outline` 而非阴影
- 页面：`src/pages/HomePage.tsx`
  - 页头改为黑白边框条 `border-2 border-black rounded-none bg-white`，文案 `uppercase`

## UI 基础组件（便于复用）
- 新增轻量 JSX 组件（非全局样式）：
  - `SketchButton`：`inline-flex px-3 py-2 border-2 border-black bg-white text-black uppercase rounded-none hover:bg-gray-100 active:translate-y-[1px]`
  - `SketchInput`/`SketchSelect`：`bg-white border-2 border-black rounded-none px-3 py-2`
  - `SketchCard`：`bg-white border-2 border-black rounded-none p-6`
  - `SketchTag`：`border-2 border-black rounded-none px-2 py-1 text-xs uppercase`
  - 所有数值展示统一用 `font-black`

## 图表实现
- 依赖：`chart.js` 与（可选）`react-chartjs-2`
- 折线图配置：无阴影与渐变；交互只用默认 tooltip；颜色黑白为主，必要时用主色标注特定系列

## 交互与动画
- 统一按钮与可点击元素 `duration-75`；`hover:bg-gray-100`；`active:translate-y-[1px]`
- 去除平滑过渡与复杂阴影动画

## 依赖变更
- 新增：`chart.js`（以及 `react-chartjs-2`）
- 已有：`lucide-react`，直接使用并设定 `strokeWidth={1.5}`

## 验证与交付
- 本地运行并检查：导航、各卡片、弹窗、图表外观是否满足 style.md 规则
- 截图对比：首页、历史记录、语音录入/确认、各详情页
- 清单核对：颜色使用、边框、圆角、阴影、排版、动画、图标规范逐项打勾

## 实施顺序
1) 引入基础组件并替换按钮/输入/卡片在各处的使用
2) 改造导航与页头
3) 迁移 `TrendChart` 到 Chart.js
4) 改造历史记录与弹窗
5) 调整语音录入的布局与状态色
6) 全局排查移除阴影/圆角/彩色背景，统一黑白风格

请确认以上方案，我将据此开始逐文件实施并提交改动。
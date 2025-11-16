# 吃树（MVP）任务清单

## 状态约定
- [x] 已完成  [ ] 待办  [-] 进行中  [!] 阻塞

## 已完成（MVP实现）
- [x] 初始化 React + TS + Vite 项目
- [x] Tailwind CSS 集成与全局样式优化
- [x] 数据模型类型定义（`src/types/health.ts`）
- [x] 本地数据服务（CRUD/查询）（`src/services/healthDataService.ts`）
- [x] 语音识别服务（模拟）（`src/services/voiceRecognitionService.ts`）
- [x] 首页：今日关键数据卡片（`TodayStats`）
- [x] 首页：聚合趋势图（`TrendChart`）
- [x] 首页：历史记录（按天折叠）（`HistoryRecords`）
- [x] 语音录制入口与识别弹窗（`VoiceRecorder`/`VoiceConfirmModal`）
- [x] 手动记录弹窗（`ManualRecordModal`）
- [x] 详情页（体重/运动/血压/血糖）
- [x] 路由与底部导航栏（`App.tsx`/`NavigationBar`）

## 待办（短期迭代）
- [ ] 历史记录分页与“查看更多”完整实现
- [ ] 图表轴、刻度与多指标可视化优化
- [ ] 数据导出（JSON/CSV）与导入（恢复）
- [ ] 输入校验与边界提示（血压/血糖范围、体重单位）
- [ ] 空状态与引导提示（首次使用）
- [ ] 语音识别解析规则完善（更多表达与单位支持）
- [ ] 可配置单位与显示偏好（kg↔斤，mmHg/mmol/L展示）

## 中期计划（功能增强）
- [ ] 接入真实语音转写API（如 Web Speech/云服务）
- [ ] 接入结构化解析API（文本→健康JSON）
- [ ] 引入专业图表库（ECharts/Chart.js/Recharts）
- [ ] IndexedDB 存储与数据迁移工具（替换 localStorage）
- [ ] PWA 支持（安装、离线缓存、更新策略）
- [ ] 提醒与目标：体重/运动/睡眠目标设置与提醒

## 长期计划（可选）
- [ ] 账号与云同步（OAuth/自建后端）
- [ ] 多设备数据合并与冲突解决
- [ ] 数据分析报告与周/月报
- [ ] 国际化（i18n）与多语言支持

## 验收与测试
- [ ] 端到端使用流程脚本：录音→识别→确认→入库→展示→编辑→删除
- [ ] 单元测试：服务层（存取/查询/边界）
- [ ] 组件测试：弹窗与表单交互

## 里程碑
- M1（MVP闭环）：已完成当前实现
- M2（可视化与数据工具）：图表升级 + 导出/导入
- M3（智能化与存储）：真实AI识别 + IndexedDB + PWA
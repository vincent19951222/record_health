## 问题与根因
- 点击录音按钮后报错 `ReferenceError: setError is not defined`，来源于 `src/components/VoiceRecorder.tsx:87` 的 `startRecording`。
- 在该组件中多处调用 `setError(...)` 和 `setRecognitionStatus(...)`，但两者均未定义或注入，导致运行时引用错误。
- 证据：
  - 未定义调用：`src/components/VoiceRecorder.tsx:23`, `55`, `75`, `97–106`；`src/components/VoiceRecorder.tsx:24` 使用 `setRecognitionStatus('')`。

## 修改计划
1. 在 `VoiceRecorder` 组件内补充状态定义：
   - 添加 `const [error, setError] = useState<string | null>(null);`
   - 添加 `const [recognitionStatus, setRecognitionStatus] = useState<string>('');`
   - 这两者用于本地管理错误与识别状态，保证所有现有调用不再抛出引用错误。
2. 在 UI 中反馈错误与状态：
   - 在录音按钮下方条件渲染错误文案：当 `error` 存在时显示一行提示（红色或警告样式）。
   - 可选显示 `recognitionStatus`（如“正在录音”“处理中”）。
3. 清理与一致性：
   - 在 `cleanupRecording` 中保留现有逻辑，只重置计时与 `isRecording`，并根据需要重置 `recognitionStatus`。
   - 在 `startRecording` 开始处清空 `error` 与 `recognitionStatus`：`setError(null)`, `setRecognitionStatus('')`。
4. 可选优化（若需）：
   - 将硬编码时长 `60` 替换为配置：从 `src/config/speechConfig.ts` 读取 `recording.maxDuration`，以保持与全局配置一致。
   - 在 `catch` 中的权限与设备错误，继续使用已有分支，但统一到 `error` 状态展示。

## 验证步骤
- 本地运行页面，点击录音按钮：不再出现 `setError 未定义` 的异常。
- 触发不同错误分支（拒绝权限、无设备、被占用）时，错误文案正常显示且不崩溃。
- 正常录音并停止后，进入 `processVoiceData` 流程，`isProcessing` 切换正确，完成后复位。

## 影响范围与风险
- 改动仅限于 `src/components/VoiceRecorder.tsx`，为新增局部状态和少量 JSX 渲染，低风险。
- 不改变服务层（`voiceRecognitionService`）的行为；仅改善 UI 错误处理与组件健壮性。

## 交付内容
- 更新 `VoiceRecorder`：补充状态定义与条件渲染；保持现有业务逻辑不变。
- 简单样式（如 `text-red-500`）用于错误提示，可沿用现有 Tailwind/类名风格。
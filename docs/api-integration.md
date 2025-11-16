# API 接入指南

本指南说明如何将当前前端应用接入真实后端 API，包括语音转文字、健康数据解析与健康记录的增删改查。示例均采用浏览器原生 `fetch`，使用环境变量 `VITE_API_BASE_URL` 配置后端地址。

## 总体方案

- 基础地址：`import.meta.env.VITE_API_BASE_URL`
- 鉴权策略：使用后端颁发的短期 Token（如 `Authorization: Bearer <token>`），不要在前端硬编码密钥
- 语音流程：音频上传 → 返回文本 → 文本解析为结构化结果（`VoiceRecognitionResult`） → 用户确认 → 保存为 `HealthRecord`
- 数据持久化：默认使用 `localStorage`；接入后端时建议以服务器为准并做乐观更新

## 接口设计建议

- `POST /speech-to-text`
  - 请求：`multipart/form-data`，字段 `file` 为音频 Blob
  - 响应：`{ text: string }`

- `POST /nlp/parse-health`
  - 请求：`{ text: string }`
  - 响应：`VoiceRecognitionResult` 结构（字段可为空）：
    ```json
    {
      "weight": { "id": "...", "value": 70.5, "timestamp": 1730000000000 },
      "bloodPressure": { "id": "...", "systolic": 120, "diastolic": 80, "timestamp": 1730000000000 },
      "bloodSugar": { "id": "...", "value": 5.6, "timestamp": 1730000000000 },
      "exercise": { "id": "...", "type": "跑步", "duration": 30, "timestamp": 1730000000000 },
      "sleep": { "id": "...", "bedTime": 1730000000000, "wakeTime": 1730030000000, "duration": 420, "quality": "good", "timestamp": 1730000000000 }
    }
    ```

- `GET /health-records`
  - 响应：`HealthRecord[]`

- `POST /health-records`
  - 请求：`HealthRecord`
  - 响应：保存后的 `HealthRecord`

- `PUT /health-records/:id`
- `DELETE /health-records/:id`

## 前端接入步骤

1. 新增环境变量
   - 开发：在 `.env.local` 添加 `VITE_API_BASE_URL=https://api.example.com`
   - 部署：在平台（如 Vercel）项目设置中添加同名变量

2. 替换语音识别为真实 API
   - 修改位置：`src/services/voiceRecognitionService.ts`
   - 建议实现：
     ```ts
     const BASE_URL = import.meta.env.VITE_API_BASE_URL;

     async function speechToText(audioBlob: Blob): Promise<string> {
       const form = new FormData();
       form.append('file', audioBlob, 'audio.webm');

       const ctrl = new AbortController();
       const timer = setTimeout(() => ctrl.abort(), 20000);
       const res = await fetch(`${BASE_URL}/speech-to-text`, {
         method: 'POST', body: form, signal: ctrl.signal,
         headers: { /* 'Authorization': `Bearer ${token}` */ }
       });
       clearTimeout(timer);
       if (!res.ok) throw new Error(`STT failed ${res.status}`);
       const data = await res.json();
       return data.text as string;
     }

     async function parseHealth(text: string): Promise<VoiceRecognitionResult> {
       const res = await fetch(`${BASE_URL}/nlp/parse-health`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ text })
       });
       if (!res.ok) throw new Error(`Parse failed ${res.status}`);
       return await res.json();
     }
     ```

3. 保存记录到后端（可选）
   - 修改位置：`src/services/healthDataService.ts`
   - 方案：优先写后端并回填到本地；失败时回退到本地存储
   - 示例：
     ```ts
     async function saveRecordRemote(record: HealthRecord): Promise<HealthRecord> {
       const res = await fetch(`${BASE_URL}/health-records`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(record)
       });
       if (!res.ok) throw new Error('Save remote failed');
       return await res.json();
     }
     ```

## 音频上传细节

- 前端录音通常得到 `Blob`（`webm`/`wav`），直接以 `FormData` 上传
- 大文件建议分片或预压缩，后端限制 `max size`
- 若需采样率转换与降噪，放在后端处理管线中

## 错误处理与降级

- 使用 `AbortController` 设置请求超时；失败时提示用户并回退到本地解析逻辑
- 对 `429` 或瞬时网络错误做指数退避重试
- 记录失败事件以便后续排查

## 安全与合规

- 不在前端存储长期密钥；改用后端交换短期 Token
- 对健康数据进行传输层加密（HTTPS）与最小化收集
- 提供用户数据导出与删除能力；遵守隐私法规

## 后端响应约定

- 使用标准 HTTP 状态码与 JSON 错误结构：
  ```json
  { "error": { "code": "BAD_REQUEST", "message": "..." } }
  ```
- 所有时间戳使用毫秒 Unix 时间

## 部署平台配置（Vercel）

- 在 Vercel 项目 `Settings → Environment Variables` 添加 `VITE_API_BASE_URL`
- 如需鉴权，前端只持有短期令牌；令牌获取流程由后端路由提供

## 接入清单

- [ ] 后端 STT 与 NLP 接口可用
- [ ] 添加 `VITE_API_BASE_URL` 环境变量
- [ ] 替换 `voiceRecognitionService` 的模拟方法
- [ ] （可选）替换 `healthDataService` 为后端存储并与本地同步
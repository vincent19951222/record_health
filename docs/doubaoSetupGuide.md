# 豆包语音识别API配置指南

## 🔥 获取豆包API凭据

### 1. 注册火山引擎账号

1. 访问 [火山引擎控制台](https://console.volcengine.com/)
2. 注册并登录账号
3. 完成实名认证

### 2. 开通语音识别服务

1. 在控制台搜索"语音识别"
2. 进入"语音技术" -> "语音识别"
3. 点击"立即开通"
4. 选择"实时语音识别"服务

### 3. 创建应用

1. 在语音识别页面点击"创建应用"
2. 填写应用信息：
   - 应用名称：`吃树健康管理`
   - 应用描述：`个人健康管理应用的语音识别功能`
3. 记录以下信息：
   - **AppID**：应用ID
   - **API Key**：API密钥

### 4. 获取WebSocket地址

豆包语音识别的WebSocket地址通常是：
```
wss://openspeech.bytedance.com/api/v1/ws
```

## 🛠️ 配置步骤

### 方法1: 使用环境变量（推荐）

1. 在项目根目录创建 `.env.local` 文件：

```env
# 火山引擎豆包语音识别配置
VITE_DOUBAO_API_KEY=your_actual_api_key_here
VITE_DOUBAO_APP_ID=your_actual_app_id_here
VITE_DOUBAO_URI=wss://openspeech.bytedance.com/api/v1/ws
```

2. 替换 `your_actual_api_key_here` 和 `your_actual_app_id_here` 为您的实际凭据

3. 重启开发服务器：
```bash
npm run dev
```

### 方法2: 代码内配置

如果您不想使用环境变量，可以在代码中直接配置：

```typescript
import { voiceRecognitionService } from './src/services/voiceRecognitionService';

// 在应用启动时配置
voiceRecognitionService.configureRealSpeech(
  'your_actual_api_key',
  'your_actual_app_id',
  'wss://openspeech.bytedance.com/api/v1/ws'
);
```

### 方法3: 动态配置

创建一个设置页面，让用户输入自己的API凭据：

```typescript
// 在设置页面中
const handleSaveConfig = () => {
  voiceRecognitionService.configureRealSpeech(
    apiKey,
    appId,
    uri
  );
  alert('豆包语音识别配置成功！');
};
```

## 🔧 验证配置

### 检查配置状态

在浏览器控制台中运行：

```javascript
// 检查是否配置了真实语音识别
console.log('豆包API配置状态:', voiceRecognitionService.isRealSpeechConfigured());
```

### 测试语音识别

1. 打开应用 http://localhost:5174
2. 长按麦克风按钮
3. 说出健康数据，如："今天体重75公斤"
4. 查看识别结果

## ⚠️ 注意事项

### 安全性

- **不要提交API密钥到Git仓库** - `.env.local` 文件已经在 `.gitignore` 中
- **保护API密钥** - 不要在前端代码中硬编码真实的API密钥
- **使用环境变量** - 这是推荐的生产环境做法

### 计费和限制

- **查看计费规则** - 在火山引擎控制台查看语音识别的计费标准
- **设置调用限制** - 避免意外产生高额费用
- **监控使用量** - 定期检查API调用情况

### 网络要求

- **HTTPS要求** - 生产环境需要使用HTTPS
- **WebSocket支持** - 确保网络环境支持WebSocket连接
- **防火墙设置** - 如果在受限网络环境，需要开放相应的端口

## 🚨 故障排除

### 常见问题

**1. 连接失败**
```
错误: WebSocket连接失败
解决: 检查网络连接和防火墙设置
```

**2. 认证失败**
```
错误: 豆包API认证失败
解决: 检查API Key和App ID是否正确
```

**3. 识别失败**
```
错误: 语音识别失败
解决: 检查音频格式和网络连接
```

**4. 环境变量不生效**
```
解决:
1. 确认文件名是 .env.local
2. 重启开发服务器
3. 检查变量名是否正确
```

### 调试技巧

1. **查看浏览器控制台** - 详细的错误信息
2. **检查网络面板** - WebSocket连接状态
3. **使用模拟模式** - 开发时可以先用模拟模式测试
4. **逐步验证** - 先测试简单的连接，再测试完整的识别流程

## 📞 技术支持

如果遇到配置问题，可以：

1. **查看豆包官方文档** - [火山引擎语音识别文档](https://www.volcengine.com/docs/6288/80420)
2. **检查火山引擎控制台** - 应用状态和API密钥是否有效
3. **联系技术支持** - 火山引擎提供24/7技术支持

## 🎯 成功标志

配置成功后，您应该看到：

- ✅ 控制台显示"豆包语音识别服务配置成功"
- ✅ 应用界面不再显示"当前使用模拟语音识别"提示
- ✅ 语音识别结果更加准确和实时
- ✅ 支持更长的语音输入

现在您的吃树应用就具备了真正的语音识别能力了喵～！(๑•̀ㅂ•́)✧
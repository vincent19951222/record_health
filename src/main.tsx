import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { autoConfigureFromEnv } from './config/speechSetup'
import './diagnostic' // 导入诊断工具

// 初始化语音识别配置
const configResult = autoConfigureFromEnv()

if (import.meta.env.DEV) {
  console.log('🎙️ 语音识别配置结果:', configResult ? '豆包API已配置' : '使用模拟模式');
  console.log('💡 在控制台运行 runSpeechDiagnostic() 进行完整诊断');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/**
 * 语音识别配置初始化
 * 在应用启动时调用以配置豆包API
 */

import { voiceRecognitionService } from '../services/voiceRecognitionService';

/**
 * 配置豆包语音识别
 * @param apiKey 豆包API密钥
 * @param appId 豆包应用ID
 * @param uri WebSocket URI
 */
export function configureDoubaoSpeech(
  apiKey: string,
  appId: string,
  uri: string = 'wss://openspeech.bytedance.com/api/v1/ws'
): void {
  try {
    voiceRecognitionService.configureRealSpeech(apiKey, appId, uri);
    console.log('✅ 豆包语音识别服务配置成功');
  } catch (error) {
    console.error('❌ 豆包语音识别服务配置失败:', error);
  }
}

/**
 * 从环境变量自动配置
 */
export function autoConfigureFromEnv(): boolean {
  const apiKey = import.meta.env.VITE_DOUBAO_API_KEY;
  const appId = import.meta.env.VITE_DOUBAO_APP_ID;
  const uri = import.meta.env.VITE_DOUBAO_URI;

  // 临时禁用豆包API，使用模拟模式进行测试
  const DISABLE_DOUBAO_FOR_TESTING = true;

  if (DISABLE_DOUBAO_FOR_TESTING) {
    console.log('🧪 测试模式：强制使用模拟语音识别');
    console.log('💡 如需启用豆包API，请将 DISABLE_DOUBAO_FOR_TESTING 设为 false');
    return false;
  }

  if (apiKey && appId && uri && apiKey !== 'your_actual_api_key_here') {
    configureDoubaoSpeech(apiKey, appId, uri);
    return true;
  } else {
    console.log('💡 豆包API配置未找到，将使用模拟语音识别');
    console.log('📝 请在 .env.local 文件中配置以下环境变量:');
    console.log('   VITE_DOUBAO_API_KEY=your_api_key');
    console.log('   VITE_DOUBAO_APP_ID=your_app_id');
    console.log('   VITE_DOUBAO_URI=wss://openspeech.bytedance.com/api/v1/ws');
    return false;
  }
}

/**
 * 检查豆包API是否已配置
 */
export function isDoubaoConfigured(): boolean {
  return voiceRecognitionService.isRealSpeechConfigured();
}
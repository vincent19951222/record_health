/**
 * 语音识别配置文件
 * 用于管理豆包语音识别服务的配置信息
 */

export interface SpeechConfig {
  doubao: {
    apiKey: string;
    appId: string;
    uri: string;
    enabled: boolean;
  };
  fallback: {
    enabled: boolean;
    timeout: number; // ms
  };
  recording: {
    maxDuration: number; // seconds
    minDuration: number; // seconds
    sampleRate: number; // Hz
    channels: number;
  };
}

/**
 * 默认配置
 */
export const defaultSpeechConfig: SpeechConfig = {
  doubao: {
    apiKey: '', // 从环境变量或用户设置中获取
    appId: '', // 从环境变量或用户设置中获取
    uri: '', // WebSocket URI，例如：wss://openspeech.bytedance.com/api/v1/ws
    enabled: false // 默认禁用，需要配置后启用
  },
  fallback: {
    enabled: true,
    timeout: 10000 // 10秒超时
  },
  recording: {
    maxDuration: 60, // 最长60秒
    minDuration: 2,  // 最短2秒
    sampleRate: 16000,
    channels: 1
  }
};

/**
 * 从环境变量加载配置
 */
export function loadSpeechConfigFromEnv(): SpeechConfig {
  const config = { ...defaultSpeechConfig };

  // 从环境变量读取豆包配置
  const apiKey = import.meta.env.VITE_DOUBAO_API_KEY;
  const appId = import.meta.env.VITE_DOUBAO_APP_ID;
  const uri = import.meta.env.VITE_DOUBAO_URI;

  if (apiKey && appId && uri) {
    config.doubao = {
      apiKey,
      appId,
      uri,
      enabled: true
    };
  }

  return config;
}

/**
 * 验证配置是否有效
 */
export function validateSpeechConfig(config: SpeechConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.doubao.enabled) {
    if (!config.doubao.apiKey) {
      errors.push('豆包 API Key 不能为空');
    }
    if (!config.doubao.appId) {
      errors.push('豆包 App ID 不能为空');
    }
    if (!config.doubao.uri) {
      errors.push('豆包 WebSocket URI 不能为空');
    }
    if (!config.doubao.uri.startsWith('ws://') && !config.doubao.uri.startsWith('wss://')) {
      errors.push('豆包 URI 必须是 WebSocket 地址 (ws:// 或 wss://)');
    }
  }

  if (config.recording.minDuration >= config.recording.maxDuration) {
    errors.push('最小录音时长不能大于等于最大录音时长');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 获取当前配置（优先从环境变量）
 */
export function getCurrentSpeechConfig(): SpeechConfig {
  try {
    return loadSpeechConfigFromEnv();
  } catch (error) {
    console.warn('从环境变量加载语音配置失败，使用默认配置:', error);
    return defaultSpeechConfig;
  }
}

/**
 * 用户配置豆包API的辅助函数
 */
export function createDoubaoConfig(apiKey: string, appId: string, uri: string): SpeechConfig {
  const config = { ...defaultSpeechConfig };
  config.doubao = {
    apiKey,
    appId,
    uri,
    enabled: true
  };

  const validation = validateSpeechConfig(config);
  if (!validation.isValid) {
    throw new Error(`配置验证失败: ${validation.errors.join(', ')}`);
  }

  return config;
}
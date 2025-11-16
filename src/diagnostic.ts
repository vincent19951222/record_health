/**
 * 语音识别诊断工具
 * 用于快速诊断语音识别功能问题
 */

import { voiceRecognitionService } from './services/voiceRecognitionService';

/**
 * 运行完整的语音识别诊断
 */
export async function runSpeechDiagnostic(): Promise<void> {
  console.log('🔍 开始语音识别功能诊断...\n');

  // 1. 检查配置状态
  console.log('📋 1. 配置状态检查');
  const isRealConfigured = voiceRecognitionService.isRealSpeechConfigured();
  console.log(`   ✅ 豆包API配置状态: ${isRealConfigured ? '已配置' : '未配置'}`);

  if (!isRealConfigured) {
    console.log('   💡 提示: 当前将使用模拟语音识别模式');
  }

  // 2. 检查环境变量
  console.log('\n🌍 2. 环境变量检查');
  const envVars = {
    'VITE_DOUBAO_API_KEY': import.meta.env.VITE_DOUBAO_API_KEY ? '已设置' : '未设置',
    'VITE_DOUBAO_APP_ID': import.meta.env.VITE_DOUBAO_APP_ID ? '已设置' : '未设置',
    'VITE_DOUBAO_URI': import.meta.env.VITE_DOUBAO_URI ? '已设置' : '未设置'
  };

  Object.entries(envVars).forEach(([key, status]) => {
    console.log(`   ${status === '已设置' ? '✅' : '❌'} ${key}: ${status}`);
  });

  // 3. 检查浏览器支持
  console.log('\n🌐 3. 浏览器支持检查');
  const browserSupport = {
    mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    webSocket: typeof WebSocket !== 'undefined',
    mediaRecorder: typeof MediaRecorder !== 'undefined'
  };

  Object.entries(browserSupport).forEach(([feature, supported]) => {
    console.log(`   ${supported ? '✅' : '❌'} ${feature}: ${supported ? '支持' : '不支持'}`);
  });

  // 4. 检查麦克风权限
  console.log('\n🎤 4. 麦克风权限检查');
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      console.log(`   ✅ 麦克风权限状态: ${permission.state}`);
    } else {
      console.log('   ⚠️  无法检查麦克风权限状态（浏览器不支持）');
    }
  } catch (error) {
    console.log(`   ❌ 检查麦克风权限失败: ${error}`);
  }

  // 5. 测试模拟语音识别
  console.log('\n🎭 5. 模拟语音识别测试');
  try {
    // 创建模拟音频数据
    const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/wav' });

    console.log('   🔄 开始测试语音转文字...');
    const voiceText = await voiceRecognitionService.speechToText(mockAudioBlob);
    console.log(`   ✅ 模拟语音转文字成功: "${voiceText}"`);

    console.log('   🔄 开始测试健康数据识别...');
    const healthData = await voiceRecognitionService.recognizeHealthData(voiceText);
    console.log('   ✅ 健康数据识别成功:', JSON.stringify(healthData, null, 2));

  } catch (error) {
    console.log(`   ❌ 模拟语音识别测试失败: ${error}`);
  }

  // 6. 总结
  console.log('\n📊 诊断总结');
  console.log('   🔧 建议的修复步骤:');

  if (!isRealConfigured) {
    console.log('   1. 在 .env.local 中配置豆包API凭据');
  }

  if (!browserSupport.mediaDevices) {
    console.log('   2. 使用支持WebRTC的现代浏览器');
  }

  console.log('   3. 确保麦克风权限已授予');
  console.log('   4. 检查网络连接和防火墙设置');
  console.log('   5. 查看浏览器控制台的详细错误信息');

  console.log('\n🎯 如果问题仍然存在，请:');
  console.log('   - 打开浏览器开发者工具');
  console.log('   - 尝试录音并查看控制台输出');
  console.log('   - 检查网络面板的WebSocket连接状态');
  console.log('   - 确认豆包API凭据是否正确');
}

/**
 * 测试麦克风权限
 */
export async function testMicrophonePermission(): Promise<boolean> {
  try {
    console.log('🎤 正在测试麦克风权限...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    console.log('✅ 麦克风权限正常');
    return true;
  } catch (error) {
    console.log('❌ 麦克风权限失败:', error);
    return false;
  }
}

/**
 * 生成诊断报告
 */
export function generateDiagnosticReport(): string {
  return `
语音识别诊断报告
================

时间: ${new Date().toLocaleString()}
浏览器: ${navigator.userAgent}
平台: ${navigator.platform}

配置状态:
- 豆包API: ${voiceRecognitionService.isRealSpeechConfigured() ? '已配置' : '未配置'}
- 环境变量: ${import.meta.env.VITE_DOUBAO_API_KEY ? '已设置' : '未设置'}

浏览器支持:
- MediaDevices: ${!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)}
- WebSocket: ${typeof WebSocket !== 'undefined'}
- MediaRecorder: ${typeof MediaRecorder !== 'undefined'}

建议:
- 确保使用现代浏览器（Chrome 88+, Firefox 85+, Safari 14+）
- 授予麦克风权限
- 配置有效的豆包API凭据
- 检查网络连接和防火墙设置
`;
}

// 在开发环境中自动运行诊断
if (import.meta.env.DEV) {
  // 延迟执行，等待应用完全加载
  setTimeout(() => {
    console.log('💡 运行语音识别诊断: runSpeechDiagnostic()');
    console.log('💡 测试麦克风权限: testMicrophonePermission()');
  }, 2000);
}
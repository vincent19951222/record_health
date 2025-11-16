import { VoiceRecognitionResult } from '../types/health';
import { doubaoSpeechService } from './doubaoSpeechService';

export class VoiceRecognitionService {
  private static instance: VoiceRecognitionService;
  private useRealSpeech: boolean = false; // 控制是否使用真实语音识别

  static getInstance(): VoiceRecognitionService {
    if (!this.instance) {
      this.instance = new VoiceRecognitionService();
    }
    return this.instance;
  }

  /**
   * 配置真实语音识别服务
   */
  configureRealSpeech(apiKey: string, appId: string, uri: string): void {
    doubaoSpeechService.configure({ apiKey, appId, uri });
    this.useRealSpeech = true;
  }

  /**
   * 检查是否配置了真实语音识别
   */
  isRealSpeechConfigured(): boolean {
    return this.useRealSpeech && doubaoSpeechService.isConfigured();
  }

  // 模拟AI语音识别 - 将语音转文字并提取健康数据
  async recognizeHealthData(voiceText: string): Promise<VoiceRecognitionResult> {
    // 这里模拟AI识别过程
    // 在实际应用中，这里会调用真实的AI API
    
    const result: VoiceRecognitionResult = {};
    
    // 体重识别 - 扩展支持更多表达方式
    const weightPatterns = [
      /(\d+(?:\.\d+)?)\s*kg/i,                                    // "75kg", "75 kg"
      /体重[是为]?[多少]?\s*(\d+(?:\.\d+)?)/i,                     // "体重75", "体重是75"
      /重\s*(\d+(?:\.\d+)?)\s*(?:kg|公斤)/i,                      // "重75kg", "重75公斤"
      /称重[是为]?\s*(\d+(?:\.\d+)?)\s*(?:kg|公斤)/i,             // "称重75", "称重是75kg"
      /(\d+(?:\.\d+)?)\s*(?:kg|公斤)/i,                           // "75公斤", "75kg"
      /(\d+(?:\.\d+)?)\s*(?:斤)/i,                                // "150斤" (转换为kg)
      /(\d+(?:\.\d+)?)\s*(?:pounds?|lbs?)/i                       // "165lbs" (转换为kg)
    ];

    for (const pattern of weightPatterns) {
      const match = voiceText.match(pattern);
      if (match) {
        let weight = parseFloat(match[1]);

        // 单位转换
        if (voiceText.match(/斤/)) {
          weight = weight / 2; // 斤转公斤
        } else if (voiceText.match(/pounds?|lbs?/i)) {
          weight = weight * 0.453592; // 磅转公斤
        }

        if (weight > 20 && weight < 300) {
          result.weight = {
            id: Date.now().toString(36),
            value: Math.round(weight * 10) / 10, // 保留一位小数
            timestamp: Date.now()
          };
          break; // 找到第一个匹配就停止
        }
      }
    }

    // 血压识别 - 扩展支持更多表达方式
    const bloodPressurePatterns = [
      /血压[是为]?\s*(\d+)\s*[/／]\s*(\d+)/i,                        // "血压120/80"
      /血压.*?高压?[是为]?\s*(\d+).*?低压?[是为]?\s*(\d+)/i,         // "血压高压120低压80"
      /高压[是为]?\s*(\d+).*?低压[是为]?\s*(\d+)/i,                   // "高压120低压80"
      /收缩压[是为]?\s*(\d+).*?舒张压[是为]?\s*(\d+)/i,              // "收缩压120舒张压80"
      /血压\s*(\d+)\s*和\s*(\d+)/i,                                  // "血压120和80"
      /(\d+)\s*[/／]\s*(\d+)/i                                       // "120/80", "120／80"
    ];

    for (const pattern of bloodPressurePatterns) {
      const match = voiceText.match(pattern);
      if (match) {
        const systolic = parseInt(match[1]);
        const diastolic = parseInt(match[2]);
        if (systolic > 50 && systolic < 250 && diastolic > 30 && diastolic < 150) {
          result.bloodPressure = {
            id: Date.now().toString(36),
            systolic,
            diastolic,
            timestamp: Date.now()
          };
          break; // 找到第一个匹配就停止
        }
      }
    }

    // 血糖识别 - 扩展支持更多表达方式
    const bloodSugarPatterns = [
      /血糖[是为]?\s*(\d+(?:\.\d+)?)/i,                              // "血糖5.8", "血糖是5.8"
      /血糖值[是为]?\s*(\d+(?:\.\d+)?)/i,                           // "血糖值5.8"
      /糖化血红蛋白[是为]?\s*(\d+(?:\.\d+)?)/i,                     // "糖化血红蛋白6.0"
      /空腹血糖[是为]?\s*(\d+(?:\.\d+)?)/i,                         // "空腹血糖5.2"
      /餐后血糖[是为]?\s*(\d+(?:\.\d+)?)/i,                         // "餐后血糖7.8"
      /(\d+(?:\.\d+)?)\s*mmol/i                                     // "5.8mmol"
    ];

    for (const pattern of bloodSugarPatterns) {
      const match = voiceText.match(pattern);
      if (match) {
        const sugar = parseFloat(match[1]);
        if (sugar > 1 && sugar < 50) {
          result.bloodSugar = {
            id: Date.now().toString(36),
            value: Math.round(sugar * 10) / 10, // 保留一位小数
            timestamp: Date.now()
          };
          break; // 找到第一个匹配就停止
        }
      }
    }

    // 运动识别 - 扩展支持更多表达方式
    const exercisePatterns = [
      // 基础运动类型 + 时间
      {
        pattern: /(跑步|走路|散步|健身|运动|锻炼|游泳|骑行|瑜伽|跳绳|打球|爬山).*?(\d+)\s*(?:分钟|分|min)/i,
        typeExtractor: (text: string) => {
          if (text.match(/跑步/i)) return '跑步';
          if (text.match(/走路|散步/i)) return '走路';
          if (text.match(/健身|锻炼/i)) return '健身';
          if (text.match(/游泳/i)) return '游泳';
          if (text.match(/骑行|骑车/i)) return '骑行';
          if (text.match(/瑜伽/i)) return '瑜伽';
          if (text.match(/跳绳/i)) return '跳绳';
          if (text.match(/打球/i)) return '打球';
          if (text.match(/爬山/i)) return '爬山';
          return '运动';
        }
      },
      // 时间 + 运动类型
      {
        pattern: /(\d+)\s*(?:分钟|分|min).*?(跑步|走路|散步|健身|运动|锻炼|游泳|骑行|瑜伽|跳绳|打球|爬山)/i,
        typeExtractor: (text: string, match: RegExpMatchArray) => match[2]
      },
      // 运动了XX分钟
      {
        pattern: /运动[了|有]?\s*(\d+)\s*(?:分钟|分|min)/i,
        typeExtractor: () => '运动'
      },
      // 时长表达：半小时、一小时
      {
        pattern: /(跑步|走路|散步|健身|运动|锻炼|游泳|骑行|瑜伽|跳绳|打球|爬山).*?(半小时|一小时|半小时)/i,
        typeExtractor: (text: string, match: RegExpMatchArray) => {
          const duration = match[2].includes('半') ? 30 : 60;
          return {
            type: text.match(/跑步/i) ? '跑步' :
                  text.match(/走路|散步/i) ? '走路' :
                  text.match(/健身|锻炼/i) ? '健身' :
                  text.match(/游泳/i) ? '游泳' :
                  text.match(/骑行|骑车/i) ? '骑行' :
                  text.match(/瑜伽/i) ? '瑜伽' :
                  text.match(/跳绳/i) ? '跳绳' :
                  text.match(/打球/i) ? '打球' :
                  text.match(/爬山/i) ? '爬山' : '运动',
            duration
          };
        }
      }
    ];

    for (const { pattern, typeExtractor } of exercisePatterns) {
      const match = voiceText.match(pattern);
      if (match) {
        const resultData = typeExtractor(voiceText, match);

        if (typeof resultData === 'object' && resultData.type && resultData.duration) {
          // 处理包含type和duration的对象
          if (resultData.duration > 0 && resultData.duration < 480) { // 最多8小时
            result.exercise = {
              id: Date.now().toString(36),
              type: resultData.type,
              duration: resultData.duration,
              timestamp: Date.now()
            };
          }
        } else if (typeof resultData === 'string') {
          // 处理只返回type的情况
          const duration = parseInt(match[1] || match[2]);
          if (duration > 0 && duration < 480) {
            result.exercise = {
              id: Date.now().toString(36),
              type: resultData,
              duration,
              timestamp: Date.now()
            };
          }
        }
        break; // 找到第一个匹配就停止
      }
    }

    // 睡眠识别 - 扩展支持更多表达方式
    const sleepPatterns = [
      // 昨晚XX点睡，早上XX点醒
      {
        pattern: /昨[晚夜][日]?.*?(\d+)[点时](\d*)[分]?.*?睡[觉]?.*?今[天早日]上[天]?.*?(\d+)[点时](\d*)[分]?.*?醒[来]?/i,
        timeExtractor: (match: RegExpMatchArray) => ({
          bedHour: parseInt(match[1]),
          bedMinute: parseInt(match[2] || '0'),
          wakeHour: parseInt(match[3]),
          wakeMinute: parseInt(match[4] || '0')
        })
      },
      // XX点睡觉，XX点起床
      {
        pattern: /(\d+)[点时](\d*)[分]?.*?睡[觉]?.*?(\d+)[点时](\d*)[分]?.*?起床/i,
        timeExtractor: (match: RegExpMatchArray) => ({
          bedHour: parseInt(match[1]),
          bedMinute: parseInt(match[2] || '0'),
          wakeHour: parseInt(match[3]),
          wakeMinute: parseInt(match[4] || '0')
        })
      },
      // 睡了X小时
      {
        pattern: /睡了?\s*(\d+)\s*(?:小时|个?钟头?)/i,
        timeExtractor: (match: RegExpMatchArray) => {
          const duration = parseInt(match[1]) * 60; // 转换为分钟
          const now = new Date();
          const wakeTime = new Date(now.getTime());
          const bedTime = new Date(wakeTime.getTime() - duration * 60000);
          return {
            bedHour: bedTime.getHours(),
            bedMinute: bedTime.getMinutes(),
            wakeHour: wakeTime.getHours(),
            wakeMinute: wakeTime.getMinutes()
          };
        }
      },
      // 晚上XX点睡到早上XX点
      {
        pattern: /[晚夜]上[天]?.*?(\d+)[点时](\d*)[分]?.*?睡[觉]?.*?[早日]上[天]?.*?(\d+)[点时](\d*)[分]?/i,
        timeExtractor: (match: RegExpMatchArray) => ({
          bedHour: parseInt(match[1]),
          bedMinute: parseInt(match[2] || '0'),
          wakeHour: parseInt(match[3]),
          wakeMinute: parseInt(match[4] || '0')
        })
      }
    ];

    for (const { pattern, timeExtractor } of sleepPatterns) {
      const match = voiceText.match(pattern);
      if (match) {
        const { bedHour, bedMinute, wakeHour, wakeMinute } = timeExtractor(match);

        const now = new Date();
        const bedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), bedHour, bedMinute);
        let wakeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeHour, wakeMinute);

        // 如果起床时间早于睡觉时间，说明跨夜了
        if (wakeTime <= bedTime) {
          wakeTime.setDate(wakeTime.getDate() + 1);
        }

        const duration = Math.floor((wakeTime.getTime() - bedTime.getTime()) / (1000 * 60));

        // 验证睡眠时间的合理性（30分钟到16小时）
        if (duration >= 30 && duration <= 960) {
          result.sleep = {
            id: Date.now().toString(36),
            bedTime: bedTime.getTime(),
            wakeTime: wakeTime.getTime(),
            duration,
            quality: 'fair', // 默认质量，后面会被覆盖
            timestamp: Date.now()
          };
          break; // 找到第一个匹配就停止
        }
      }
    }

    // 睡眠质量识别 - 增强表达方式
    const qualityPatterns = [
      { keywords: /睡得好|睡得不错|睡眠质量好|睡得很香|睡眠充足|睡得很好/i, quality: 'good' as const },
      { keywords: /睡得不好|睡眠质量差|没睡好|失眠|睡不着|睡眠不足|睡得很差/i, quality: 'poor' as const },
      { keywords: /一般般|还行|凑合|普通/i, quality: 'fair' as const }
    ];

    if (result.sleep) {
      for (const { keywords, quality } of qualityPatterns) {
        if (voiceText.match(keywords)) {
          result.sleep.quality = quality;
          break;
        }
      }
    }

    return result;
  }

  // 语音转文字 - 支持真实API和模拟模式
  async speechToText(audioBlob: Blob): Promise<string> {
    // 检查是否配置了真实语音识别
    if (this.useRealSpeech && doubaoSpeechService.isConfigured()) {
      try {
        console.log('🎙️ 使用豆包语音识别API进行识别...');
        console.log('📊 音频文件大小:', audioBlob.size, 'bytes');
        return await doubaoSpeechService.speechToText(audioBlob);
      } catch (error) {
        console.warn('❌ 豆包语音识别失败，降级使用模拟模式:', error);
        console.log('🔄 降级到模拟模式...');
        return this.fallbackToMockRecognition();
      }
    }

    // 默认使用模拟模式（用于开发和测试）
    console.log('🎭 使用模拟语音识别...');
    return this.fallbackToMockRecognition();
  }

  /**
   * 降级到模拟识别（当真实API失败时使用）
   */
  private async fallbackToMockRecognition(): Promise<string> {
    return new Promise((resolve) => {
      // 模拟异步处理
      setTimeout(() => {
        // 返回一些示例文本用于测试
        const sampleTexts = [
          "我今天早上称重是75公斤，血压高压120低压80，昨晚11点睡觉，早上7点起床，感觉睡得还不错",
          "今天运动了30分钟，体重68.5kg，血糖5.8",
          "昨晚12点半睡的，早上6点半醒，血压130/85，体重80公斤",
          "体重65公斤，早上跑了5公里，血糖6.2，睡得很好"
        ];
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        resolve(randomText);
      }, 800); // 稍微快一点，模拟降级场景
    });
  }
}

export const voiceRecognitionService = VoiceRecognitionService.getInstance();
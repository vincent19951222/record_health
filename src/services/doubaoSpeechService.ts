/**
 * 火山引擎豆包语音识别服务
 * 基于 https://www.volcengine.com/docs/6288/80420
 */

export interface DoubaoConfig {
  apiKey: string;
  appId: string;
  uri: string; // WebSocket URI
}

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export class DoubaoSpeechService {
  private static instance: DoubaoSpeechService;
  private config: DoubaoConfig | null = null;
  private ws: WebSocket | null = null;

  static getInstance(): DoubaoSpeechService {
    if (!this.instance) {
      this.instance = new DoubaoSpeechService();
    }
    return this.instance;
  }

  /**
   * 配置豆包语音识别服务
   */
  configure(config: DoubaoConfig): void {
    this.config = config;
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * 将音频Blob转换为豆包API所需的格式
   */
  private async convertAudioToFormat(audioBlob: Blob): Promise<ArrayBuffer> {
    // 豆包API通常需要PCM格式，这里假设音频已经是合适的格式
    // 如果需要格式转换，可以在这里添加WebAudio API处理
    return audioBlob.arrayBuffer();
  }

  /**
   * 语音转文字 - 豆包API实现
   */
  async speechToText(audioBlob: Blob): Promise<string> {
    if (!this.config) {
      throw new Error('豆包语音服务未配置，请先调用 configure() 方法');
    }

    try {
      // 方案1: 使用WebSocket实时识别（推荐）
      if (this.config.uri.startsWith('wss://') || this.config.uri.startsWith('ws://')) {
        return this.recognizeViaWebSocket(audioBlob);
      }

      // 方案2: 使用HTTP API（备用方案）
      return this.recognizeViaHTTP(audioBlob);

    } catch (error) {
      console.error('豆包语音识别失败:', error);
      throw new Error(`语音识别失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * WebSocket方式识别语音
   */
  private async recognizeViaWebSocket(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        reject(new Error('配置未设置'));
        return;
      }

      try {
        console.log('🔗 正在连接豆包WebSocket:', this.config.uri);
        console.log('🔑 使用API Key:', this.config.apiKey.substring(0, 8) + '...');
        console.log('📱 App ID:', this.config.appId);

        this.ws = new WebSocket(this.config.uri);

        let recognizedText = '';

        this.ws.onopen = async () => {
          try {
            // 发送配置和认证信息
            this.ws!.send(JSON.stringify({
              app: {
                appid: this.config!.appId,
                token: this.config!.apiKey,
                cluster: 'volc_asr_common'
              },
              user: {
                uid: 'user_' + Date.now()
              },
              audio: {
                format: 'wav', // 音频格式
                rate: 16000,   // 采样率
                bits: 16,      // 位深
                channel: 1     // 声道数
              },
              request: {
                reqid: Date.now().toString(),
                nbest: 1
              }
            }));

            // 发送音频数据
            const audioBuffer = await this.convertAudioToFormat(audioBlob);
            this.ws!.send(audioBuffer);

            // 发送结束标识
            this.ws!.send(JSON.stringify({ "end": true }));
          } catch (error) {
            reject(new Error(`WebSocket发送失败: ${error}`));
          }
        };

        this.ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);

            if (response.code === 0 && response.data) {
              // 处理识别结果
              const segments = response.data.segments || [];
              for (const segment of segments) {
                if (segment.final_result) {
                  recognizedText += segment.text;
                }
              }

              if (response.data.is_final) {
                resolve(recognizedText);
                this.ws?.close();
              }
            } else if (response.code !== 0) {
              reject(new Error(`豆包API错误: ${response.message}`));
            }
          } catch (error) {
            reject(new Error(`响应解析失败: ${error}`));
          }
        };

        this.ws.onerror = (error) => {
          reject(new Error(`WebSocket错误: ${error}`));
        };

        this.ws.onclose = () => {
          if (!recognizedText) {
            reject(new Error('WebSocket连接关闭，未获得识别结果'));
          }
        };

        // 设置超时
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('语音识别超时'));
          }
        }, 10000); // 10秒超时

      } catch (error) {
        reject(new Error(`WebSocket创建失败: ${error}`));
      }
    });
  }

  /**
   * HTTP API方式识别语音（备用方案）
   */
  private async recognizeViaHTTP(audioBlob: Blob): Promise<string> {
    if (!this.config) {
      throw new Error('配置未设置');
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('app_id', this.config.appId);
    formData.append('format', 'wav');
    formData.append('rate', '16000');

    try {
      const response = await fetch(this.config.uri, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.code === 0 && result.data) {
        return result.data.text || '';
      } else {
        throw new Error(`豆包API错误: ${result.message}`);
      }
    } catch (error) {
      throw new Error(`HTTP请求失败: ${error}`);
    }
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.ws = null;
  }
}

export const doubaoSpeechService = DoubaoSpeechService.getInstance();
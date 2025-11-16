import React, { useState, useRef } from 'react';
import { voiceRecognitionService } from '../services/voiceRecognitionService';
import { VoiceRecognitionResult } from '../types/health';
import { SketchButton } from './ui/SketchButton';
import { Mic, LoaderCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onRecognitionComplete: (result: VoiceRecognitionResult) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecognitionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // 清除之前的错误状态
      setError(null);
      setRecognitionStatus('');

      // 检查浏览器是否支持MediaRecorder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('您的浏览器不支持语音录制功能');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/wav'
      });

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('录制过程中发生错误，请重试');
        cleanupRecording();
      };

      mediaRecorder.onstop = async () => {
        try {
          // 延迟一点时间确保数据完整性
          await new Promise(resolve => setTimeout(resolve, 100));

          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/wav'
          });

          if (audioBlob.size === 0) {
            throw new Error('录音数据为空，请检查麦克风权限');
          }

          await processVoiceData(audioBlob);
        } catch (processingError) {
          console.error('Error processing audio:', processingError);
          setError(`音频处理失败: ${processingError instanceof Error ? processingError.message : '未知错误'}`);
        } finally {
          cleanupRecording();
        }
      };

      mediaRecorder.start(100); // 100ms间隔收集数据
      setIsRecording(true);
      setRecordingTime(0);
      setRecognitionStatus('正在录音...');

      // 开始计时
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 59) { // 最长60秒
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setError('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
        } else if (error.name === 'NotFoundError') {
          setError('未找到可用的麦克风设备');
        } else if (error.name === 'NotReadableError') {
          setError('麦克风正在被其他应用使用');
        } else {
          setError(`启动录音失败: ${error.message}`);
        }
      } else {
        setError('启动录音时发生未知错误');
      }
    }
  };

  const cleanupRecording = () => {
    // 停止所有音轨
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // 清理计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 重置状态
    setIsRecording(false);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setRecognitionStatus('正在处理语音...');
    }
  };

  const processVoiceData = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      // 检查音频文件大小
      if (audioBlob.size < 100) {
        throw new Error('录音时间太短，请录至少2秒');
      }

      // 语音转文字
      setRecognitionStatus('正在识别语音...');
      const voiceText = await voiceRecognitionService.speechToText(audioBlob);

      if (!voiceText || voiceText.trim().length === 0) {
        throw new Error('未能识别到有效的语音内容，请重新录音');
      }

      console.log('语音识别结果:', voiceText);
      setRecognitionStatus('正在解析健康数据...');

      // AI识别健康数据
      const result = await voiceRecognitionService.recognizeHealthData(voiceText);
      console.log('健康数据识别结果:', result);

      // 检查是否识别到健康数据
      const hasHealthData = Object.keys(result).length > 0;

      if (!hasHealthData) {
        setError('未能识别到健康数据，请尝试明确说出体重、血压、血糖、运动或睡眠信息');
        setRecognitionStatus('识别完成，但未找到健康数据');
      } else {
        setRecognitionStatus('识别完成！');
        onRecognitionComplete(result);
      }

    } catch (error) {
      console.error('语音处理失败:', error);
      let errorMessage = '语音处理失败，请重试';

      if (error instanceof Error) {
        if (error.message.includes('录音时间太短')) {
          errorMessage = error.message;
        } else if (error.message.includes('未能识别到有效的语音内容')) {
          errorMessage = error.message;
        } else if (error.message.includes('语音识别失败')) {
          errorMessage = '语音识别服务暂时不可用，请稍后重试';
        } else if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络后重试';
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
      setRecognitionStatus('');
    } finally {
      setIsProcessing(false);
      setRecordingTime(0);

      // 3秒后清除状态信息
      setTimeout(() => {
        setRecognitionStatus('');
        setError(null);
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-sm">
        {/* 录音按钮 */}
        <SketchButton
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          disabled={isProcessing}
          variant={isRecording ? 'highlight' : 'primary'}
          className={`${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} w-20 h-20 p-0`}
        >
          {isProcessing ? (
            <LoaderCircle className="w-8 h-8" strokeWidth={1.5} />
          ) : (
            <Mic className="w-8 h-8" strokeWidth={1.5} />
          )}
        </SketchButton>

        {/* 录音时间显示 */}
        {isRecording && (
          <div className="px-3 py-1 bg-white border-2 border-black text-black rounded-none text-sm font-semibold uppercase">
            {formatTime(recordingTime)}
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm max-w-xs">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 状态提示 */}
        <div className="text-center text-sm max-w-xs text-black">
          {!isRecording && !isProcessing && !error && (
            <p>长按麦克风按钮，说出你的健康数据</p>
          )}
          {isRecording && (
            <p className="font-medium">正在录音，请说出你的健康数据...</p>
          )}
          {isProcessing && recognitionStatus && (
            <p className="font-medium">{recognitionStatus}</p>
          )}
        </div>

        
    </div>
  );
};
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
  const [error, setError] = useState<string | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimeRef = useRef<number>(0);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

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
      setRecognitionStatus('录音中...');
      recordingTimeRef.current = 0;

      // 开始计时
      timerRef.current = setInterval(() => {
        recordingTimeRef.current++;
        if (recordingTimeRef.current >= 60) { // 最长60秒
          stopRecording();
        }
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
    recordingTimeRef.current = 0;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const processVoiceData = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // 检查音频文件大小
      if (audioBlob.size < 100) {
        throw new Error('录音时间太短，请录至少2秒');
      }

      // 语音转文字
      const voiceText = await voiceRecognitionService.speechToText(audioBlob);

      if (!voiceText || voiceText.trim().length === 0) {
        throw new Error('未能识别到有效的语音内容，请重新录音');
      }

      console.log('语音识别结果:', voiceText);

      // AI识别健康数据
      const result = await voiceRecognitionService.recognizeHealthData(voiceText);
      console.log('健康数据识别结果:', result);

      // 检查是否识别到健康数据
      const hasHealthData = Object.keys(result).length > 0;

      if (!hasHealthData) {
        throw new Error('未能识别到健康数据，请尝试明确说出体重、血压、血糖、运动或睡眠信息');
      } else {
        onRecognitionComplete(result);
      }

    } catch (error) {
      console.error('语音处理失败:', error);
    } finally {
      setIsProcessing(false);
      recordingTimeRef.current = 0;
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* 录音按钮 */}
      <SketchButton
        onClick={toggleRecording}
        disabled={isProcessing}
        variant={isRecording ? 'primary' : 'highlight'}
        className={`${isRecording ? 'bg-green-200' : ''} p-0 w-48 h-12 flex-shrink-0`}
      >
        {isProcessing ? (
          <LoaderCircle className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <Mic className="w-5 h-5" strokeWidth={1.5} />
        )}
      </SketchButton>

      {/* 状态文本在按钮右边 */}
      {recognitionStatus && (
        <span className="text-sm text-gray-600 whitespace-nowrap">{recognitionStatus}</span>
      )}

      {/* 错误提示 */}
      {error && (
        <span className="text-sm text-red-600 whitespace-nowrap max-w-xs">{error}</span>
      )}
    </div>
  );
};
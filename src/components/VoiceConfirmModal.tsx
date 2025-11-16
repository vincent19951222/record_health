import React from 'react';
import { VoiceRecognitionResult, WeightRecord, BloodPressureRecord, BloodSugarRecord, ExerciseRecord, SleepRecord } from '../types/health';
import { healthDataService } from '../services/healthDataService';
import { SketchButton } from './ui/SketchButton';

interface VoiceConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: VoiceRecognitionResult | null;
}

export const VoiceConfirmModal: React.FC<VoiceConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  result 
}) => {
  if (!isOpen || !result) return null;

  const handleConfirm = () => {
    const records = [];
    
    if (result.weight) {
      records.push({
        id: result.weight.id,
        type: 'weight' as const,
        data: result.weight,
        timestamp: result.weight.timestamp
      });
    }
    
    if (result.bloodPressure) {
      records.push({
        id: result.bloodPressure.id,
        type: 'bloodPressure' as const,
        data: result.bloodPressure,
        timestamp: result.bloodPressure.timestamp
      });
    }
    
    if (result.bloodSugar) {
      records.push({
        id: result.bloodSugar.id,
        type: 'bloodSugar' as const,
        data: result.bloodSugar,
        timestamp: result.bloodSugar.timestamp
      });
    }
    
    if (result.exercise) {
      records.push({
        id: result.exercise.id,
        type: 'exercise' as const,
        data: result.exercise,
        timestamp: result.exercise.timestamp
      });
    }
    
    if (result.sleep) {
      records.push({
        id: result.sleep.id,
        type: 'sleep' as const,
        data: result.sleep,
        timestamp: result.sleep.timestamp
      });
    }

    healthDataService.saveMultipleRecords(records);
    onClose();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
  };

  const formatSleepTime = (bedTime: number, wakeTime: number) => {
    const bed = new Date(bedTime);
    const wake = new Date(wakeTime);
    return `${bed.getHours()}:${bed.getMinutes().toString().padStart(2, '0')} - ${wake.getHours()}:${wake.getMinutes().toString().padStart(2, '0')}`;
  };

  const sections = [
    {
      title: '体重',
      icon: '⚖️',
      data: result.weight,
      render: (data: WeightRecord) => (
        <div className="flex justify-between items-center">
          <span>{data.value} kg</span>
          <span className="text-sm text-gray-500">{formatTime(data.timestamp)}</span>
        </div>
      )
    },
    {
      title: '血压',
      icon: '💓',
      data: result.bloodPressure,
      render: (data: BloodPressureRecord) => (
        <div className="flex justify-between items-center">
          <span>{data.systolic}/{data.diastolic} mmHg</span>
          <span className="text-sm text-gray-500">{formatTime(data.timestamp)}</span>
        </div>
      )
    },
    {
      title: '血糖',
      icon: '🩸',
      data: result.bloodSugar,
      render: (data: BloodSugarRecord) => (
        <div className="flex justify-between items-center">
          <span>{data.value} mmol/L</span>
          <span className="text-sm text-gray-500">{formatTime(data.timestamp)}</span>
        </div>
      )
    },
    {
      title: '运动',
      icon: '🏃',
      data: result.exercise,
      render: (data: ExerciseRecord) => (
        <div className="flex justify-between items-center">
          <span>{data.type} {formatDuration(data.duration)}</span>
          <span className="text-sm text-gray-500">{formatTime(data.timestamp)}</span>
        </div>
      )
    },
    {
      title: '睡眠',
      icon: '😴',
      data: result.sleep,
      render: (data: SleepRecord) => (
        <div className="flex justify-between items-center">
          <span>
            {formatSleepTime(data.bedTime, data.wakeTime)} 
            ({formatDuration(data.duration)})
          </span>
          <span className="text-sm text-gray-500">{formatTime(data.timestamp)}</span>
        </div>
      )
    }
  ].filter(section => section.data);

  if (sections.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white border-2 border-black rounded-none p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold uppercase text-black mb-4">未识别到健康数据</h3>
          <p className="text-black mb-6">请重新录制，确保清晰地说明你的健康数据。</p>
          <div className="flex justify-end space-x-3">
            <SketchButton onClick={onClose}>关闭</SketchButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-none p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold uppercase text-black mb-4">确认健康数据</h3>
        <p className="text-black mb-6">请确认以下识别的健康数据是否正确：</p>

        <div className="space-y-4 mb-6">
          {sections.map((section, index) => (
            <div key={index} className="border-2 border-black rounded-none p-4 bg-white">
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{section.icon}</span>
                <h4 className="font-medium uppercase">{section.title}</h4>
              </div>
              {section.render(section.data)}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <SketchButton onClick={onClose}>取消</SketchButton>
          <SketchButton onClick={handleConfirm} variant="primary">确认记录</SketchButton>
        </div>
      </div>
    </div>
  );
};
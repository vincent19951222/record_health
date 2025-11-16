import React, { useState } from 'react';
import { healthDataService } from '../services/healthDataService';
import { HealthRecordType } from '../types/health';
import { SketchButton } from './ui/SketchButton';
import { SketchInput } from './ui/SketchInput';
import { SketchSelect } from './ui/SketchSelect';

interface ManualRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: HealthRecordType;
}

export const ManualRecordModal: React.FC<ManualRecordModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultType = 'weight' 
}) => {
  const [recordType, setRecordType] = useState<HealthRecordType>(defaultType);
  const [formData, setFormData] = useState<any>({});
  const [recordTime, setRecordTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const timestamp = new Date(recordTime).getTime();
    const id = healthDataService.generateId();

    let record;
    
    switch (recordType) {
      case 'weight':
        record = {
          id,
          type: 'weight' as const,
          data: {
            id,
            value: parseFloat(formData.weight),
            timestamp
          },
          timestamp
        };
        break;
      
      case 'bloodPressure':
        record = {
          id,
          type: 'bloodPressure' as const,
          data: {
            id,
            systolic: parseInt(formData.systolic),
            diastolic: parseInt(formData.diastolic),
            timestamp
          },
          timestamp
        };
        break;
      
      case 'bloodSugar':
        record = {
          id,
          type: 'bloodSugar' as const,
          data: {
            id,
            value: parseFloat(formData.bloodSugar),
            timestamp
          },
          timestamp
        };
        break;
      
      case 'exercise':
        record = {
          id,
          type: 'exercise' as const,
          data: {
            id,
            type: formData.exerciseType,
            duration: parseInt(formData.duration),
            timestamp
          },
          timestamp
        };
        break;
      
      case 'sleep':
        const bedTime = new Date(formData.bedTime).getTime();
        const wakeTime = new Date(formData.wakeTime).getTime();
        const duration = Math.floor((wakeTime - bedTime) / (1000 * 60));
        
        record = {
          id,
          type: 'sleep' as const,
          data: {
            id,
            bedTime,
            wakeTime,
            duration,
            quality: formData.quality || 'fair',
            timestamp
          },
          timestamp
        };
        break;
      
      default:
        return;
    }

    healthDataService.saveRecord(record);
    
    // 重置表单
    setFormData({});
    setRecordTime(new Date().toISOString().slice(0, 16));
    onClose();
  };

  const renderFormFields = () => {
    switch (recordType) {
      case 'weight':
        return (
          <div>
            <label className="block text-sm font-medium uppercase text-black mb-2">
              体重 (kg)
            </label>
            <SketchInput
              type="number"
              step="0.1"
              required
              placeholder="请输入体重"
              value={formData.weight || ''}
              onChange={(e) => handleInputChange('weight', e.target.value)}
            />
          </div>
        );
      
      case 'bloodPressure':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium uppercase text-black mb-2">
                收缩压 (高压)
              </label>
              <SketchInput
                type="number"
                required
                placeholder="高压"
                value={formData.systolic || ''}
                onChange={(e) => handleInputChange('systolic', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium uppercase text-black mb-2">
                舒张压 (低压)
              </label>
              <SketchInput
                type="number"
                required
                placeholder="低压"
                value={formData.diastolic || ''}
                onChange={(e) => handleInputChange('diastolic', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'bloodSugar':
        return (
          <div>
            <label className="block text-sm font-medium uppercase text-black mb-2">
              血糖 (mmol/L)
            </label>
            <SketchInput
              type="number"
              step="0.1"
              required
              placeholder="请输入血糖值"
              value={formData.bloodSugar || ''}
              onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
            />
          </div>
        );
      
      case 'exercise':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium uppercase text-black mb-2">
                运动类型
              </label>
              <SketchSelect
                required
                value={formData.exerciseType || ''}
                onChange={(e) => handleInputChange('exerciseType', e.target.value)}
              >
                <option value="">选择运动类型</option>
                <option value="跑步">跑步</option>
                <option value="走路">走路</option>
                <option value="健身">健身</option>
                <option value="游泳">游泳</option>
                <option value="骑行">骑行</option>
                <option value="其他">其他</option>
              </SketchSelect>
            </div>
            <div>
              <label className="block text-sm font-medium uppercase text-black mb-2">
                时长 (分钟)
              </label>
              <SketchInput
                type="number"
                required
                placeholder="运动时长"
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'sleep':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium uppercase text-black mb-2">
                  入睡时间
                </label>
                <SketchInput
                  type="datetime-local"
                  required
                  value={formData.bedTime || ''}
                  onChange={(e) => handleInputChange('bedTime', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase text-black mb-2">
                  起床时间
                </label>
                <SketchInput
                  type="datetime-local"
                  required
                  value={formData.wakeTime || ''}
                  onChange={(e) => handleInputChange('wakeTime', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium uppercase text-black mb-2">
                睡眠质量
              </label>
              <SketchSelect
                value={formData.quality || 'fair'}
                onChange={(e) => handleInputChange('quality', e.target.value)}
              >
                <option value="good">好</option>
                <option value="fair">一般</option>
                <option value="poor">差</option>
              </SketchSelect>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const recordTypeOptions = [
    { value: 'weight', label: '体重' },
    { value: 'bloodPressure', label: '血压' },
    { value: 'bloodSugar', label: '血糖' },
    { value: 'exercise', label: '运动' },
    { value: 'sleep', label: '睡眠' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black rounded-none p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold uppercase text-black">手动记录</h3>
          <SketchButton onClick={onClose}>关闭</SketchButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium uppercase text-black mb-2">
              记录类型
            </label>
            <SketchSelect
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as HealthRecordType)}
            >
              {recordTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SketchSelect>
          </div>

          {renderFormFields()}

          <div>
            <label className="block text-sm font-medium uppercase text-black mb-2">
              记录时间
            </label>
            <SketchInput
              type="datetime-local"
              required
              value={recordTime}
              onChange={(e) => setRecordTime(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <SketchButton type="button" onClick={onClose}>取消</SketchButton>
            <SketchButton type="submit" variant="primary">保存</SketchButton>
          </div>
        </form>
      </div>
    </div>
  );
};
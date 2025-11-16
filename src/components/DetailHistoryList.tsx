import React, { useState } from 'react';
import { HealthRecord } from '../types/health';
import { healthDataService } from '../services/healthDataService';
import { ManualRecordModal } from './ManualRecordModal';
import { SketchButton } from './ui/SketchButton';
import { SketchInput } from './ui/SketchInput';
import { SketchTag } from './ui/SketchTag';

interface DetailHistoryListProps {
  records: HealthRecord[];
  onRecordsUpdate: () => void;
}

export const DetailHistoryList: React.FC<DetailHistoryListProps> = ({ records, onRecordsUpdate }) => {
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const startEditing = (record: HealthRecord) => {
    setEditingRecord(record.id);
    setEditForm({ ...record.data });
  };

  const cancelEditing = () => {
    setEditingRecord(null);
    setEditForm({});
  };

  const saveEdit = (record: HealthRecord) => {
    const updatedRecord = {
      ...record,
      data: editForm
    };
    healthDataService.updateRecord(record.id, updatedRecord);
    setEditingRecord(null);
    onRecordsUpdate();
  };

  const deleteRecord = (recordId: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      healthDataService.deleteRecord(recordId);
      onRecordsUpdate();
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const renderRecordData = (record: HealthRecord) => {
    if (editingRecord === record.id) {
      return renderEditForm(record);
    }

    switch (record.type) {
      case 'weight':
        return <span className="font-semibold">{(record.data as any).value} kg</span>;
      case 'bloodPressure':
        return (
          <span className="font-semibold">
            {(record.data as any).systolic}/{(record.data as any).diastolic} mmHg
          </span>
        );
      case 'bloodSugar':
        return <span className="font-semibold">{(record.data as any).value} mmol/L</span>;
      case 'exercise':
        return (
          <span className="font-semibold">
            {(record.data as any).type} - {(record.data as any).duration}分钟
          </span>
        );
      case 'sleep':
        const sleepData = record.data as any;
        const bedTime = new Date(sleepData.bedTime);
        const wakeTime = new Date(sleepData.wakeTime);
        return (
          <span className="font-semibold">
            {bedTime.getHours()}:{bedTime.getMinutes().toString().padStart(2, '0')} - 
            {wakeTime.getHours()}:{wakeTime.getMinutes().toString().padStart(2, '0')}
            <span className="text-gray-500 ml-2">
              ({Math.floor(sleepData.duration / 60)}h{sleepData.duration % 60}m)
            </span>
          </span>
        );
      default:
        return <span>未知类型</span>;
    }
  };

  const renderEditForm = (record: HealthRecord) => {
    const handleInputChange = (field: string, value: any) => {
      setEditForm(prev => ({ ...prev, [field]: value }));
    };

    switch (record.type) {
      case 'weight':
        return (
          <SketchInput
            type="number"
            step="0.1"
            value={editForm.value || ''}
            onChange={(e) => handleInputChange('value', parseFloat(e.target.value))}
            className="w-20 text-sm"
            placeholder="kg"
          />
        );
      case 'bloodPressure':
        return (
          <div className="flex items-center space-x-2">
            <SketchInput
              type="number"
              value={editForm.systolic || ''}
              onChange={(e) => handleInputChange('systolic', parseInt(e.target.value))}
              className="w-16 text-sm"
              placeholder="高压"
            />
            <span>/</span>
            <SketchInput
              type="number"
              value={editForm.diastolic || ''}
              onChange={(e) => handleInputChange('diastolic', parseInt(e.target.value))}
              className="w-16 text-sm"
              placeholder="低压"
            />
          </div>
        );
      case 'bloodSugar':
        return (
          <SketchInput
            type="number"
            step="0.1"
            value={editForm.value || ''}
            onChange={(e) => handleInputChange('value', parseFloat(e.target.value))}
            className="w-20 text-sm"
            placeholder="mmol/L"
          />
        );
      case 'exercise':
        return (
          <div className="flex items-center space-x-2">
            <SketchInput
              type="text"
              value={editForm.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-20 text-sm"
              placeholder="类型"
            />
            <SketchInput
              type="number"
              value={editForm.duration || ''}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-16 text-sm"
              placeholder="分钟"
            />
          </div>
        );
      default:
        return <span>不支持编辑</span>;
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-none">
      <div className="p-4 border-b-2 border-black">
        <h3 className="text-lg font-semibold uppercase text-black">历史记录</h3>
      </div>
      
      <div className="divide-y">
        {records.map(record => (
          <div key={record.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm text-black mb-1">
                  {formatDateTime(record.timestamp)}
                </div>
                <div>{renderRecordData(record)}</div>
              </div>
              
              {editingRecord === record.id ? (
                <div className="flex space-x-2">
                  <SketchButton className="text-sm" onClick={() => saveEdit(record)}>保存</SketchButton>
                  <SketchButton className="text-sm" onClick={cancelEditing}>取消</SketchButton>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <SketchButton className="text-sm" onClick={() => startEditing(record)}>编辑</SketchButton>
                  <SketchButton className="text-sm" onClick={() => deleteRecord(record.id)}>删除</SketchButton>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {records.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>暂无记录</p>
          </div>
        )}
      </div>
    </div>
  );
};
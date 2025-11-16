import React, { useState } from 'react';
import { HealthRecord } from '../types/health';
import { healthDataService } from '../services/healthDataService';
import { ManualRecordModal } from './ManualRecordModal';
import { SketchButton } from './ui/SketchButton';
import { SketchTag } from './ui/SketchTag';
import { SketchInput } from './ui/SketchInput';

interface HistoryRecordsProps {
  records: HealthRecord[];
  onRecordsUpdate: () => void;
}

export const HistoryRecords: React.FC<HistoryRecordsProps> = ({ records, onRecordsUpdate }) => {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showManualModal, setShowManualModal] = useState(false);

  // 按日期分组记录
  const recordsByDate = records.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString('zh-CN');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, HealthRecord[]>);

  // 按日期排序
  const sortedDates = Object.keys(recordsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderRecordData = (record: HealthRecord) => {
    if (editingRecord === record.id) {
      return renderEditForm(record);
    }

    switch (record.type) {
      case 'weight':
        return <span>{(record.data as any).value} kg</span>;
      case 'bloodPressure':
        return <span>{(record.data as any).systolic}/{(record.data as any).diastolic} mmHg</span>;
      case 'bloodSugar':
        return <span>{(record.data as any).value} mmol/L</span>;
      case 'exercise':
        return <span>{(record.data as any).type} {(record.data as any).duration}分钟</span>;
      case 'sleep':
        const sleepData = record.data as any;
        const bedTime = new Date(sleepData.bedTime);
        const wakeTime = new Date(sleepData.wakeTime);
        return (
          <span>
            {bedTime.getHours()}:{bedTime.getMinutes().toString().padStart(2, '0')} - 
            {wakeTime.getHours()}:{wakeTime.getMinutes().toString().padStart(2, '0')} 
            ({Math.floor(sleepData.duration / 60)}h{sleepData.duration % 60}m)
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
            className="w-24"
            placeholder="体重(kg)"
          />
        );
      case 'bloodPressure':
        return (
          <div className="flex items-center space-x-2">
            <SketchInput
              type="number"
              value={editForm.systolic || ''}
              onChange={(e) => handleInputChange('systolic', parseInt(e.target.value))}
              className="w-16"
              placeholder="高压"
            />
            <span>/</span>
            <SketchInput
              type="number"
              value={editForm.diastolic || ''}
              onChange={(e) => handleInputChange('diastolic', parseInt(e.target.value))}
              className="w-16"
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
            className="w-20"
            placeholder="血糖值"
          />
        );
      case 'exercise':
        return (
          <div className="flex items-center space-x-2">
            <SketchInput
              type="text"
              value={editForm.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-20"
              placeholder="运动类型"
            />
            <SketchInput
              type="number"
              value={editForm.duration || ''}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-16"
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
      <div className="p-4 border-b-2 border-black flex justify-between items-center">
        <h3 className="text-lg font-semibold uppercase text-black">历史记录</h3>
        <SketchButton onClick={() => setShowManualModal(true)} variant="primary">+ 手动记录</SketchButton>
      </div>
      
      <div className="divide-y">
        {sortedDates.slice(0, 7).map(date => {
          const dayRecords = recordsByDate[date];
          const isExpanded = expandedDates.has(date);
          const recordCount = dayRecords.length;

          return (
            <div key={date} className="p-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-100 -mx-4 px-4 py-2"
                onClick={() => toggleDateExpansion(date)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <div className="font-semibold uppercase text-black">{date}</div>
                    <div className="text-sm text-black">{recordCount} 条记录</div>
                  </div>
                </div>
                <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-2">
                  {dayRecords.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-white border-2 border-black rounded-none">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-black">{formatTime(record.timestamp)}</span>
                        <SketchTag>
                          {record.type === 'weight' && '体重'}
                          {record.type === 'bloodPressure' && '血压'}
                          {record.type === 'bloodSugar' && '血糖'}
                          {record.type === 'exercise' && '运动'}
                          {record.type === 'sleep' && '睡眠'}
                        </SketchTag>
                        <div>{renderRecordData(record)}</div>
                      </div>
                      
                      {editingRecord === record.id ? (
                        <div className="flex space-x-2">
                          <SketchButton className="text-xs" onClick={() => saveEdit(record)}>保存</SketchButton>
                          <SketchButton className="text-xs" onClick={cancelEditing}>取消</SketchButton>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <SketchButton className="text-xs" onClick={() => startEditing(record)}>编辑</SketchButton>
                          <SketchButton className="text-xs" onClick={() => deleteRecord(record.id)}>删除</SketchButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedDates.length > 7 && (
        <div className="p-4 text-center border-t-2 border-black">
          <SketchButton>查看更多记录 ›</SketchButton>
        </div>
      )}

      <ManualRecordModal
        isOpen={showManualModal}
        onClose={() => {
          setShowManualModal(false);
          onRecordsUpdate();
        }}
      />
    </div>
  );
};
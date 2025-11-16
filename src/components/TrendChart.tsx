import React, { useState } from 'react';
import { HealthRecord } from '../types/health';
import { DetailChart } from './DetailChart';
import { healthDataService } from '../services/healthDataService';

type TabType = 'weight' | 'exercise' | 'bloodPressure' | 'bloodSugar';

interface TrendChartProps {
  records: HealthRecord[];
  days?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ records, days = 7 }) => {
  const [activeTab, setActiveTab] = useState<TabType>('weight');

  // 根据当前tab获取对应的记录
  const getRecordsByType = (type: TabType): HealthRecord[] => {
    return healthDataService.getRecordsByType(type);
  };

  const tabs = [
    { id: 'weight' as TabType, label: '体重' },
    { id: 'exercise' as TabType, label: '运动' },
    { id: 'bloodPressure' as TabType, label: '血压' },
    { id: 'bloodSugar' as TabType, label: '血糖' }
  ];

  return (
    <div className="bg-white p-6 border-2 border-black rounded-none">
      <h3 className="text-lg font-semibold mb-4">健康趋势</h3>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-black border-b-2 border-black -mb-[2px]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 图表内容 - 使用 DetailChart 组件 */}
      <div className="space-y-6">
        {activeTab === 'weight' && (
          <DetailChart
            records={getRecordsByType('weight')}
            title="体重"
            unit="kg"
            color="#000000"
            dataExtractor={(record) => (record.data as any).value}
            labelExtractor={(record) => new Date(record.timestamp).toLocaleDateString()}
          />
        )}

        {activeTab === 'exercise' && (
          <DetailChart
            records={getRecordsByType('exercise')}
            title="运动"
            unit="分钟"
            color="#000000"
            dataExtractor={(record) => (record.data as any).duration}
            labelExtractor={(record) => new Date(record.timestamp).toLocaleDateString()}
          />
        )}

        {activeTab === 'bloodPressure' && (
          <div className="grid md:grid-cols-2 gap-6">
            <DetailChart
              records={getRecordsByType('bloodPressure')}
              title="收缩压（高压）"
              unit="mmHg"
              color="#000000"
              dataExtractor={(record) => (record.data as any).systolic}
              labelExtractor={(record) => new Date(record.timestamp).toLocaleDateString()}
            />
            <DetailChart
              records={getRecordsByType('bloodPressure')}
              title="舒张压（低压）"
              unit="mmHg"
              color="#000000"
              dataExtractor={(record) => (record.data as any).diastolic}
              labelExtractor={(record) => new Date(record.timestamp).toLocaleDateString()}
            />
          </div>
        )}

        {activeTab === 'bloodSugar' && (
          <DetailChart
            records={getRecordsByType('bloodSugar')}
            title="血糖"
            unit="mmol/L"
            color="#000000"
            dataExtractor={(record) => (record.data as any).value}
            labelExtractor={(record) => new Date(record.timestamp).toLocaleDateString()}
          />
        )}
      </div>
    </div>
  );
};
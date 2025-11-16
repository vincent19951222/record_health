import React from 'react';
import { HealthRecord } from '../types/health';

interface DetailChartProps {
  records: HealthRecord[];
  title: string;
  unit: string;
  color: string;
  dataExtractor: (record: HealthRecord) => number | null;
  labelExtractor: (record: HealthRecord) => string;
}

export const DetailChart: React.FC<DetailChartProps> = ({ 
  records, 
  title, 
  unit, 
  color, 
  dataExtractor, 
  labelExtractor 
}) => {
  const validRecords = records
    .map(record => ({
      ...record,
      value: dataExtractor(record)
    }))
    .filter(record => record.value !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (validRecords.length === 0) {
    return (
      <div className="bg-white border-2 border-black rounded-none p-6">
        <h3 className="text-lg font-semibold uppercase mb-4 text-black">{title}趋势</h3>
        <div className="text-center text-black py-12">
          <div className="text-4xl mb-2">📊</div>
          <p>暂无{title}数据</p>
        </div>
      </div>
    );
  }

  const values = validRecords.map(r => r.value!);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;

  const points = validRecords.map((record, index) => {
    const x = (index / Math.max(validRecords.length - 1, 1)) * (chartWidth - 2 * padding) + padding;
    const y = chartHeight - padding - ((record.value! - minValue) / range) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const latestValue = validRecords[validRecords.length - 1].value;
  const latestLabel = validRecords[validRecords.length - 1].timestamp;

  return (
    <div className="bg-white border-2 border-black rounded-none p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold uppercase text-black">{title}趋势</h3>
        <div className="text-right">
          <div className="text-2xl font-black text-black">
            {latestValue?.toFixed(1)} {unit}
          </div>
          <div className="text-sm text-black">
            最新 ({new Date(latestLabel).toLocaleDateString()})
          </div>
        </div>
      </div>

      <div className="mb-4">
        <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
          <polyline
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            points={points}
          />
          {validRecords.map((record, index) => {
            const x = (index / Math.max(validRecords.length - 1, 1)) * (chartWidth - 2 * padding) + padding;
            const y = chartHeight - padding - ((record.value! - minValue) / range) * (chartHeight - 2 * padding);
            return (
              <circle
                key={record.id}
                cx={x}
                cy={y}
                r="4"
                fill="#000000"
              />
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div className="text-center p-3 bg-white border-2 border-black rounded-none">
          <div className="text-black uppercase">平均值</div>
          <div className="font-black text黑">
            {(values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1)} {unit}
          </div>
        </div>
        <div className="text-center p-3 bg白 border-2 border黑 rounded-none">
          <div className="text黑 uppercase">记录次数</div>
          <div className="font-black text黑">{values.length} 次</div>
        </div>
      </div>
    </div>
  );
};
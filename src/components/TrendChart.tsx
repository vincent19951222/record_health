import React from 'react';
import { HealthRecord } from '../types/health';

interface TrendChartProps {
  records: HealthRecord[];
  days?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ records, days = 7 }) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // 获取最近几天的记录
  const recentRecords = records.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= startDate;
  });

  // 按日期分组
  const recordsByDate = recentRecords.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, HealthRecord[]>);

  // 生成日期数组
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString();
  });

  // 计算每日数据
  const dailyData = dates.map(date => {
    const dayRecords = recordsByDate[date] || [];
    
    const weight = dayRecords.find(r => r.type === 'weight');
    const exercises = dayRecords.filter(r => r.type === 'exercise');
    const sleep = dayRecords.find(r => r.type === 'sleep');
    const bloodPressure = dayRecords.find(r => r.type === 'bloodPressure');
    const bloodSugar = dayRecords.find(r => r.type === 'bloodSugar');

    return {
      date,
      weight: weight ? (weight.data as any).value : null,
      exerciseTime: exercises.reduce((total, r) => total + (r.data as any).duration, 0),
      sleepHours: sleep ? (sleep.data as any).duration / 60 : null,
      systolic: bloodPressure ? (bloodPressure.data as any).systolic : null,
      diastolic: bloodPressure ? (bloodPressure.data as any).diastolic : null,
      bloodSugar: bloodSugar ? (bloodSugar.data as any).value : null
    };
  });

  // 简单的SVG图表
  const maxWeight = Math.max(...dailyData.map(d => d.weight || 0), 80);
  const minWeight = Math.min(...dailyData.map(d => d.weight || 100), 60);
  const weightRange = maxWeight - minWeight || 1;

  const chartWidth = 300;
  const chartHeight = 100;
  const padding = 20;

  const weightPoints = dailyData.map((day, index) => {
    const x = (index / (days - 1)) * (chartWidth - 2 * padding) + padding;
    const y = chartHeight - padding - ((day.weight || minWeight) - minWeight) / weightRange * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">健康趋势（最近{days}天）</h3>
      
      {/* 体重趋势 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">体重趋势 (kg)</h4>
        <div className="relative">
          <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={weightPoints}
            />
            {dailyData.map((day, index) => {
              if (day.weight) {
                const x = (index / (days - 1)) * (chartWidth - 2 * padding) + padding;
                const y = chartHeight - padding - ((day.weight || minWeight) - minWeight) / weightRange * (chartHeight - 2 * padding);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#3b82f6"
                  />
                );
              }
              return null;
            })}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {dates.map((date, index) => (
            <span key={index}>{new Date(date).getMonth() + 1}/{new Date(date).getDate()}</span>
          ))}
        </div>
      </div>

      {/* 其他指标概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">平均运动</div>
          <div className="text-lg font-semibold text-green-600">
            {Math.round(dailyData.reduce((sum, d) => sum + d.exerciseTime, 0) / days)}分钟
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">平均睡眠</div>
          <div className="text-lg font-semibold text-purple-600">
            {dailyData.filter(d => d.sleepHours).length > 0 
              ? (dailyData.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / dailyData.filter(d => d.sleepHours).length).toFixed(1)
              : '0'}小时
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">血压趋势</div>
          <div className="text-lg font-semibold text-red-600">
            {dailyData.filter(d => d.systolic).length > 0 ? '已记录' : '无数据'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">血糖趋势</div>
          <div className="text-lg font-semibold text-orange-600">
            {dailyData.filter(d => d.bloodSugar).length > 0 ? '已记录' : '无数据'}
          </div>
        </div>
      </div>
    </div>
  );
};
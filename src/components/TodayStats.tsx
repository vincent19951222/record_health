import React from 'react';
import { HealthRecord } from '../types/health';
import { healthDataService } from '../services/healthDataService';

interface TodayStatsProps {
  records: HealthRecord[];
}

export const TodayStats: React.FC<TodayStatsProps> = ({ records }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayRecords = records.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= today;
  });

  // 获取今日各项数据
  const todayWeight = todayRecords.find(r => r.type === 'weight');
  const todayExercise = todayRecords.filter(r => r.type === 'exercise');
  const todaySleep = todayRecords.find(r => r.type === 'sleep');
  const latestBloodPressure = records.find(r => r.type === 'bloodPressure');
  const latestBloodSugar = records.find(r => r.type === 'bloodSugar');

  // 计算今日运动总时长
  const totalExerciseTime = todayExercise.reduce((total, record) => {
    return total + (record.data as any).duration;
  }, 0);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
  };

  const formatHours = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const stats = [
    {
      title: '今日体重',
      value: todayWeight ? `${(todayWeight.data as any).value}kg` : '未记录',
      icon: '⚖️'
    },
    {
      title: '今日睡眠',
      value: todaySleep ? 
        `${formatTime((todaySleep.data as any).duration)} (${formatHours((todaySleep.data as any).bedTime)}-${formatHours((todaySleep.data as any).wakeTime)})` : 
        '未记录',
      icon: '😴'
    },
    {
      title: '最近血压',
      value: latestBloodPressure ? 
        `${(latestBloodPressure.data as any).systolic}/${(latestBloodPressure.data as any).diastolic}` : 
        '未记录',
      icon: '💓'
    },
    {
      title: '最近血糖',
      value: latestBloodSugar ? `${(latestBloodSugar.data as any).value}mmol/L` : '未记录',
      icon: '🩸'
    },
    {
      title: '今日运动',
      value: totalExerciseTime > 0 ? formatTime(totalExerciseTime) : '未记录',
      icon: '🏃'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="p-6 bg-white border-2 border-black rounded-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold uppercase text-black">{stat.title}</span>
            <span className="text-lg">{stat.icon}</span>
          </div>
          <div className="text-2xl font-black text-black">
            {stat.value === '未记录' ? (
              <span className="px-2 py-1 text-xs uppercase border-2 border-black rounded-none bg-[#FBCB2D] text-black">未记录</span>
            ) : (
              stat.value
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
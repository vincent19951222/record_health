import React, { useState, useEffect } from 'react';
import { TodayStats } from '../components/TodayStats';
import { TrendChart } from '../components/TrendChart';
import { HistoryRecords } from '../components/HistoryRecords';
import { healthDataService } from '../services/healthDataService';

export const HomePage: React.FC = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const allRecords = healthDataService.getAllRecords();
    setRecords(allRecords);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 今日关键数据 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-black uppercase mb-4">今日概览</h2>
          <TodayStats records={records} />
        </section>

        {/* 健康趋势图 */}
        <section className="mb-8">
          <TrendChart records={records} days={7} />
        </section>

        {/* 历史记录 */}
        <section>
          <HistoryRecords records={records} onRecordsUpdate={loadRecords} />
        </section>
      </main>
    </div>
  );
};

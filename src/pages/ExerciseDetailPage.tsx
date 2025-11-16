import React, { useState, useEffect } from 'react';
import { DetailChart } from '../components/DetailChart';
import { DetailHistoryList } from '../components/DetailHistoryList';
import { healthDataService } from '../services/healthDataService';
import { HealthRecord } from '../types/health';
import { SketchButton } from '../components/ui/SketchButton';
import { ManualRecordModal } from '../components/ManualRecordModal';

export const ExerciseDetailPage: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const exerciseRecords = healthDataService.getRecordsByType('exercise');
    setRecords(exerciseRecords);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-2 border-black rounded-none">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black uppercase">运动详情</h1>
            <p className="text-black">跟踪你的运动记录</p>
          </div>
          <SketchButton onClick={() => setShowManualModal(true)} variant="primary">+ 手动记录</SketchButton>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white border-2 border-black rounded-none p-6">
          <h3 className="text-lg font-semibold uppercase mb-4 text-black">运动统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-3 bg-white border-2 border-black rounded-none">
              <div className="text-sm text-black uppercase">总运动次数</div>
              <div className="text-2xl font-black text-black">{records.length}</div>
            </div>
            <div className="text-center p-3 bg-white border-2 border-black rounded-none">
              <div className="text-sm text-black uppercase">总运动时长</div>
              <div className="text-2xl font-black text-black">
                {Math.round(records.reduce((sum, r) => sum + (r.data as any).duration, 0) / 60 * 10) / 10}h
              </div>
            </div>
            <div className="text-center p-3 bg-white border-2 border-black rounded-none">
              <div className="text-sm text-black uppercase">平均时长</div>
              <div className="text-2xl font-black text-black">
                {records.length > 0 ? Math.round(records.reduce((sum, r) => sum + (r.data as any).duration, 0) / records.length) : 0}分钟
              </div>
            </div>
            <div className="text-center p-3 bg-white border-2 border-black rounded-none">
              <div className="text-sm text-black uppercase">本周运动</div>
              <div className="text-2xl font-black text-black">
                {records.filter(r => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(r.timestamp) >= weekAgo;
                }).length}次
              </div>
            </div>
          </div>
        </div>

        <DetailHistoryList records={records} onRecordsUpdate={loadRecords} />
      </main>
      <ManualRecordModal
        isOpen={showManualModal}
        onClose={() => {
          setShowManualModal(false);
          loadRecords();
        }}
        defaultType={'exercise'}
      />
    </div>
  );
};
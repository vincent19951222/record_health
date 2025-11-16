import React, { useState, useEffect } from 'react';
import { TodayStats } from '../components/TodayStats';
import { TrendChart } from '../components/TrendChart';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { VoiceConfirmModal } from '../components/VoiceConfirmModal';
import { HistoryRecords } from '../components/HistoryRecords';
import { healthDataService } from '../services/healthDataService';
import { VoiceRecognitionResult } from '../types/health';

export const HomePage: React.FC = () => {
  const [records, setRecords] = useState([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceResult, setVoiceResult] = useState<VoiceRecognitionResult | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const allRecords = healthDataService.getAllRecords();
    setRecords(allRecords);
  };

  const handleVoiceRecognition = (result: VoiceRecognitionResult) => {
    setVoiceResult(result);
    setShowVoiceModal(true);
  };

  const handleVoiceModalClose = () => {
    setShowVoiceModal(false);
    setVoiceResult(null);
    loadRecords(); // 重新加载记录
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

      {/* 语音录制按钮 */}
      <VoiceRecorder onRecognitionComplete={handleVoiceRecognition} />

      {/* 语音确认弹窗 */}
      <VoiceConfirmModal
        isOpen={showVoiceModal}
        onClose={handleVoiceModalClose}
        result={voiceResult}
      />
    </div>
  );
};

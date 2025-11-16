import React, { useState, useEffect } from 'react';
import { DetailChart } from '../components/DetailChart';
import { DetailHistoryList } from '../components/DetailHistoryList';
import { healthDataService } from '../services/healthDataService';
import { HealthRecord } from '../types/health';
import { SketchButton } from '../components/ui/SketchButton';
import { ManualRecordModal } from '../components/ManualRecordModal';

export const BloodSugarDetailPage: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const sugarRecords = healthDataService.getRecordsByType('bloodSugar');
    setRecords(sugarRecords);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-2 border-black rounded-none">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black uppercase">血糖详情</h1>
            <p className="text-black">跟踪你的血糖变化趋势</p>
          </div>
          <SketchButton onClick={() => setShowManualModal(true)} variant="primary">+ 手动记录</SketchButton>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <DetailChart
          records={records}
          title="血糖"
          unit="mmol/L"
          color="#000000"
          dataExtractor={(record) => (record.data as any).value}
          labelExtractor={(record) => new Date(record.timestamp).toLocaleDateString()}
        />

        <DetailHistoryList records={records} onRecordsUpdate={loadRecords} />
      </main>
      <ManualRecordModal
        isOpen={showManualModal}
        onClose={() => {
          setShowManualModal(false);
          loadRecords();
        }}
        defaultType={'bloodSugar'}
      />
    </div>
  );
};

import { HealthRecord, HealthRecordType, VoiceRecognitionResult } from '../types/health';

const STORAGE_KEY = 'health_records';

export class HealthDataService {
  private static instance: HealthDataService;

  static getInstance(): HealthDataService {
    if (!this.instance) {
      this.instance = new HealthDataService();
    }
    return this.instance;
  }

  // 获取所有记录
  getAllRecords(): HealthRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  // 保存记录
  saveRecord(record: HealthRecord): void {
    const records = this.getAllRecords();
    records.push(record);
    this.saveAllRecords(records);
  }

  // 批量保存记录
  saveMultipleRecords(records: HealthRecord[]): void {
    const existingRecords = this.getAllRecords();
    const newRecords = [...existingRecords, ...records];
    this.saveAllRecords(newRecords);
  }

  // 更新记录
  updateRecord(id: string, updatedRecord: HealthRecord): void {
    const records = this.getAllRecords();
    const index = records.findIndex(record => record.id === id);
    if (index !== -1) {
      records[index] = updatedRecord;
      this.saveAllRecords(records);
    }
  }

  // 删除记录
  deleteRecord(id: string): void {
    const records = this.getAllRecords();
    const filteredRecords = records.filter(record => record.id !== id);
    this.saveAllRecords(filteredRecords);
  }

  // 根据类型获取记录
  getRecordsByType(type: HealthRecordType): HealthRecord[] {
    const records = this.getAllRecords();
    return records.filter(record => record.type === type);
  }

  // 获取今日记录
  getTodayRecords(): HealthRecord[] {
    const records = this.getAllRecords();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return records.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= today && recordDate < tomorrow;
    });
  }

  // 获取最新记录（每种类型）
  getLatestRecords(): Record<HealthRecordType, HealthRecord | null> {
    const records = this.getAllRecords();
    const types: HealthRecordType[] = ['weight', 'bloodPressure', 'bloodSugar', 'exercise', 'sleep'];
    
    const latest: Record<HealthRecordType, HealthRecord | null> = {
      weight: null,
      bloodPressure: null,
      bloodSugar: null,
      exercise: null,
      sleep: null
    };

    types.forEach(type => {
      const typeRecords = records.filter(record => record.type === type);
      if (typeRecords.length > 0) {
        latest[type] = typeRecords.reduce((latest, current) => 
          current.timestamp > latest.timestamp ? current : latest
        );
      }
    });

    return latest;
  }

  // 生成唯一ID
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 保存所有记录到localStorage
  private saveAllRecords(records: HealthRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // 清除所有数据（用于测试）
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const healthDataService = HealthDataService.getInstance();
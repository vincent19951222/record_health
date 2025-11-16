export interface WeightRecord {
  id: string;
  value: number; // kg
  timestamp: number;
}

export interface BloodPressureRecord {
  id: string;
  systolic: number; // 高压
  diastolic: number; // 低压
  timestamp: number;
}

export interface BloodSugarRecord {
  id: string;
  value: number; // mmol/L
  timestamp: number;
}

export interface ExerciseRecord {
  id: string;
  type: string; // 运动类型
  duration: number; // 分钟
  timestamp: number;
}

export interface SleepRecord {
  id: string;
  bedTime: number; // 入睡时间戳
  wakeTime: number; // 起床时间戳
  duration: number; // 睡眠时长（分钟）
  quality: 'good' | 'fair' | 'poor'; // 睡眠质量
  timestamp: number; // 记录时间
}

export type HealthRecordType = 'weight' | 'bloodPressure' | 'bloodSugar' | 'exercise' | 'sleep';

export interface HealthRecord {
  id: string;
  type: HealthRecordType;
  data: WeightRecord | BloodPressureRecord | BloodSugarRecord | ExerciseRecord | SleepRecord;
  timestamp: number;
}

export interface VoiceRecognitionResult {
  weight?: WeightRecord;
  bloodPressure?: BloodPressureRecord;
  bloodSugar?: BloodSugarRecord;
  exercise?: ExerciseRecord;
  sleep?: SleepRecord;
}
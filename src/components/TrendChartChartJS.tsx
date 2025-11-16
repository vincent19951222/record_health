import React from 'react'
import { HealthRecord } from '../types/health'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

interface TrendChartProps {
  records: HealthRecord[]
  days?: number
}

export const TrendChartChartJS: React.FC<TrendChartProps> = ({ records, days = 7 }) => {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  const recentRecords = records.filter(record => new Date(record.timestamp) >= startDate)
  const recordsByDate = recentRecords.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(record)
    return acc
  }, {} as Record<string, HealthRecord[]>)

  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000)
    return date.toLocaleDateString()
  })

  const dailyData = dates.map(date => {
    const dayRecords = recordsByDate[date] || []
    const weight = dayRecords.find(r => r.type === 'weight')
    const exercises = dayRecords.filter(r => r.type === 'exercise')
    const sleep = dayRecords.find(r => r.type === 'sleep')
    const bloodPressure = dayRecords.find(r => r.type === 'bloodPressure')
    const bloodSugar = dayRecords.find(r => r.type === 'bloodSugar')
    return {
      date,
      weight: weight ? (weight.data as any).value : null,
      exerciseTime: exercises.reduce((total, r) => total + (r.data as any).duration, 0),
      sleepHours: sleep ? (sleep.data as any).duration / 60 : null,
      systolic: bloodPressure ? (bloodPressure.data as any).systolic : null,
      diastolic: bloodPressure ? (bloodPressure.data as any).diastolic : null,
      bloodSugar: bloodSugar ? (bloodSugar.data as any).value : null
    }
  })

  const weightSeries = dailyData.map(d => d.weight ?? null)

  return (
    <div className="bg-white p-6 border-2 border-black rounded-none">
      <h3 className="text-lg font-semibold uppercase mb-4 text-black">健康趋势（最近{days}天）</h3>
      <div className="mb-6">
        <h4 className="text-sm font-semibold uppercase text-black mb-2">体重趋势 (kg)</h4>
        <Line
          data={{
            labels: dates,
            datasets: [
              {
                label: 'WEIGHT',
                data: weightSeries,
                borderColor: '#000000',
                pointBackgroundColor: '#000000',
                pointBorderColor: '#000000',
                borderWidth: 2,
                tension: 0
              }
            ]
          }}
          options={{
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: {
              x: { grid: { color: '#00000020' }, ticks: { color: '#000000' } },
              y: { grid: { color: '#00000020' }, ticks: { color: '#000000' } }
            }
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-sm uppercase text-black">平均运动</div>
          <div className="text-lg font-black text-black">
            {Math.round(dailyData.reduce((sum, d) => sum + d.exerciseTime, 0) / days)}分钟
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm uppercase text-black">平均睡眠</div>
          <div className="text-lg font-black text-black">
            {dailyData.filter(d => d.sleepHours).length > 0
              ? (dailyData.reduce((sum, d) => sum + (d.sleepHours || 0), 0) / dailyData.filter(d => d.sleepHours).length).toFixed(1)
              : '0'}小时
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm uppercase text黑">血压趋势</div>
          <div className="text-lg font-black text黑">
            {dailyData.filter(d => d.systolic).length > 0 ? '已记录' : '无数据'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm uppercase text黑">血糖趋势</div>
          <div className="text-lg font-black text黑">
            {dailyData.filter(d => d.bloodSugar).length > 0 ? '已记录' : '无数据'}
          </div>
        </div>
      </div>
    </div>
  )
}
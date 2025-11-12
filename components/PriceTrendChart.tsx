'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { PriceHistory } from '@/lib/types'

interface PriceTrendChartProps {
  data: PriceHistory[]
  title?: string
}

export default function PriceTrendChart({ data, title = 'Fiyat Trendi' }: PriceTrendChartProps) {
  // Veriyi yıl-ay formatında hazırla
  const chartData = data.map(item => ({
    date: `${item.year}-${String(item.month).padStart(2, '0')}`,
    'Ortalama Fiyat': Math.round(item.averagePrice / 1000), // Binlerde göster
    'm² Fiyat': item.averagePricePerSqm,
    month: item.month,
    year: item.year
  }))

  // Her 3 ayda bir göster (çok fazla veri olmasın)
  const filteredData = chartData.filter((_, index) => index % 3 === 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: 'Ortalama Fiyat (Bin ₺)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: 'm² Fiyat (₺)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                    <p className="text-sm text-blue-600">
                      Ort. Fiyat: ₺{(payload[0].value as number * 1000).toLocaleString('tr-TR')}
                    </p>
                    <p className="text-sm text-green-600">
                      m² Fiyat: ₺{(payload[1]?.value as number || 0).toLocaleString('tr-TR')}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Ortalama Fiyat"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="m² Fiyat"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

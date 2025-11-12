'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface YearlyData {
  year: number
  avgPrice: number
  avgPricePerSqm: number
}

interface YearlyComparisonChartProps {
  data: YearlyData[]
  title?: string
}

export default function YearlyComparisonChart({
  data,
  title = 'Yıllara Göre Fiyat Karşılaştırması'
}: YearlyComparisonChartProps) {
  const chartData = data.map(item => ({
    year: item.year.toString(),
    'Ortalama Fiyat (M₺)': (item.avgPrice / 1000000).toFixed(2),
    'm² Fiyat (K₺)': (item.avgPricePerSqm / 1000).toFixed(1)
  }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const year = payload[0].payload.year
                const avgPrice = parseFloat(payload[0].value as string)
                const sqmPrice = parseFloat(payload[1]?.value as string || '0')

                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="text-sm font-semibold mb-2">{year} Yılı</p>
                    <p className="text-sm text-blue-600">
                      Ort. Fiyat: ₺{avgPrice}M
                    </p>
                    <p className="text-sm text-green-600">
                      m² Fiyat: ₺{sqmPrice}K
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="Ortalama Fiyat (M₺)" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="m² Fiyat (K₺)" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

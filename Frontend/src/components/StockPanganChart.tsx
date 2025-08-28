// src/components/StockPanganChart.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';

export default function StockPanganChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLines, setChartLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/public/stock-pangan-chart-data');
        const { chartData, chartLines } = response.data;
        setChartData(chartData);
        setChartLines(chartLines);
        setError(null);
      } catch (error) {
        console.error("Gagal mengambil data chart Stock Pangan:", error);
        setError('Gagal memuat data chart Stock Pangan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, []);

  const formatToNumber = (tickItem: number) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(1)}M`;
    } else if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(1)}K`;
    }
    return tickItem.toString();
  };

  const formatTooltip = (value: number, name: string) => {
    return [new Intl.NumberFormat('id-ID').format(value), name];
  };

  if (loading) {
    return (
      <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
        <div className="p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Tren Stock Komoditas Pangan
          </h3>
          <p className="text-sm text-gray-500">Pergerakan stock komoditas pangan berdasarkan transaksi harian.</p>
        </div>
        <div className="p-6 pt-0">
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-gray-500">Memuat data chart...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
        <div className="p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Tren Stock Komoditas Pangan
          </h3>
          <p className="text-sm text-gray-500">Pergerakan stock komoditas pangan berdasarkan transaksi harian.</p>
        </div>
        <div className="p-6 pt-0">
          <div className="h-80 w-full flex items-center justify-center">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
      <div className="p-6">
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Tren Stock Komoditas Pangan
          </h3>
          <p className="text-sm text-gray-500">Pergerakan stock komoditas pangan berdasarkan transaksi harian.</p>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-gray-500">Tidak ada data transaksi Stock Pangan</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatToNumber} />
                <Tooltip 
                  wrapperStyle={{ zIndex: 999 }} 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} 
                  formatter={formatTooltip}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                {chartLines.map(line => (
                  <Line 
                    key={line.key} 
                    type="monotone" 
                    dataKey={line.key} 
                    stroke={line.color} 
                    strokeWidth={2} 
                    connectNulls={true}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
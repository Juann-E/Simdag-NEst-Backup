// src/components/StockPanganChart.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface Distributor {
  id: number;
  nama_distributor: string;
}

interface Komoditas {
  id: number;
  komoditas: string;
  satuan: string;
}

export default function StockPanganChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLines, setChartLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dropdown states
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [komoditas, setKomoditas] = useState<Komoditas[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<string>('');
  const [selectedKomoditas, setSelectedKomoditas] = useState<string>('');
  const [dropdownLoading, setDropdownLoading] = useState(true);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [distributorResponse, komoditasResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/distributors`),
          axios.get(`${API_BASE_URL}/public/komoditas-stock-pangan`)
        ]);
        
        setDistributors(distributorResponse.data);
        setKomoditas(komoditasResponse.data);
      } catch (error) {
        console.error('Gagal mengambil data dropdown:', error);
      } finally {
        setDropdownLoading(false);
      }
    };
    
    fetchDropdownData();
  }, []);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDistributor) {
          params.append('distributorId', selectedDistributor);
        }
        if (selectedKomoditas) {
          params.append('komoditasId', selectedKomoditas);
        }
        
        const url = `${API_BASE_URL}/public/stock-pangan-chart-data${params.toString() ? '?' + params.toString() : ''}`;
        const response = await axios.get(url);
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
    
    if (!dropdownLoading) {
      fetchChartData();
    }
  }, [selectedDistributor, selectedKomoditas, dropdownLoading]);

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

  if (loading || dropdownLoading) {
    return (
      <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Tren Stock Komoditas Pangan
              </h3>
              <p className="text-sm text-gray-500">Pergerakan stock komoditas pangan berdasarkan transaksi harian.</p>
            </div>
            
            {/* Loading Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toko Besar
                </label>
                <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-gray-100">
                  <option>Memuat...</option>
                </select>
              </div>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Komoditas
                </label>
                <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-gray-100">
                  <option>Memuat...</option>
                </select>
              </div>
            </div>
          </div>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Tren Stock Komoditas Pangan
              </h3>
              <p className="text-sm text-gray-500">Pergerakan stock komoditas pangan berdasarkan transaksi harian.</p>
            </div>
            
            {/* Error state still shows dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toko Besar
                </label>
                <select
                  value={selectedDistributor}
                  onChange={(e) => setSelectedDistributor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Semua Toko Besar</option>
                  {distributors.map((distributor) => (
                    <option key={distributor.id} value={distributor.id}>
                      {distributor.nama_distributor}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Komoditas
                </label>
                <select
                  value={selectedKomoditas}
                  onChange={(e) => setSelectedKomoditas(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Semua Komoditas</option>
                  {komoditas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.komoditas} ({item.satuan})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Tren Stock Komoditas Pangan
            </h3>
            <p className="text-sm text-gray-500">Pergerakan stock komoditas pangan berdasarkan transaksi harian.</p>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distributor
              </label>
              <select
                value={selectedDistributor}
                onChange={(e) => setSelectedDistributor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={dropdownLoading}
              >
                <option value="">Semua Toko Besar</option>
                {distributors.map((distributor) => (
                  <option key={distributor.id} value={distributor.id}>
                    {distributor.nama_distributor}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Komoditas
              </label>
              <select
                value={selectedKomoditas}
                onChange={(e) => setSelectedKomoditas(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={dropdownLoading}
              >
                <option value="">Semua Komoditas</option>
                {komoditas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.komoditas} ({item.satuan})
                  </option>
                ))}
              </select>
            </div>
          </div>
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
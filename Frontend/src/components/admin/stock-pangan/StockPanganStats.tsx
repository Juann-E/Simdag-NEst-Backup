// src/components/admin/stock-pangan/StockPanganStats.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Calculator
} from 'lucide-react';

interface StockPanganStatsData {
  distributors: number;
  komoditas: number;
  transaksi: number;
  stockAwal: number;
  pengadaan: number;
  penyaluran: number;
  stockAkhir: number;
}

export default function StockPanganStats() {
  const [stats, setStats] = useState<StockPanganStatsData>({
    distributors: 0,
    komoditas: 0,
    transaksi: 0,
    stockAwal: 0,
    pengadaan: 0,
    penyaluran: 0,
    stockAkhir: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/public/stock-pangan-stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stock pangan stats:', err);
        setError('Gagal memuat statistik Stock Pangan');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Memuat statistik...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistik Stock Pangan</h2>
        <p className="text-gray-500 mb-8">Ringkasan data dan statistik sistem manajemen stock pangan</p>

        {/* Master Data Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Data Master</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Toko Besar</p>
                  <p className="text-3xl font-bold text-blue-800">
                    {stats.distributors}
                  </p>
                  <p className="text-xs text-blue-500">Terdaftar</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
                  <Users size={24} />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Komoditas</p>
                  <p className="text-3xl font-bold text-green-800">
                    {stats.komoditas}
                  </p>
                  <p className="text-xs text-green-500">Jenis</p>
                </div>
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
                  <Package size={24} />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Transaksi</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {stats.transaksi}
                  </p>
                  <p className="text-xs text-purple-500">Record</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
                  <FileText size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Flow Statistics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Alur Stock (Total Keseluruhan)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Stock Awal</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.stockAwal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Unit</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 text-gray-600 flex items-center justify-center rounded-lg">
                  <BarChart3 size={20} />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Pengadaan</p>
                  <p className="text-2xl font-bold text-green-800">
                    {stats.pengadaan.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-500">Unit</p>
                </div>
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Penyaluran</p>
                  <p className="text-2xl font-bold text-red-800">
                    {stats.penyaluran.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-500">Unit</p>
                </div>
                <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center rounded-lg">
                  <TrendingDown size={20} />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg border ${
              stats.stockAkhir >= 0 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    stats.stockAkhir >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    Stock Akhir
                  </p>
                  <p className={`text-2xl font-bold ${
                    stats.stockAkhir >= 0 ? 'text-blue-800' : 'text-orange-800'
                  }`}>
                    {stats.stockAkhir.toLocaleString()}
                  </p>
                  <p className={`text-xs ${
                    stats.stockAkhir >= 0 ? 'text-blue-500' : 'text-orange-500'
                  }`}>
                    Unit
                  </p>
                </div>
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  stats.stockAkhir >= 0 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  <Calculator size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Formula Perhitungan:</h4>
          <p className="text-sm text-gray-600">
            <span className="font-mono bg-white px-2 py-1 rounded border">
              Stock Akhir = Stock Awal + Pengadaan - Penyaluran
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            * Nilai negatif pada Stock Akhir menunjukkan kekurangan stock
          </p>
        </div>
      </div>
    </div>
  );
}
// src/pages/admin/DashboardPage.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Package,  DatabaseBackup, Car, Users, Fuel, Zap, Truck } from 'lucide-react';
import PriceChart from '../../components/PriceChart';
import StockPanganChart from '../../components/StockPanganChart';

// Definisikan tipe data untuk membantu kita
interface PriceHistoryItem {
  harga: number;
  tanggal_harga: string;
  barangPasar: {
    barang: { namaBarang: string; };
  };
}

export default function DashboardPage() {
  // State untuk statistik
  const [marketCount, setMarketCount] = useState(0);
  // const [itemCount, setItemCount] = useState(0);
  const [spbuCount, setSpbuCount] = useState(0);
  const [agenCount, setAgenCount] = useState(0);
  const [pangkalanLpgCount, setPangkalanLpgCount] = useState(0);
  const [spbeCount, setSpbeCount] = useState(0);
  const [distributorCount, setDistributorCount] = useState(0);
  const [komoditasKepokmasCount, setKomoditasKepokmasCount] = useState(0);
  const [komoditasStockPanganCount, setKomoditasStockPanganCount] = useState(0);
  
  // State baru untuk data grafik
  const [chartData, setChartData] = useState([]);
  const [chartLines, setChartLines] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) { setLoading(false); return; }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Ambil semua data yang dibutuhkan secara bersamaan
        const [marketsRes, pricesRes, dashboardStatsRes] = await Promise.all([
          axios.get('http://localhost:3000/nama-pasar', { headers }),
          axios.get('http://localhost:3000/harga-barang-pasar', { headers }),
          axios.get('http://localhost:3000/public/dashboard-stats')
        ]);

        // 1. Set data untuk kartu statistik
        setMarketCount(marketsRes.data.length);
        const stats = dashboardStatsRes.data;
        setSpbuCount(stats.spbu);
        setAgenCount(stats.agen);
        setPangkalanLpgCount(stats.pangkalanLpg);
        setSpbeCount(stats.spbe);
        setDistributorCount(stats.distributors);
        setKomoditasKepokmasCount(stats.komoditasKepokmas);
        setKomoditasStockPanganCount(stats.komoditasStockPangan);

        // 2. Proses data harga untuk grafik
        const rawPrices: PriceHistoryItem[] = pricesRes.data;
        
        // Ambil 5 tanggal unik terakhir
        const recentDates = [...new Set(rawPrices.map(p => p.tanggal_harga.split('T')[0]))]
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .slice(0, 5)
            .reverse(); // Balik urutan agar tanggal tertua di kiri

        // Kelompokkan data berdasarkan tanggal
        const groupedByDate: { [key: string]: any } = {};
        recentDates.forEach(date => {
          groupedByDate[date] = { day: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
        });

        rawPrices.forEach(p => {
          const date = p.tanggal_harga.split('T')[0];
          if(groupedByDate[date]) {
            // Asumsikan harga rata-rata jika ada barang yg sama di pasar berbeda
            groupedByDate[date][p.barangPasar.barang.namaBarang] = p.harga;
          }
        });
        
        const formattedChartData = Object.values(groupedByDate);
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
      <p className="text-gray-500 mt-1">Selamat datang di SIMDAG - Sistem Informasi Perdagangan Salatiga</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Pasar</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : marketCount}
            </p>
            <p className="text-xs text-green-500 font-semibold">Aktif</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
            <Building2 />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">SPBU</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : spbuCount}
            </p>
            <p className="text-xs text-blue-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-lg">
            <Car />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Agen</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : agenCount}
            </p>
            <p className="text-xs text-purple-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
            <Users />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pangkalan LPG</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : pangkalanLpgCount}
            </p>
            <p className="text-xs text-orange-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 text-orange-600 flex items-center justify-center rounded-lg">
            <Fuel />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">SPBE</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : spbeCount}
            </p>
            <p className="text-xs text-yellow-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-lg">
            <Zap />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Distributor</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : distributorCount}
            </p>
            <p className="text-xs text-indigo-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
            <Truck />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Komoditas Kepokmas</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : komoditasKepokmasCount}
            </p>
            <p className="text-xs text-green-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
            <Package />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Komoditas Stock Pangan</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : komoditasStockPanganCount}
            </p>
            <p className="text-xs text-teal-500 font-semibold">Terdaftar</p>
          </div>
          <div className="w-12 h-12 bg-teal-100 text-teal-600 flex items-center justify-center rounded-lg">
            <DatabaseBackup />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <PriceChart data={chartData} lines={chartLines} />
        </div>
      </div>

      {/* Stock Pangan Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <StockPanganChart />
        </div>
      </div>
    </div>
  );
}
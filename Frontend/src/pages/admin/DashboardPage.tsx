// src/pages/admin/DashboardPage.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Package, DatabaseBackup, Car, Users, Fuel, Zap, Truck } from 'lucide-react';
import PriceChart from '../../components/PriceChart';
import StockPanganChart from '../../components/StockPanganChart';

// Definisikan tipe data untuk membantu kita
interface PriceHistoryItem {
  harga: number;
  tanggal_harga: string;
  barangPasar: {
    pasar: { id: number; }; // Diperlukan untuk filtering
    barang: { namaBarang: string; };
  };
}

interface Market {
  id: number;
  nama_pasar: string;
}

export default function DashboardPage() {
  // State untuk statistik
  const [marketCount, setMarketCount] = useState(0);
  const [spbuCount, setSpbuCount] = useState(0);
  const [agenCount, setAgenCount] = useState(0);
  const [pangkalanLpgCount, setPangkalanLpgCount] = useState(0);
  const [spbeCount, setSpbeCount] = useState(0);
  const [distributorCount, setDistributorCount] = useState(0);
  const [komoditasKepokmasCount, setKomoditasKepokmasCount] = useState(0);
  const [komoditasStockPanganCount, setKomoditasStockPanganCount] = useState(0);

  // State untuk data mentah
  const [allPrices, setAllPrices] = useState<PriceHistoryItem[]>([]);
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);

  // State untuk chart yang dikontrol dari halaman ini
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLines, setChartLines] = useState<{ key: string; color: string; }[]>([]);

  const [loading, setLoading] = useState(true);

  // useEffect untuk mengambil semua data awal saat komponen dimuat
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [marketsRes, pricesRes, dashboardStatsRes] = await Promise.all([
          axios.get('http://localhost:3000/nama-pasar', { headers }),
          axios.get('http://localhost:3000/harga-barang-pasar', { headers }),
          axios.get('http://localhost:3000/public/dashboard-stats')
        ]);

        // 1. Set data statistik
        const stats = dashboardStatsRes.data;
        setMarketCount(marketsRes.data.length);
        setSpbuCount(stats.spbu);
        setAgenCount(stats.agen);
        setPangkalanLpgCount(stats.pangkalanLpg);
        setSpbeCount(stats.spbe);
        setDistributorCount(stats.distributors);
        setKomoditasKepokmasCount(stats.komoditasKepokmas);
        setKomoditasStockPanganCount(stats.komoditasStockPangan);

        // 2. Set data mentah untuk chart
        setAllMarkets(marketsRes.data);
        setAllPrices(pricesRes.data);

        // 3. Set pasar pertama sebagai default jika ada
        if (marketsRes.data.length > 0) {
          setSelectedMarketId(marketsRes.data[0].id.toString());
        }

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // useEffect untuk memproses ulang data chart setiap kali pasar yang dipilih berubah
  useEffect(() => {
    if (!selectedMarketId || allPrices.length === 0) return;

    const numericMarketId = parseInt(selectedMarketId);

    // Filter harga berdasarkan pasar yang dipilih
    const pricesForSelectedMarket = allPrices.filter(
      p => p.barangPasar?.pasar?.id === numericMarketId
    );

    // Ambil 5 tanggal unik terakhir
    const recentDates = [...new Set(pricesForSelectedMarket.map(p => p.tanggal_harga.split('T')[0]))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 5)
      .reverse();

    // Kelompokkan data berdasarkan tanggal
    const groupedByDate: { [key: string]: any } = {};
    recentDates.forEach(date => {
      groupedByDate[date] = { day: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
    });

    pricesForSelectedMarket.forEach(p => {
      const date = p.tanggal_harga.split('T')[0];
      if (groupedByDate[date]) {
        groupedByDate[date][p.barangPasar.barang.namaBarang] = p.harga;
      }
    });

    const formattedChartData = Object.values(groupedByDate);
    setChartData(formattedChartData);

    // Tentukan garis-garis untuk chart (maksimal 10)
    const lineKeys = [...new Set(pricesForSelectedMarket.map(p => p.barangPasar.barang.namaBarang))]
      .slice(0, 10);

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#d0ed57', '#a28fd0', '#ff6f91', '#2f4f4f'];
    setChartLines(lineKeys.map((key, index) => ({ key, color: colors[index % colors.length] })));

  }, [selectedMarketId, allPrices]); // Dijalankan ulang jika selectedMarketId atau allPrices berubah


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

      {/* Main Content: Price Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          {/* Kirim semua data dan fungsi yang dibutuhkan sebagai props */}
          <PriceChart
            data={chartData}
            lines={chartLines}
            markets={allMarkets}
            selectedMarketId={selectedMarketId}
            onMarketChange={(e) => setSelectedMarketId(e.target.value)}
            loading={loading}
          />
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
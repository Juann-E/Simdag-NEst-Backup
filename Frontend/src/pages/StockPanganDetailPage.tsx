// src/pages/StockPanganDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const API_BASE_URL = ${API_BASE_URL};

interface Distributor {
  id: number;
  nama_distributor: string;
  alamat: string;
}

interface KomoditasData {
  nama_komoditas: string;
  total_stock_awal: number;
  total_pengadaan: number;
  total_penyaluran: number;
  stock_akhir: number;
}

interface MonthlyData {
  month: string;
  monthName: string;
  komoditas: KomoditasData[];
}

export default function StockPanganDetailPage() {
  const { distributorId } = useParams<{ distributorId: string }>();
  const [distributor, setDistributor] = useState<Distributor | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!distributorId) return;
      
      setLoading(true);
      try {
        // Fetch distributor info
        const distributorsResponse = await axios.get(`${API_BASE_URL}/public/distributors`);
        const distributorInfo = distributorsResponse.data.find((d: Distributor) => d.id === parseInt(distributorId));
        setDistributor(distributorInfo);

        // Fetch monthly stock data
        const stockResponse = await axios.get(`${API_BASE_URL}/public/distributor/${distributorId}/stock-monthly`);
        setMonthlyData(stockResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [distributorId]);

  // Helper functions for month/year navigation
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  // const getAvailableYears = () => {
  //   const currentYear = new Date().getFullYear();
  //   const years = [];
  //   for (let year = currentYear - 5; year <= currentYear + 1; year++) {
  //     years.push(year);
  //   }
  //   return years;
  // };

  const getCurrentMonthData = () => {
    const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
    return monthlyData.find(data => data.month === monthKey);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Memuat data stock...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8">
          <ArrowLeft size={18} />
          Kembali ke Halaman Utama
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Perkembangan Stock Bulanan</h1>
          <p className="text-2xl text-gray-500 mt-2">{distributor?.nama_distributor || 'Memuat...'}</p>
          <p className="text-lg text-gray-400 mt-1">{distributor?.alamat}</p>
        </div>

        {/* Month/Year Navigation Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Previous Month Button */}
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Current Month/Year Display */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Calendar size={18} />
                  <span className="font-semibold text-lg">
                    {monthNames[selectedMonth - 1]} {selectedYear}
                  </span>
                  <ChevronRight size={16} className={`transform transition-transform ${showDropdown ? 'rotate-90' : ''}`} />
                </button>

                {/* Dropdown for Month/Year Selection */}
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[250px]">
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan dan Tahun</label>
                        <input
                          type="month"
                          value={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
                          onChange={(e) => {
                            const [year, month] = e.target.value.split('-');
                            setSelectedYear(parseInt(year));
                            setSelectedMonth(parseInt(month));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Month Button */}
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                title="Bulan Berikutnya"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {(() => {
          const currentMonthData = getCurrentMonthData();
          
          if (monthlyData.length === 0) {
            return (
              <div className="text-center py-12">
                <p className="text-gray-500">Belum ada data transaksi untuk distributor ini.</p>
              </div>
            );
          }
          
          if (!currentMonthData) {
            return (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {monthNames[selectedMonth - 1]} {selectedYear}
                </h2>
                <div className="text-center py-12">
                  <p className="text-gray-500">Tidak ada data untuk bulan dan tahun yang dipilih.</p>
                </div>
              </div>
            );
          }
          
          return (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {monthNames[selectedMonth - 1]} {selectedYear}
              </h2>
              
              {currentMonthData.komoditas.length === 0 ? (
                <p className="text-gray-500">Tidak ada data komoditas untuk bulan ini.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMonthData.komoditas.map((komoditas, index) => {
                    // Get previous month data for trend comparison
                    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
                    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
                    const prevMonthKey = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
                    const previousMonthData = monthlyData.find(data => data.month === prevMonthKey);
                    const previousKomoditas = previousMonthData?.komoditas.find(
                      k => k.nama_komoditas === komoditas.nama_komoditas
                    );
                    
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {komoditas.nama_komoditas}
                          </h3>
                          {previousKomoditas && getTrendIcon(komoditas.stock_akhir, previousKomoditas.stock_akhir)}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Stock Awal:</span>
                            <span className="font-medium">{formatNumber(komoditas.total_stock_awal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pengadaan:</span>
                            <span className="font-medium text-green-600">+{formatNumber(komoditas.total_pengadaan)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Penyaluran:</span>
                            <span className="font-medium text-red-600">-{formatNumber(komoditas.total_penyaluran)}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span className="text-gray-800">Stock Akhir:</span>
                            <span className="text-blue-600">{formatNumber(komoditas.stock_akhir)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
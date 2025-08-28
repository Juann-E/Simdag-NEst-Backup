// src/components/PriceChart.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Tipe data tetap sama
interface Market {
  id: number;
  nama_pasar: string;
}
interface PriceHistoryItem {
  harga: number;
  tanggal_harga: string;
  barangPasar: {
    pasar: { id: number };
    barang: { namaBarang: string; };
  };
}

export default function PriceChart() {
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);
  const [allPrices, setAllPrices] = useState<PriceHistoryItem[]>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLines, setChartLines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- PERUBAHAN HANYA DI BAGIAN INI ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      
      // Menghapus pengambilan token dan header otorisasi
      // const token = localStorage.getItem('accessToken');
      // if (!token) { setLoading(false); return; }
      // const headers = { Authorization: `Bearer ${token}` };

      try {
        const [marketsRes, pricesRes] = await Promise.all([
          // Mengganti endpoint ke public/markets
          axios.get('http://localhost:3000/public/markets'),
          // Mengganti endpoint ke public/prices/all yang sudah dibuat di backend
          axios.get('http://localhost:3000/public/prices/all')
        ]);

        setAllMarkets(marketsRes.data);
        setAllPrices(pricesRes.data);
        
        if (marketsRes.data.length > 0) {
          setSelectedMarketId(marketsRes.data[0].id.toString());
        }

      } catch (error) {
        console.error("Gagal mengambil data untuk grafik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- BAGIAN INI TIDAK ADA PERUBAHAN SAMA SEKALI ---
  // Logika pemrosesan data tetap sama karena struktur data yang diterima tidak berubah
  useEffect(() => {
    if (!selectedMarketId || allPrices.length === 0) return;

    const numericMarketId = parseInt(selectedMarketId);

    const pricesForSelectedMarket = allPrices.filter(
      p => p.barangPasar?.pasar?.id === numericMarketId
    );

    const recentDates = [...new Set(pricesForSelectedMarket.map(p => p.tanggal_harga.split('T')[0]))]
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .slice(0, 5).reverse();

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
    
    const lineKeys = [...new Set(pricesForSelectedMarket.map(p => p.barangPasar.barang.namaBarang))]
        .slice(0, 10);
        
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe','#00c49f', '#d0ed57', '#a28fd0', '#ff6f91', '#2f4f4f'];
    setChartLines(lineKeys.map((key, index) => ({ key, color: colors[index % colors.length] })));

  }, [selectedMarketId, allPrices]);

  const formatToRipsum = (tickItem: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tickItem);

  // --- BAGIAN TAMPILAN (JSX) JUGA TIDAK ADA PERUBAHAN ---
  return (
    <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
      <div className="flex flex-col md-flex-row md-items-center justify-between p-6">
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Tren Harga Komoditas
          </h3>
          <p className="text-sm text-gray-500">Pergerakan harga bahan pokok utama yang tercatat.</p>
        </div>
        <div className="mt-4 md-mt-0">
          <select 
            value={selectedMarketId}
            onChange={(e) => setSelectedMarketId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            disabled={loading}
          >
            {loading ? <option>Memuat pasar...</option> : allMarkets.map(market => (
              <option key={market.id} value={market.id}>{market.nama_pasar}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis tickFormatter={(tick) => `Rp${tick/1000}k`} />
                    <Tooltip 
                      wrapperStyle={{ zIndex: 999 }} 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }} 
                      formatter={formatToRipsum} 
                    />
                    <Legend />
                    {chartLines.map(line => (
                      <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} connectNulls={true}/>
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
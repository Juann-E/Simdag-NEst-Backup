// src/components/PriceChart.tsx

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Tipe data untuk props yang akan diterima oleh komponen ini
interface LineItem {
  key: string;
  color: string;
}

interface Market {
  id: number;
  nama_pasar: string;
}

interface Item {
  id: number;
  namaBarang: string;
  satuan?: {
    satuanBarang: string;
  };
}

interface PriceChartProps {
  data: any[];
  lines: LineItem[];
  markets: Market[];
  items: Item[];
  selectedMarketId: string;
  selectedItemId: string;
  onMarketChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onItemChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loading: boolean;
  chartTitle?: string;
  chartSubtitle?: string;
}

// Ubah signature fungsi untuk menerima props
// Komponen ini menjadi "dumb component" yang hanya menampilkan data
export default function PriceChart({
  data = [],           // <-- Tambahkan = []
  lines = [],          // <-- Tambahkan = []
  markets = [],        // <-- Tambahkan = []
  items = [],          // <-- Tambahkan = []
  selectedMarketId,
  selectedItemId,
  onMarketChange,
  onItemChange,
  loading,
  chartTitle = "Tren Harga Komoditas",
  chartSubtitle = "Pergerakan harga bahan pokok utama yang tercatat dari semua pasar."
}: PriceChartProps) {

  // Hapus semua useState dan useEffect dari sini

  const formatToRupiah = (tickItem: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(tickItem);

  return (
    <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl lg:text-2xl font-semibold leading-none tracking-tight flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 flex-shrink-0" />
            {chartTitle}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{chartSubtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
          <select
            value={selectedItemId}
            onChange={onItemChange}
            className="w-full sm:w-auto min-w-0 sm:min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Semua Komoditas</option>
            {items.map(item => (
              <option key={item.id} value={item.id.toString()}>
                {item.namaBarang} {item.satuan ? `(${item.satuan.satuanBarang})` : ''}
              </option>
            ))}
          </select>
          <select
            value={selectedMarketId}
            onChange={onMarketChange}
            className="w-full sm:w-auto min-w-0 sm:min-w-[150px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Semua Pasar</option>
            {markets.map(market => (
              <option key={market.id} value={market.id.toString()}>
                {market.nama_pasar}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {/* Gunakan props 'data' dan 'lines' untuk me-render chart */}
            <LineChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(tick) => `Rp${tick / 1000}k`} />
              <Tooltip
                wrapperStyle={{ zIndex: 999 }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                formatter={formatToRupiah}
              />
              <Legend />
              {lines.map(line => (
                <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} connectNulls={true} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
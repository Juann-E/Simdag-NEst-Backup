// src/components/PriceChart.tsx

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Tipe data untuk props yang akan diterima oleh komponen ini
interface Market {
  id: number;
  nama_pasar: string;
}

interface LineItem {
  key: string;
  color: string;
}

interface PriceChartProps {
  data: any[];
  lines: LineItem[];
  markets: Market[];
  selectedMarketId: string;
  onMarketChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  loading: boolean;
}

// Ubah signature fungsi untuk menerima props
// Komponen ini menjadi "dumb component" yang hanya menampilkan data
export default function PriceChart({
  data = [],           // <-- Tambahkan = []
  lines = [],          // <-- Tambahkan = []
  markets = [],        // <-- Tambahkan = []
  selectedMarketId,
  onMarketChange,
  loading
}: PriceChartProps) {

  // Hapus semua useState dan useEffect dari sini

  const formatToRupiah = (tickItem: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(tickItem);

  return (
    <div className="rounded-lg border bg-white text-gray-800 shadow-sm h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
        <div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Tren Harga Komoditas
          </h3>
          <p className="text-sm text-gray-500">Pergerakan harga bahan pokok utama yang tercatat.</p>
        </div>
        <div className="mt-4 md:mt-0">
          {/* Gunakan props untuk mengontrol select/dropdown */}
          <select
            value={selectedMarketId}
            onChange={onMarketChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            disabled={loading}
          >
            {loading ? <option>Memuat pasar...</option> : markets.map(market => (
              <option key={market.id} value={market.id}>{market.nama_pasar}</option>
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
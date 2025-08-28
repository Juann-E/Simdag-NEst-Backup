// src/components/admin/kepokmas/HargaBarangGrid.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, PlusCircle, Search } from 'lucide-react'; 

interface Market {
  id: number;
  nama_pasar: string;
  alamat: string;
}

export default function HargaBarangGrid() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
      try {
        const response = await axios.get('http://localhost:3000/nama-pasar', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMarkets(response.data);
      } catch (err) {
        setError("Gagal mengambil data pasar.");
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const filteredMarkets = markets.filter(market =>
    market.nama_pasar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      <div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Table size={20} className="mr-2"/>Harga Barang Grid</h2>
        <p className="text-sm text-gray-500">Pilih pasar untuk mengelola harga barang</p>
      </div>

      <div className="relative my-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama pasar..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pasar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {loading && <tr><td colSpan={3} className="text-center py-4">Memuat data pasar...</td></tr>}
              {error && <tr><td colSpan={3} className="text-center py-4 text-red-500">{error}</td></tr>}
              
              {!loading && !error && filteredMarkets.map((market) => (
                  <tr 
                    key={market.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/kepokmas/harga-barang-grid/${market.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{market.nama_pasar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{market.alamat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div 
                          // Ganti warna menjadi hijau agar konsisten
                          className="text-green-600 hover:text-green-900"
                          title={`Kelola Harga di ${market.nama_pasar}`}
                        >
                          {/* Ganti ikon Edit menjadi PlusCircle */}
                          <PlusCircle size={20} />
                        </div>
                    </td>
                  </tr>
              ))}

              {!loading && filteredMarkets.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    Tidak ada pasar yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
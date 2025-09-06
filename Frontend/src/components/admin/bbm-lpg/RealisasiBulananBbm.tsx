// src/components/admin/bbm-lpg/RealisasiBulananBbm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, Search, PlusCircle } from 'lucide-react';
import { getAuthToken } from '../../../utils/auth';
import { spbuService, realisasiBulananBbmService } from '../../../services/bbmLpgService';

interface Spbu {
  id_spbu: number;
  nama_usaha: string;
  no_spbu: string;
  alamat: string;
  telepon?: string;
  penanggung_jawab: string;
  nomor_hp_penanggung_jawab?: string;
  status: string;
  kecamatan?: {
    nama_kecamatan: string;
  };
  kelurahan?: {
    nama_kelurahan: string;
  };
}

interface RealisasiBbm {
  id_realisasi_bbm: number;
  id_spbu: number;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  spbu: Spbu;
}

export default function RealisasiBulananBbm() {
  const navigate = useNavigate();
  const [spbuList, setSpbuList] = useState<Spbu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSpbuList();
  }, []);

  const fetchSpbuList = async () => {
    try {
      setLoading(true);
      const data = await spbuService.getAll();
      setSpbuList(data);
    } catch (error) {
      console.error('Error fetching SPBU list:', error);
      setError('Gagal memuat data SPBU');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to detail page for SPBU realisasi BBM
  const handleShowDetail = (spbu: Spbu) => {
    navigate(`/admin/bbm-lpg/realisasi-bbm-detail/${spbu.id_spbu}`);
  };

  const filteredData = spbuList.filter(spbu =>
    spbu.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spbu.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spbu.penanggung_jawab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Memuat data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Building size={20} className="mr-2" />
              Realisasi Bulanan BBM
            </h2>
            <p className="text-sm text-gray-500">Pilih SPBU untuk melihat dan mengelola data realisasi BBM</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama usaha, alamat, atau penanggung jawab..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama SPBU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. SPBU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penanggung Jawab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data SPBU'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr 
                    key={item.id_spbu} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleShowDetail(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.nama_usaha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.no_spbu}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.penanggung_jawab}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="text-green-600 hover:text-green-900">
                        <PlusCircle size={20} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


    </>
  );
}
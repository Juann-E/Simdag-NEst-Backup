import { useState, useEffect } from 'react';
import { PlusCircle, Search, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Interface definitions
interface Agen {
  id_agen: number;
  nama_usaha: string;
  alamat: string;
  penanggung_jawab: string;
  kecamatan?: {
    nama_kecamatan: string;
  };
  kelurahan?: {
    nama_kelurahan: string;
  };
  telepon?: string;
  nomor_hp_penanggung_jawab?: string;
  status?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function RealisasiBulananLpg() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for agen management
  const [agenList, setAgenList] = useState<Agen[]>([]);
  const [error, setError] = useState<string | null>(null);



  // Fetch agen list
  const fetchAgenList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/public/agen`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agen data');
      }
      
      const result = await response.json();
      setAgenList(result || []);
    } catch (error) {
      console.error('Error fetching agen data:', error);
      setError('Gagal memuat data agen');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchAgenList();
  }, []);

  // Filter agen list
  const filteredAgenList = agenList.filter(agen => 
    agen.nama_usaha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agen.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agen.penanggung_jawab?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to detail page for adding realisasi data
  const handleAddRealisasi = (agen: Agen) => {
    navigate(`/admin/bbm-lpg/realisasi-detail/${agen.id_agen}`);
  };





  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Building size={20} className="mr-2" />
              Daftar Agen LPG
            </h2>
            <p className="text-sm text-gray-500">Pilih agen untuk menambah data realisasi bulanan LPG</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError('')} 
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
            placeholder="Cari berdasarkan nama agen, alamat, atau penanggung jawab..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Usaha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Alamat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan={3} className="text-center py-4">Memuat data agen...</td></tr>}
            {error && <tr><td colSpan={3} className="text-center py-4 text-red-500">{error}</td></tr>}
            
            {!loading && !error && filteredAgenList.map((agen) => (
              <tr 
                key={agen.id_agen} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAddRealisasi(agen)}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {agen.nama_usaha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {agen.alamat}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="text-green-600 hover:text-green-900">
                    <PlusCircle size={20} />
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filteredAgenList.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  {searchTerm ? 'Tidak ada agen yang sesuai dengan pencarian.' : 'Tidak ada data agen.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
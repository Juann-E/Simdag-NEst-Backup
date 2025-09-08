// src/components/admin/bbm-lpg/RealisasiLpgDetailPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, ArrowLeft, Search, Edit, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../ui/Modal';
import ConfirmationModal from '../../ui/ConfirmationModal';

// Interface untuk tipe data
interface Agen {
  id_agen: number;
  nama_usaha: string;
  alamat: string;
  penanggung_jawab: string;
}

interface RealisasiLpg {
  id_realisasi_lpg: number;
  id_agen: number;
  periode: string;
  realisasi_tabung: number;
  agen?: {
    nama_usaha: string;
    alamat: string;
    penanggung_jawab: string;
  };
}

// Konstanta untuk dropdown
const BULAN_OPTIONS = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' }
];

// Helper function to convert month number to name
const getMonthName = (monthNumber: number): string => {
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return monthNames[monthNumber - 1] || '';
};

// Jumlah item per halaman
const ITEMS_PER_PAGE = 10;

export default function RealisasiLpgDetailPage() {
  const { agenId } = useParams();
  const [agen, setAgen] = useState<Agen | null>(null);
  const [realisasiData, setRealisasiData] = useState<RealisasiLpg[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RealisasiLpg | null>(null);

  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');
  const [realisasiTabung, setRealisasiTabung] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  // State untuk error message
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBulan, setEditBulan] = useState('');
  const [editTahun, setEditTahun] = useState('');
  const [editRealisasiTabung, setEditRealisasiTabung] = useState('');


  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);

  const numericAgenId = parseInt(agenId || '0', 10);

  useEffect(() => {
    if (numericAgenId) {
      const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) { setLoading(false); return; }
        const headers = { Authorization: `Bearer ${token}` };

        try {
          // Fetch agen data
          const agenRes = await axios.get<Agen[]>('http://localhost:3000/public/agen');
          const currentAgen = agenRes.data.find(a => a.id_agen === numericAgenId);
          if (currentAgen) setAgen(currentAgen);

          // Fetch realisasi data by agen
          const realisasiRes = await axios.get(`http://localhost:3000/realisasi-bulanan-lpg?id_agen=${numericAgenId}`, { headers })
            .catch(error => {
              if (error.response && error.response.status === 404) { return { data: [] }; }
              throw error;
            });

          setRealisasiData(realisasiRes.data || []);
          setError(null);

        } catch (error) {
          console.error("Gagal memuat data realisasi", error);
          setError('Gagal memuat data realisasi LPG');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [numericAgenId]);

  // Logika untuk memfilter dan memotong data untuk halaman saat ini
  const filteredData = useMemo(() =>
    realisasiData.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const itemDate = new Date(item.tanggal);
      const monthName = itemDate.toLocaleDateString('id-ID', { month: 'long' });
      const year = itemDate.getFullYear().toString();
      return (
        monthName.toLowerCase().includes(searchLower) ||
        year.includes(searchLower) ||
        item.realisasi_tabung.toString().includes(searchLower)
      );
    }), [realisasiData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [currentPage, filteredData]);

  // Reset ke halaman 1 setiap kali filter pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAddRealisasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulan || !tahun || !realisasiTabung) return;
    
    const token = localStorage.getItem('accessToken');
    try {
      const newRealisasi = {
        id_agen: numericAgenId,
        bulan: parseInt(bulan),
        tahun: parseInt(tahun),
        realisasi_tabung: parseInt(realisasiTabung)
      };
      
      await axios.post('http://localhost:3000/realisasi-bulanan-lpg', newRealisasi, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh data from server
      const refreshRes = await axios.get(`http://localhost:3000/realisasi-bulanan-lpg?id_agen=${numericAgenId}`, { headers: { Authorization: `Bearer ${token}` } });
      setRealisasiData(refreshRes.data || []);
      setError(null);
      
      setIsModalOpen(false);
      setBulan('');
      setTahun('');
      setRealisasiTabung('');

      // Success notification removed
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal menambahkan data realisasi.";
      alert(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://localhost:3000/realisasi-bulanan-lpg/${itemToDelete.id_realisasi_lpg}`, { headers: { Authorization: `Bearer ${token}` } });
      
      // Refresh data from server after delete
      const refreshRes = await axios.get(`http://localhost:3000/realisasi-bulanan-lpg?id_agen=${numericAgenId}`, { headers: { Authorization: `Bearer ${token}` } });
      setRealisasiData(refreshRes.data || []);
      
      setItemToDelete(null);
    } catch (error) {
      alert("Gagal menghapus data realisasi.");
    }
  };

  const handleOpenEditMode = (item: RealisasiLpg) => {
    setEditingId(item.id_realisasi_lpg);
    // Parse periode (YYYY-MM format) to separate bulan and tahun
    const [tahun, bulan] = item.periode.split('-');
    setEditBulan(parseInt(bulan).toString()); // Convert MM to number then back to string for form
    setEditTahun(tahun);
    setEditRealisasiTabung(item.realisasi_tabung.toString());
  };

  const handleSaveRealisasi = async (itemToUpdate: RealisasiLpg) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.patch(
        `http://localhost:3000/realisasi-bulanan-lpg/${itemToUpdate.id_realisasi_lpg}`,
        {
          bulan: parseInt(editBulan),
          tahun: parseInt(editTahun),
          realisasi_tabung: parseInt(editRealisasiTabung),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh data from server after update
      const refreshRes = await axios.get(`http://localhost:3000/realisasi-bulanan-lpg?id_agen=${numericAgenId}`, { headers: { Authorization: `Bearer ${token}` } });
      setRealisasiData(refreshRes.data || []);

      setEditingId(null);
      setEditBulan('');
      setEditTahun('');
      setEditRealisasiTabung('');


    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal menyimpan perubahan data realisasi.";
      alert(errorMessage);
    }
  };



  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <Link to="/admin/bbm-lpg/realisasi-bulanan-lpg" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft size={16} />
          Kembali ke Daftar Agen LPG
        </Link>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Realisasi: {agen?.nama_usaha}</h2>
            <p className="text-sm text-gray-500">Kelola data realisasi bulanan untuk agen ini</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} className="mr-2" />Tambah Data
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <Link to="/admin/bbm-lpg/realisasi-bulanan-lpg" className="text-red-800 underline hover:text-red-900">
              Kembali ke Halaman Utama
            </Link>
          </div>
        )}

        {/* Info Agen */}
        {agen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Informasi Agen</h3>
                <p className="text-sm text-gray-600">Nama: {agen.nama_usaha}</p>
                <p className="text-sm text-gray-600">Alamat: {agen.alamat}</p>
                <p className="text-sm text-gray-600">Penanggung Jawab: {agen.penanggung_jawab}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Keterangan</h3>
                <p className="text-sm text-gray-600">Tidak ada keterangan tambahan</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari data realisasi..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Realisasi Tabung</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan={3} className="text-center py-4">Memuat data...</td></tr>}
            {!loading && paginatedData.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  {realisasiData.length > 0 ? 'Data tidak ditemukan.' : 'Belum ada data realisasi untuk agen ini'}
                </td>
              </tr>
            )}

            {!loading && paginatedData.map(item => (
              <tr key={item.id_realisasi_lpg}>
                <td className="px-6 py-4 font-medium">
                  {editingId === item.id_realisasi_lpg ? (
                    <div className="flex gap-2">
                      <select
                        value={editBulan}
                        onChange={(e) => setEditBulan(e.target.value)}
                        className="px-2 py-1 border rounded-md text-sm"
                        autoFocus
                      >
                        <option value="">Pilih Bulan</option>
                        {BULAN_OPTIONS.map(bulan => (
                          <option key={bulan.value} value={bulan.value}>{bulan.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={editTahun}
                        onChange={(e) => setEditTahun(e.target.value)}
                        className="px-2 py-1 border rounded-md w-20 text-sm"
                        placeholder="Tahun"
                        min="2020"
                        max="2030"
                      />
                    </div>
                  ) : (
                    item.periode
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {editingId === item.id_realisasi_lpg ? (
                    <input
                      type="number"
                      value={editRealisasiTabung}
                      onChange={(e) => setEditRealisasiTabung(e.target.value)}
                      className="px-2 py-1 border rounded-md w-24"
                      min="0"
                    />
                  ) : (
                    item.realisasi_tabung.toLocaleString()
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingId === item.id_realisasi_lpg ? (
                    <button onClick={() => handleSaveRealisasi(item)} className="text-green-600 hover:text-green-900" title="Simpan">
                      <Save size={16} />
                    </button>
                  ) : (
                    <button onClick={() => handleOpenEditMode(item)} className="text-blue-600 hover:text-blue-900" title="Edit Data">
                      <Edit size={16} />
                    </button>
                  )}
                  <button onClick={() => setItemToDelete(item)} className="text-red-600 hover:text-red-900" title="Hapus Data">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
            </span>
            <div className="inline-flex items-center -space-x-px">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah Data */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Tambah Data Realisasi - ${agen?.nama_usaha}`}>
        <form onSubmit={handleAddRealisasi} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bulan-input" className="block text-sm font-medium text-gray-700 mb-1">Bulan *</label>
              <select
                id="bulan-input"
                value={bulan}
                onChange={e => setBulan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Pilih Bulan</option>
                {BULAN_OPTIONS.map(bulanOption => (
                  <option key={bulanOption.value} value={bulanOption.value}>{bulanOption.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tahun-input" className="block text-sm font-medium text-gray-700 mb-1">Tahun *</label>
              <input
                id="tahun-input"
                type="number"
                value={tahun}
                onChange={e => setTahun(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 2025"
                min="2020"
                max="2030"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="realisasi-input" className="block text-sm font-medium text-gray-700 mb-1">Realisasi Tabung *</label>
            <input
              id="realisasi-input"
              type="number"
              min="0"
              value={realisasiTabung}
              onChange={e => setRealisasiTabung(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan jumlah realisasi tabung"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Tambah</button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Hapus data realisasi periode ${itemToDelete ? itemToDelete.periode : ''}?`}
      />
    </>
  );
}
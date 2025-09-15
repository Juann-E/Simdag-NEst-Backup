import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Weight, Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

// Definisikan tipe data untuk satu satuan, sesuai dengan Entity Anda
interface Unit {
  idSatuan: number;
  satuanBarang: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const ITEMS_PER_PAGE = 10; // Tentukan jumlah item per halaman

export default function SatuanBarang() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({ satuanBarang: '' });

  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  // State baru untuk pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/satuan-barang`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnits(response.data);
    } catch (err) {
      setError("Gagal mengambil data satuan.");
    } finally {
      setLoading(false);
    }
  };

  // Logika untuk memfilter dan memotong data untuk halaman saat ini
  const filteredUnits = useMemo(() => 
    units.filter(unit =>
      unit.satuanBarang.toLowerCase().includes(searchTerm.toLowerCase())
    ), [units, searchTerm]);

  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUnits.slice(startIndex, endIndex);
  }, [currentPage, filteredUnits]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingUnit(null);
    setFormData({ satuanBarang: '' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({ satuanBarang: unit.satuanBarang });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }

    const url = editingUnit 
      ? `${API_BASE_URL}/satuan-barang/${editingUnit.idSatuan}` 
      : `${API_BASE_URL}/satuan-barang`;
      
    const method = editingUnit ? 'patch' : 'post';

    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchUnits();
      setIsFormModalOpen(false);

    } catch (err) {
      alert("Gagal menyimpan data. Pastikan nama satuan unik.");
    }
  };

  const handleOpenDeleteModal = (unit: Unit) => {
    setUnitToDelete(unit);
  };
  
  const handleConfirmDelete = async () => {
    if (!unitToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }

    try {
      await axios.delete(`${API_BASE_URL}/satuan-barang/${unitToDelete.idSatuan}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUnits(units.filter(u => u.idSatuan !== unitToDelete.idSatuan));
      setUnitToDelete(null);

    } catch (err) {
      alert("Gagal menghapus satuan.");
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Weight size={20} className="mr-2"/>Satuan Barang</h2>
            <p className="text-sm text-gray-500">Kelola satuan untuk semua komoditas</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleOpenCreateModal} className="btn-primary"><Plus size={16} className="mr-2"/>Tambah Satuan</button>
          </div>
        </div>
        
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama satuan..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-4/5">Nama Satuan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading && <tr><td colSpan={2} className="text-center py-4">Memuat data...</td></tr>}
                {error && <tr><td colSpan={2} className="text-center py-4 text-red-500">{error}</td></tr>}
                
                {/* Gunakan 'paginatedData' untuk me-render baris tabel */}
                {!loading && !error && paginatedData.map((unit) => (
                    <tr key={unit.idSatuan}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{unit.satuanBarang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => handleOpenEditModal(unit)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                          <button onClick={() => handleOpenDeleteModal(unit)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                ))}

                {/* Pesan jika hasil pencarian kosong */}
                {!loading && paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-gray-500">
                      Tidak ada satuan yang cocok dengan pencarian Anda.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Tambahkan komponen navigasi pagination di bawah tabel */}
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

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={editingUnit ? "Edit Satuan Barang" : "Tambah Satuan Barang Baru"}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="unit-name" className="block text-sm font-medium text-gray-700">Nama Satuan</label>
              <input
                type="text" id="unit-name"
                value={formData.satuanBarang}
                onChange={(e) => setFormData({ ...formData, satuanBarang: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Contoh: Kg, Liter, Ikat"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">
              {editingUnit ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal 
        isOpen={!!unitToDelete}
        onClose={() => setUnitToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus satuan "${unitToDelete?.satuanBarang}"?`}
      />
    </>
  );
}
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Weight, Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

// Definisikan tipe data untuk satu satuan, sesuai dengan Entity
interface Unit {
  idSatuan: number;
  satuanBarang: string;
}

const API_BASE_URL = ${API_BASE_URL};

export default function SatuanBarang() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    satuanBarang: ''
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/satuan-barang-stock-pangan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnits(response.data);
    } catch (err) {
      setError("Gagal mengambil data satuan.");
    } finally {
      setLoading(false);
    }
  };

  // Filter dan pagination
  const filteredUnits = useMemo(() => {
    return units.filter(unit => 
      unit.satuanBarang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [units, searchTerm]);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + itemsPerPage);

  const resetFormState = () => {
    setFormData({ satuanBarang: '' });
    setEditingUnit(null);
  };

  const handleOpenCreateModal = () => {
    resetFormState();
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
      ? `${API_BASE_URL}/satuan-barang-stock-pangan/${editingUnit.idSatuan}` 
      : `${API_BASE_URL}/satuan-barang-stock-pangan`;
      
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
      await axios.delete(`${API_BASE_URL}/satuan-barang-stock-pangan/${unitToDelete.idSatuan}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUnits();
      setUnitToDelete(null);
    } catch (err) {
      alert("Gagal menghapus data satuan.");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-lg">Memuat data...</div></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Weight size={24} className="text-blue-600" />
              Daftar Satuan Komoditas
            </h2>
            <p className="text-sm text-gray-500">Kelola data satuan komoditas untuk stock pangan</p>
          </div>
          <button onClick={handleOpenCreateModal} className="btn-primary">
            <Plus size={16} className="mr-2" />Tambah Satuan Komoditas
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari satuan komoditas..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan Komoditas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUnits.map((unit) => (
                <tr key={unit.idSatuan} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {unit.satuanBarang}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(unit)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(unit)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Menampilkan {Math.min(startIndex + itemsPerPage, filteredUnits.length)} dari {filteredUnits.length} data
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {filteredUnits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Tidak ada satuan yang sesuai dengan pencarian.' : 'Belum ada data satuan komoditas.'}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingUnit ? 'Edit Satuan Komoditas' : 'Tambah Satuan Komoditas'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Satuan Komoditas *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.satuanBarang}
              onChange={(e) => setFormData({...formData, satuanBarang: e.target.value})}
              placeholder="Contoh: Kg, Liter, Buah, dll"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {editingUnit ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={!!unitToDelete}
        onClose={() => setUnitToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Satuan Komoditas"
        message={`Apakah Anda yakin ingin menghapus satuan "${unitToDelete?.satuanBarang}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Package, Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

interface Unit {
  idSatuan: number;
  satuanBarang: string;
}

interface Komoditas {
  id_komoditas: number;
  komoditas: string;
  keterangan?: string;
  time_stamp: string;
  satuan: Unit;
}



const API_BASE_URL = 'http://localhost:3000';
const ITEMS_PER_PAGE = 10;

const Komoditas = () => {
  const [komoditas, setKomoditas] = useState<Komoditas[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingKomoditas, setEditingKomoditas] = useState<Komoditas | null>(null);
  const [komoditasToDelete, setKomoditasToDelete] = useState<Komoditas | null>(null);
  const [formData, setFormData] = useState({ komoditas: '', keterangan: '', id_satuan: '' });

  // Logika untuk memfilter dan memotong data untuk halaman saat ini
  const filteredKomoditas = useMemo(() =>
    komoditas.filter(item => {
      const term = searchTerm.toLowerCase();
      if (!term) return true;
      return item.komoditas.toLowerCase().includes(term) ||
             item.satuan?.satuanBarang.toLowerCase().includes(term);
    }), [komoditas, searchTerm]);
  
  const totalPages = Math.ceil(filteredKomoditas.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredKomoditas.slice(startIndex, endIndex);
  }, [currentPage, filteredKomoditas]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { 
      setError("Autentikasi gagal."); 
      setLoading(false); 
      return; 
    }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [komoditasResponse, unitsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/nama-komoditas`, { headers }),
        axios.get(`${API_BASE_URL}/satuan-barang-stock-pangan`, { headers })
      ]);
      setKomoditas(komoditasResponse.data);
      setUnits(unitsResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Gagal mengambil data komoditas.");
    } finally {
      setLoading(false);
    }
  };

  const resetFormState = () => {
    setEditingKomoditas(null);
    setFormData({ komoditas: '', keterangan: '', id_satuan: units[0]?.idSatuan.toString() || '' });
  };

  const handleOpenCreateModal = () => {
    resetFormState();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: Komoditas) => {
    setEditingKomoditas(item);
    setFormData({
      komoditas: item.komoditas,
      keterangan: item.keterangan || '',
      id_satuan: item.satuan.idSatuan.toString()
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) { 
      alert("Sesi berakhir."); 
      return; 
    }

    const url = editingKomoditas 
      ? `${API_BASE_URL}/nama-komoditas/${editingKomoditas.id_komoditas}` 
      : `${API_BASE_URL}/nama-komoditas`;
      
    const method = editingKomoditas ? 'patch' : 'post';
    
    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchData();
      setIsFormModalOpen(false);
      resetFormState();
    } catch (err) {
      console.error('Error saving komoditas:', err);
      alert('Gagal menyimpan komoditas');
    }
  };

  const handleConfirmDelete = async () => {
    if (!komoditasToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { 
      alert("Sesi berakhir."); 
      return; 
    }

    try {
      await axios.delete(`${API_BASE_URL}/nama-komoditas/${komoditasToDelete.id_komoditas}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKomoditas(komoditas.filter(k => k.id_komoditas !== komoditasToDelete.id_komoditas));
      setKomoditasToDelete(null);
    } catch (err) {
      console.error('Error deleting komoditas:', err);
      alert('Gagal menghapus komoditas');
    }
  };

  const handleOpenDeleteModal = (item: Komoditas) => {
    setKomoditasToDelete(item);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Package size={20} className="mr-2"/>Komoditas</h2>
            <p className="text-sm text-gray-500">Kelola nama dan satuan komoditas</p>
          </div>
          <div>
            <button onClick={handleOpenCreateModal} className="btn-primary"><Plus size={16} className="mr-2"/>Tambah Komoditas</button>
          </div>
        </div>
        
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama komoditas atau satuan..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komoditas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.id_komoditas} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.komoditas}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.satuan?.satuanBarang || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.keterangan || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:text-blue-900">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleOpenDeleteModal(item)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={16} />
                            </button>
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">Tidak ada komoditas yang cocok.</td></tr>
                )}
            </tbody>
          </table>
        </div>

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
        title={editingKomoditas ? "Edit Komoditas" : "Tambah Komoditas Baru"}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">Nama Komoditas</label>
              <input type="text" id="item-name" value={formData.komoditas} onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="item-unit" className="block text-sm font-medium text-gray-700">Satuan</label>
              <select id="item-unit" value={formData.id_satuan} onChange={(e) => setFormData({ ...formData, id_satuan: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
                <option value="" disabled>Pilih satuan...</option>
                {units.map(unit => (
                  <option key={unit.idSatuan} value={unit.idSatuan}>{unit.satuanBarang}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="item-desc" className="block text-sm font-medium text-gray-700">Keterangan (Opsional)</label>
              <textarea id="item-desc" value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">
              {editingKomoditas ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal 
        isOpen={komoditasToDelete !== null}
        onClose={() => setKomoditasToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus komoditas "${komoditasToDelete?.komoditas}"?`}
      />
    </>
  );
};

export default Komoditas;
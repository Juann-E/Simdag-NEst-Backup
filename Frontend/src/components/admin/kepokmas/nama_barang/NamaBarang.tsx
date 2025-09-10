import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Package, Search, Plus, Edit, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

interface Unit {
  idSatuan: number;
  satuanBarang: string;
}

interface Item {
  id: number;
  namaBarang: string;
  keterangan?: string;
  satuan: Unit;
  gambar?: string;
}

const API_BASE_URL = ${API_BASE_URL};
const ITEMS_PER_PAGE = 10; // Tentukan jumlah item per halaman

const createImageUrl = (path?: string) => {
  if (!path) return null;
  const cleanedPath = path.replace(/\\/g, '/');
  return `${API_BASE_URL}/uploads/${cleanedPath.replace('uploads/', '')}`;
};

export default function NamaBarang() {
  const [items, setItems] = useState<Item[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  const [formData, setFormData] = useState({ namaBarang: '', keterangan: '', idSatuan: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  
  // State baru untuk pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [itemsResponse, unitsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/nama-barang`, { headers }),
        axios.get(`${API_BASE_URL}/satuan-barang`, { headers })
      ]);
      setItems(itemsResponse.data);
      setUnits(unitsResponse.data);
    } catch (err) {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  // Logika untuk memfilter dan memotong data untuk halaman saat ini
  const filteredItems = useMemo(() =>
    items.filter(item => {
      const term = searchTerm.toLowerCase();
      if (!term) return true;
      return item.namaBarang.toLowerCase().includes(term) ||
             item.satuan?.satuanBarang.toLowerCase().includes(term);
    }), [items, searchTerm]);
  
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  }, [currentPage, filteredItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  const resetFormState = () => {
    setEditingItem(null);
    setFormData({ namaBarang: '', keterangan: '', idSatuan: units[0]?.idSatuan.toString() || '' });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleOpenCreateModal = () => {
    resetFormState();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: Item) => {
    resetFormState();
    setEditingItem(item);
    setFormData({
      namaBarang: item.namaBarang,
      keterangan: item.keterangan || '',
      idSatuan: item.satuan.idSatuan.toString(),
    });
    setImagePreview(createImageUrl(item.gambar));
    setIsFormModalOpen(true); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir."); return; }

    const data = new FormData();
    data.append('namaBarang', formData.namaBarang);
    data.append('keterangan', formData.keterangan || '');
    data.append('idSatuan', formData.idSatuan);
    if (selectedFile) {
      data.append('gambar', selectedFile);
    }

    const url = editingItem 
      ? `${API_BASE_URL}/nama-barang/${editingItem.id}` 
      : `${API_BASE_URL}/nama-barang`;
      
    const method = editingItem ? 'patch' : 'post';
    
    try {
      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan data.");
    }
  };

  const handleOpenDeleteModal = (item: Item) => {
    setItemToDelete(item);
  };
  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir."); return; }

    try {
      await axios.delete(`${API_BASE_URL}/nama-barang/${itemToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(i => i.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      alert("Gagal menghapus barang.");
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Package size={20} className="mr-2"/>Nama Barang</h2>
            <p className="text-sm text-gray-500">Kelola nama dan satuan komoditas</p>
          </div>
          <div>
            <button onClick={handleOpenCreateModal} className="btn-primary"><Plus size={16} className="mr-2"/>Tambah Barang</button>
          </div>
        </div>
        
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama barang atau satuan..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading && <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>}
                {error && <tr><td colSpan={5} className="text-center py-4 text-red-500">{error}</td></tr>}
                
                {/* Gunakan 'paginatedData' untuk me-render baris tabel */}
                {!loading && !error && paginatedData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        {item.gambar ? (
                          <img 
                            src={createImageUrl(item.gambar) || ''}
                            alt={item.namaBarang}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{item.namaBarang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.satuan?.satuanBarang || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.keterangan || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                          <button onClick={() => handleOpenDeleteModal(item)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                ))}

                {!loading && paginatedData.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-500">Tidak ada barang yang cocok.</td></tr>
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
        title={editingItem ? "Edit Barang" : "Tambah Barang Baru"}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">Nama Barang</label>
              <input type="text" id="item-name" value={formData.namaBarang} onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="item-unit" className="block text-sm font-medium text-gray-700">Satuan</label>
              <select id="item-unit" value={formData.idSatuan} onChange={(e) => setFormData({ ...formData, idSatuan: e.target.value })}
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
            <div>
              <label htmlFor="item-image" className="block text-sm font-medium text-gray-700">Gambar Barang</label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Pratinjau" className="h-16 w-16 object-cover rounded-md"/>
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <label className="block">
                  <span className="sr-only">Pilih file</span>
                  <input type="file" id="item-image" name="gambar" onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">
              {editingItem ? "Simpan Perubahan" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus barang "${itemToDelete?.namaBarang}"?`}
      />
    </>
  );
}
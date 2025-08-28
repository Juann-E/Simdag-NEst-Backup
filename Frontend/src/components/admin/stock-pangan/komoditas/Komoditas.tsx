import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Upload, X } from 'lucide-react';

interface KomoditasItem {
  id: number;
  komoditas: string;
  satuan: string;
  keterangan?: string;
  gambar?: string;
  createdAt: string;
}

const Komoditas: React.FC = () => {
  const [komoditasItems, setKomoditasItems] = useState<KomoditasItem[]>([]);
  const [availableSatuans, setAvailableSatuans] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KomoditasItem | null>(null);
  const [formData, setFormData] = useState({
    komoditas: '',
    satuan: '',
    keterangan: '',
    gambar: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    fetchKomoditas();
    fetchAvailableSatuans();
  }, []);

  const fetchKomoditas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('Token:', token ? 'Token exists' : 'No token found');
      
      const response = await fetch(`${API_BASE_URL}/komoditas-stock-pangan`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Data received:', data);
        setKomoditasItems(data);
        setError('');
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        setError(`Gagal mengambil data komoditas: ${response.status}`);
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSatuans = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/satuan-barang-stock-pangan`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ambil satuan dari data satuan komoditas
        const satuans = data.map((item: any) => item.satuanBarang).filter(Boolean);
        setAvailableSatuans(satuans);
      }
    } catch (error) {
      console.error('Error fetching available satuans:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('komoditas', formData.komoditas);
      formDataToSend.append('satuan', formData.satuan);
      formDataToSend.append('keterangan', formData.keterangan);
      
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar);
      }

      const url = editingItem 
        ? `${API_BASE_URL}/komoditas-stock-pangan/${editingItem.id}`
        : `${API_BASE_URL}/komoditas-stock-pangan`;
      
      const method = editingItem ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        await fetchKomoditas();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal menyimpan data');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komoditas ini?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/komoditas-stock-pangan/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchKomoditas();
      } else {
        setError('Gagal menghapus data');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat menghapus data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: KomoditasItem) => {
    setEditingItem(item);
    setFormData({
      komoditas: item.komoditas,
      satuan: item.satuan,
      keterangan: item.keterangan || '',
      gambar: null
    });
    setImagePreview(item.gambar ? `${API_BASE_URL}/uploads/${item.gambar.replace(/\\/g, '/').replace('uploads/', '')}` : null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      komoditas: '',
      satuan: '',
      keterangan: '',
      gambar: null
    });
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, gambar: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const filteredItems = komoditasItems.filter(item =>
    item.komoditas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.satuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Komoditas</h2>
            <p className="text-sm text-gray-500">Kelola data komoditas untuk stock pangan</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={16} className="mr-2" />
            Tambah Komoditas
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari komoditas..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komoditas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data komoditas
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.gambar ? (
                        <img
                          src={`${API_BASE_URL}/uploads/${item.gambar.replace(/\\/g, '/').replace('uploads/', '')}`}
                          alt={item.komoditas}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.komoditas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.satuan}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.keterangan || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, filteredItems.length)} dari {filteredItems.length} data
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sebelumnya
                </button>
                <span className="px-3 py-1 text-sm">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Komoditas' : 'Tambah Komoditas'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Komoditas *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.komoditas}
                  onChange={(e) => setFormData(prev => ({ ...prev, komoditas: e.target.value }))}
                  placeholder="Masukkan nama komoditas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Satuan *
                </label>
                <select
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={formData.satuan}
                  onChange={(e) => setFormData(prev => ({ ...prev, satuan: e.target.value }))}
                >
                  <option value="" disabled>Pilih satuan...</option>
                  {availableSatuans.map((satuan, index) => (
                    <option key={index} value={satuan}>{satuan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan (Opsional)
                </label>
                <textarea
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  rows={3}
                  value={formData.keterangan}
                  onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                  placeholder="Masukkan keterangan (opsional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Komoditas
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Pratinjau" className="h-16 w-16 object-cover rounded-md"/>
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                        <Upload size={32} />
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="sr-only">Pilih file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Menyimpan...' : (editingItem ? 'Simpan Perubahan' : 'Tambah')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Komoditas;
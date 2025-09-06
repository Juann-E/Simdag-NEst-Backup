// src/components/admin/bbm-lpg/JenisBbm.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { jenisBbmService, JenisBbm as IJenisBbm, CreateJenisBbmDto } from '../../../services/bbmLpgService';

export default function JenisBbm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jenisBbmData, setJenisBbmData] = useState<IJenisBbm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IJenisBbm | null>(null);
  const [formData, setFormData] = useState<CreateJenisBbmDto>({
    jenis_bbm: '',
    keterangan: ''
  });

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await jenisBbmService.getAll();
      setJenisBbmData(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data jenis BBM');
      console.error('Error loading jenis BBM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = jenisBbmData.filter(item =>
    item.jenis_bbm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await jenisBbmService.update(editingItem.id_jenis_bbm, formData);
      } else {
        await jenisBbmService.create(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving jenis BBM:', err);
      setError('Gagal menyimpan data');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await jenisBbmService.delete(id);
        await loadData();
      } catch (err) {
        console.error('Error deleting jenis BBM:', err);
        setError('Gagal menghapus data');
      }
    }
  };

  // Handle edit
  const handleEdit = (item: IJenisBbm) => {
    setEditingItem(item);
    setFormData({
      jenis_bbm: item.jenis_bbm,
      keterangan: item.keterangan || ''
    });
    setShowCreateModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingItem(null);
    setFormData({ jenis_bbm: '', keterangan: '' });
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Jenis BBM</h2>
            <p className="text-sm text-gray-500">Kelola data jenis BBM</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus size={16} className="mr-2" />
            Tambah Jenis BBM
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari jenis BBM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Jenis BBM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keterangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id_jenis_bbm} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.jenis_bbm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.keterangan || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id_jenis_bbm)}
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
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data yang ditemukan
          </div>
        )}
      </div>
    </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Jenis BBM' : 'Tambah Jenis BBM'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Jenis BBM *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jenis_bbm}
                    onChange={(e) => setFormData({ ...formData, jenis_bbm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama jenis BBM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan keterangan (opsional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingItem ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
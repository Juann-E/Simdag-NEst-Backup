// src/components/admin/settings/KelurahanSettings.tsx
import { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface Kecamatan {
  id_kecamatan: number;
  nama_kecamatan: string;
}

interface Kelurahan {
  id_kelurahan: number;
  nama_kelurahan: string;
  keterangan?: string;
  id_kecamatan: number;
  kecamatan?: Kecamatan;
}

export default function KelurahanSettings() {
  const [kelurahanList, setKelurahanList] = useState<Kelurahan[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedKelurahan, setSelectedKelurahan] = useState<Kelurahan | null>(null);
  const [formData, setFormData] = useState({
    nama_kelurahan: '',
    keterangan: '',
    id_kecamatan: 0
  });

  // Fetch data kelurahan
  const fetchKelurahan = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/kelurahan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setKelurahanList(data);
      }
    } catch (error) {
      console.error('Error fetching kelurahan:', error);
    }
  };

  // Fetch data kecamatan untuk dropdown
  const fetchKecamatan = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/kecamatan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setKecamatanList(data);
      }
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchKelurahan(), fetchKecamatan()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter data berdasarkan search term
  const filteredKelurahan = kelurahanList.filter(kelurahan =>
    kelurahan.nama_kelurahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kelurahan.kecamatan?.nama_kecamatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission untuk tambah kelurahan
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/kelurahan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowAddModal(false);
        setFormData({ nama_kelurahan: '', keterangan: '', id_kecamatan: 0 });
        fetchKelurahan();
      }
    } catch (error) {
      console.error('Error adding kelurahan:', error);
    }
  };

  // Handle form submission untuk edit kelurahan
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKelurahan) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/kelurahan/${selectedKelurahan.id_kelurahan}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowEditModal(false);
        setSelectedKelurahan(null);
        setFormData({ nama_kelurahan: '', keterangan: '', id_kecamatan: 0 });
        fetchKelurahan();
      }
    } catch (error) {
      console.error('Error updating kelurahan:', error);
    }
  };

  // Handle delete kelurahan
  const handleDelete = async () => {
    if (!selectedKelurahan) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/kelurahan/${selectedKelurahan.id_kelurahan}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedKelurahan(null);
        fetchKelurahan();
      }
    } catch (error) {
      console.error('Error deleting kelurahan:', error);
    }
  };

  // Open edit modal
  const openEditModal = (kelurahan: Kelurahan) => {
    setSelectedKelurahan(kelurahan);
    setFormData({
      nama_kelurahan: kelurahan.nama_kelurahan,
      keterangan: kelurahan.keterangan || '',
      id_kecamatan: kelurahan.id_kecamatan
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (kelurahan: Kelurahan) => {
    setSelectedKelurahan(kelurahan);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Data Kelurahan</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Kelurahan
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cari kelurahan atau kecamatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Kelurahan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kecamatan
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
            {filteredKelurahan.map((kelurahan, index) => (
              <tr key={kelurahan.id_kelurahan} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {kelurahan.nama_kelurahan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kelurahan.kecamatan?.nama_kecamatan || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kelurahan.keterangan || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(kelurahan)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(kelurahan)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Tambah Kelurahan</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kecamatan *
                </label>
                <select
                  required
                  value={formData.id_kecamatan}
                  onChange={(e) => setFormData({...formData, id_kecamatan: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Pilih Kecamatan</option>
                  {kecamatanList.map((kecamatan) => (
                    <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
                      {kecamatan.nama_kecamatan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kelurahan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_kelurahan}
                  onChange={(e) => setFormData({...formData, nama_kelurahan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ nama_kelurahan: '', keterangan: '', id_kecamatan: 0 });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Kelurahan</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kecamatan *
                </label>
                <select
                  required
                  value={formData.id_kecamatan}
                  onChange={(e) => setFormData({...formData, id_kecamatan: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Pilih Kecamatan</option>
                  {kecamatanList.map((kecamatan) => (
                    <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
                      {kecamatan.nama_kecamatan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kelurahan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_kelurahan}
                  onChange={(e) => setFormData({...formData, nama_kelurahan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedKelurahan(null);
                    setFormData({ nama_kelurahan: '', keterangan: '', id_kecamatan: 0 });
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedKelurahan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus kelurahan <strong>{selectedKelurahan.nama_kelurahan}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedKelurahan(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
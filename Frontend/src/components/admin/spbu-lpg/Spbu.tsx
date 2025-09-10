// src/components/admin/spbu-lpg/Spbu.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, Search, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import Modal from '../../ui/Modal';
import ConfirmationModal from '../../ui/ConfirmationModal';

interface Spbu {
  id_spbu: number;
  nama_usaha: string;
  no_spbu: string;
  alamat: string;
  telepon?: string;
  penanggung_jawab: string;
  nomor_hp_penanggung_jawab?: string;
  status: string;
  koordinat?: string;
  latitude?: number;
  longitude?: number;
  id_kecamatan?: number;
  id_kelurahan?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Fungsi untuk membuka Google Maps
const openGoogleMaps = (latitude?: number, longitude?: number) => {
  if (latitude && longitude) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
  } else {
    alert('Koordinat untuk SPBU ini tidak tersedia.');
  }
};

export default function Spbu() {
  const [spbuList, setSpbuList] = useState<Spbu[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSpbu, setEditingSpbu] = useState<Spbu | null>(null);
  const [kecamatanList, setKecamatanList] = useState<{id_kecamatan: number, nama_kecamatan: string}[]>([]);
  const [kelurahanList, setKelurahanList] = useState<{id_kelurahan: number, nama_kelurahan: string, id_kecamatan: number}[]>([]);
  const [formData, setFormData] = useState({ 
    nama_usaha: '', 
    no_spbu: '',
    alamat: '', 
    telepon: '',
    penanggung_jawab: '', 
    nomor_hp_penanggung_jawab: '',
    status: 'Aktif',
    koordinat: '',
    id_kecamatan: '',
    id_kelurahan: ''
  });
  const [spbuToDelete, setSpbuToDelete] = useState<Spbu | null>(null);

  useEffect(() => {
    fetchSpbu();
    fetchKecamatan();
  }, []);

  // Fetch data kecamatan untuk dropdown
  const fetchKecamatan = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/kecamatan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKecamatanList(response.data);
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
    }
  };

  // Fetch data kelurahan berdasarkan kecamatan
  const fetchKelurahan = async (id_kecamatan: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE_URL}/kelurahan?id_kecamatan=${id_kecamatan}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKelurahanList(response.data);
    } catch (error) {
      console.error('Error fetching kelurahan:', error);
    }
  };

  // Handle kecamatan change
  const handleKecamatanChange = (id_kecamatan: string) => {
    setFormData({...formData, id_kecamatan, id_kelurahan: ''});
    if (id_kecamatan) {
      fetchKelurahan(parseInt(id_kecamatan));
    } else {
      setKelurahanList([]);
    }
  };

  const fetchSpbu = async () => {
    const token = localStorage.getItem('token');
    if (!token) { return; }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/spbu`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpbuList(response.data);
    } catch (err) {
      console.error("Gagal mengambil data SPBU:", err);
    }
  };

  const filteredData = spbuList.filter(item =>
    item.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.penanggung_jawab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      nama_usaha: '',
      no_spbu: '',
      alamat: '',
      telepon: '',
      penanggung_jawab: '',
      nomor_hp_penanggung_jawab: '',
      status: 'Aktif',
      koordinat: '',
      id_kecamatan: '',
      id_kelurahan: ''
    });
    setKelurahanList([]);
  };

 const handleOpenCreateModal = () => {
    resetForm();
    setEditingSpbu(null);
    setIsFormModalOpen(true);
  };
  const handleEdit = (spbu: Spbu) => {
    setEditingSpbu(spbu);
    // Buat koordinat dari latitude dan longitude jika koordinat tidak ada
    const koordinatValue = spbu.koordinat || 
      (spbu.latitude && spbu.longitude ? `${spbu.latitude},${spbu.longitude}` : '');
    
    setFormData({
      nama_usaha: spbu.nama_usaha,
      no_spbu: spbu.no_spbu,
      alamat: spbu.alamat,
      telepon: spbu.telepon || '',
      penanggung_jawab: spbu.penanggung_jawab,
      nomor_hp_penanggung_jawab: spbu.nomor_hp_penanggung_jawab || '',
      status: spbu.status,
      koordinat: koordinatValue,
      id_kecamatan: spbu.id_kecamatan?.toString() || '',
      id_kelurahan: spbu.id_kelurahan?.toString() || ''
    });
    // Load kelurahan data if kecamatan is selected
    if (spbu.id_kecamatan) {
      fetchKelurahan(spbu.id_kecamatan);
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }

    const submitData = {
      nama_usaha: formData.nama_usaha,
      no_spbu: formData.no_spbu,
      alamat: formData.alamat,
      telepon: formData.telepon,
      penanggung_jawab: formData.penanggung_jawab,
      nomor_hp_penanggung_jawab: formData.nomor_hp_penanggung_jawab,
      status: formData.status,
      koordinat: formData.koordinat,
      id_kecamatan: formData.id_kecamatan ? parseInt(formData.id_kecamatan) : undefined,
      id_kelurahan: formData.id_kelurahan ? parseInt(formData.id_kelurahan) : undefined
    };

    const url = editingSpbu 
      ? `${API_BASE_URL}/spbu/${editingSpbu.id_spbu}` 
      : `${API_BASE_URL}/spbu`;
    const method = editingSpbu ? 'patch' : 'post';

    try {
      const response = await axios[method](url, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (editingSpbu) {
        setSpbuList(spbuList.map(s => s.id_spbu === editingSpbu.id_spbu ? response.data : s));
      } else {
        setSpbuList([...spbuList, response.data]);
      }
      setIsFormModalOpen(false);

    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan data. Periksa kembali input Anda.");
    }
  };

  const handleOpenDeleteModal = (spbu: Spbu) => {
    setSpbuToDelete(spbu);
  };

  const handleConfirmDelete = async () => {
    if (!spbuToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }
    try {
      await axios.delete(`${API_BASE_URL}/spbu/${spbuToDelete.id_spbu}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpbuList(spbuList.filter(s => s.id_spbu !== spbuToDelete.id_spbu));
      setSpbuToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus SPBU:", err);
      alert("Gagal menghapus SPBU.");
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Building size={20} className="mr-2"/>Data SPBU</h2>
            <p className="text-sm text-gray-500">Kelola data Stasiun Pengisian Bahan Bakar Umum</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleOpenCreateModal} className="btn-primary"><Plus size={16} className="mr-2"/>Tambah SPBU</button>
          </div>
        </div>

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
                Nama Usaha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No SPBU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alamat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Penanggung Jawab
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telepon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id_spbu} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{item.nama_usaha}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{item.no_spbu}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{item.alamat}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{item.penanggung_jawab}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{item.telepon}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => openGoogleMaps(item.latitude, item.longitude)}
                    className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="Buka di Google Maps"
                    disabled={!item.latitude || !item.longitude}
                  >
                    <MapPin size={18} />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-900" 
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleOpenDeleteModal(item)}
                    className="text-red-600 hover:text-red-900" 
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data SPBU yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingSpbu ? 'Edit SPBU' : 'Tambah SPBU'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NAMA USAHA *
            </label>
            <input
              type="text"
              value={formData.nama_usaha}
              onChange={(e) => setFormData({...formData, nama_usaha: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NOMOR SPBU *
            </label>
            <input
              type="text"
              value={formData.no_spbu}
              onChange={(e) => setFormData({...formData, no_spbu: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KECAMATAN *
            </label>
            <select
              value={formData.id_kecamatan}
              onChange={(e) => handleKecamatanChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kecamatan) => (
                <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
                  {kecamatan.nama_kecamatan}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KELURAHAN *
            </label>
            <select
              value={formData.id_kelurahan}
              onChange={(e) => setFormData({...formData, id_kelurahan: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kelurahan</option>
              {kelurahanList.map((kelurahan) => (
                <option key={kelurahan.id_kelurahan} value={kelurahan.id_kelurahan}>
                  {kelurahan.nama_kelurahan}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ALAMAT *
            </label>
            <textarea
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TELEPON *
            </label>
            <input
              type="text"
              value={formData.telepon}
              onChange={(e) => setFormData({...formData, telepon: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PENANGGUNG JAWAB *
            </label>
            <input
              type="text"
              value={formData.penanggung_jawab}
              onChange={(e) => setFormData({...formData, penanggung_jawab: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NOMOR HP PENANGGUNG JAWAB
            </label>
            <input
              type="text"
              value={formData.nomor_hp_penanggung_jawab}
              onChange={(e) => setFormData({...formData, nomor_hp_penanggung_jawab: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Koordinat (latitude,longitude) *
            </label>
            <input
              type="text"
              value={formData.koordinat}
              onChange={(e) => setFormData({...formData, koordinat: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-7.7956,110.3695"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingSpbu ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!spbuToDelete}
        onClose={() => setSpbuToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus SPBU "${spbuToDelete?.nama_usaha}"?`}
      />
    </>
  );
}
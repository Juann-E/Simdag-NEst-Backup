// src/components/admin/stock-pangan/distributor/Distributor.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

// Interface untuk data Distributor
interface Distributor {
  id: number;
  nama_distributor: string;
  nama_kecamatan: string;
  nama_kelurahan: string;
  alamat: string;
  koordinat?: string; // Field asli dari user
  latitude?: number;  // Field hasil konversi backend
  longitude?: number; // Field hasil konversi backend
  keterangan?: string;
}

// Interface untuk dropdown data
interface Kecamatan {
  id_kecamatan: number;
  nama_kecamatan: string;
}

interface Kelurahan {
  id_kelurahan: number;
  nama_kelurahan: string;
  id_kecamatan: number;
}

const API_BASE_URL = 'http://localhost:3000';

export default function Distributor() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [kecamatans, setKecamatans] = useState<Kecamatan[]>([]);
  const [kelurahans, setKelurahans] = useState<Kelurahan[]>([]);
  const [filteredKelurahans, setFilteredKelurahans] = useState<Kelurahan[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
  
  const [formData, setFormData] = useState({
    nama_distributor: '',
    id_kecamatan: '',
    id_kelurahan: '',
    alamat: '',
    koordinat: '',
    keterangan: ''
  });

  const [distributorToDelete, setDistributorToDelete] = useState<Distributor | null>(null);

  useEffect(() => {
    fetchDistributors();
    fetchKecamatans();
    fetchKelurahans();
  }, []);

  // Filter kelurahan berdasarkan kecamatan yang dipilih
  useEffect(() => {
    if (formData.id_kecamatan) {
      const filtered = kelurahans.filter(kel => kel.id_kecamatan === parseInt(formData.id_kecamatan));
      setFilteredKelurahans(filtered);
    } else {
      setFilteredKelurahans([]);
    }
  }, [formData.id_kecamatan, kelurahans]);

  const fetchDistributors = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/distributor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDistributors(response.data);
    } catch (err) {
      setError("Gagal mengambil data distributor.");
    } finally {
      setLoading(false);
    }
  };

  const fetchKecamatans = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/kecamatan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKecamatans(response.data);
    } catch (err) {
      console.error("Gagal mengambil data kecamatan:", err);
    }
  };

  const fetchKelurahans = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/kelurahan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKelurahans(response.data);
    } catch (err) {
      console.error("Gagal mengambil data kelurahan:", err);
    }
  };

  const filteredDistributors = distributors.filter(distributor =>
    distributor.nama_distributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.nama_kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.nama_kelurahan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi untuk membuka Google Maps
  const openGoogleMaps = (latitude?: number, longitude?: number) => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    } else {
      alert('Koordinat untuk distributor ini tidak tersedia.');
    }
  };

  const resetFormState = () => {
    setFormData({
      nama_distributor: '',
      id_kecamatan: '',
      id_kelurahan: '',
      alamat: '',
      koordinat: '',
      keterangan: ''
    });
    setEditingDistributor(null);
  };

  const handleOpenCreateModal = () => {
    resetFormState();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (distributor: Distributor) => {
    resetFormState();
    setEditingDistributor(distributor);
    
    // Cari ID kecamatan dan kelurahan berdasarkan nama
    const kecamatan = kecamatans.find(k => k.nama_kecamatan === distributor.nama_kecamatan);
    const kelurahan = kelurahans.find(k => k.nama_kelurahan === distributor.nama_kelurahan);
    
    setFormData({
      nama_distributor: distributor.nama_distributor,
      id_kecamatan: kecamatan?.id_kecamatan.toString() || '',
      id_kelurahan: kelurahan?.id_kelurahan.toString() || '',
      alamat: distributor.alamat,
      koordinat: distributor.koordinat || '', // Tampilkan koordinat asli jika ada
      keterangan: distributor.keterangan || ''
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }

    const submitData = {
      nama_distributor: formData.nama_distributor,
      id_kecamatan: parseInt(formData.id_kecamatan),
      id_kelurahan: parseInt(formData.id_kelurahan),
      alamat: formData.alamat,
      koordinat: formData.koordinat, // Kirim field koordinat
      keterangan: formData.keterangan
    };

    const url = editingDistributor 
      ? `${API_BASE_URL}/distributor/${editingDistributor.id}` 
      : `${API_BASE_URL}/distributor`;
    const method = editingDistributor ? 'patch' : 'post';

    try {
      const response = await axios[method](url, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (editingDistributor) {
        setDistributors(distributors.map(d => d.id === editingDistributor.id ? response.data : d));
      } else {
        setDistributors([...distributors, response.data]);
      }
      setIsFormModalOpen(false);

    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan data. Periksa kembali input Anda.");
    }
  };

  const handleOpenDeleteModal = (distributor: Distributor) => {
    setDistributorToDelete(distributor);
  };

  const handleConfirmDelete = async () => {
    if (!distributorToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }
    try {
      await axios.delete(`${API_BASE_URL}/distributor/${distributorToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDistributors(distributors.filter(d => d.id !== distributorToDelete.id));
      setDistributorToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus data:", err);
      alert("Gagal menghapus data distributor.");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-lg">Memuat data...</div></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Distributor</h2>
            <p className="text-sm text-gray-500">Kelola data distributor stock pangan</p>
          </div>
          <button onClick={handleOpenCreateModal} className="btn-primary">
            <Plus size={16} className="mr-2" />Tambah Distributor
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari distributor..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Distributor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelurahan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDistributors.map((distributor, index) => (
                <tr key={distributor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{distributor.nama_distributor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{distributor.nama_kecamatan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{distributor.nama_kelurahan}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{distributor.alamat}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{distributor.keterangan || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => openGoogleMaps(distributor.latitude, distributor.longitude)}
                      className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      title="Buka di Google Maps"
                      disabled={!distributor.latitude || !distributor.longitude}
                    >
                      <MapPin size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(distributor)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(distributor)}
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

        {filteredDistributors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Tidak ada distributor yang sesuai dengan pencarian.' : 'Belum ada data distributor.'}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingDistributor ? 'Edit Distributor' : 'Tambah Distributor'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Distributor *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.nama_distributor}
              onChange={(e) => setFormData({...formData, nama_distributor: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.id_kecamatan}
              onChange={(e) => setFormData({...formData, id_kecamatan: e.target.value, id_kelurahan: ''})}
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatans.map(kecamatan => (
                <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
                  {kecamatan.nama_kecamatan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan *</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.id_kelurahan}
              onChange={(e) => setFormData({...formData, id_kelurahan: e.target.value})}
              disabled={!formData.id_kecamatan}
            >
              <option value="">Pilih Kelurahan</option>
              {filteredKelurahans.map(kelurahan => (
                <option key={kelurahan.id_kelurahan} value={kelurahan.id_kelurahan}>
                  {kelurahan.nama_kelurahan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.alamat}
              onChange={(e) => setFormData({...formData, alamat: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Koordinat Peta</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.koordinat}
              onChange={(e) => setFormData({...formData, koordinat: e.target.value})}
              placeholder="-7.330054997778679, 110.50510243753217"
            />
            <p className="text-xs text-gray-500 mt-1">Klik kanan lalu Salin & tempel koordinat langsung dari Google Maps.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              placeholder="Keterangan tambahan (opsional)"
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
              {editingDistributor ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={!!distributorToDelete}
        onClose={() => setDistributorToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Distributor"
        message={`Apakah Anda yakin ingin menghapus distributor "${distributorToDelete?.nama_distributor}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}
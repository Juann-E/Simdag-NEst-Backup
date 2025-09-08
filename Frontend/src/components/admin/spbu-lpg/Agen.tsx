// src/components/admin/spbu-lpg/Agen.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, Search, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import Modal from '../../ui/Modal';
import ConfirmationModal from '../../ui/ConfirmationModal';

interface Agen {
  id_agen: number;
  nama_usaha: string;
  alamat: string;
  penanggung_jawab: string;
  telepon?: string;
  nomor_hp_penanggung_jawab?: string;
  status: string;
  koordinat?: string;
  latitude?: number;
  longitude?: number;
  id_kecamatan?: number;
  id_kelurahan?: number;
}

const API_BASE_URL = 'http://localhost:3000';

const openGoogleMaps = (latitude?: number, longitude?: number) => {
  if (latitude && longitude) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
  } else {
    alert('Koordinat untuk agen ini tidak tersedia.');
  }
};

export default function Agen() {
  const [agenList, setAgenList] = useState<Agen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [kelurahanList, setKelurahanList] = useState<any[]>([]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAgen, setEditingAgen] = useState<Agen | null>(null);
  const [formData, setFormData] = useState({ 
    nama_usaha: '', 
    alamat: '', 
    penanggung_jawab: '', 
    telepon: '',
    nomor_hp_penanggung_jawab: '',
    status: 'Aktif',
    koordinat: '',
    id_kecamatan: '',
    id_kelurahan: ''
  });
  const [agenToDelete, setAgenToDelete] = useState<Agen | null>(null);

  useEffect(() => {
    fetchAgen();
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

  const fetchAgen = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/agen`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgenList(response.data);
    } catch (err) {
      setError("Gagal mengambil data agen.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAgen = agenList.filter(agen =>
    agen.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agen.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetFormState = () => {
    setFormData({ 
      nama_usaha: '', 
      alamat: '', 
      penanggung_jawab: '', 
      telepon: '',
      nomor_hp_penanggung_jawab: '',
      status: 'Aktif',
      koordinat: '',
      id_kecamatan: '',
      id_kelurahan: ''
    });
    setKelurahanList([]);
    setEditingAgen(null);
  };

  const handleOpenCreateModal = () => {
    resetFormState();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (agen: Agen) => {
    resetFormState();
    setEditingAgen(agen);
    // Buat koordinat dari latitude dan longitude jika koordinat tidak ada
    const koordinatValue = agen.koordinat || 
      (agen.latitude && agen.longitude ? `${agen.latitude},${agen.longitude}` : '');
    
    setFormData({ 
      nama_usaha: agen.nama_usaha, 
      alamat: agen.alamat,
      penanggung_jawab: agen.penanggung_jawab,
      telepon: agen.telepon || '',
      nomor_hp_penanggung_jawab: agen.nomor_hp_penanggung_jawab || '',
      status: agen.status,
      koordinat: koordinatValue,
      id_kecamatan: agen.id_kecamatan?.toString() || '',
      id_kelurahan: agen.id_kelurahan?.toString() || ''
    });
    // Load kelurahan data if kecamatan is selected
    if (agen.id_kecamatan) {
      fetchKelurahan(agen.id_kecamatan);
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }

    const submitData = {
      nama_usaha: formData.nama_usaha,
      alamat: formData.alamat,
      penanggung_jawab: formData.penanggung_jawab,
      telepon: formData.telepon,
      nomor_hp_penanggung_jawab: formData.nomor_hp_penanggung_jawab,
      status: formData.status,
      koordinat: formData.koordinat,
      id_kecamatan: formData.id_kecamatan ? parseInt(formData.id_kecamatan) : undefined,
      id_kelurahan: formData.id_kelurahan ? parseInt(formData.id_kelurahan) : undefined
    };

    const url = editingAgen 
      ? `${API_BASE_URL}/agen/${editingAgen.id_agen}` 
      : `${API_BASE_URL}/agen`;
    const method = editingAgen ? 'patch' : 'post';

    try {
      const response = await axios[method](url, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (editingAgen) {
        setAgenList(agenList.map(a => a.id_agen === editingAgen.id_agen ? response.data : a));
      } else {
        setAgenList([...agenList, response.data]);
      }
      setIsFormModalOpen(false);

    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Gagal menyimpan data. Periksa kembali input Anda.");
    }
  };

  const handleOpenDeleteModal = (agen: Agen) => {
    setAgenToDelete(agen);
  };

  const handleConfirmDelete = async () => {
    if (!agenToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }
    try {
      await axios.delete(`${API_BASE_URL}/agen/${agenToDelete.id_agen}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgenList(agenList.filter(a => a.id_agen !== agenToDelete.id_agen));
      setAgenToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus agen:", err);
      alert("Gagal menghapus agen.");
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Building size={20} className="mr-2"/>Data Agen LPG</h2>
            <p className="text-sm text-gray-500">Kelola data Agen Liquefied Petroleum Gas</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleOpenCreateModal} className="btn-primary"><Plus size={16} className="mr-2"/>Tambah Agen</button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama agen..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Usaha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penanggung Jawab</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan={7} className="text-center py-4">Memuat data...</td></tr>}
            {error && <tr><td colSpan={7} className="text-center py-4 text-red-500">{error}</td></tr>}
            {!loading && !error && filteredAgen.map((agen) => (
              <tr key={agen.id_agen}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{agen.nama_usaha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{agen.alamat}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{agen.penanggung_jawab}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{agen.telepon}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    agen.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {agen.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => openGoogleMaps(agen.latitude, agen.longitude)}
                    className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    title="Buka di Google Maps"
                    disabled={!agen.latitude || !agen.longitude}
                  >
                    <MapPin size={18} />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleOpenEditModal(agen)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                  <button onClick={() => handleOpenDeleteModal(agen)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {!loading && filteredAgen.length === 0 && (
              <tr><td colSpan={7} className="text-center py-4 text-gray-500">Tidak ada agen yang cocok.</td></tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={editingAgen ? "Edit Agen" : "Tambah Agen Baru"}
      >
         <form onSubmit={handleFormSubmit}>
           <div className="space-y-4">
             <div>
               <label htmlFor="agen-name" className="block text-sm font-medium text-gray-700">Nama Usaha</label>
               <input
                 type="text" id="agen-name"
                 value={formData.nama_usaha}
                 onChange={(e) => setFormData({ ...formData, nama_usaha: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 required
               />
             </div>
             <div>
               <label htmlFor="agen-kecamatan" className="block text-sm font-medium text-gray-700">Kecamatan</label>
               <select
                 id="agen-kecamatan"
                 value={formData.id_kecamatan}
                 onChange={(e) => handleKecamatanChange(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 required
               >
                 <option value="">Select KECAMATAN</option>
                 {kecamatanList.map((kecamatan) => (
                   <option key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
                     {kecamatan.nama_kecamatan}
                   </option>
                 ))}
               </select>
             </div>
             <div>
               <label htmlFor="agen-kelurahan" className="block text-sm font-medium text-gray-700">Kelurahan</label>
               <select
                 id="agen-kelurahan"
                 value={formData.id_kelurahan}
                 onChange={(e) => setFormData({ ...formData, id_kelurahan: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 required
               >
                 <option value="">NONE</option>
                 {kelurahanList.map((kelurahan) => (
                   <option key={kelurahan.id_kelurahan} value={kelurahan.id_kelurahan}>
                     {kelurahan.nama_kelurahan}
                   </option>
                 ))}
               </select>
             </div>
             <div>
               <label htmlFor="agen-address" className="block text-sm font-medium text-gray-700">Alamat</label>
               <textarea
                 id="agen-address"
                 value={formData.alamat}
                 onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 rows={3}
                 required
               />
             </div>
             <div>
               <label htmlFor="agen-phone" className="block text-sm font-medium text-gray-700">Telepon</label>
               <input
                 type="text" id="agen-phone"
                 value={formData.telepon}
                 onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
               />
             </div>
             <div>
               <label htmlFor="agen-pic" className="block text-sm font-medium text-gray-700">Penanggung Jawab</label>
               <input
                 type="text" id="agen-pic"
                 value={formData.penanggung_jawab}
                 onChange={(e) => setFormData({ ...formData, penanggung_jawab: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 required
               />
             </div>
             <div>
               <label htmlFor="agen-hp" className="block text-sm font-medium text-gray-700">Nomor HP Penanggung Jawab</label>
               <input
                 type="text" id="agen-hp"
                 value={formData.nomor_hp_penanggung_jawab}
                 onChange={(e) => setFormData({ ...formData, nomor_hp_penanggung_jawab: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
               />
             </div>
             <div>
               <label htmlFor="agen-status" className="block text-sm font-medium text-gray-700">Status</label>
               <select
                 id="agen-status"
                 value={formData.status}
                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
               >
                 <option value="Aktif">Aktif</option>
                 <option value="Tidak Aktif">Tidak Aktif</option>
               </select>
             </div>
             <div>
                <label htmlFor="agen-coords" className="block text-sm font-medium text-gray-700">Koordinat Peta</label>
                <input
                    type="text" id="agen-coords"
                    value={formData.koordinat}
                    onChange={(e) => setFormData({ ...formData, koordinat: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder='Contoh: -7.330054997778679, 110.50510243753217'
                />
                <p className="mt-1 text-xs text-gray-500">Klik kanan lalu Salin & tempel koordinat langsung dari Google Maps.</p>
             </div>
           </div>
           <div className="mt-6 flex justify-end space-x-3">
             <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary">Batal</button>
             <button type="submit" className="btn-primary">
               {editingAgen ? "Simpan Perubahan" : "Tambah"}
             </button>
           </div>
         </form>
      </Modal>

      <ConfirmationModal 
        isOpen={!!agenToDelete}
        onClose={() => setAgenToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus agen "${agenToDelete?.nama_usaha}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}
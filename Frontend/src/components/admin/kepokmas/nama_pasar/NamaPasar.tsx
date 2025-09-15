// src/components/admin/kepokmas/NamaPasar.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, Search, Plus, Edit, Trash2, Image as ImageIcon, MapPin } from 'lucide-react';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

// 1. Perbarui interface untuk data dari API
interface Market {
  id: number;
  nama_pasar: string;
  alamat: string;
  gambar?: string;
  koordinat?: string; // Field asli dari user
  latitude?: number;  // Field hasil konversi backend
  longitude?: number; // Field hasil konversi backend
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const createImageUrl = (path?: string) => {
  if (!path) return null;
  const cleanedPath = path.replace(/\\/g, '/');
  return `${API_BASE_URL}/uploads/${cleanedPath.replace('uploads/', '')}`;
};

export default function NamaPasar() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<Market | null>(null);
  
  // 2. Ubah formData untuk menyertakan 'koordinat'
  const [formData, setFormData] = useState({ nama_pasar: '', alamat: '', koordinat: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [marketToDelete, setMarketToDelete] = useState<Market | null>(null);

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setError("Autentikasi gagal."); setLoading(false); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/nama-pasar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarkets(response.data);
    } catch (err) {
      setError("Gagal mengambil data pasar.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = markets.filter(market =>
    market.nama_pasar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetFormState = () => {
    // 3. Reset 'koordinat' juga
    setFormData({ nama_pasar: '', alamat: '', koordinat: '' });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingMarket(null);
  }

  const handleOpenCreateModal = () => {
    resetFormState();
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (market: Market) => {
    resetFormState();
    setEditingMarket(market);
    // 4. Set 'koordinat' di form saat edit
    setFormData({ 
      nama_pasar: market.nama_pasar, 
      alamat: market.alamat,
      koordinat: market.koordinat || '' // Tampilkan koordinat asli jika ada
    });
    
    setImagePreview(createImageUrl(market.gambar));
    setIsFormModalOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }

    const data = new FormData();
    data.append('nama_pasar', formData.nama_pasar);
    data.append('alamat', formData.alamat);
    // Hanya kirim koordinat jika tidak kosong
    if (formData.koordinat && formData.koordinat.trim() !== '') {
      data.append('koordinat', formData.koordinat.trim());
    }
    if (selectedFile) {
      data.append('gambar', selectedFile);
    }

    const url = editingMarket 
      ? `${API_BASE_URL}/nama-pasar/${editingMarket.id}` 
      : `${API_BASE_URL}/nama-pasar`;
    const method = editingMarket ? 'patch' : 'post';

    try {
      await axios[method](url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchMarkets(); // Refresh data dari server
      resetFormState(); // Reset form setelah berhasil submit
      setIsFormModalOpen(false);

    } catch (err: any) {
      console.error("Gagal menyimpan data:", err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal menyimpan data";
      alert(`Gagal menyimpan data: ${errorMessage}`);
    }
  };

  const handleOpenDeleteModal = (market: Market) => {
    setMarketToDelete(market);
  };

  const handleConfirmDelete = async () => {
    if (!marketToDelete) return;
    const token = localStorage.getItem('accessToken');
    if (!token) { alert("Sesi berakhir, silakan login kembali."); return; }
    try {
      await axios.delete(`${API_BASE_URL}/nama-pasar/${marketToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMarkets(markets.filter(m => m.id !== marketToDelete.id));
      setMarketToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus pasar:", err);
      alert("Gagal menghapus pasar.");
    }
  };
  
  // 6. Fungsi untuk membuka Google Maps
  const openGoogleMaps = (latitude?: number, longitude?: number) => {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    } else {
      alert('Koordinat untuk pasar ini tidak tersedia.');
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        {/* ... (Header dan Search Bar tidak berubah) ... */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Building size={20} className="mr-2"/>Nama Pasar</h2>
            <p className="text-sm text-gray-500">Kelola data pasar tradisional untuk survey komoditas</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={handleOpenCreateModal} className="btn-primary"><Plus size={16} className="mr-2"/>Tambah Pasar</button>
          </div>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama pasar..." 
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pasar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                    {/* 7. Tambah kolom Peta */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading && <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>}
                {error && <tr><td colSpan={5} className="text-center py-4 text-red-500">{error}</td></tr>}
                {!loading && !error && filteredMarkets.map((market) => (
                    <tr key={market.id}>
                        <td className="px-6 py-4">
                            {market.gambar ? (
                                <img 
                                  src={createImageUrl(market.gambar) || ''} 
                                  alt={market.nama_pasar}
                                  className="h-12 w-12 rounded-md object-cover"
                                />
                            ) : (
                                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                                  <ImageIcon size={24} />
                                </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{market.nama_pasar}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{market.alamat}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => openGoogleMaps(market.latitude, market.longitude)}
                              className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                              title="Buka di Google Maps"
                              disabled={!market.latitude || !market.longitude}
                            >
                              <MapPin size={18} />
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button onClick={() => handleOpenEditModal(market)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                            <button onClick={() => handleOpenDeleteModal(market)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
                {!loading && filteredMarkets.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-4 text-gray-500">Tidak ada pasar yang cocok.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        title={editingMarket ? "Edit Pasar" : "Tambah Pasar Baru"}
      >
         <form onSubmit={handleFormSubmit}>
           <div className="space-y-4">
             <div>
               <label htmlFor="market-name" className="block text-sm font-medium text-gray-700">Nama Pasar</label>
               <input
                 type="text" id="market-name"
                 value={formData.nama_pasar}
                 onChange={(e) => setFormData({ ...formData, nama_pasar: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 required
               />
             </div>
             <div>
               <label htmlFor="market-address" className="block text-sm font-medium text-gray-700">Alamat</label>
               <input
                 type="text" id="market-address"
                 value={formData.alamat}
                 onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                 required
               />
             </div>
             {/* 8. Input koordinat baru */}
             <div>
                <label htmlFor="market-coords" className="block text-sm font-medium text-gray-700">Koordinat Peta</label>
                <input
                    type="text" id="market-coords"
                    value={formData.koordinat}
                    onChange={(e) => setFormData({ ...formData, koordinat: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder='Contoh: -7.330054997778679, 110.50510243753217'
                />
                <p className="mt-1 text-xs text-gray-500">Klik kanan lalu Salin & tempel koordinat langsung dari Google Maps.</p>
             </div>
             <div>
                 <label htmlFor="market-image" className="block text-sm font-medium text-gray-700">Gambar Pasar</label>
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
                         <input type="file" id="market-image" name="gambar" onChange={handleFileChange}
                             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                         />
                     </label>
                 </div>
             </div>
           </div>
           <div className="mt-6 flex justify-end space-x-3">
             <button type="button" onClick={() => setIsFormModalOpen(false)} className="btn-secondary">Batal</button>
             <button type="submit" className="btn-primary">
               {editingMarket ? "Simpan Perubahan" : "Tambah"}
             </button>
           </div>
         </form>
      </Modal>

      <ConfirmationModal 
        isOpen={!!marketToDelete}
        onClose={() => setMarketToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin ingin menghapus pasar "${marketToDelete?.nama_pasar}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}
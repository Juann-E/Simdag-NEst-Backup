// src/components/admin/bbm-lpg/RealisasiBbmDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Fuel } from 'lucide-react';
import Modal from '../../ui/Modal';
import ConfirmationModal from '../../ui/ConfirmationModal';
import { getAuthToken } from '../../../utils/auth';

interface JenisBbm {
  id_jenis_bbm: number;
  jenis_bbm: string;
  keterangan?: string;
}

interface RealisasiDetail {
  id_realisasi_bbm: number;
  bulan: string;
  tahun: string;
  realisasi_liter: number;
  spbu: {
    id_spbu: number;
    nama_usaha: string;
    no_spbu: string;
    alamat: string;
    penanggung_jawab: string;
  };
  jenisBbm: JenisBbm;
}

interface RealisasiBbm {
  id_spbu: number;
  spbu: {
    id_spbu: number;
    nama_usaha: string;
    no_spbu: string;
    alamat: string;
    penanggung_jawab: string;
  };
  details: RealisasiDetail[];
}



export default function RealisasiBbmDetail() {
  const { id_spbu } = useParams<{ id_spbu: string }>();
  const navigate = useNavigate();
  
  const [realisasiData, setRealisasiData] = useState<RealisasiBbm | null>(null);
  const [jenisBbmList, setJenisBbmList] = useState<JenisBbm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<RealisasiDetail | null>(null);
  const [detailToDelete, setDetailToDelete] = useState<RealisasiDetail | null>(null);
  
  const [formData, setFormData] = useState({
    bulan: String(new Date().getMonth() + 1).padStart(2, '0'),
    tahun: String(new Date().getFullYear()),
    id_jenis_bbm: 0,
    realisasi_liter: ''
  });

  useEffect(() => {
    if (id_spbu) {
      const loadData = async () => {
          setLoading(true);
          setError(null);
          try {
            await Promise.all([
              fetchRealisasiData(),
              fetchJenisBbmList()
            ]);
          } catch (error) {
            console.error('Error loading data:', error);
            setError('Gagal memuat data. Silakan coba lagi.');
          } finally {
            setLoading(false);
          }
        };
      loadData();
    } else {
      setLoading(false);
    }
  }, [id_spbu]);

  const fetchRealisasiData = async () => {
    try {
      // Fetch SPBU data
      const spbuResponse = await axios.get('http://localhost:3000/public/spbu', { timeout: 10000 });
      const spbuData = spbuResponse.data.find((s: any) => s.id_spbu === parseInt(id_spbu!));
      
      if (!spbuData) {
        throw new Error('SPBU tidak ditemukan');
      }
      
      // Fetch realisasi data for this SPBU using public endpoint
      const realisasiResponse = await axios.get(`http://localhost:3000/public/realisasi-bulanan-bbm/spbu/${id_spbu}`, { timeout: 10000 });
      
      // Map the response data to match our interface
      const mappedDetails = (realisasiResponse.data || []).map((item: any) => ({
        id_realisasi_bbm: item.id_realisasi_bbm,
        bulan: item.bulan,
        tahun: item.tahun,
        realisasi_liter: parseFloat(item.realisasi_liter),
        spbu: {
          id_spbu: item.id_spbu,
          nama_usaha: item.nama_usaha,
          no_spbu: item.no_spbu,
          alamat: item.alamat,
          penanggung_jawab: item.penanggung_jawab || ''
        },
        jenisBbm: {
          id_jenis_bbm: item.id_jenis_bbm,
          jenis_bbm: item.jenis_bbm,
          keterangan: item.keterangan || ''
        }
      }));
      
      const resultData = {
        id_spbu: parseInt(id_spbu!),
        spbu: spbuData,
        details: mappedDetails
      };
      
      setRealisasiData(resultData);
    } catch (error) {
      console.error('Error fetching realisasi data:', error);
      throw error;
    }
  };

  const fetchJenisBbmList = async () => {
    try {
      console.log('fetchJenisBbmList: Starting fetch...');
      // Menggunakan endpoint public untuk jenis BBM
      const response = await axios.get('http://localhost:3000/public/jenis-bbm', { 
        timeout: 10000
      });
      console.log('fetchJenisBbmList: Response received:', response.data?.length, 'items');
      console.log('fetchJenisBbmList: Setting jenis BBM list:', response.data);
      setJenisBbmList(response.data || []);
      console.log('fetchJenisBbmList: Completed successfully');
    } catch (error) {
      console.error('fetchJenisBbmList: Error occurred:', error);
      throw error; // Re-throw to be caught by Promise.all
    }
  };

  const handleAddDetail = async () => {
    try {
      const token = getAuthToken();
      const detailData = {
        id_spbu: parseInt(id_spbu!),
        id_jenis_bbm: formData.id_jenis_bbm,
        bulan: formData.bulan,
        tahun: formData.tahun,
        realisasi_liter: parseFloat(formData.realisasi_liter)
      };
      
      await axios.post(`http://localhost:3000/realisasi-bulanan-bbm`, detailData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAddModalOpen(false);
      resetForm();
      fetchRealisasiData();
    } catch (error: any) {
      console.error('Error adding detail:', error);
      if (error.response?.status === 409) {
        setError('Data untuk periode dan jenis BBM ini sudah ada');
      } else if (error.response?.status === 401) {
        setError('Sesi login telah berakhir. Silakan login kembali.');
      } else if (error.response?.status === 400) {
        setError('Data yang dimasukkan tidak valid. Periksa kembali form.');
      } else {
        setError(`Gagal menambahkan data: ${error.response?.data?.message || error.message || 'Terjadi kesalahan'}`);
      }
    }
  };

  const handleEditDetail = async () => {
    if (!editingDetail) return;
    
    try {
      const token = getAuthToken();
      const updateData = {
        id_jenis_bbm: formData.id_jenis_bbm,
        bulan: formData.bulan,
        tahun: formData.tahun,
        realisasi_liter: parseFloat(formData.realisasi_liter)
      };
      await axios.patch(`http://localhost:3000/realisasi-bulanan-bbm/${editingDetail.id_realisasi_bbm}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsEditModalOpen(false);
      setEditingDetail(null);
      resetForm();
      fetchRealisasiData();
    } catch (error: any) {
      console.error('Error updating detail:', error);
      if (error.response?.status === 409) {
        setError('Data untuk periode dan jenis BBM ini sudah ada');
      } else {
        setError('Gagal mengupdate data detail');
      }
    }
  };

  const handleDeleteDetail = async () => {
    if (!detailToDelete) return;
    
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:3000/realisasi-bulanan-bbm/${detailToDelete.id_realisasi_bbm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDetailToDelete(null);
      fetchRealisasiData();
    } catch (error) {
      console.error('Error deleting detail:', error);
      setError('Gagal menghapus data detail');
    }
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (detail: RealisasiDetail) => {
    setEditingDetail(detail);
    setFormData({
      bulan: detail.bulan,
      tahun: detail.tahun,
      id_jenis_bbm: detail.jenisBbm?.id_jenis_bbm || 0,
      realisasi_liter: detail.realisasi_liter.toString()
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      bulan: String(new Date().getMonth() + 1).padStart(2, '0'),
      tahun: String(new Date().getFullYear()),
      id_jenis_bbm: 0,
      realisasi_liter: ''
    });
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!realisasiData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Data tidak ditemukan</div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <button
          onClick={() => navigate('/admin/bbm-lpg/realisasi-bulanan-bbm')}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          Kembali ke Realisasi Bulanan BBM
        </button>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Realisasi BBM: {realisasiData.spbu.nama_usaha}</h2>
            <p className="text-sm text-gray-500">Kelola data realisasi bulanan untuk SPBU ini - {realisasiData.spbu.no_spbu}</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary"
          >
            <Plus size={16} className="mr-2" />
            Tambah Data
          </button>
        </div>

        {/* SPBU Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Informasi SPBU</h3>
              <p className="text-sm text-gray-600">Nama: {realisasiData.spbu.nama_usaha}</p>
              <p className="text-sm text-gray-600">No. SPBU: {realisasiData.spbu.no_spbu}</p>
              <p className="text-sm text-gray-600">Alamat: {realisasiData.spbu.alamat}</p>
              <p className="text-sm text-gray-600">Penanggung Jawab: {realisasiData.spbu.penanggung_jawab}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Keterangan</h3>
              <p className="text-sm text-gray-600">{realisasiData.keterangan || 'Tidak ada keterangan'}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis BBM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Realisasi (Liter)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {realisasiData.details?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Belum ada data realisasi
                  </td>
                </tr>
              ) : (
                realisasiData.details?.map((detail) => (
                  <tr key={detail.id_realisasi_bbm} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{detail.bulan}/{detail.tahun}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {detail.jenisBbm?.jenis_bbm || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof detail.realisasi_liter === 'number' ? detail.realisasi_liter.toLocaleString('id-ID') : detail.realisasi_liter} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(detail)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDetailToDelete(detail)}
                          className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Data Realisasi"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulan *
              </label>
              <select
                value={formData.bulan}
                onChange={(e) => setFormData({...formData, bulan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun *
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={formData.tahun}
                onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis BBM *
            </label>
            <select
              value={formData.id_jenis_bbm}
              onChange={(e) => setFormData({...formData, id_jenis_bbm: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Pilih Jenis BBM</option>
              {jenisBbmList.map(jenis => (
                <option key={jenis.id_jenis_bbm} value={jenis.id_jenis_bbm}>
                  {jenis.jenis_bbm}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Realisasi (Liter) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.realisasi_liter}
              onChange={(e) => setFormData({...formData, realisasi_liter: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan jumlah realisasi dalam liter"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              onClick={handleAddDetail}
              disabled={formData.id_jenis_bbm === 0 || !formData.realisasi_liter || parseFloat(formData.realisasi_liter || '0') <= 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambah
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Data Realisasi"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulan *
              </label>
              <select
                value={formData.bulan}
                onChange={(e) => setFormData({...formData, bulan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun *
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={formData.tahun}
                onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis BBM *
            </label>
            <select
              value={formData.id_jenis_bbm}
              onChange={(e) => setFormData({...formData, id_jenis_bbm: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Pilih Jenis BBM</option>
              {jenisBbmList.map(jenis => (
                <option key={jenis.id_jenis_bbm} value={jenis.id_jenis_bbm}>
                  {jenis.jenis_bbm}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Realisasi (Liter) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.realisasi_liter}
              onChange={(e) => setFormData({...formData, realisasi_liter: parseFloat(e.target.value) || ''})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan jumlah realisasi dalam liter"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              onClick={handleEditDetail}
              disabled={formData.id_jenis_bbm === 0 || !formData.realisasi_liter || parseFloat(formData.realisasi_liter) <= 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!detailToDelete}
        onClose={() => setDetailToDelete(null)}
        onConfirm={handleDeleteDetail}
        title="Hapus Data Realisasi"
        message={`Apakah Anda yakin ingin menghapus data realisasi ${detailToDelete?.periode} untuk ${detailToDelete?.jenisBbm?.jenis_bbm}?`}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </>
  );
}
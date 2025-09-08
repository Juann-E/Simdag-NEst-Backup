import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Distributor {
  id: number;
  nama_distributor: string;
}

interface Komoditas {
  id: number;
  komoditas: string;
}

interface TransaksiStockPangan {
  idTransaksi: number;
  tahun: number;
  bulan: number;
  distributor: Distributor;
  komoditas: Komoditas;
  stockAwal: number;
  pengadaan: number;
  penyaluran: number;
  keterangan?: string;
  timeStamp: string;
}

interface TransaksiFormData {
  tahun: number;
  bulan: number;
  idDistributor: number;
  idKomoditas: number;
  stockAwal: number;
  pengadaan: number;
  penyaluran: number;
  keterangan?: string;
}

const TransaksiStockPangan: React.FC = () => {
  const [transaksiItems, setTransaksiItems] = useState<TransaksiStockPangan[]>([]);
  const [filteredItems, setFilteredItems] = useState<TransaksiStockPangan[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [komoditasItems, setKomoditasItems] = useState<Komoditas[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransaksiStockPangan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<TransaksiFormData>({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
    idDistributor: 0,
    idKomoditas: 0,
    stockAwal: 0,
    pengadaan: 0,
    penyaluran: 0,
    keterangan: ''
  });

  const bulanNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Fetch data functions
  const fetchTransaksiItems = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Autentikasi gagal. Silakan login kembali.');
      return;
    }
    
    try {
      const response = await axios.get('http://localhost:3000/transaksi-stock-pangan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransaksiItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching transaksi items:', error);
    }
  };

  const fetchDistributors = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    try {
      const response = await axios.get('http://localhost:3000/distributor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDistributors(response.data);
    } catch (error) {
      console.error('Error fetching distributors:', error);
    }
  };

  const fetchKomoditas = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    try {
      const response = await axios.get('http://localhost:3000/komoditas-stock-pangan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKomoditasItems(response.data);
    } catch (error) {
      console.error('Error fetching komoditas:', error);
    }
  };

  useEffect(() => {
    fetchTransaksiItems();
    fetchDistributors();
    fetchKomoditas();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    const filtered = transaksiItems.filter(item =>
      item.distributor.nama_distributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.komoditas.komoditas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tahun.toString().includes(searchTerm) ||
      bulanNames[item.bulan - 1].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, transaksiItems]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Sesi berakhir, silakan login kembali.');
      setIsLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingItem) {
        await axios.patch(`http://localhost:3000/transaksi-stock-pangan/${editingItem.idTransaksi}`, formData, { headers });
        console.log('Transaksi berhasil diperbarui');
      } else {
        await axios.post('http://localhost:3000/transaksi-stock-pangan', formData, { headers });
        console.log('Transaksi berhasil ditambahkan');
      }
      
      fetchTransaksiItems();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving transaksi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: TransaksiStockPangan) => {
    setEditingItem(item);
    setFormData({
      tahun: item.tahun,
      bulan: item.bulan,
      idDistributor: item.distributor.id,
      idKomoditas: item.komoditas.id,
      stockAwal: item.stockAwal,
      pengadaan: item.pengadaan,
      penyaluran: item.penyaluran,
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?');

    if (confirmed) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Sesi berakhir, silakan login kembali.');
        return;
      }

      try {
        await axios.delete(`http://localhost:3000/transaksi-stock-pangan/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Transaksi berhasil dihapus');
        fetchTransaksiItems();
      } catch (error) {
        console.error('Error deleting transaksi:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tahun: new Date().getFullYear(),
      bulan: new Date().getMonth() + 1,
      idDistributor: 0,
      idKomoditas: 0,
      stockAwal: 0,
      pengadaan: 0,
      penyaluran: 0,
      keterangan: ''
    });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Transaksi Stock Pangan</h2>
            <p className="text-sm text-gray-500">
              Kelola data transaksi stock pangan termasuk stock awal, pengadaan, dan penyaluran.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </button>
        </div>

        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toko Besar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komoditas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Awal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengadaan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penyaluran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr key={item.idTransaksi} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tahun}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bulanNames[item.bulan - 1]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.distributor.nama_distributor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.komoditas.komoditas}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stockAwal.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pengadaan.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.penyaluran.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.keterangan || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.idTransaksi)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredItems.length)}</span> of{' '}
                  <span className="font-medium">{filteredItems.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit Transaksi Stock Pangan' : 'Tambah Transaksi Stock Pangan'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.tahun}
                      onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.bulan}
                      onChange={(e) => setFormData({ ...formData, bulan: parseInt(e.target.value) })}
                    >
                      {bulanNames.map((bulan, index) => (
                        <option key={index + 1} value={index + 1}>{bulan}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toko Besar</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.idDistributor}
                      onChange={(e) => setFormData({ ...formData, idDistributor: parseInt(e.target.value) })}
                    >
                      <option value={0}>Pilih Toko Besar</option>
                      {distributors.map((distributor) => (
                        <option key={distributor.id} value={distributor.id}>
                          {distributor.nama_distributor}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Komoditas</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.idKomoditas}
                      onChange={(e) => setFormData({ ...formData, idKomoditas: parseInt(e.target.value) })}
                    >
                      <option value={0}>Pilih Komoditas</option>
                      {komoditasItems.map((komoditas) => (
                        <option key={komoditas.id} value={komoditas.id}>
                          {komoditas.komoditas}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Awal</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.stockAwal === 0 ? '' : formData.stockAwal}
                      onChange={(e) => setFormData({ ...formData, stockAwal: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pengadaan</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.pengadaan === 0 ? '' : formData.pengadaan}
                      onChange={(e) => setFormData({ ...formData, pengadaan: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penyaluran</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.penyaluran === 0 ? '' : formData.penyaluran}
                      onChange={(e) => setFormData({ ...formData, penyaluran: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    placeholder="Keterangan tambahan (opsional)"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Menyimpan...' : (editingItem ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransaksiStockPangan;
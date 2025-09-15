// src/components/admin/kepokmas/GridDetailPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, ArrowLeft, Search, Edit, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../ui/Modal';
import ConfirmationModal from '../../ui/ConfirmationModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Interface untuk tipe data
interface Market { id: number; nama_pasar: string; }
interface Unit { idSatuan: number; satuanBarang: string; }
interface Item { id: number; namaBarang: string; satuan: Unit; }
interface GridItem { id_barang_pasar: number; pasar: Market; barang: Item; keterangan?: string; }

// 1. Tentukan jumlah item per halaman
const ITEMS_PER_PAGE = 10;

export default function GridDetailPage() {
  const { marketId } = useParams();
  const [marketName, setMarketName] = useState('');
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GridItem | null>(null);

  const [selectedItemId, setSelectedItemId] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [editingGridItemId, setEditingGridItemId] = useState<number | null>(null);
  const [editKeterangan, setEditKeterangan] = useState('');

  // 2. Tambahkan state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);

  const numericMarketId = parseInt(marketId || '0', 10);

  useEffect(() => {
    if (numericMarketId) {
      const fetchDetails = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) { setLoading(false); return; }
        const headers = { Authorization: `Bearer ${token}` };

        try {
          const [marketRes, allItemsRes, gridRes] = await Promise.all([
            axios.get<Market[]>(`${API_BASE_URL}/nama-pasar`, { headers }),
            axios.get<Item[]>(`${API_BASE_URL}/nama-barang`, { headers }),
            axios.post<GridItem[]>(`${API_BASE_URL}/barang-pasar-grid/filter`, { idPasar: numericMarketId }, { headers })
              .catch(error => {
                if (error.response && error.response.status === 404) { return { data: [] }; }
                throw error;
              })
          ]);

          const currentMarket = marketRes.data.find(m => m.id === numericMarketId);
          if (currentMarket) setMarketName(currentMarket.nama_pasar);

          setAllItems(allItemsRes.data);
          setGridItems(gridRes.data);

        } catch (error) {
          console.error("Gagal memuat data detail grid", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [numericMarketId]);

  const availableItemsToAdd = useMemo(() => {
    const existingItemIds = new Set(gridItems.map(item => item.barang.id));
    return allItems.filter(item => !existingItemIds.has(item.id));
  }, [allItems, gridItems]);

  // 3. Logika untuk memfilter dan memotong data untuk halaman saat ini
  const filteredGridItems = useMemo(() =>
    gridItems.filter(item =>
      item.barang.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
    ), [gridItems, searchTerm]);

  const totalPages = Math.ceil(filteredGridItems.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredGridItems.slice(startIndex, endIndex);
  }, [currentPage, filteredGridItems]);

  // Reset ke halaman 1 setiap kali filter pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(`${API_BASE_URL}/barang-pasar-grid`, {
        idPasar: numericMarketId,
        idBarang: parseInt(selectedItemId),
        keterangan: keterangan,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const newItemFullData = allItems.find(item => item.id === parseInt(selectedItemId));
      if (newItemFullData) {
        const newGridItem = { ...response.data, barang: newItemFullData, pasar: { id: numericMarketId, nama_pasar: marketName } };
        setGridItems([...gridItems, newGridItem]);
      }
      setIsModalOpen(false);
      setSelectedItemId('');
      setKeterangan('');
    } catch (error) {
      alert("Gagal menambahkan barang. Mungkin barang sudah ada.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_BASE_URL}/barang-pasar-grid/${itemToDelete.pasar.id}/${itemToDelete.barang.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGridItems(gridItems.filter(i => i.id_barang_pasar !== itemToDelete.id_barang_pasar));
      setItemToDelete(null);
    } catch (error) {
      alert("Gagal menghapus barang.");
    }
  };

  const handleOpenEditMode = (item: GridItem) => {
    setEditingGridItemId(item.id_barang_pasar);
    setEditKeterangan(item.keterangan || '');
  };

  const handleSaveKeterangan = async (itemToUpdate: GridItem) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/barang-pasar-grid/${itemToUpdate.pasar.id}/${itemToUpdate.barang.id}`,
        { keterangan: editKeterangan },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGridItems(gridItems.map(item =>
        item.id_barang_pasar === itemToUpdate.id_barang_pasar
          ? { ...item, keterangan: response.data.keterangan }
          : item
      ));

      setEditingGridItemId(null);
      setEditKeterangan('');

    } catch (error) {
      alert("Gagal menyimpan perubahan keterangan.");
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <Link to="/admin/kepokmas/barang-pasar-grid" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft size={16} />
          Kembali ke Daftar Pasar
        </Link>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Barang: {marketName}</h2>
            <p className="text-sm text-gray-500">Kelola barang yang tersedia untuk pasar ini</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary"><Plus size={16} className="mr-2" />Tambah Barang</button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari barang di pasar ini..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan={4} className="text-center py-4">Memuat data...</td></tr>}
            {!loading && paginatedData.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-gray-500">{gridItems.length > 0 ? 'Barang tidak ditemukan.' : 'Belum ada barang di pasar ini.'}</td></tr>}

            {/* 4. Gunakan 'paginatedData' untuk me-render baris tabel */}
            {!loading && paginatedData.map(item => (
              <tr key={item.id_barang_pasar}>
                <td className="px-6 py-4 font-medium">{item.barang.namaBarang}</td>
                <td className="px-6 py-4 text-gray-500">{item.barang.satuan?.satuanBarang || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-500 w-1/3">
                  {editingGridItemId === item.id_barang_pasar ? (
                    <input
                      type="text"
                      value={editKeterangan}
                      onChange={(e) => setEditKeterangan(e.target.value)}
                      className="px-2 py-1 border rounded-md w-full"
                      autoFocus
                    />
                  ) : (
                    item.keterangan || '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingGridItemId === item.id_barang_pasar ? (
                    <button onClick={() => handleSaveKeterangan(item)} className="text-green-600 hover:text-green-900" title="Simpan">
                      <Save size={16} />
                    </button>
                  ) : (
                    <button onClick={() => handleOpenEditMode(item)} className="text-blue-600 hover:text-blue-900" title="Edit Keterangan">
                      <Edit size={16} />
                    </button>
                  )}
                  <button onClick={() => setItemToDelete(item)} className="text-red-600 hover:text-red-900" title="Hapus Barang dari Pasar">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- 5. Tambahkan komponen navigasi pagination di bawah tabel --- */}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Tambah Barang ke ${marketName}`}>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="item-select" className="block text-sm font-medium text-gray-700">Pilih Barang</label>
            <select id="item-select" value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required>
              <option value="" disabled>-- Pilih Barang untuk Ditambahkan --</option>
              {availableItemsToAdd.map(item => (
                <option key={item.id} value={item.id}>{item.namaBarang} ({item.satuan.satuanBarang})</option>
              ))}
            </select>
            {availableItemsToAdd.length === 0 && <p className="text-xs text-gray-500 mt-1">Semua barang sudah ditambahkan ke pasar ini.</p>}
          </div>

          <div>
            <label htmlFor="item-keterangan" className="block text-sm font-medium text-gray-700">Keterangan (Opsional)</label>
            <textarea id="item-keterangan" value={keterangan} onChange={e => setKeterangan(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary" disabled={availableItemsToAdd.length === 0}>Tambah</button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Hapus barang "${itemToDelete?.barang.namaBarang}" dari pasar "${itemToDelete?.pasar.nama_pasar}"?`} />
    </>
  );
}
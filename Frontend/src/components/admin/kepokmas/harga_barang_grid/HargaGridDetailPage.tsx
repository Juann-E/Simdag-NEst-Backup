import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BulkPriceInputModal from './BulkPriceInputModal';
import Modal from '../../../ui/Modal';
import ConfirmationModal from '../../../ui/ConfirmationModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Definisikan tipe data
interface PriceData {
  id_harga: number;
  harga: number;
  tanggal_harga: string;
}
interface Market {
  id: number;
  nama_pasar: string;
}
interface PriceHistoryItem {
  id_harga: number;
  harga: number;
  tanggal_harga: string;
  keterangan?: string;
  barangPasar: {
    id_barang_pasar: number;
    barang: { namaBarang: string; satuan: { satuanBarang: string } };
    pasar: { id: number; nama_pasar: string; };
  };
}

// 1. Tentukan jumlah item per halaman
const ITEMS_PER_PAGE = 10;

export default function HargaGridDetailPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const [marketName, setMarketName] = useState('');
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [latestPriceMap, setLatestPriceMap] = useState<Map<number, PriceData>>(new Map());

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PriceHistoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<PriceHistoryItem | null>(null);
  const [formData, setFormData] = useState({ harga: '', tanggal_harga: '', keterangan: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Tambahkan state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);

  const numericMarketId = parseInt(marketId || '0', 10);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) { setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [marketRes, hargaRes] = await Promise.all([
        axios.get<Market[]>(`${API_BASE_URL}/nama-pasar`, { headers }),
        axios.get<PriceHistoryItem[]>(`${API_BASE_URL}/harga-barang-pasar`, { headers }),
      ]);

      const currentMarket = marketRes.data.find(m => m.id === numericMarketId);
      if (currentMarket) setMarketName(currentMarket.nama_pasar);

      const allPricesForMarket = hargaRes.data.filter((p: PriceHistoryItem) => p.barangPasar?.pasar?.id === numericMarketId);

      const sortedHistory = [...allPricesForMarket].sort((a, b) => new Date(b.tanggal_harga).getTime() - new Date(a.tanggal_harga).getTime());
      setPriceHistory(sortedHistory);

      const newLatestPriceMap = new Map<number, PriceData>();
      const pricesByGridItem: { [key: number]: PriceHistoryItem[] } = {};
      allPricesForMarket.forEach((p: PriceHistoryItem) => {
        const gridId = p.barangPasar.id_barang_pasar;
        if (!pricesByGridItem[gridId]) pricesByGridItem[gridId] = [];
        pricesByGridItem[gridId].push(p);
      });

      for (const gridId in pricesByGridItem) {
        const latestPrice = pricesByGridItem[gridId].sort((a, b) => new Date(b.tanggal_harga).getTime() - new Date(a.tanggal_harga).getTime())[0];
        newLatestPriceMap.set(parseInt(gridId), latestPrice);
      }
      setLatestPriceMap(newLatestPriceMap);

    } catch (error) {
      console.error("Gagal memuat data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (numericMarketId) {
      fetchData();
    }
  }, [numericMarketId]);

  // 3. Logika untuk memfilter data
  const filteredPriceHistory = useMemo(() =>
    priceHistory.filter(item => {
      const term = searchTerm.toLowerCase();
      if (!term) return true; // Tampilkan semua jika tidak ada pencarian
      const itemName = item.barangPasar?.barang?.namaBarang.toLowerCase() || '';
      const itemPrice = item.harga.toString();
      const itemDate = new Date(item.tanggal_harga).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return itemName.includes(term) || itemPrice.includes(term) || itemDate.includes(term);
    }), [priceHistory, searchTerm]);

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredPriceHistory.length / ITEMS_PER_PAGE);

  // Potong data untuk ditampilkan di halaman saat ini
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPriceHistory.slice(startIndex, endIndex);
  }, [currentPage, filteredPriceHistory]);

  // Reset ke halaman 1 setiap kali filter pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleOpenEditModal = (item: PriceHistoryItem) => {
    setEditingItem(item);
    setFormData({
      harga: item.harga.toString(),
      tanggal_harga: new Date(item.tanggal_harga).toISOString().split('T')[0],
      keterangan: item.keterangan || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_BASE_URL}/harga-barang-pasar/${editingItem.id_harga}`, {
        harga: parseInt(formData.harga),
        tanggal_harga: formData.tanggal_harga,
        keterangan: formData.keterangan,
      }, { headers: { Authorization: `Bearer ${token}` } });

      await fetchData();
      setIsEditModalOpen(false);
    } catch (error) {
      alert("Gagal memperbarui harga.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_BASE_URL}/harga-barang-pasar/${itemToDelete.id_harga}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPriceHistory(priceHistory.filter(p => p.id_harga !== itemToDelete.id_harga));
      setItemToDelete(null);
    } catch (error) {
      alert("Gagal menghapus data harga.");
    }
  };

  return (
    <>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <Link to="/admin/kepokmas/harga-barang-grid" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft size={16} />
          Kembali ke Daftar Pasar
        </Link>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Riwayat Harga: {marketName}</h2>
            <p className="text-sm text-gray-500">Menampilkan semua data harga yang pernah diinput</p>
          </div>
          {/* <button onClick={() => setIsBulkModalOpen(true)} className="btn-primary"><Plus size={16} className="mr-2" />Input Harga Harian</button> */}
          <Link to={`/admin/kepokmas/input-harga/${marketId}`} className="btn-primary">
            <Plus size={16} className="mr-2" />Input Harga Harian
          </Link>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, harga, atau tanggal..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <tr><td colSpan={5} className="text-center py-4">Memuat data...</td></tr>}
            {!loading && paginatedData.length === 0 && <tr><td colSpan={5} className="text-center py-4 text-gray-500">Tidak ada data yang ditemukan.</td></tr>}
            {/* 4. Gunakan 'paginatedData' untuk me-render baris tabel */}
            {!loading && paginatedData.map(item => (
              <tr key={item.id_harga}>
                <td className="px-6 py-4 font-medium">{item.barangPasar?.barang?.namaBarang || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(item.tanggal_harga).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                <td className="px-6 py-4 text-gray-500">{item.keterangan || '-'}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                  <button onClick={() => setItemToDelete(item)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
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

      <BulkPriceInputModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        marketId={numericMarketId}
        marketName={marketName}
        onSuccess={fetchData}
        latestPrices={latestPriceMap}
      />

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Harga untuk ${editingItem?.barangPasar?.barang?.namaBarang}`}>
        <form onSubmit={handleUpdatePrice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input type="date" value={formData.tanggal_harga} onChange={(e) => setFormData({ ...formData, tanggal_harga: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
            <input type="number" value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={3}></textarea>
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message={`Anda yakin ingin menghapus data harga ini?`}
      />
    </>
  );
}
// src/components/admin/kepokmas/BulkPriceInputModal.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Definisikan tipe data yang lebih detail
interface GridItem { id_barang_pasar: number; barang: { namaBarang: string; satuan: { satuanBarang: string } } }
interface PriceInput { [key: number]: string }
interface PriceData { id_harga: number; harga: number; tanggal_harga: string; }

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketId: number;
  marketName: string;
  onSuccess: () => void;
  latestPrices: Map<number, PriceData>; 
}
    
export default function BulkPriceInputModal({ isOpen, onClose, marketId, marketName, onSuccess, latestPrices }: ModalProps) {
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [prices, setPrices] = useState<PriceInput>({});
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
    
  useEffect(() => {
    if (isOpen) {
      const fetchItems = async () => {
        const token = localStorage.getItem('accessToken');
        try {
          const res = await axios.post(`${API_BASE_URL}/barang-pasar-grid/filter`, { idPasar: marketId }, { headers: { Authorization: `Bearer ${token}` } });
          setGridItems(res.data);
          setPrices({});
        } catch (error) {
          console.error("Gagal mengambil daftar barang untuk form", error);
        }
      };
      fetchItems();
    }
  }, [isOpen, marketId]);

  const handlePriceChange = (id_barang_pasar: number, value: string) => {
    setPrices(prev => ({ ...prev, [id_barang_pasar]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('accessToken');

    const promises = Object.entries(prices)
      .filter(([, price]) => price.trim() !== '')
      .map(([id_barang_pasar, harga]) => {
        const payload = {
          id_barang_pasar: parseInt(id_barang_pasar),
          harga: parseInt(harga),
          tanggal_harga: tanggal,
        };
        return axios.post(`${API_BASE_URL}/harga-barang-pasar`, payload, { headers: { Authorization: `Bearer ${token}` } });
      });

    try {
      await Promise.all(promises);
      alert("Harga berhasil disimpan!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan harga.");
    } finally {
      setIsSaving(false);
    }
  };
    
  if (!isOpen) return null;
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Input Harga Barang - {marketName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal Input</label>
              <input type="date" id="tanggal" value={tanggal} onChange={e => setTanggal(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <hr />
            {gridItems.map(item => {
              // Cari harga terakhir untuk item ini dari prop
              const lastPrice = latestPrices.get(item.id_barang_pasar);

              return (
              <div key={item.id_barang_pasar} className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                <label htmlFor={`price-${item.id_barang_pasar}`} className="text-sm text-gray-600 md:col-span-2">
                  {item.barang.namaBarang} ({item.barang.satuan?.satuanBarang})
                </label>
                <input
                  type="number"
                  id={`price-${item.id_barang_pasar}`}
                  // Gunakan harga terakhir sebagai placeholder
                  placeholder={lastPrice ? `Rp ${lastPrice.harga.toLocaleString('id-ID')}` : 'Rp'}
                  value={prices[item.id_barang_pasar] || ''}
                  onChange={e => handlePriceChange(item.id_barang_pasar, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            )})}
          </div>
          <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-3 rounded-b-lg sticky bottom-0 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary" disabled={isSaving || gridItems.length === 0}>
              {isSaving ? 'Menyimpan...' : 'Simpan Semua Harga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
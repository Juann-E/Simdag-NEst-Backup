// src/components/admin/kepokmas/Report.tsx

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';

// Definisikan tipe data yang lebih detail
interface Market { id: number; nama_pasar: string; }
interface Item { id: number; namaBarang: string; }
interface GridItem { pasar: { id: number }; barang: { id: number }; }
interface SelectOption { value: number; label: string; }

export default function Report() {
  // State untuk menyimpan data mentah dari API
  const [allMarkets, setAllMarkets] = useState<SelectOption[]>([]);
  const [allItems, setAllItems] = useState<SelectOption[]>([]);
  const [gridData, setGridData] = useState<GridItem[]>([]);
  
  // State untuk form filter
  const [selectedMarket, setSelectedMarket] = useState<SelectOption | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectOption[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fileType, setFileType] = useState('excel');
  
  const [isLoading, setIsLoading] = useState(false);

  // Ambil semua data yang diperlukan saat komponen dimuat
  useEffect(() => {
    const fetchFilterOptions = async () => {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [marketsRes, itemsRes, gridRes] = await Promise.all([
          axios.get('http://localhost:3000/nama-pasar', { headers }),
          axios.get('http://localhost:3000/nama-barang', { headers }),
          axios.get('http://localhost:3000/barang-pasar-grid', { headers }),
        ]);
        setAllMarkets(marketsRes.data.map((m: Market) => ({ value: m.id, label: m.nama_pasar })));
        setAllItems(itemsRes.data.map((i: Item) => ({ value: i.id, label: i.namaBarang })));
        setGridData(gridRes.data);
      } catch (error) {
        console.error("Gagal mengambil pilihan filter", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Logika untuk dropdown dinamis
  const availableItems = useMemo(() => {
    if (!selectedMarket) {
      return allItems;
    }
    const selectedMarketId = selectedMarket.value;
    const itemIdsInSelectedMarket = new Set(
      gridData
        .filter(grid => grid.pasar.id === selectedMarketId)
        .map(grid => grid.barang.id)
    );
    return allItems.filter(item => itemIdsInSelectedMarket.has(item.value));
  }, [selectedMarket, allItems, gridData]);

  // Efek untuk membersihkan pilihan barang jika tidak lagi valid
  useEffect(() => {
    setSelectedItems(prevSelected =>
      prevSelected.filter(selected =>
        availableItems.some(available => available.value === selected.value)
      )
    );
  }, [selectedMarket, availableItems]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMarket || selectedItems.length === 0 || !startDate || !endDate) {
      alert('Mohon lengkapi semua field yang wajib diisi (Pasar, Barang, Tanggal Mulai, dan Tanggal Selesai).');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('accessToken');

    // --- PERUBAHAN 1: Tambahkan namaPasar dan namaBarang ke payload ---
    // Pastikan backend Anda diupdate untuk menerima properti 'namaPasar' dan 'namaBarang'
    const payload = {
      pasarId: [selectedMarket.value],
      namaPasar: selectedMarket.label, // Kirim nama pasar
      barangId: selectedItems.map(i => i.value),
      namaBarang: selectedItems.map(i => i.label), // Kirim nama barang
      start: startDate,
      end: endDate,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/report/${fileType}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: fileType === 'excel' ? 'blob' : 'json',
        }
      );

      if (fileType === 'excel') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // --- PERUBAHAN 2: Buat nama file lebih deskriptif ---
        const marketNameForFile = selectedMarket.label.replace(/ /g, '_'); // Ganti spasi dengan underscore
        const today = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `Laporan_${marketNameForFile}_${today}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.log("Data Laporan JSON:", response.data);
        alert("Laporan JSON sudah di-generate, lihat di console browser (F12).");
      }

    } catch (error) {
      alert("Gagal membuat laporan. Pastikan ada data pada rentang tanggal yang dipilih.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectAllItemsOption = { value: 0, label: '[ Pilih Semua Barang Tersedia ]' };

  const handleItemChange = (selectedOptions: readonly SelectOption[]) => {
    if (selectedOptions && selectedOptions.some(option => option.value === 0)) {
        setSelectedItems(selectedItems.length === availableItems.length ? [] : availableItems);
    } else {
      setSelectedItems(selectedOptions as SelectOption[]);
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold text-gray-800">Generate Laporan</h2>
      <p className="text-sm text-gray-500 mb-6">Pilih kriteria untuk membuat laporan harga komoditas.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasar/Toko</label>
          <Select
            options={allMarkets}
            value={selectedMarket}
            onChange={(option) => setSelectedMarket(option as SelectOption)}
            placeholder="Pilih satu pasar"
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
          <Select
            isMulti
            options={[selectAllItemsOption, ...availableItems]}
            value={selectedItems}
            onChange={handleItemChange}
            placeholder="Pilih pasar dulu"
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isDisabled={!selectedMarket}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        <div>
            <label htmlFor="file-type" className="block text-sm font-medium text-gray-700">Tipe File</label>
            <select id="file-type" value={fileType} onChange={e => setFileType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="excel">Excel</option>
              {/* <option value="json">JSON</option> */}
            </select>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Membuat Laporan...' : 'Submit'}
          </button>
          <button 
            type="reset" 
            className="btn-secondary" 
            onClick={() => {
              setSelectedMarket(null);
              setSelectedItems([]);
              setStartDate('');
              setEndDate('');
            }}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
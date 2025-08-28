import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ChevronLeft, ChevronRight, Save, Copy } from 'lucide-react';

// Tipe data
interface PriceHistoryItem {
  harga: number;
  tanggal_harga: string;
  barangPasar: {
    id_barang_pasar: number;
    pasar: { id: number; };
  };
}
interface PriceData { harga: number; tanggal_harga: string; }
interface GridItem { id_barang_pasar: number; barang: { namaBarang: string; satuan: { satuanBarang: string } } }
interface PriceInput { [key: number]: string }
interface Market { id: number; nama_pasar: string }

export default function InputHargaPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const numericMarketId = parseInt(marketId || '0', 10);

  // State
  const [marketInfo, setMarketInfo] = useState<Market | null>(null);
  const [allItems, setAllItems] = useState<GridItem[]>([]);
  const [prices, setPrices] = useState<PriceInput>({});
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [latestPriceMap, setLatestPriceMap] = useState<Map<number, PriceData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const storageKey = `priceInput_market_${marketId}`;

  // const allFilled = allItems.every(item => {
  //   const val = prices[item.id_barang_pasar];
  //   return val && val.trim() !== "";
  // });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const { savedPrices, savedTanggal } = JSON.parse(savedData);
          setPrices(savedPrices || {});
          setTanggal(savedTanggal || new Date().toISOString().split('T')[0]);
        }

        const [marketListRes, itemsRes, priceHistoryRes] = await Promise.all([
          axios.get('http://localhost:3000/nama-pasar', { headers: { Authorization: `Bearer ${token}` } }),
          axios.post('http://localhost:3000/barang-pasar-grid/filter', { idPasar: numericMarketId }, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/harga-barang-pasar', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const currentMarket = marketListRes.data.find((m: Market) => m.id === numericMarketId);
        if (currentMarket) setMarketInfo(currentMarket);
        setAllItems(itemsRes.data);

        const allPricesForMarket = priceHistoryRes.data.filter((p: PriceHistoryItem) => p.barangPasar?.pasar?.id === numericMarketId);

        const newLatestPriceMap = new Map<number, PriceData>();
        const pricesByGridItem: { [key: number]: PriceHistoryItem[] } = {};
        allPricesForMarket.forEach((p: PriceHistoryItem) => {
          const gridId = p.barangPasar.id_barang_pasar;
          if (!pricesByGridItem[gridId]) pricesByGridItem[gridId] = [];
          pricesByGridItem[gridId].push(p);
        });
        for (const gridId in pricesByGridItem) {
          const latestPrice = pricesByGridItem[gridId].sort((a, b) => new Date(b.tanggal_harga).getTime() - new Date(a.tanggal_harga).getTime())[0];
          if (latestPrice) {
            newLatestPriceMap.set(parseInt(gridId), latestPrice);
          }
        }
        setLatestPriceMap(newLatestPriceMap);

      } catch (error) { console.error("Gagal memuat data:", error); }
      finally { setLoading(false); }
    };
    if (numericMarketId) fetchData();
  }, [numericMarketId]);

  useEffect(() => {
    if (!loading) {
      const dataToSave = JSON.stringify({ savedPrices: prices, savedTanggal: tanggal });
      localStorage.setItem(storageKey, dataToSave);
    }
  }, [prices, tanggal, storageKey, loading]);

  const handlePriceChange = (id_barang_pasar: number, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setPrices(prev => ({ ...prev, [id_barang_pasar]: '' }));
      return;
    }
    const formattedValue = parseInt(numericValue, 10).toLocaleString('id-ID');
    setPrices(prev => ({ ...prev, [id_barang_pasar]: formattedValue }));
  };

  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allItems.slice(startIndex, startIndex + itemsPerPage);
  }, [allItems, currentPage, itemsPerPage]);

  // cek apakah semua field terisi``
  const isPageValid = useMemo(() => {
    if (paginatedItems.length === 0) return false;
    return paginatedItems.every(item => prices[item.id_barang_pasar] && prices[item.id_barang_pasar].trim() !== '');
  }, [prices, paginatedItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPageValid) return; // Tambahan keamanan

    setIsSaving(true);
    const token = localStorage.getItem('accessToken');

    const promises = Object.entries(prices)
      .filter(([, price]) => price && price.trim() !== '')
      .map(([id_barang_pasar, harga]) => {
        const numericHarga = parseInt(harga.replace(/\./g, ''), 10);
        const payload = {
          id_barang_pasar: parseInt(id_barang_pasar),
          harga: numericHarga,
          tanggal_harga: tanggal,
        };
        return axios.post('http://localhost:3000/harga-barang-pasar', payload, { headers: { Authorization: `Bearer ${token}` } });
      });

    try {
      await Promise.all(promises);
      alert("Semua harga berhasil disimpan!");
      localStorage.removeItem(storageKey);
      navigate(`/admin/kepokmas/harga-barang-grid/${marketId}`);
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan harga.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  if (loading) return <div className="text-center p-10">Memuat data input...</div>;

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      <Link to={`/admin/kepokmas/harga-barang-grid/${marketId}`} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft size={16} /> Kembali ke Detail Pasar
      </Link>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Input Harga Harian: {marketInfo?.nama_pasar}</h2>
        <p className="text-sm text-gray-500">Isi harga untuk barang-barang di bawah ini. Data Anda akan tersimpan otomatis di browser.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700">Tanggal Input Harga</label>
            <input type="date" id="tanggal" value={tanggal} onChange={e => setTanggal(e.target.value)}
              className="mt-1 input-field w-full md:w-auto" required />
          </div>
          <div>
            <label htmlFor="items-per-page" className="block text-sm font-medium text-gray-700">Barang per Halaman</label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={e => setItemsPerPage(Number(e.target.value))}
              className="mt-1 input-field"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-x-4 items-center border-b pb-2 font-semibold text-sm text-gray-600">
            <div className="col-span-3">Nama Barang</div>
            <div className="text-left col-span-1">Harga Kemarin</div>
            <div className="text-left col-span-2">Harga Baru</div>
          </div>

          {paginatedItems.map(item => {
            const lastPrice = latestPriceMap.get(item.id_barang_pasar);
            return (
              <div key={item.id_barang_pasar} className="grid grid-cols-6 gap-x-4 items-center border-b pb-3">
                <div className="text-sm text-gray-800 col-span-3">
                  {item.barang.namaBarang} ({item.barang.satuan?.satuanBarang})
                </div>
                <div className="text-sm text-gray-500 text-left col-span-1">
                  {lastPrice ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(lastPrice.harga) : '-'}
                </div>
                <div className="flex items-center gap-x-2 col-span-2">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={lastPrice ? parseFloat(String(lastPrice.harga)).toLocaleString('id-ID') : '0'}
                      value={prices[item.id_barang_pasar] || ''}
                      onChange={e => handlePriceChange(item.id_barang_pasar, e.target.value)}
                      className="input-field text-left w-full pl-10"
                    />
                  </div>
                  {lastPrice && (!prices[item.id_barang_pasar] || prices[item.id_barang_pasar] === Number(lastPrice.harga).toLocaleString("id-ID")) && (

                    <button
                      type="button"
                      onClick={() =>
                        setPrices(prev => ({
                          ...prev,
                          [item.id_barang_pasar]: Number(lastPrice.harga).toLocaleString("id-ID")
                        }))
                      }
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200"
                      title="Salin harga kemarin"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
            </span>
            <div className="inline-flex items-center -space-x-px">
              <button type="button" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button type="button" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={isSaving || !isPageValid}
            className={`btn-primary transition-colors duration-200 ${!isPageValid ? 'bg-blue-300 cursor-not-allowed hover:bg-blue-300' : 'hover:bg-blue-700'}`}
          >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Menyimpan...' : 'Simpan Semua Harga'}
          </button>
        </div>
      </form>
    </div>
  );
}
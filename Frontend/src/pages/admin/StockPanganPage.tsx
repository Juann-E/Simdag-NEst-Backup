// src/pages/admin/StockPanganPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StockPanganTabs from '../../components/admin/StockPanganTabs';
import Distributor from '../../components/admin/stock-pangan/distributor/Distributor';
import SatuanBarang from '../../components/admin/stock-pangan/satuan-barang/SatuanBarang';
import Komoditas from '../../components/admin/stock-pangan/komoditas/Komoditas';
import TransaksiStockPangan from './stock-pangan/TransaksiStockPangan';
import ReportStockPangan from './stock-pangan/ReportStockPangan';


// Daftar tab yang valid untuk dicocokkan dengan URL
const validTabs = {
  'distributor': 'Toko Besar',
  'satuan-barang': 'Satuan Komoditas',
  'komoditas': 'Komoditas',
  'transaksi-stock': 'Transaksi Stock Pangan',
  'report': 'Report Stock Pangan',
};

// type guard
const isValidTab = (key: string | undefined): key is keyof typeof validTabs => {
  if (!key) return false;
  return key in validTabs;
};

export default function StockPanganPage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const currentTab = isValidTab(tab) ? validTabs[tab] : 'Toko Besar';
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    const urlKey = (Object.keys(validTabs) as Array<keyof typeof validTabs>).find(key => validTabs[key] === tabName);
    if (urlKey) {
      navigate(`/admin/stock-pangan/${urlKey}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Toko Besar':
        return <Distributor />;
      case 'Satuan Komoditas':
        return <SatuanBarang />;
      case 'Komoditas':
        return <Komoditas />;
      case 'Transaksi Stock Pangan':
        return <TransaksiStockPangan />;
      case 'Report Stock Pangan':
        return <ReportStockPangan />;
      default:
        return <Distributor />;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Stock Pangan</h1>
      <p className="text-gray-500 mt-1">Sistem manajemen stock pangan - Kelola toko besar, komoditas, dan transaksi</p>

      <StockPanganTabs activeTab={activeTab} setActiveTab={handleTabClick} />

      <div>
        {renderContent()}
      </div>
    </div>
  );
}
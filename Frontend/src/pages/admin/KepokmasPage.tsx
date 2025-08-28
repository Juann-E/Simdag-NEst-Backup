// src/pages/admin/KepokmasPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import KepokmasTabs from '../../components/admin/KepokmasTabs';
import NamaPasar from '../../components/admin/kepokmas/nama_pasar/NamaPasar';
import SatuanBarang from '../../components/admin/kepokmas/satuan_Barang/SatuanBarang';
import NamaBarang from '../../components/admin/kepokmas/nama_barang/NamaBarang';
import BarangPasarGrid from '../../components/admin/kepokmas/barang_pasar_grid/BarangPasarGrid';
import HargaBarangGrid from '../../components/admin/kepokmas/harga_barang_grid/HargaBarangGrid';
import Report from '../../components/admin/kepokmas/report/Report';


// Daftar tab yang valid untuk dicocokkan dengan URL
const validTabs = {
  'nama-pasar': 'Nama Pasar',
  'satuan-barang': 'Satuan Barang',
  'nama-barang': 'Nama Barang',
  'barang-pasar-grid': 'Barang Pasar Grid',
  'harga-barang-grid': 'Harga Barang Grid',
  'report': 'Report',
};

// type guard
const isValidTab = (key: string | undefined): key is keyof typeof validTabs => {
  if (!key) return false;
  return key in validTabs;
};

export default function KepokmasPage() {
  const { tab } = useParams();
  const navigate = useNavigate();

  // const currentTab = tab && validTabs[tab] ? validTabs[tab] : 'Nama Pasar';
  const currentTab = isValidTab(tab) ? validTabs[tab] : 'Nama Pasar';
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    // const urlKey = Object.keys(validTabs).find(key => validTabs[key] === tabName);
    const urlKey = (Object.keys(validTabs) as Array<keyof typeof validTabs>).find(key => validTabs[key] === tabName);
    if (urlKey) {
      navigate(`/admin/kepokmas/${urlKey}`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Nama Pasar':
        return <NamaPasar />;
      case 'Satuan Barang':
        return <SatuanBarang />;
      case 'Nama Barang':
        return <NamaBarang />;
      case 'Barang Pasar Grid':
        return <BarangPasarGrid />;
      case 'Harga Barang Grid':
        return <HargaBarangGrid />;
      case 'Report':
        return <Report />;
      default:
        return <NamaPasar />;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Kepokmas</h1>
      <p className="text-gray-500 mt-1">Kebutuhan Pokok Masyarakat - Sistem manajemen harga komoditas esensial</p>

      <KepokmasTabs activeTab={activeTab} setActiveTab={handleTabClick} />

      <div>
        {renderContent()}
      </div>
    </div>
  );
}
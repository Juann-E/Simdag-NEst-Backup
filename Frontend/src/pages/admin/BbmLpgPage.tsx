// src/pages/admin/BbmLpgPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BbmLpgTabs from '../../components/admin/BbmLpgTabs';
import JenisBbm from '../../components/admin/bbm-lpg/JenisBbm';
import RealisasiBulananLpg from '../../components/admin/bbm-lpg/RealisasiBulananLpg';
import RealisasiBulananBbm from '../../components/admin/bbm-lpg/RealisasiBulananBbm';
import ReportAgenLpg from '../../components/admin/bbm-lpg/ReportAgenLpg';
import ReportBbm from '../../components/admin/bbm-lpg/ReportBbm';

// Daftar tab yang valid untuk dicocokkan dengan URL
const validTabs = {
  'jenis-bbm': 'Jenis BBM',
  'realisasi-bulanan-lpg': 'Realisasi Bulanan LPG',
  'realisasi-bulanan-bbm': 'Realisasi Bulanan BBM',
  'report-agen-lpg': 'Report Agen LPG',
  'report-bbm': 'Report BBM',
};

export default function BbmLpgPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  
  // Tentukan tab aktif berdasarkan URL atau default ke 'Jenis BBM'
  const getActiveTabFromUrl = (urlTab: string | undefined): string => {
    if (urlTab && validTabs[urlTab as keyof typeof validTabs]) {
      return validTabs[urlTab as keyof typeof validTabs];
    }
    return 'Jenis BBM'; // Default tab
  };
  
  const [activeTab, setActiveTab] = useState<string>(getActiveTabFromUrl(tab));
  
  // Update activeTab ketika URL berubah
  useEffect(() => {
    setActiveTab(getActiveTabFromUrl(tab));
  }, [tab]);
  
  // Fungsi untuk mengubah tab dan URL
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    
    // Konversi nama tab ke URL slug
    const urlSlug = Object.keys(validTabs).find(
      key => validTabs[key as keyof typeof validTabs] === tabName
    );
    
    if (urlSlug) {
      navigate(`/admin/bbm-lpg/${urlSlug}`);
    }
  };
  
  // Render komponen berdasarkan tab aktif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Jenis BBM':
        return <JenisBbm />;
      case 'Realisasi Bulanan LPG':
        return <RealisasiBulananLpg />;
      case 'Realisasi Bulanan BBM':
        return <RealisasiBulananBbm />;
      case 'Report Agen LPG':
        return <ReportAgenLpg />;
      case 'Report BBM':
        return <ReportBbm />;
      default:
        return <JenisBbm />;
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">BBM LPG</h1>
        <p className="text-gray-600 mt-1">Kelola data BBM dan LPG</p>
      </div>
      
      <BbmLpgTabs activeTab={activeTab} setActiveTab={handleTabClick} />
      
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
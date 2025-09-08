// src/pages/admin/SpbuLpgPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpbuLpgTabs from '../../components/admin/SpbuLpgTabs';
import Spbu from '../../components/admin/spbu-lpg/Spbu';
import Agen from '../../components/admin/spbu-lpg/Agen';
import PangkalanLpg from '../../components/admin/spbu-lpg/PangkalanLpg';
import Spbe from '../../components/admin/spbu-lpg/Spbe';

// Daftar tab yang valid untuk dicocokkan dengan URL
const validTabs = {
  'spbu': 'SPBU',
  'agen': 'Agen',
  'pangkalan-lpg': 'Pangkalan LPG',
  'spbe': 'SPBE',
};

export default function SpbuLpgPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  
  // Tentukan tab aktif berdasarkan URL atau default ke 'SPBU'
  const getActiveTabFromUrl = (urlTab: string | undefined): string => {
    if (urlTab && validTabs[urlTab as keyof typeof validTabs]) {
      return validTabs[urlTab as keyof typeof validTabs];
    }
    return 'SPBU'; // Default tab
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
      navigate(`/admin/spbu-lpg/${urlSlug}`);
    }
  };
  
  // Render konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'SPBU':
        return <Spbu />;
      case 'Agen':
        return <Agen />;
      case 'Pangkalan LPG':
        return <PangkalanLpg />;
      case 'SPBE':
        return <Spbe />;
      default:
        return <Spbu />;
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">SPBU LPG</h1>
      <p className="text-gray-500 mt-1">Sistem manajemen data SPBU, Agen, Pangkalan LPG, dan SPBE</p>

      <SpbuLpgTabs activeTab={activeTab} setActiveTab={handleTabClick} />

      <div>
        {renderContent()}
      </div>
    </div>
  );
}
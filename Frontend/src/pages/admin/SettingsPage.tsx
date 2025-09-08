// src/pages/admin/SettingsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SettingsTabs from '../../components/admin/SettingsTabs';
import KecamatanSettings from '../../components/admin/settings/KecamatanSettings';
import KelurahanSettings from '../../components/admin/settings/KelurahanSettings';

// Daftar tab yang valid untuk dicocokkan dengan URL
const validTabs = {
  'kecamatan': 'Kecamatan',
  'kelurahan': 'Kelurahan',
};

export default function SettingsPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  
  // Tentukan tab aktif berdasarkan URL atau default ke 'Kecamatan'
  const getActiveTabFromUrl = (urlTab: string | undefined): string => {
    if (urlTab && validTabs[urlTab as keyof typeof validTabs]) {
      return validTabs[urlTab as keyof typeof validTabs];
    }
    return 'Kecamatan'; // Default tab
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
      navigate(`/admin/settings/${urlSlug}`);
    }
  };
  
  // Render komponen berdasarkan tab aktif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Kecamatan':
        return <KecamatanSettings />;
      case 'Kelurahan':
        return <KelurahanSettings />;
      default:
        return <KecamatanSettings />;
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-600">Kelola data kecamatan dan kelurahan</p>
      </div>
      
      <SettingsTabs 
        activeTab={activeTab} 
        onTabClick={handleTabClick} 
      />
      
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
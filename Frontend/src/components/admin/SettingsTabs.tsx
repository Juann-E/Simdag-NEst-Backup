// src/components/admin/SettingsTabs.tsx
import React from 'react';

interface SettingsTabsProps {
  activeTab: string;
  onTabClick: (tabName: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabClick }) => {
  const tabs = ['Kecamatan', 'Kelurahan'];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsTabs;
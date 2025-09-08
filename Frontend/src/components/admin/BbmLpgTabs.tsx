// src/components/admin/BbmLpgTabs.tsx
import { Fuel, BarChart3, FileText, TrendingUp, ClipboardList } from 'lucide-react';

// Definisikan tipe untuk props agar lebih aman
interface BbmLpgTabsProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

export default function BbmLpgTabs({ activeTab, setActiveTab }: BbmLpgTabsProps) {
  const tabs = [
    { name: 'Jenis BBM', icon: <Fuel size={16} /> },
    { name: 'Realisasi Bulanan LPG', icon: <BarChart3 size={16} /> },
    { name: 'Realisasi Bulanan BBM', icon: <TrendingUp size={16} /> },
    { name: 'Report Agen LPG', icon: <FileText size={16} /> },
    { name: 'Report BBM', icon: <ClipboardList size={16} /> },
  ];

  const baseClasses = "py-4 px-3 inline-flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors duration-200";
  const activeClasses = "border-blue-600 text-blue-600 font-semibold";
  const inactiveClasses = "border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-t-lg";

  return (
    <div className="mt-8 border-b">
      <nav className="-mb-px flex space-x-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`${baseClasses} ${activeTab === tab.name ? activeClasses : inactiveClasses}`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
// src/components/admin/KepokmasTabs.tsx
import { Building, Weight, Package, LayoutGrid, Table, Printer } from 'lucide-react';

// Definisikan tipe untuk props agar lebih aman
interface KepokmasTabsProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

export default function KepokmasTabs({ activeTab, setActiveTab }: KepokmasTabsProps) {
  const tabs = [
    { name: 'Nama Pasar', icon: <Building size={16} /> },
    { name: 'Satuan Barang', icon: <Weight size={16} /> },
    { name: 'Nama Barang', icon: <Package size={16} /> },
    { name: 'Barang Pasar Grid', icon: <LayoutGrid size={16} /> },
    { name: 'Harga Barang Grid', icon: <Table size={16} /> },
    { name: 'Report', icon: <Printer size={16} /> },
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
// src/components/admin/StockPanganTabs.tsx
import { Truck, Package, ArrowRightLeft, FileText, Weight } from 'lucide-react';

// Definisikan tipe untuk props agar lebih aman
interface StockPanganTabsProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
}

export default function StockPanganTabs({ activeTab, setActiveTab }: StockPanganTabsProps) {
  const tabs = [
    { name: 'Toko Besar', icon: <Truck size={16} /> },
    { name: 'Satuan Komoditas', icon: <Weight size={16} /> },
    { name: 'Komoditas', icon: <Package size={16} /> },
    { name: 'Transaksi Stock Pangan', icon: <ArrowRightLeft size={16} /> },
    { name: 'Report Stock Pangan', icon: <FileText size={16} /> },
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
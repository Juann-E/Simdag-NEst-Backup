// src/components/Header.tsx

import { Link, useLocation } from 'react-router-dom';
import { ChartColumn, TriangleAlert, Eye, MapPin, TrendingUp, Store, Package } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Fungsi untuk scroll ke section tertentu
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    // --- PERBAIKAN DI SINI: Ubah z-50 menjadi z-[1001] ---
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-[1001]">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ChartColumn className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                <h1 className="text-lg sm:text-xl font-bold text-blue-600">SIMDAG</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                    Sistem Informasi Perdagangan
                </p>
                </div>
            </Link>
          </div>

          {/* Navigation Buttons - Only show on homepage */}
          {isHomePage && (
            <div className="hidden lg:flex items-center gap-1 mr-4">
              <button
                onClick={() => scrollToSection('peta-lokasi')}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Peta Lokasi
              </button>
              <button
                onClick={() => scrollToSection('grafik-statistik')}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Grafik Statistik
              </button>
              <button
                onClick={() => scrollToSection('daftar-pasar')}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Store className="w-4 h-4" />
                Daftar Pasar
              </button>
              <button
                onClick={() => scrollToSection('monitoring-stock-pangan')}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Package className="w-4 h-4" />
                Monitoring Stock
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <Link
              to="/login" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 h-9 rounded-md px-3 text-xs sm:text-sm bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 shadow-lg hover:shadow-xl"
            >
              <TriangleAlert className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Login Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
            <Link
              to="/tentang"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 h-9 rounded-md px-3 text-xs sm:text-sm border border-gray-200 bg-white hover:bg-gray-100"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Tentang</span>
              <span className="sm:hidden">Info</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
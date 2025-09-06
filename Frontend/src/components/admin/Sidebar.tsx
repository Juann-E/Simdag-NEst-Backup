// src/components/admin/Sidebar.tsx
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Boxes, LogOut, ChevronDown, Fuel, Settings, Package2 } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cek apakah rute saat ini ada di dalam section Kepokmas
  const isKepokmasActive = location.pathname.startsWith('/admin/kepokmas');
  
  // Cek apakah rute saat ini ada di dalam section SPBU LPG
  const isSpbuLpgActive = location.pathname.startsWith('/admin/spbu-lpg');
  
  // Cek apakah rute saat ini ada di dalam section BBM LPG
  const isBbmLpgActive = location.pathname.startsWith('/admin/bbm-lpg');
  
  // Cek apakah rute saat ini ada di dalam section Settings
  const isSettingsActive = location.pathname.startsWith('/admin/settings');
  
  // Cek apakah rute saat ini ada di dalam section Stock Pangan
  const isStockPanganActive = location.pathname.startsWith('/admin/stock-pangan');

  // 1. Ubah state awal 'isKepokmasOpen' berdasarkan rute aktif
  const [isKepokmasOpen, setIsKepokmasOpen] = useState(isKepokmasActive);
  
  // State untuk menu SPBU LPG
  const [isSpbuLpgOpen, setIsSpbuLpgOpen] = useState(isSpbuLpgActive);
  
  // State untuk menu BBM LPG
  const [isBbmLpgOpen, setIsBbmLpgOpen] = useState(isBbmLpgActive);
  
  // State untuk menu Stock Pangan
  const [isStockPanganOpen, setIsStockPanganOpen] = useState(isStockPanganActive);
  
  // State untuk menu Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);
  
  // 2. Tambahkan state baru untuk menu akun
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Efek untuk membuka menu Kepokmas secara otomatis jika pengguna menavigasi ke halamannya
  useEffect(() => {
    if (isKepokmasActive) {
      setIsKepokmasOpen(true);
    }
  }, [isKepokmasActive]);
  
  // Efek untuk membuka menu SPBU LPG secara otomatis jika pengguna menavigasi ke halamannya
  useEffect(() => {
    if (isSpbuLpgActive) {
      setIsSpbuLpgOpen(true);
    }
  }, [isSpbuLpgActive]);
  
  // Efek untuk membuka menu BBM LPG secara otomatis jika pengguna menavigasi ke halamannya
  useEffect(() => {
    if (isBbmLpgActive) {
      setIsBbmLpgOpen(true);
    }
  }, [isBbmLpgActive]);
  
  // Efek untuk membuka menu Stock Pangan secara otomatis jika pengguna menavigasi ke halamannya
  useEffect(() => {
    if (isStockPanganActive) {
      setIsStockPanganOpen(true);
    }
  }, [isStockPanganActive]);
  
  // Efek untuk membuka menu Settings secara otomatis jika pengguna menavigasi ke halamannya
  useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsActive]);

  const handleLogout = () => {
    // Hapus token otentikasi
    localStorage.removeItem('accessToken');
    
    // Hapus semua data input harga yang tersimpan sementara di browser
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('priceInput_market_')) {
        localStorage.removeItem(key);
      }
    });

    // Arahkan kembali ke halaman login
    navigate('/login');
  };

  const linkClass = "flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-200";
  const activeLinkClass = "flex items-center p-2 text-blue-600 rounded-lg bg-blue-50 font-semibold";
  
  const subLinkClass = "flex items-center p-2 pl-11 text-sm text-gray-700 rounded-lg hover:bg-gray-200";
  const activeSubLinkClass = "flex items-center p-2 pl-11 text-sm text-blue-600 rounded-lg bg-blue-50 font-semibold";

  return (
    <aside className="w-64 h-screen bg-white border-r fixed top-0 left-0 flex flex-col">
      <div className="p-4 border-b flex-shrink-0">
        <h1 className="text-xl font-bold text-blue-600">SIMDAG Admin</h1>
        <p className="text-sm text-gray-500">Dashboard Administrasi</p>
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Menu Utama</p>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="ml-3">Dashboard</span>
        </NavLink>

        <button 
          onClick={() => setIsKepokmasOpen(!isKepokmasOpen)} 
          className={`w-full flex items-center justify-between p-2 text-gray-700 rounded-lg hover:bg-gray-200 ${isKepokmasActive ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center">
            <Boxes className="w-5 h-5" />
            <span className="ml-3">Kepokmas</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isKepokmasOpen ? 'rotate-180' : ''}`} />
        </button>

        {isKepokmasOpen && (
          <div className="space-y-1 mt-1">
            <NavLink to="/admin/kepokmas/nama-pasar" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Nama Pasar
            </NavLink>
            <NavLink to="/admin/kepokmas/satuan-barang" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Satuan Barang
            </NavLink>
            <NavLink to="/admin/kepokmas/nama-barang" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Nama Barang
            </NavLink>
             <NavLink to="/admin/kepokmas/barang-pasar-grid" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Barang Pasar Grid
            </NavLink>
             <NavLink to="/admin/kepokmas/harga-barang-grid" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Harga Barang Grid
            </NavLink>
            <NavLink to="/admin/kepokmas/report" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Report
            </NavLink>
          </div>
        )}

        <button 
          onClick={() => setIsSpbuLpgOpen(!isSpbuLpgOpen)} 
          className={`w-full flex items-center justify-between p-2 text-gray-700 rounded-lg hover:bg-gray-200 ${isSpbuLpgActive ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center">
            <Fuel className="w-5 h-5" />
            <span className="ml-3">SPBU LPG</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isSpbuLpgOpen ? 'rotate-180' : ''}`} />
        </button>

        {isSpbuLpgOpen && (
          <div className="space-y-1 mt-1">
            <NavLink to="/admin/spbu-lpg/spbu" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              SPBU
            </NavLink>
            <NavLink to="/admin/spbu-lpg/agen" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Agen
            </NavLink>
            <NavLink to="/admin/spbu-lpg/pangkalan-lpg" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Pangkalan LPG
            </NavLink>
            <NavLink to="/admin/spbu-lpg/spbe" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              SPBE
            </NavLink>
          </div>
        )}

        <button 
          onClick={() => setIsBbmLpgOpen(!isBbmLpgOpen)} 
          className={`w-full flex items-center justify-between p-2 text-gray-700 rounded-lg hover:bg-gray-200 ${isBbmLpgActive ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center">
            <Fuel className="w-5 h-5" />
            <span className="ml-3">BBM LPG</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isBbmLpgOpen ? 'rotate-180' : ''}`} />
        </button>

        {isBbmLpgOpen && (
          <div className="space-y-1 mt-1">
            <NavLink to="/admin/bbm-lpg/jenis-bbm" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Jenis BBM
            </NavLink>
            <NavLink to="/admin/bbm-lpg/realisasi-bulanan-lpg" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Realisasi Bulanan LPG
            </NavLink>
            <NavLink to="/admin/bbm-lpg/realisasi-bulanan-bbm" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Realisasi Bulanan BBM
            </NavLink>
            <NavLink to="/admin/report-agen-lpg" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Report Agen LPG
            </NavLink>
            <NavLink to="/admin/bbm-lpg/report-bbm" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Report BBM
            </NavLink>
          </div>
        )}

        <button 
          onClick={() => setIsStockPanganOpen(!isStockPanganOpen)} 
          className={`w-full flex items-center justify-between p-2 text-gray-700 rounded-lg hover:bg-gray-200 ${isStockPanganActive ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center">
            <Package2 className="w-5 h-5" />
            <span className="ml-3">Stock Pangan</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isStockPanganOpen ? 'rotate-180' : ''}`} />
        </button>

        {isStockPanganOpen && (
          <div className="space-y-1 mt-1">
            <NavLink to="/admin/stock-pangan/distributor" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
                  Toko Besar
            </NavLink>
            <NavLink to="/admin/stock-pangan/satuan-barang" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Satuan Komoditas
            </NavLink>
            <NavLink to="/admin/stock-pangan/komoditas" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Komoditas
            </NavLink>
            <NavLink to="/admin/stock-pangan/transaksi-stock" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Transaksi Stock Pangan
            </NavLink>
            <NavLink to="/admin/stock-pangan/report" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Report Stock Pangan
            </NavLink>

          </div>
        )}

        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
          className={`w-full flex items-center justify-between p-2 text-gray-700 rounded-lg hover:bg-gray-200 ${isSettingsActive ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center">
            <Settings className="w-5 h-5" />
            <span className="ml-3">Settings</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
        </button>

        {isSettingsOpen && (
          <div className="space-y-1 mt-1">
            <NavLink to="/admin/settings/kecamatan" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Kecamatan
            </NavLink>
            <NavLink to="/admin/settings/kelurahan" className={({ isActive }) => isActive ? activeSubLinkClass : subLinkClass}>
              Kelurahan
            </NavLink>
          </div>
        )}
      </nav>
      
      {/* --- 3. Bagian Akun & Logout yang Diperbarui --- */}
      <div className="p-4 border-t flex-shrink-0 relative">
        {/* Menu pop-up untuk logout */}
        {isAccountMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border rounded-lg shadow-lg p-1 transition-all">
            <button onClick={handleLogout} className="w-full flex items-center p-2 text-sm text-red-600 rounded-md hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </button>
          </div>
        )}

        {/* Tombol Profil Admin */}
        <button 
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          className="w-full flex items-center p-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-yellow-900">A</div>
          <div className="ml-3 text-left">
            <p className="font-semibold text-gray-800">Administrator</p>
            <p className="text-xs text-gray-500">admin@salatiga.go.id</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
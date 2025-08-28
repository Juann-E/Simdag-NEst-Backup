// src/App.tsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Impor semua halaman dan komponen
import MarketListPage from './pages/MarketListPage';
import MarketDetailPage from './pages/MarketDetailPage';
import StockPanganDetailPage from './pages/StockPanganDetailPage';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/admin/Sidebar';
import DashboardPage from './pages/admin/DashboardPage';
import Header from './components/Header';
import KepokmasPage from './pages/admin/KepokmasPage';
import SpbuLpgPage from './pages/admin/SpbuLpgPage';
import StockPanganPage from './pages/admin/StockPanganPage';
import SettingsPage from './pages/admin/SettingsPage';
import GridDetailPage from './components/admin/kepokmas/GridDetailPage';
import HargaGridDetailPage from './components/admin/kepokmas/harga_barang_grid/HargaGridDetailPage';
import TentangPage from './pages/TentangPage';

// ## PATH IMPOR YANG SUDAH DIPERBAIKI ##
import InputHargaPage from './components/admin/kepokmas/harga_barang_grid/InputHargaPage';

// ==========================================================
// ## KOMPONEN BARU UNTUK LAYOUT PUBLIK ##
function PublicLayout() {
  return (
    <div>
      <Header />
      {/* Outlet akan merender halaman publik (MarketListPage, dll) */}
      <Outlet />
    </div>
  );
}
// ==========================================================

// Komponen untuk Layout Admin
function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow ml-64 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

// Komponen untuk Rute Terproteksi
function ProtectedRoute() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout />;
}

function App() {
  return (
    <Routes>
      {/* Rute Login (tanpa Header) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Publik (dibungkus dengan PublicLayout agar punya Header) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<MarketListPage />} />
        <Route path="/market/:marketId" element={<MarketDetailPage />} />
        <Route path="/distributor/:distributorId" element={<StockPanganDetailPage />} />
        <Route path="/tentang" element={<TentangPage />} />
      </Route>

      {/* Rute Admin yang Terproteksi */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Rute baru yang lebih fleksibel untuk Kepokmas */}
        <Route path="kepokmas/:tab" element={<KepokmasPage />} />

        {/* Rute untuk SPBU LPG */}
        <Route path="spbu-lpg/:tab" element={<SpbuLpgPage />} />

        {/* Rute untuk Stock Pangan */}
        <Route path="stock-pangan/:tab" element={<StockPanganPage />} />

        {/* Rute untuk Settings */}
        <Route path="settings/:tab" element={<SettingsPage />} />

        {/* Rute untuk halaman detail dan input */}
        <Route path="kepokmas/barang-pasar-grid/:marketId" element={<GridDetailPage />} />
        <Route path="kepokmas/harga-barang-grid/:marketId" element={<HargaGridDetailPage />} />

        {/* Rute baru untuk halaman input */}
        <Route path="/admin/kepokmas/input-harga/:marketId" element={<InputHargaPage />} />

        {/* Tambahkan redirect agar /admin/kepokmas otomatis ke tab pertama */}
        <Route
          path="kepokmas"
          element={<Navigate to="/admin/kepokmas/nama-pasar" replace />}
        />
        
        {/* Tambahkan redirect agar /admin/spbu-lpg otomatis ke tab pertama */}
        <Route
          path="spbu-lpg"
          element={<Navigate to="/admin/spbu-lpg/spbu" replace />}
        />
        
        {/* Tambahkan redirect agar /admin/stock-pangan otomatis ke tab pertama */}
        <Route
          path="stock-pangan"
          element={<Navigate to="/admin/stock-pangan/distributor" replace />}
        />
        
        {/* Tambahkan redirect agar /admin/settings otomatis ke tab pertama */}
        <Route
          path="settings"
          element={<Navigate to="/admin/settings/kecamatan" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;
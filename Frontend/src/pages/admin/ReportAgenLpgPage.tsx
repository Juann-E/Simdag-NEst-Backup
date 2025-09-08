import React, { useState } from 'react';
import { DocumentArrowDownIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BbmLpgTabs from '../../components/admin/BbmLpgTabs';

interface MonthlyReportForm {
  monthYear: string;
}

interface YearlyReportForm {
  year: string;
  kuota_mt: string;
}

export default function ReportAgenLpgPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('Report Agen LPG');
  
  const [monthlyForm, setMonthlyForm] = useState<MonthlyReportForm>({
    monthYear: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  });
  const [yearlyForm, setYearlyForm] = useState<YearlyReportForm>({
    year: new Date().getFullYear().toString(),
    kuota_mt: ''
  });
  const [isDownloadingMonthly, setIsDownloadingMonthly] = useState(false);
  const [isDownloadingYearly, setIsDownloadingYearly] = useState(false);

  const [isDownloadingYearlyStatisticsPDF, setIsDownloadingYearlyStatisticsPDF] = useState(false);

  // Download monthly Excel report
  const downloadMonthlyExcel = async () => {
    try {
      setIsDownloadingMonthly(true);
      const [year, month] = monthlyForm.monthYear.split('-');
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-monthly?month=${parseInt(month)}&year=${parseInt(year)}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const monthName = monthNames[parseInt(month) - 1];
      
      link.setAttribute('download', `Laporan_Agen_LPG_${monthName}_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading monthly report:', error);
      alert('Gagal mengunduh laporan bulanan. Silakan coba lagi.');
    } finally {
      setIsDownloadingMonthly(false);
    }
  };

  // Download yearly Excel report
  const downloadYearlyExcel = async () => {
    try {
      // Validasi input kuota metrik ton
      if (!yearlyForm.kuota_mt || parseFloat(yearlyForm.kuota_mt) <= 0) {
        alert('Mohon masukkan kuota metrik ton yang valid (lebih dari 0)');
        return;
      }
      
      setIsDownloadingYearly(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-yearly?year=${parseInt(yearlyForm.year)}&kuota_mt=${parseFloat(yearlyForm.kuota_mt)}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Agen_LPG_Tahunan_${yearlyForm.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading yearly report:', error);
      alert('Gagal mengunduh laporan tahunan. Silakan coba lagi.');
    } finally {
      setIsDownloadingYearly(false);
    }
  };



  // Download yearly statistics PDF
  const downloadYearlyStatisticsPDF = async () => {
    try {
      if (!yearlyForm.kuota_mt || parseFloat(yearlyForm.kuota_mt) <= 0) {
        alert('Mohon masukkan kuota metrik ton yang valid (lebih dari 0)');
        return;
      }
      
      setIsDownloadingYearlyStatisticsPDF(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-yearly-statistics-pdf?year=${parseInt(yearlyForm.year)}&kuota_mt=${parseFloat(yearlyForm.kuota_mt)}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Statistik_LPG_Tahunan_${yearlyForm.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading yearly statistics PDF:', error);
      alert('Gagal mengunduh statistik PDF tahunan. Silakan coba lagi.');
    } finally {
      setIsDownloadingYearlyStatisticsPDF(false);
    }
  };



  // Handle form changes
  const handleMonthlyFormChange = (value: string) => {
    setMonthlyForm({ monthYear: value });
  };

  const handleYearlyFormChange = (field: string, value: string) => {
    setYearlyForm(prev => ({ ...prev, [field]: value }));
  };
  
  // Fungsi untuk mengubah tab dan navigasi
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    
    // Navigasi ke halaman yang sesuai berdasarkan tab
    const tabRoutes = {
      'Jenis BBM': '/admin/bbm-lpg/jenis-bbm',
      'Realisasi Bulanan LPG': '/admin/bbm-lpg/realisasi-bulanan-lpg',
      'Realisasi Bulanan BBM': '/admin/bbm-lpg/realisasi-bulanan-bbm',
      'Report Agen LPG': '/admin/report-agen-lpg',
      'Report BBM': '/admin/bbm-lpg/report-bbm',
    };
    
    const route = tabRoutes[tabName as keyof typeof tabRoutes];
    if (route && route !== '/admin/report-agen-lpg') {
      navigate(route);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Agen LPG</h1>
        <p className="text-gray-600 mt-1">Generate dan ekspor laporan agen LPG berdasarkan bulan dan tahun</p>
      </div>
      
      <BbmLpgTabs activeTab={activeTab} setActiveTab={handleTabClick} />
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Laporan Agen LPG</h2>
          <p className="text-sm text-gray-500">
            Kelola dan unduh laporan realisasi agen LPG dalam format Excel.
          </p>
        </div>

        {/* Monthly Report Section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Bulanan Excel</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download laporan agen LPG bulanan dalam format Excel yang dikelompokkan berdasarkan agen dengan perhitungan realisasi tabung.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulan dan Tahun
              </label>
              <input
                type="month"
                value={monthlyForm.monthYear}
                onChange={(e) => handleMonthlyFormChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <button
                onClick={downloadMonthlyExcel}
                disabled={isDownloadingMonthly}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isDownloadingMonthly ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Download Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>



        {/* Yearly Report Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Tahunan Excel</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download laporan agen LPG tahunan dalam format Excel dengan breakdown per bulan untuk setiap agen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <select
                value={yearlyForm.year}
                onChange={(e) => handleYearlyFormChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Metrik Ton <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Contoh: 9901"
                value={yearlyForm.kuota_mt}
                onChange={(e) => handleYearlyFormChange('kuota_mt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <button
                onClick={downloadYearlyExcel}
                disabled={isDownloadingYearly}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isDownloadingYearly ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Download Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Yearly Statistics Section */}
        <div className="bg-orange-50 p-4 rounded-lg mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Statistik & Analitik Tahunan</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download laporan statistik dan analitik LPG tahunan dengan perbandingan bulanan, trend analysis, dan evaluasi pencapaian target dalam format PDF atau Word.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <select
                value={yearlyForm.year}
                onChange={(e) => handleYearlyFormChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Metrik Ton <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Contoh: 9901"
                value={yearlyForm.kuota_mt}
                onChange={(e) => handleYearlyFormChange('kuota_mt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <button
                onClick={downloadYearlyStatisticsPDF}
                disabled={isDownloadingYearlyStatisticsPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full flex items-center justify-center transition-colors"
              >
                {isDownloadingYearlyStatisticsPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BbmLpgTabs from '../../components/admin/BbmLpgTabs';

interface MonthlyReportForm {
  monthYear: string;
}

interface YearlyReportForm {
  year: string;
  kuota_mt: string;
}

export default function ReportAgenLpgPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('Report Agen LPG');
  
  const [monthlyForm, setMonthlyForm] = useState<MonthlyReportForm>({
    monthYear: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  });
  const [yearlyForm, setYearlyForm] = useState({
    year: new Date().getFullYear().toString(),
    kuota_mt: ''
  });
  const [isDownloadingMonthly, setIsDownloadingMonthly] = useState(false);
  const [isDownloadingYearly, setIsDownloadingYearly] = useState(false);

  // Download monthly Excel report
  const downloadMonthlyExcel = async () => {
    try {
      if (!monthlyForm.monthYear) {
        alert('Harap pilih bulan dan tahun terlebih dahulu.');
        return;
      }
      
      setIsDownloadingMonthly(true);
      const token = localStorage.getItem('accessToken');
      
      const [year, month] = monthlyForm.monthYear.split('-');
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-monthly?year=${parseInt(year)}&month=${parseInt(month)}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Agen_LPG_${monthlyForm.monthYear}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading monthly report:', error);
      alert('Gagal mengunduh laporan bulanan. Silakan coba lagi.');
    } finally {
      setIsDownloadingMonthly(false);
    }
  };

  // Download yearly Excel report
  const downloadYearlyExcel = async () => {
    try {
      if (!yearlyForm.year || !yearlyForm.kuota_mt) {
        alert('Harap lengkapi tahun dan kuota metrik ton terlebih dahulu.');
        return;
      }
      
      if (parseFloat(yearlyForm.kuota_mt) <= 0) {
        alert('Kuota metrik ton harus lebih dari 0.');
        return;
      }
      
      setIsDownloadingYearly(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-yearly?year=${parseInt(yearlyForm.year)}&kuota_mt=${parseFloat(yearlyForm.kuota_mt)}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Agen_LPG_Tahunan_${yearlyForm.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading yearly report:', error);
      alert('Gagal mengunduh laporan tahunan. Silakan coba lagi.');
    } finally {
      setIsDownloadingYearly(false);
    }
  };

  // Handle form changes
  const handleMonthlyFormChange = (value: string) => {
    setMonthlyForm({ monthYear: value });
  };

  const handleYearlyFormChange = (field: string, value: string) => {
    setYearlyForm(prev => ({ ...prev, [field]: value }));
  };
  
  /**
   * Fungsi untuk navigasi ke halaman laporan tahunan terpisah.
   */
  const openYearlyReportPage = () => {
    if (!yearlyForm.kuota_mt || parseFloat(yearlyForm.kuota_mt) <= 0) {
      alert('Harap masukkan nilai Kuota Metrik Ton yang valid (lebih dari 0) untuk melihat laporan.');
      return;
    }
    // Navigasi ke halaman Tahunan dengan parameter
    navigate(`/admin/tahunan?year=${yearlyForm.year}&kuota_mt=${yearlyForm.kuota_mt}`);
  };
   
  // Fungsi untuk mengubah tab dan navigasi
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    
    // Navigasi ke halaman yang sesuai berdasarkan tab
    const tabRoutes = {
      'Jenis BBM': '/admin/bbm-lpg/jenis-bbm',
      'Realisasi Bulanan LPG': '/admin/bbm-lpg/realisasi-bulanan-lpg',
      'Realisasi Bulanan BBM': '/admin/bbm-lpg/realisasi-bulanan-bbm',
      'Report Agen LPG': '/admin/report-agen-lpg',
      'Report BBM': '/admin/bbm-lpg/report-bbm',
    };
    
    const route = tabRoutes[tabName as keyof typeof tabRoutes];
    if (route && route !== '/admin/report-agen-lpg') {
      navigate(route);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Agen LPG</h1>
        <p className="text-gray-600 mt-1">Generate dan ekspor laporan agen LPG berdasarkan bulan dan tahun</p>
      </div>
      
      <BbmLpgTabs activeTab={activeTab} setActiveTab={handleTabClick} />
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Laporan Agen LPG</h2>
          <p className="text-sm text-gray-500">
            Kelola dan unduh laporan realisasi agen LPG dalam format Excel.
          </p>
        </div>

        {/* Monthly Report Section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Bulanan Excel</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download laporan agen LPG bulanan dalam format Excel yang dikelompokkan berdasarkan agen dengan perhitungan realisasi tabung.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulan dan Tahun
              </label>
              <input
                type="month"
                value={monthlyForm.monthYear}
                onChange={(e) => handleMonthlyFormChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <button
                onClick={downloadMonthlyExcel}
                disabled={isDownloadingMonthly}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isDownloadingMonthly ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Download Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Yearly Report Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Tahunan Excel</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download laporan agen LPG tahunan dalam format Excel dengan breakdown per bulan untuk setiap agen.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <select
                value={yearlyForm.year}
                onChange={(e) => handleYearlyFormChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Metrik Ton <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Contoh: 9901"
                value={yearlyForm.kuota_mt}
                onChange={(e) => handleYearlyFormChange('kuota_mt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <button
                onClick={openYearlyReportPage}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Lihat Statistik
              </button>
            </div>
            
            <div>
              <button
                onClick={downloadYearlyExcel}
                disabled={isDownloadingYearly}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isDownloadingYearly ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Download Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  );
}
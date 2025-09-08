import React, { useState } from 'react';
import { DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { TahunanComponent } from './Laporan/tahunan';

// Interface untuk mendefinisikan bentuk data form
interface MonthlyReportForm {
  monthYear: string;
}

interface YearlyReportForm {
  year: string;
  kuota_mt: string;
}

export default function ReportAgenLpg() {
  const [monthlyForm, setMonthlyForm] = useState<MonthlyReportForm>({
    monthYear: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  });
  const [yearlyForm, setYearlyForm] = useState<YearlyReportForm>({
    year: new Date().getFullYear().toString(),
    kuota_mt: '9901'
  });
  const [isDownloadingMonthly, setIsDownloadingMonthly] = useState(false);
  const [isDownloadingYearly, setIsDownloadingYearly] = useState(false);
  const [showYearlyReport, setShowYearlyReport] = useState(false);

  /**
   * Fungsi untuk mengunduh laporan bulanan.
   */
  const downloadMonthlyExcel = async () => {
    try {
      setIsDownloadingMonthly(true);
      const [year, month] = monthlyForm.monthYear.split('-');
      const token = localStorage.getItem('accessToken');

      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-monthly?month=${parseInt(month)}&year=${parseInt(year)}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const monthName = monthNames[parseInt(month) - 1];
      link.setAttribute('download', `Laporan_LPG_${monthName}_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading monthly report:', error);
      alert('Gagal mengunduh laporan bulanan.');
    } finally {
      setIsDownloadingMonthly(false);
    }
  };

  /**
   * Fungsi KHUSUS untuk mengunduh file Excel tahunan.
   */
  const downloadYearlyExcel = async () => {
    if (!yearlyForm.kuota_mt || parseFloat(yearlyForm.kuota_mt) <= 0) {
      alert('Harap masukkan nilai Kuota (MT) yang valid.');
      return;
    }
    try {
      setIsDownloadingYearly(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-yearly?year=${yearlyForm.year}&kuota_mt=${yearlyForm.kuota_mt}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_LPG_Tahunan_${yearlyForm.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading yearly excel:', error);
      alert('Gagal mengunduh file Excel Tahunan.');
    } finally {
      setIsDownloadingYearly(false);
    }
  };

  /**
   * Fungsi untuk menampilkan laporan tahunan di halaman yang sama.
   */
  const openYearlyReportPage = () => {
    if (!yearlyForm.kuota_mt || parseFloat(yearlyForm.kuota_mt) <= 0) {
      alert('Harap masukkan nilai Kuota Metrik Ton yang valid (lebih dari 0) untuk melihat laporan.');
      return;
    }
    setShowYearlyReport(true);
  };

  const handleMonthlyFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyForm({ monthYear: e.target.value });
  };

  const handleYearlyFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setYearlyForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Report Agen LPG</h2>
        <p className="text-sm text-gray-500">
          Generate dan ekspor laporan agen LPG berdasarkan bulan dan tahun.
        </p>
      </div>

      {/* Monthly Report Section */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Bulanan Excel</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download laporan agen LPG bulanan dalam format Excel.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-1">
              Bulan dan Tahun
            </label>
            <input
              id="monthYear"
              type="month"
              value={monthlyForm.monthYear}
              onChange={handleMonthlyFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              onClick={downloadMonthlyExcel}
              disabled={isDownloadingMonthly}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isDownloadingMonthly ? 'Mengunduh...' : <><DocumentArrowDownIcon className="h-4 w-4 mr-2" /> Download Excel</>}
            </button>
          </div>
        </div>
      </div>

      {/* Yearly Report Section */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Tahunan</h3>
        <p className="text-sm text-gray-600 mb-4">
          Unduh laporan sebagai file Excel atau lihat detail interaktif di halaman baru.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Kolom Tahun */}
          <div className="md:col-span-1">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Tahun
            </label>
            <select
              id="year" name="year" value={yearlyForm.year} onChange={handleYearlyFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (<option key={year} value={year}>{year}</option>);
              })}
            </select>
          </div>
          {/* Kolom Kuota */}
          <div className="md:col-span-1">
            <label htmlFor="kuota_mt" className="block text-sm font-medium text-gray-700 mb-1">
              Kuota Metrik Ton <span className="text-red-500">*</span>
            </label>
            <input
              id="kuota_mt" type="number" name="kuota_mt" value={yearlyForm.kuota_mt}
              onChange={handleYearlyFormChange} placeholder="Contoh: 9901" step="0.01" min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Kolom Tombol Lihat Data */}
          <div className="md:col-span-1">
            <button
              onClick={openYearlyReportPage}
              className="btn-secondary w-full flex items-center justify-center"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Lihat Data
            </button>
          </div>
          {/* Kolom Tombol Download */}
          <div className="md:col-span-1">
            <button
              onClick={downloadYearlyExcel}
              disabled={isDownloadingYearly}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isDownloadingYearly
                ? 'Mengunduh...'
                : <><DocumentArrowDownIcon className="h-5 w-5 mr-2" /> Download Excel</>
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Tampilkan komponen Tahunan jika showYearlyReport true */}
      {showYearlyReport && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Laporan Tahunan LPG</h2>
            <button
              onClick={() => setShowYearlyReport(false)}
              className="btn-secondary flex items-center"
            >
              ← Kembali ke Form
            </button>
          </div>
          <TahunanComponent year={yearlyForm.year} kuota_mt={yearlyForm.kuota_mt} />
        </div>
      )}
    </div>
  );
}
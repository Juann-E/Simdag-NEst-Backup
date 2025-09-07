// src/components/admin/bbm-lpg/ReportAgenLpg.tsx
import React, { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

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
    kuota_mt: ''
  });
  const [isDownloadingMonthly, setIsDownloadingMonthly] = useState(false);
  const [isDownloadingYearly, setIsDownloadingYearly] = useState(false);

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

      link.setAttribute('download', `Laporan_LPG_${monthName}_${year}.xlsx`);
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
    // Add a check to ensure kuota_mt is not empty
    if (!yearlyForm.kuota_mt) {
      alert('Harap masukkan nilai Kuota (MT).');
      return;
    }
    try {
      setIsDownloadingYearly(true);
      const token = localStorage.getItem('accessToken');

      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-yearly?year=${yearlyForm.year}&kuota_mt=${yearlyForm.kuota_mt}`,
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
      link.setAttribute('download', `Laporan_LPG_Tahunan_${yearlyForm.year}.xlsx`);
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

  const handleYearlyFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setYearlyForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
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
          {/* Kolom Tahun */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Tahun
            </label>
            <select
              id="year"
              name="year"
              value={yearlyForm.year}
              onChange={handleYearlyFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Kolom Kuota (MT) - STRUKTUR DIPERBAIKI */}
          <div>
            <label htmlFor="kuota_mt" className="block text-sm font-medium text-gray-700 mb-1">
              Kuota (MT)
            </label>
            <input
              id="kuota_mt"
              type="number"
              name="kuota_mt"
              value={yearlyForm.kuota_mt}
              onChange={handleYearlyFormChange}
              placeholder="Contoh: 123.45"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kolom Tombol Download */}
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
  );
}
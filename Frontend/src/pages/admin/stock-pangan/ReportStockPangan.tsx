import React, { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface MonthlyReportForm {
  monthYear: string;
}

const ReportStockPangan: React.FC = () => {
  const [monthlyForm, setMonthlyForm] = useState<MonthlyReportForm>({
    monthYear: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  });
  const [isDownloadingMonthly, setIsDownloadingMonthly] = useState(false);

  // Download monthly Excel report
  const downloadMonthlyExcel = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Sesi berakhir, silakan login kembali.');
      return;
    }

    if (!monthlyForm.monthYear) {
      console.warn('Mohon pilih tahun dan bulan terlebih dahulu');
      return;
    }

    const [year, month] = monthlyForm.monthYear.split('-').map(Number);

    setIsDownloadingMonthly(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/stock-pangan/report/monthly-excel`,
        {
          tahun: year,
          bulan: month
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `data_stock_pangan_${String(month).padStart(2, '0')}_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('Laporan Excel berhasil diunduh');
    } catch (error) {
      console.error('Error downloading monthly excel:', error);
    } finally {
      setIsDownloadingMonthly(false);
    }
  };

  // Handle monthly form change
  const handleMonthlyFormChange = (value: string) => {
    setMonthlyForm({ monthYear: value });
  };



  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Report Stock Pangan</h2>
        <p className="text-sm text-gray-500">
          Generate dan ekspor laporan stock pangan berdasarkan bulan dan tahun.
        </p>
      </div>

      {/* Monthly Report Section */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Laporan Bulanan Excel</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download laporan stock pangan dalam format Excel yang dikelompokkan berdasarkan komoditas dengan perhitungan stock akhir otomatis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
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


    </div>
  );
};

export default ReportStockPangan;
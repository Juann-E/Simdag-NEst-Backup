// Frontend/src/components/admin/bbm-lpg/tahunan.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Definisikan tipe untuk data yang diterima dari API
interface ReportData {
  tableData: any[];
  summary: {
    monthlyTotals: number[];
    grandTotal: number;
    kuotaTabung: number;
    sisaKuota: number;
  };
  reportInfo: {
    year: number;
    kuotaMt: number;
  };
}

// Komponen ini menerima props dari ReportAgenLpg
export default function Tahunan({ year, kuota_mt }: { year: string; kuota_mt: string }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!year || !kuota_mt || kuota_mt === '0' || parseFloat(kuota_mt) <= 0) {
        setError('Silakan masukkan nilai Kuota MT yang valid dari halaman Report Agen LPG.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `http://localhost:3000/public/report-agen-lpg/yearly-data?year=${year}&kuota_mt=${kuota_mt}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data);
        setError('');
      } catch (err) {
        setError('Gagal memuat data laporan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, kuota_mt]);

  const downloadRawExcel = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:3000/public/report-agen-lpg/download-yearly?year=${year}&kuota_mt=${kuota_mt}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_LPG_Tahunan_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading raw excel:', error);
      alert('Gagal mengunduh file Excel.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById('report-content');
      if (!element) {
        alert('Konten laporan tidak ditemukan.');
        return;
      }
  
      // Hide download buttons before capturing
      const downloadButtons = element.querySelectorAll('.download-button');
      downloadButtons.forEach(button => {
        (button as HTMLElement).style.display = 'none';
      });
  
      // Capture the entire content including charts
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
  
      // Show download buttons again after capturing
      downloadButtons.forEach(button => {
        (button as HTMLElement).style.display = 'flex';
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save(`Laporan_LPG_Tahunan_${year}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Gagal mengunduh file PDF.');
      
      // Make sure to show buttons again even if there's an error
      const element = document.getElementById('report-content');
      if (element) {
        const downloadButtons = element.querySelectorAll('.download-button');
        downloadButtons.forEach(button => {
          (button as HTMLElement).style.display = 'flex';
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data laporan...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-8 text-center">Tidak ada data untuk ditampilkan.</div>;

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return `Bulan ${context[0].label} ${data.reportInfo.year}`;
          },
          label: function(context: any) {
            const value = context.parsed.y;
            return [
              `Realisasi: ${value.toLocaleString('id-ID')} tabung`,
              `Setara dengan: ${(value * 3 / 1000).toFixed(2)} MT`
            ];
          }
        }
      }
    },
  };

  const summaryChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return `${context[0].label} - Tahun ${data.reportInfo.year}`;
          },
          label: function(context: any) {
            const value = context.parsed.y;
            const label = context.label;
            
            if (label === 'Total Realisasi') {
              return [
                `Total Realisasi: ${value.toLocaleString('id-ID')} tabung`,
                `Setara dengan: ${(value * 3 / 1000).toFixed(2)} MT`,
                `Persentase dari kuota: ${((value * 3 / 1000) / data.reportInfo.kuotaMt * 100).toFixed(1)}%`
              ];
            } else if (label === 'Kuota LPG') {
              return [
                `Kuota LPG: ${value.toLocaleString('id-ID')} tabung`,
                `Kuota MT: ${data.reportInfo.kuotaMt} MT`,
                `Kuota untuk Kota Salatiga`
              ];
            } else if (label === 'Sisa Kuota') {
              const sisaMT = (value * 3 / 1000);
              return [
                `Sisa Kuota: ${value.toLocaleString('id-ID')} tabung`,
                `Setara dengan: ${sisaMT.toFixed(2)} MT`,
                `Persentase sisa: ${(sisaMT / data.reportInfo.kuotaMt * 100).toFixed(1)}%`
              ];
            }
            return `${value.toLocaleString('id-ID')} tabung`;
          }
        }
      }
    },
  };

  const monthlyChartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Total Realisasi (Tabung)',
      data: data.summary.monthlyTotals,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }],
  };
  
  const summaryChartData = {
    labels: ['Total Realisasi', 'Kuota LPG', 'Sisa Kuota'],
    datasets: [{
      label: 'Jumlah (Tabung)',
      data: [data.summary.grandTotal, data.summary.kuotaTabung.toFixed(0), data.summary.sisaKuota.toFixed(0)],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
    }],
  };

  return (
    <div id="report-content" className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Tahunan LPG - {data.reportInfo.year}</h1>
          <p className="text-gray-600">Kuota Ditetapkan: {data.reportInfo.kuotaMt} MT</p>
        </div>
        <div className="flex gap-3">
          {/* <button onClick={downloadRawExcel} disabled={isDownloading} className="download-button bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md transition-colors flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" /> */}
            {/* {isDownloading ? 'Mengunduh...' : 'Download Excel'} */}
          {/* </button> */}
          <button onClick={downloadPDF} disabled={isDownloading} className="download-button bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md transition-colors flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            {isDownloading ? 'Mengunduh...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow"><h2 className="text-xl font-semibold text-center mb-4">Realisasi Penyaluran Bulanan</h2><Bar options={monthlyChartOptions} data={monthlyChartData} /></div>
        <div className="bg-white p-4 rounded-lg shadow"><h2 className="text-xl font-semibold text-center mb-4">Ringkasan Kuota Tahunan</h2><Bar options={summaryChartOptions} data={summaryChartData} /></div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Detail Realisasi per Agen</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell text-left">Nama Agen</th>
                {monthLabels.map(label => <th key={label} className="th-cell text-right">{label}</th>)}
                <th className="th-cell text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.tableData.map((agen, index) => (
                <tr key={index}>
                  <td className="td-cell font-medium">{agen.nama_usaha}</td>
                  {agen.monthly.map((val: number, i: number) => 
                    <td key={i} className="td-cell text-right">{val.toLocaleString('id-ID')}</td>
                  )}
                  <td className="td-cell text-right font-bold">{agen.total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {/* Baris Total Realisasi */}
              <tr className="bg-yellow-100 font-bold">
                <td className="td-cell font-bold">TOTAL REALISASI</td>
                {data.summary.monthlyTotals.map((total: number, i: number) => 
                  <td key={i} className="td-cell text-right">{total.toLocaleString('id-ID')}</td>
                )}
                <td className="td-cell text-right font-bold">{data.summary.grandTotal.toLocaleString('id-ID')}</td>
              </tr>
              {/* Baris Kuota LPG */}
               <tr className="bg-yellow-100 font-bold">
                 <td className="td-cell font-bold">KUOTA LPG 3 KG DI KOTA SALATIGA ({data.reportInfo.kuotaMt} MT)</td>
                 {Array(12).fill(0).map((_, i) => 
                   <td key={i} className="td-cell text-right"></td>
                 )}
                 <td className="td-cell text-right font-bold">{data.summary.kuotaTabung.toLocaleString('id-ID')}</td>
               </tr>
               {/* Baris Sisa Kuota */}
               <tr className="bg-yellow-100 font-bold">
                 <td className="td-cell font-bold">SISA KUOTA LPG TAHUN {data.reportInfo.year}</td>
                 {Array(12).fill(0).map((_, i) => 
                   <td key={i} className="td-cell text-right"></td>
                 )}
                 <td className="td-cell text-right font-bold">{data.summary.sisaKuota.toLocaleString('id-ID')}</td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Tahunan from '../../components/admin/bbm-lpg/Laporan/tahunan';

export default function TahunanPage() {
  const [searchParams] = useSearchParams();
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  const kuota_mt = searchParams.get('kuota_mt') || '0';

  return (
    <div className="p-6">
      {/* Header dengan tombol kembali */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/report-agen-lpg"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Report Agen LPG</span>
          </Link>
        </div>
      </div>

      {/* Komponen Tahunan */}
      <Tahunan year={year} kuota_mt={kuota_mt} />
    </div>
  );
}
// src/components/Footer.tsx
import { ChartColumn } from 'lucide-react'; // 1. Ganti ikon menjadi ChartColumn

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center text-center text-gray-500">
          
          {/* 2. Ganti seluruh blok div ini agar sama dengan di header */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <ChartColumn className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-blue-600">SIMDAG</p>
              <p className="text-sm text-gray-500">Pemerintah Kota Salatiga</p>
            </div>
          </div>

          <p className="text-sm mt-4">
            © {currentYear} Pemerintah Kota Salatiga, Sistem Informasi Perdagangan Terintegrasi
          </p>
        </div>
      </div>
    </footer>
  );
}
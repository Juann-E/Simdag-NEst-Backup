// src/pages/TentangPage.tsx

import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Award, ChartColumn } from 'lucide-react';

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChartColumn className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Tentang <span className="text-blue-600">SIMDAG</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Sistem Informasi Perdagangan yang membantu memantau dan mengelola data perdagangan secara efisien
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* About SIMDAG */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Apa itu SIMDAG?</h2>
            </div>
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p className="mb-4">
                <strong>SIMDAG (Sistem Informasi Perdagangan)</strong> adalah platform digital yang dirancang untuk membantu 
                pemerintah daerah dan stakeholder terkait dalam memantau, mengelola, dan menganalisis data perdagangan 
                di wilayah mereka.
              </p>
              <p className="mb-4">
                Sistem ini menyediakan berbagai fitur untuk mengelola data komoditas, harga pasar, stok pangan, 
                serta lokasi-lokasi strategis seperti SPBU, SPBE, Agen, dan Pangkalan LPG.
              </p>
              <p>
                Dengan SIMDAG, pengguna dapat dengan mudah memantau fluktuasi harga, mengelola inventori, 
                dan membuat laporan yang komprehensif untuk mendukung pengambilan keputusan yang lebih baik 
                dalam sektor perdagangan.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Fitur Utama</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Manajemen Stok Pangan</h3>
                    <p className="text-gray-600 text-sm">Kelola data stok komoditas pangan dengan mudah</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Monitoring Harga Pasar</h3>
                    <p className="text-gray-600 text-sm">Pantau fluktuasi harga komoditas di berbagai pasar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Peta Interaktif</h3>
                    <p className="text-gray-600 text-sm">Visualisasi lokasi SPBU, SPBE, Agen, dan Pangkalan LPG</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Laporan Excel</h3>
                    <p className="text-gray-600 text-sm">Generate laporan dalam format Excel untuk analisis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dashboard Admin</h3>
                    <p className="text-gray-600 text-sm">Interface admin yang intuitif untuk pengelolaan data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sistem Keamanan</h3>
                    <p className="text-gray-600 text-sm">Autentikasi dan otorisasi berbasis JWT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold">Tim Pengembang</h2>
            </div>
            <p className="text-blue-100 mb-6">
              SIMDAG dikembangkan oleh tim yang berdedikasi untuk menciptakan solusi teknologi 
              yang dapat membantu meningkatkan efisiensi dalam sektor perdagangan.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Bowo Bisma</h3>
                <p className="text-blue-200 text-sm">Developer</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Rangga Prawiro Utomo</h3>
                <p className="text-blue-200 text-sm">Developer</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Juanito Eriyadi</h3>
                <p className="text-blue-200 text-sm">Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
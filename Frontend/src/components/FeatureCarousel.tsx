// src/components/FeatureCarousel.tsx

import { useState } from 'react';
import { TrendingUp, Fuel, BarChart3, Store, ChevronLeft, ChevronRight } from 'lucide-react';

const carouselData = [
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: "Monitoring Perdagangan Real-time",
    subtitle: "Pantau harga dan ketersediaan komoditas secara langsung",
    description: "Sistem monitoring terintegrasi untuk memantau pergerakan harga bahan pokok di seluruh pasar tradisional Kota Salatiga.",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    icon: <Fuel className="w-6 h-6 text-white" />,
    title: "Distribusi BBM & LPG",
    subtitle: "Pemetaan lengkap SPBU dan agen LPG",
    description: "Akses informasi lengkap lokasi, kontak, dan jenis bahan bakar yang tersedia di setiap SPBU dan agen LPG bersubsidi.",
    gradient: "from-green-600 to-green-800",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: "Analisis Pasar Komprehensif",
    subtitle: "Data dan tren perdagangan terintegrasi",
    description: "Dashboard analitik yang memberikan insight mendalam tentang kondisi perdagangan dan tren ekonomi lokal.",
    gradient: "from-purple-600 to-purple-800",
  },
  {
    icon: <Store className="w-6 h-6 text-white" />,
    title: "Jaringan Pasar Tradisional",
    subtitle: "11 pasar tersebar di 4 kecamatan",
    description: "Mencakup seluruh pasar tradisional di Sidorejo, Sidomulyo, Tingkir, dan Argomulyo dengan data pedagang terkini.",
    gradient: "from-orange-600 to-orange-800",
  },
];

export default function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="relative">
        <div className="overflow-hidden rounded-xl border-2 shadow-sm">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {carouselData.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className={`h-96 p-8 relative overflow-hidden bg-gradient-to-br ${slide.gradient}`}>
                  <div className="relative z-10 h-full flex items-center">
                    <div className="space-y-4 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          {slide.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold">{slide.title}</h2>
                          <p className="text-lg text-white/90">{slide.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-base text-white/80 leading-relaxed max-w-2xl">{slide.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm border-2 rounded-md flex items-center justify-center hover:bg-white transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm border-2 rounded-md flex items-center justify-center hover:bg-white transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <div className="flex justify-center mt-6 space-x-2">
            {carouselData.map((_, index) => (
                <button 
                    key={index} 
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
            ))}
        </div>
      </div>
    </div>
  );
}
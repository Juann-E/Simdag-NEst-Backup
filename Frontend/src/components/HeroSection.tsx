// src/components/HeroSection.tsx

export default function HeroSection() {
  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-gray-600 to-yellow-500 bg-clip-text text-transparent pb-4 mb-4">
            SIMDAG Salatiga
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-gray-800 mt-6">
            Sistem Monitoring Kepokmas Pasar
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Platform digital terintegrasi untuk monitoring harga dan ketersediaan komoditas di pasar rakyat Kota Salatiga oleh Dinas Perdagangan
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 pt-4">
            <div className="bg-blue-600/10 text-blue-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
              🏛️ 3 Pasar Tradisional
            </div>
            <div className="bg-yellow-400/10 text-yellow-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
              📊 Real-time Monitoring
            </div>
            <div className="bg-green-600/10 text-green-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
              🎯 2 Kecamatan
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
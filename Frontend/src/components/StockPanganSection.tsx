// src/components/StockPanganSection.tsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { MapPin, TrendingUp } from "lucide-react"

const API_BASE_URL = "http://localhost:3000"

interface Distributor {
  id: number
  nama_distributor: string
  alamat: string
  kontak?: string
  latitude?: number
  longitude?: number
  totalKomoditas?: number
}

export default function StockPanganSection() {
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/public/distributors`)
        setDistributors(response.data)
      } catch (error) {
        console.error("Gagal mengambil data distributor:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDistributors()
  }, [])

  return (
    <section id="monitoring-stock-pangan" className="flex-shrink-0 container mx-auto px-4 py-16 mt-8 bg-blue-50">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Monitoring Stock Pangan</h1>
        <p className="text-lg text-gray-500 mt-2">
          Pantau perkembangan stok pangan di setiap toko besar per bulan untuk transparansi ketersediaan komoditas.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">Memuat data toko besar...</p>
        ) : distributors.length > 0 ? (
          distributors.map((distributor) => (
            <Link
              to={`/distributor/${distributor.id}`}
              key={distributor.id}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-blue-100"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {distributor.nama_distributor}
                </h2>
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-500">{distributor.alamat}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-600 font-semibold">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full mr-3">
                      Aktif
                    </span>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Lihat Statistik →
                  </div>
                </div>
                {distributor.totalKomoditas && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {distributor.totalKomoditas} komoditas terdaftar
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Belum ada data toko besar stock pangan.
          </p>
        )}
      </div>
    </section>
  )
}
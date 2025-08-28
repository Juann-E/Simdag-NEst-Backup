"use client"

// src/pages/StockPanganListPage.tsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import HeroSection from "../components/HeroSection"
import FeatureCarousel from "../components/FeatureCarousel"
import MapSection from "../components/MapSection"
import StockPanganChart from "../components/StockPanganChart"
import Footer from "../components/Footer"

// Pastikan URL ini sesuai dengan alamat backend Anda
const API_BASE_URL = "http://localhost:3000"

interface Distributor {
  id: number
  nama_distributor: string
  alamat: string
  latitude?: number
  longitude?: number
  status: string
}

export default function StockPanganListPage() {
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
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-16">
        <HeroSection />
        <FeatureCarousel />

        {/* === BAGIAN PETA LOKASI === */}
        <section className="container mx-auto px-4 sm:px-6 py-8">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-4xl font-bold text-gray-800">Peta Lokasi Distributor</h3>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Lihat persebaran lokasi distributor stock pangan yang telah terintegrasi dengan sistem kami.
            </p>
          </div>

          {/* Kontainer Peta yang Diperbesar */}
          <div className="w-full mb-8">
            <div className="h-[500px] rounded-lg shadow-lg">
              <MapSection
                locations={distributors.map((distributor) => ({
                  id: distributor.id,
                  name: distributor.nama_distributor,
                  address: distributor.alamat,
                  latitude: distributor.latitude || 0,
                  longitude: distributor.longitude || 0,
                  type: "distributor" as const,
                }))}
              />
            </div>
          </div>
        </section>
        {/* === AKHIR BAGIAN PETA === */}

        {/* === BAGIAN GRAFIK STOCK PANGAN === */}
        <section className="flex-shrink-0 w-full bg-gray-100 border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 sm:px-6 py-16">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-4xl font-bold text-gray-800">Analisis Tren Stock Pangan</h3>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Pantau perkembangan stock pangan dari berbagai distributor.
              </p>
            </div>
            <div className="mb-8 bg-white rounded-lg p-4 w-full">
              <StockPanganChart />
            </div>
          </div>
        </section>
        {/* === AKHIR BAGIAN GRAFIK STOCK PANGAN === */}

        {/* === BAGIAN DAFTAR DISTRIBUTOR === */}
        <section className="flex-shrink-0 container mx-auto px-4 py-16 mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Daftar Distributor Stock Pangan</h1>
            <p className="text-lg text-gray-500 mt-2">Klik distributor untuk melihat perkembangan stock bulanan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">Memuat data distributor...</p>
            ) : (
              distributors.map((distributor) => (
                <Link
                  to={`/stock-pangan/${distributor.id}`}
                  key={distributor.id}
                  className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">🏢</div>
                      <div className="text-lg font-semibold">Distributor</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {distributor.nama_distributor}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">{distributor.alamat}</p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mr-3">
                        {distributor.status}
                      </span>
                      Lihat Stock Bulanan →
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
        {/* === AKHIR BAGIAN DAFTAR DISTRIBUTOR === */}
      </div>

      <Footer />
    </div>
  )
}
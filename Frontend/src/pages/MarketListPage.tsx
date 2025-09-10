"use client"

// src/pages/MarketListPage.tsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import HeroSection from "../components/HeroSection"
import FeatureCarousel from "../components/FeatureCarousel"
import MapSection from "../components/MapSection"
import PriceChart from "../components/PriceChart"
import StockPanganChart from "../components/StockPanganChart"
import StockPanganSection from "../components/StockPanganSection"
import LpgBbmChart from "../components/charts/LpgBbmChart"
import Footer from "../components/Footer"

// Pastikan URL ini sesuai dengan alamat backend Anda
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Market {
  id: number
  nama_pasar: string
  alamat: string
  gambar?: string
  imageUrl?: string
  latitude?: number
  longitude?: number
}

interface Item {
  id: number
  namaBarang: string
  satuan?: {
    satuanBarang: string
  }
}

export default function MarketListPage() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  
  // State untuk PriceChart
  const [chartData, setChartData] = useState<any[]>([])
  const [chartLines, setChartLines] = useState<{ key: string; color: string }[]>([])
  const [chartLoading, setChartLoading] = useState(true)
  const [selectedMarketId, setSelectedMarketId] = useState<string>('')
  const [selectedItemId, setSelectedItemId] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Ambil data pasar dan items secara bersamaan
        const [marketsResponse, itemsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/markets`),
          axios.get(`${API_BASE_URL}/public/items`)
        ])

        // Proses data pasar
        const marketsWithImages = marketsResponse.data.map((market: Market) => {
          let imageUrl = "/default-market.jpg" // Gambar default jika tidak ada gambar
          if (market.gambar) {
            // Membersihkan path gambar dari backend
            const cleanedPath = market.gambar.replace(/\\/g, "/")
            imageUrl = `${API_BASE_URL}/uploads/${cleanedPath.replace("uploads/", "")}`
          }
          return { ...market, imageUrl }
        })

        setMarkets(marketsWithImages)
        setItems(itemsResponse.data)
        
      } catch (error) {
        console.error("Gagal mengambil data:", error)
        setMarkets([])
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // useEffect terpisah untuk mengambil data chart berdasarkan selectedItemId dan selectedMarketId
  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true)
      try {
        // Buat URL dengan parameter berdasarkan pilihan user
        let chartUrl = `${API_BASE_URL}/public/chart-data`
        const params = new URLSearchParams()
        
        if (selectedItemId) {
          params.append('itemId', selectedItemId)
        }
        if (selectedMarketId) {
          params.append('marketId', selectedMarketId)
        }
        
        if (params.toString()) {
          chartUrl += `?${params.toString()}`
        }
        
        const chartResponse = await axios.get(chartUrl)
        
        // Gunakan data chart yang sudah diproses dari backend
        const { chartData, chartLines } = chartResponse.data || { chartData: [], chartLines: [] }
        setChartData(chartData)
        setChartLines(chartLines)
        
      } catch (error) {
        console.error("Gagal mengambil data chart:", error)
        // Set default values jika terjadi error
        setChartData([])
        setChartLines([])
      } finally {
        setChartLoading(false)
      }
    }
    fetchChartData()
  }, [selectedMarketId, selectedItemId])



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        <div className="flex-shrink-0">
          <HeroSection />
        </div>
        <div className="flex-shrink-0 mt-8">
          <FeatureCarousel />
        </div>

        {/* === BAGIAN PETA LOKASI === */}
        <section id="peta-lokasi" className="flex-shrink-0 container mx-auto px-4 sm:px-6 py-12 mt-8">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-4xl font-bold text-gray-800">Peta Lokasi</h3>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Lihat persebaran lokasi yang telah terintegrasi dengan sistem kami.
            </p>
          </div>

          {/* Kontainer Peta yang Diperbesar */}
          <div className="w-full mb-8 relative">
            <div className="h-auto min-h-[500px] rounded-lg shadow-lg relative bg-white">
              <MapSection
                locations={markets.map((market) => ({
                  id: market.id,
                  name: market.nama_pasar,
                  address: market.alamat,
                  latitude: market.latitude || 0,
                  longitude: market.longitude || 0,
                  type: "market" as const,
                }))}
              />
            </div>
          </div>
        </section>
        {/* === AKHIR BAGIAN PETA === */}

        {/* === BAGIAN GRAFIK HARGA === */}
        <section id="grafik-statistik" className="flex-shrink-0 w-full bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 sm:px-6 py-16">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-4xl font-bold text-gray-800">Analisis Tren Harga Komoditas</h3>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Pilih komoditas dan pasar pada grafik di bawah untuk melihat tren harga spesifik.
              </p>
            </div>
            <div className="mb-8 bg-white rounded-lg p-4 w-full">
              <PriceChart
                data={chartData}
                lines={chartLines}
                markets={markets}
                items={items}
                selectedMarketId={selectedMarketId}
                selectedItemId={selectedItemId}
                onMarketChange={(e) => setSelectedMarketId(e.target.value)}
                onItemChange={(e) => setSelectedItemId(e.target.value)}
                loading={chartLoading}
              />
            </div>
          </div>
        </section>
        {/* === AKHIR BAGIAN GRAFIK HARGA === */}

        {/* === BAGIAN GRAFIK STOCK PANGAN === */}
        <section className="flex-shrink-0 w-full bg-gray-100 border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 sm:px-6 py-16">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-4xl font-bold text-gray-800">Tren Stock Komoditas Pangan</h3>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Pantau pergerakan stock komoditas pangan berdasarkan data transaksi toko besar.
              </p>
            </div>
            <div className="mb-8 bg-white rounded-lg p-4 w-full">
              <StockPanganChart />
            </div>
          </div>
        </section>
        {/* === AKHIR BAGIAN GRAFIK STOCK PANGAN === */}

        {/* === BAGIAN GRAFIK LPG DAN BBM === */}
        <section className="flex-shrink-0 w-full bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 sm:px-6 py-16">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-4xl font-bold text-gray-800">Realisasi Bulanan LPG dan BBM</h3>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Pantau realisasi distribusi LPG dan BBM dari berbagai agen dan SPBU.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LpgBbmChart 
                type="lpg" 
                title="Realisasi Bulanan LPG"
                className=""
              />
              <LpgBbmChart 
                type="bbm" 
                title="Realisasi Bulanan BBM"
                className=""
              />
            </div>
          </div>
        </section>
        {/* === AKHIR BAGIAN GRAFIK LPG DAN BBM === */}

        {/* === BAGIAN DAFTAR PASAR === */}
        <section id="daftar-pasar" className="flex-shrink-0 container mx-auto px-4 py-16 mt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Daftar Pasar</h1>
            <p className="text-lg text-gray-500 mt-2">Klik pasar untuk melihat perbandingan harga harian.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              <p className="col-span-full text-center text-gray-500">Memuat data pasar...</p>
            ) : (
              markets.map((market) => (
                <Link
                  to={`/market/${market.id}`}
                  key={market.id}
                  className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <img
                    src={market.imageUrl || "/placeholder.svg"}
                    alt={market.nama_pasar}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {market.nama_pasar}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">{market.alamat}</p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mr-3">
                        Aktif
                      </span>
                      Lihat Harga Real-time →
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
        {/* === AKHIR BAGIAN DAFTAR PASAR === */}

        {/* === BAGIAN STOCK PANGAN === */}
        <StockPanganSection />
        {/* === AKHIR BAGIAN STOCK PANGAN === */}
      </div>

      <Footer />
    </div>
  )
}

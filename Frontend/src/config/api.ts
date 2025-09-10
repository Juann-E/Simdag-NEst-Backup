// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    
    // Public endpoints
    LOCATIONS: '/public/locations',
    MARKETS: '/public/markets', 
    PRICES_ALL: '/public/prices/all',
    
    // Admin endpoints
    NAMA_PASAR: '/nama-pasar',
    NAMA_BARANG: '/nama-barang',
    SATUAN_BARANG: '/satuan-barang',
    HARGA_BARANG_PASAR: '/harga-barang-pasar',
    BARANG_PASAR_GRID: '/barang-pasar-grid',
    
    // Location endpoints
    KECAMATAN: '/kecamatan',
    KELURAHAN: '/kelurahan',
    
    // SPBU LPG endpoints
    SPBU: '/spbu',
    AGEN: '/agen',
    PANGKALAN_LPG: '/pangkalan-lpg',
    SPBE: '/spbe',
    
    // BBM endpoints
    JENIS_BBM: '/jenis-bbm',
    REALISASI_BULANAN_LPG: '/realisasi-bulanan-lpg',
    REALISASI_BULANAN_BBM: '/realisasi-bulanan-bbm'
  }
};
  console.log("API BASE URL:", API_CONFIG.BASE_URL);

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Mock data for development when backend is not available
export const MOCK_DATA = {
  locations: {
    markets: [
      {
        id: 1,
        name: "Pasar Sentral Makassar",
        address: "Jl. Veteran Selatan No.1, Makassar",
        latitude: -5.1477,
        longitude: 119.4327,
        type: "market"
      },
      {
        id: 2,
        name: "Pasar Terong",
        address: "Jl. Terong Raya, Makassar",
        latitude: -5.1285,
        longitude: 119.4224,
        type: "market"
      }
    ],
    spbu: [
      {
        id: 1,
        name: "SPBU Hertasning",
        address: "Jl. Hertasning Raya, Makassar",
        latitude: -5.1234,
        longitude: 119.4567,
        type: "spbu"
      }
    ],
    agen: [
      {
        id: 1,
        name: "Agen LPG Makassar",
        address: "Jl. Perintis Kemerdekaan, Makassar",
        latitude: -5.1456,
        longitude: 119.4123,
        type: "agen"
      }
    ],
    pangkalanLpg: [
      {
        id: 1,
        name: "Pangkalan LPG Antang",
        address: "Jl. Antang Raya, Makassar",
        latitude: -5.1678,
        longitude: 119.4789,
        type: "pangkalan_lpg"
      }
    ],
    spbe: [
      {
        id: 1,
        name: "SPBE Makassar",
        address: "Jl. AP Pettarani, Makassar",
        latitude: -5.1345,
        longitude: 119.4234,
        type: "spbe"
      }
    ]
  },
  markets: [
    {
      id: 1,
      nama_pasar: "Pasar Sentral Makassar",
      alamat: "Jl. Veteran Selatan No.1, Makassar"
    },
    {
      id: 2,
      nama_pasar: "Pasar Terong",
      alamat: "Jl. Terong Raya, Makassar"
    }
  ],
  prices: [
    {
      id: 1,
      harga: 15000,
      tanggal_harga: new Date().toISOString(),
      barangPasar: {
        barang: {
          namaBarang: "Beras Premium"
        }
      }
    },
    {
      id: 2,
      harga: 25000,
      tanggal_harga: new Date().toISOString(),
      barangPasar: {
        barang: {
          namaBarang: "Gula Pasir"
        }
      }
    }
  ]
};

// Development mode check
export const isDevelopment = import.meta.env.DEV;

// API status check
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000
    } as any);
    return response.ok;
  } catch (error) {
    console.warn('Backend API not available, using mock data');
    return false;
  }
};
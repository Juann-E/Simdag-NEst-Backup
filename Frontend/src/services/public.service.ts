import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Configure axios defaults
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface ChartData {
  month: string;
  [key: string]: any;
}

interface ChartLine {
  key: string;
  color: string;
}

interface ChartResponse {
  chartData: ChartData[];
  chartLines: ChartLine[];
  year: number;
}

export const publicService = {
  // Chart data services
  getLpgChartData: async (year?: number, agenId?: number): Promise<ChartResponse> => {
    const params: any = {};
    if (year) params.year = year.toString();
    if (agenId) params.agenId = agenId.toString();
    const response = await axios.get(`${API_BASE_URL}/public/lpg-chart-data`, { params });
    return response.data;
  },

  getBbmChartData: async (year?: number, spbuId?: number): Promise<ChartResponse> => {
    const params: any = {};
    if (year) params.year = year.toString();
    if (spbuId) params.spbuId = spbuId.toString();
    const response = await axios.get(`${API_BASE_URL}/public/bbm-chart-data`, { params });
    return response.data;
  },

  // Existing public services
  getMarkets: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/markets`);
    return response.data;
  },

  getItems: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/items`);
    return response.data;
  },

  getPrices: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/prices/all`);
    return response.data;
  },

  getChartData: async (itemId?: string, marketId?: string) => {
    const params: any = {};
    if (itemId) params.itemId = itemId;
    if (marketId) params.marketId = marketId;
    
    const response = await axios.get(`${API_BASE_URL}/public/chart-data`, { params });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/dashboard-stats`);
    return response.data;
  },

  getStockPanganStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/stock-pangan-stats`);
    return response.data;
  },

  getStockPanganChartData: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/stock-pangan-chart-data`);
    return response.data;
  },

  // Location services
  getKecamatan: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/kecamatan`);
    return response.data;
  },

  getKelurahan: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/kelurahan`);
    return response.data;
  },

  // SPBU LPG services
  getSpbu: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/spbu`);
    return response.data;
  },

  getAgen: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/agen`);
    return response.data;
  },

  getPangkalanLpg: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/pangkalan-lpg`);
    return response.data;
  },

  getSpbe: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/spbe`);
    return response.data;
  },

  // Distributor services
  getDistributor: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/distributor`);
    return response.data;
  },

  // Realisasi services
  getRealisasiBulananLpg: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/realisasi-bulanan-lpg`);
    return response.data;
  },

  getRealisasiBulananLpgByAgen: async (agenId: number) => {
    const response = await axios.get(`${API_BASE_URL}/public/realisasi-bulanan-lpg/agen/${agenId}`);
    return response.data;
  },

  getRealisasiBulananBbm: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/realisasi-bulanan-bbm`);
    return response.data;
  },

  getRealisasiBulananBbmBySpbu: async (spbuId: number) => {
    const response = await axios.get(`${API_BASE_URL}/public/realisasi-bulanan-bbm/spbu/${spbuId}`);
    return response.data;
  },

  // Jenis BBM services
  getJenisBbm: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/jenis-bbm`);
    return response.data;
  }
};

export default publicService;
import axios, { type AxiosResponse } from 'axios';
import { API_CONFIG, MOCK_DATA, isDevelopment } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API call wrapper with fallback to mock data
export const apiCall = async <T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: any;
    params?: any;
    useMockOnError?: boolean;
    mockData?: T;
  } = {}
): Promise<T> => {
  const { method = 'GET', data, params, useMockOnError = true, mockData } = options;

  try {
    const response: AxiosResponse<T> = await apiClient({
      url: endpoint,
      method,
      data,
      params
    });
    return response.data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    
    // In development mode or when explicitly requested, use mock data
    if (useMockOnError && (isDevelopment || mockData)) {
      console.warn(`Using mock data for ${endpoint}`);
      return mockData || getMockDataForEndpoint<T>(endpoint);
    }
    
    throw error;
  }
};

// Get mock data based on endpoint
function getMockDataForEndpoint<T>(endpoint: string): T {
  const endpointMap: { [key: string]: any } = {
    '/public/locations': MOCK_DATA.locations,
    '/public/markets': MOCK_DATA.markets,
    '/public/prices/all': MOCK_DATA.prices,
    '/nama-pasar': MOCK_DATA.markets,
    '/harga-barang-pasar': MOCK_DATA.prices,
    '/spbu': MOCK_DATA.locations.spbu,
    '/agen': MOCK_DATA.locations.agen,
    '/pangkalan-lpg': MOCK_DATA.locations.pangkalanLpg,
    '/spbe': MOCK_DATA.locations.spbe,
    '/kecamatan': [
      { id_kecamatan: 1, nama_kecamatan: 'Makassar' },
      { id_kecamatan: 2, nama_kecamatan: 'Rappocini' }
    ],
    '/kelurahan': [
      { id_kelurahan: 1, nama_kelurahan: 'Wajo', id_kecamatan: 1 },
      { id_kelurahan: 2, nama_kelurahan: 'Rappocini', id_kecamatan: 2 }
    ],
    '/nama-barang': [
      { id: 1, namaBarang: 'Beras Premium', satuan: { idSatuan: 1, satuanBarang: 'kg' } },
      { id: 2, namaBarang: 'Gula Pasir', satuan: { idSatuan: 1, satuanBarang: 'kg' } }
    ],
    '/satuan-barang': [
      { idSatuan: 1, satuanBarang: 'kg' },
      { idSatuan: 2, satuanBarang: 'liter' }
    ]
  };

  return endpointMap[endpoint] || [] as T;
}

// Specific API functions
export const fetchLocations = () => apiCall('/public/locations');
export const fetchMarkets = () => apiCall('/public/markets');
export const fetchPrices = () => apiCall('/public/prices/all');

// Auth API
export const login = (credentials: { username: string; password: string }) => 
  apiCall('/auth/login', { method: 'POST', data: credentials, useMockOnError: false });

// Admin API functions
export const fetchNamaPasar = () => apiCall('/nama-pasar');
export const fetchNamaBarang = () => apiCall('/nama-barang');
export const fetchSatuanBarang = () => apiCall('/satuan-barang');
export const fetchHargaBarangPasar = () => apiCall('/harga-barang-pasar');

// Location API functions
export const fetchKecamatan = () => apiCall('/kecamatan');
export const fetchKelurahan = (id_kecamatan?: number) => 
  apiCall('/kelurahan', { params: id_kecamatan ? { id_kecamatan } : undefined });

// SPBU LPG API functions
export const fetchSpbu = () => apiCall('/spbu');
export const fetchAgen = () => apiCall('/agen');
export const fetchPangkalanLpg = () => apiCall('/pangkalan-lpg');
export const fetchSpbe = () => apiCall('/spbe');

// Generic CRUD operations
export const createItem = <T>(endpoint: string, data: any) => 
  apiCall<T>(endpoint, { method: 'POST', data, useMockOnError: false });

export const updateItem = <T>(endpoint: string, id: number, data: any) => 
  apiCall<T>(`${endpoint}/${id}`, { method: 'PATCH', data, useMockOnError: false });

export const deleteItem = (endpoint: string, id: number) => 
  apiCall(`${endpoint}/${id}`, { method: 'DELETE', useMockOnError: false });

export default apiClient;
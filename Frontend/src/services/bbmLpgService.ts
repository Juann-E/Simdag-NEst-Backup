// src/services/bbmLpgService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Interfaces
export interface JenisBbm {
  id_jenis_bbm: number;
  jenis_bbm: string;
  keterangan?: string;
}

export interface CreateJenisBbmDto {
  jenis_bbm: string;
  keterangan?: string;
}

export interface RealisasiBulananLpg {
  id_realisasi_lpg: number;
  id_agen: number;
  periode: string;
  realisasi_tabung: number;
  agen?: {
    id_agen: number;
    nama_agen: string;
    kecamatan?: {
      nama_kecamatan: string;
    };
    kelurahan?: {
      nama_kelurahan: string;
    };
  };
}

export interface CreateRealisasiBulananLpgDto {
  id_agen: number;
  bulan: number;
  tahun: number;
  realisasi_tabung: number;
}

export interface RealisasiBulananBbm {
  id_realisasi_bbm: number;
  bulan: string;
  tahun: string;
  realisasi_liter: number;
  spbu?: {
    id_spbu: number;
    nama_usaha: string;
    no_spbu: string;
    alamat: string;
    telepon?: string;
    penanggung_jawab: string;
  };
  jenisBbm?: {
    id_jenis_bbm: number;
    jenis_bbm: string;
    keterangan?: string;
  };
}

export interface RealisasiBulananBbmDetail {
  id_detail: number;
  id_realisasi_bbm: number;
  bulan: number;
  tahun: number;
  id_jenis_bbm: number;
  realisasi_liter: number;
  created_at: string;
  updated_at: string;
  jenisBbm?: {
    id_jenis_bbm: number;
    jenis_bbm: string;
    keterangan?: string;
  };
}

export interface CreateRealisasiBulananBbmDto {
  id_spbu: number;
  id_jenis_bbm: number;
  bulan: string;
  tahun: string;
  realisasi_liter: number;
}

export interface CreateRealisasiBulananBbmDetailDto {
  id_realisasi_bbm: number;
  bulan: number;
  tahun: number;
  id_jenis_bbm: number;
  realisasi_liter: number;
}

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Create axios instance with auth header
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Jenis BBM Services
export const jenisBbmService = {
  // Get all jenis BBM
  getAll: async (): Promise<JenisBbm[]> => {
    const response = await axios.get(`${API_BASE_URL}/jenis-bbm`, createAuthHeaders());
    return response.data;
  },

  // Get jenis BBM by ID
  getById: async (id: number): Promise<JenisBbm> => {
    const response = await axios.get(`${API_BASE_URL}/jenis-bbm/${id}`, createAuthHeaders());
    return response.data;
  },

  // Create new jenis BBM
  create: async (data: CreateJenisBbmDto): Promise<JenisBbm> => {
    const response = await axios.post(`${API_BASE_URL}/jenis-bbm`, data, createAuthHeaders());
    return response.data;
  },

  // Update jenis BBM
  update: async (id: number, data: Partial<CreateJenisBbmDto>): Promise<JenisBbm> => {
    const response = await axios.patch(`${API_BASE_URL}/jenis-bbm/${id}`, data, createAuthHeaders());
    return response.data;
  },

  // Delete jenis BBM
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/jenis-bbm/${id}`, createAuthHeaders());
  },
};

// Realisasi Bulanan LPG Services
export const realisasiBulananLpgService = {
  // Get all realisasi LPG
  getAll: async (): Promise<RealisasiBulananLpg[]> => {
    const response = await axios.get(`${API_BASE_URL}/public/realisasi-bulanan-lpg`);
    return response.data;
  },

  // Get realisasi LPG by ID
  getById: async (id: number): Promise<RealisasiBulananLpg> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-lpg/${id}`, createAuthHeaders());
    return response.data;
  },

  // Get realisasi LPG by agen
  getByAgen: async (id_agen: number): Promise<RealisasiBulananLpg[]> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-lpg?id_agen=${id_agen}`, createAuthHeaders());
    return response.data;
  },

  // Get realisasi LPG by month and year
  getByMonth: async (year: number, month: number): Promise<RealisasiBulananLpg[]> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-lpg?year=${year}&month=${month}`, createAuthHeaders());
    return response.data;
  },

  // Create new realisasi LPG
  create: async (data: CreateRealisasiBulananLpgDto): Promise<RealisasiBulananLpg> => {
    const response = await axios.post(`${API_BASE_URL}/realisasi-bulanan-lpg`, data, createAuthHeaders());
    return response.data;
  },

  // Update realisasi LPG
  update: async (id: number, data: Partial<CreateRealisasiBulananLpgDto>): Promise<RealisasiBulananLpg> => {
    const response = await axios.patch(`${API_BASE_URL}/realisasi-bulanan-lpg/${id}`, data, createAuthHeaders());
    return response.data;
  },

  // Delete realisasi LPG
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/realisasi-bulanan-lpg/${id}`, createAuthHeaders());
  },
};

// SPBU Services
export const spbuService = {
  // Get all SPBU
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/public/spbu`);
    return response.data;
  },
};

// Realisasi Bulanan BBM Services
export const realisasiBulananBbmService = {
  // Get all realisasi BBM
  getAll: async (): Promise<RealisasiBulananBbm[]> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-bbm`, createAuthHeaders());
    return response.data;
  },

  // Get realisasi BBM by ID
  getById: async (id: number): Promise<RealisasiBulananBbm> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-bbm/${id}`, createAuthHeaders());
    return response.data;
  },

  // Get realisasi BBM by SPBU
  getBySpbu: async (id_spbu: number): Promise<RealisasiBulananBbm | null> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-bbm/spbu/${id_spbu}`, createAuthHeaders());
    return response.data;
  },

  // Create new realisasi BBM
  create: async (data: CreateRealisasiBulananBbmDto): Promise<RealisasiBulananBbm> => {
    const response = await axios.post(`${API_BASE_URL}/realisasi-bulanan-bbm`, data, createAuthHeaders());
    return response.data;
  },

  // Update realisasi BBM
  update: async (id: number, data: Partial<CreateRealisasiBulananBbmDto>): Promise<RealisasiBulananBbm> => {
    const response = await axios.patch(`${API_BASE_URL}/realisasi-bulanan-bbm/${id}`, data, createAuthHeaders());
    return response.data;
  },

  // Delete realisasi BBM
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/realisasi-bulanan-bbm/${id}`, createAuthHeaders());
  },

  // Detail services
  getDetails: async (id_realisasi: number): Promise<RealisasiBulananBbmDetail[]> => {
    const response = await axios.get(`${API_BASE_URL}/realisasi-bulanan-bbm/detail/${id_realisasi}`, createAuthHeaders());
    return response.data;
  },

  createDetail: async (data: CreateRealisasiBulananBbmDetailDto): Promise<RealisasiBulananBbmDetail> => {
    const response = await axios.post(`${API_BASE_URL}/realisasi-bulanan-bbm/detail`, data, createAuthHeaders());
    return response.data;
  },

  updateDetail: async (id: number, data: Partial<CreateRealisasiBulananBbmDetailDto>): Promise<RealisasiBulananBbmDetail> => {
    const response = await axios.patch(`${API_BASE_URL}/realisasi-bulanan-bbm/detail/${id}`, data, createAuthHeaders());
    return response.data;
  },

  deleteDetail: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/realisasi-bulanan-bbm/detail/${id}`, createAuthHeaders());
  },
};
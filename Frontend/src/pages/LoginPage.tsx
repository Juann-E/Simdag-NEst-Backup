// src/pages/LoginPage.tsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowLeft, BarChart3 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Menggunakan detail API yang Anda berikan
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: username,
        password: password,
      });

      // Mengambil 'access_token' sesuai respons backend
      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem('accessToken', access_token);
        // Arahkan ke halaman utama/dashboard setelah login
        navigate('/admin/dashboard'); 
      } else {
        setError("Username atau Password Salah, Coba lagi.");
      }

    } catch (err) {
      // Menangani pesan error dari backend
      if (axios.isAxiosError(err) && err.response) {
        // Menangani error seperti 'Invalid credentials' atau pesan validasi
        const errorMessage = err.response.data.error || (Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : 'Terjadi kesalahan');
        setError(errorMessage);
      } else {
        setError('Tidak dapat terhubung ke server. Coba lagi nanti.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-blue-600">SIMDAG</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Login Admin</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-sm text-center text-red-500 font-medium">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 hover:underline">
                <ArrowLeft size={14} />
                Kembali ke Beranda
            </Link>
        </div>
      </div>
    </div>
  );
}
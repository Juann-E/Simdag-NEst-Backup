// src/pages/TentangPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, Award, ChartColumn, Building, Eye, Heart } from 'lucide-react';
import TeamModal from '../components/TeamModal';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface TeamPhoto {
  id: number;
  member_id: string;
  name: string;
  position: string;
  category: string;
  nip?: string;
  photo: string;
  responsibilities?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type SubMenuType = 'tentang' | 'tugas-fungsi' | 'visi-misi' | 'team';

export default function TentangPage() {
  const [activeSubmenu, setActiveSubmenu] = useState<SubMenuType>('tentang');
  const [teamPhotos, setTeamPhotos] = useState<{[key: string]: string}>({});
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeamPhotos = async () => {
    try {
      const response = await axios.get<TeamPhoto[]>(`${API_BASE_URL}/public/team-photos/active`);
      const photosMap: {[key: string]: string} = {};
      response.data.forEach(photo => {
        photosMap[photo.member_id] = `${API_BASE_URL}${photo.photo}`;
      });
      setTeamPhotos(photosMap);
    } catch (error) {
      console.error('Error fetching team photos:', error);
      // Fallback to localStorage if API fails
      const savedPhotos = localStorage.getItem('teamPhotos');
      if (savedPhotos) {
        setTeamPhotos(JSON.parse(savedPhotos));
      }
    }
  };

  useEffect(() => {
    fetchTeamPhotos();
  }, []);

  // Reload photos when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTeamPhotos();
      }
    };

    const handleFocus = () => {
      fetchTeamPhotos();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Refresh photos when submenu changes
  useEffect(() => {
    if (activeSubmenu === 'team') {
      fetchTeamPhotos();
    }
  }, [activeSubmenu]);

  const submenuItems = [
    { id: 'tentang' as SubMenuType, label: 'Tentang', icon: ChartColumn },
    { id: 'tugas-fungsi' as SubMenuType, label: 'Tugas dan Fungsi', icon: Building },
    { id: 'visi-misi' as SubMenuType, label: 'Visi & Misi', icon: Eye },
    { id: 'team' as SubMenuType, label: 'Team', icon: Users }
  ];

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'tentang':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChartColumn className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Tentang <span className="text-blue-600">SIMDAG SALATIGA</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Sistem Informasi Perdagangan Salatiga yang membantu memantau dan mengelola data perdagangan secara efisien
              </p>
            </div>

            {/* About SIMDAG */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Apa itu SIMDAG?</h2>
              </div>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="mb-4">
                  <strong>SIMDAG (Sistem Informasi Perdagangan)</strong> adalah platform digital yang dirancang untuk membantu 
                  Dinas Perdagangan Kota Salatiga dalam memantau, mengelola, dan menganalisis data perdagangan 
                  di wilayah Kota Salatiga.
                </p>
                <p className="mb-4">
                  Sistem ini menyediakan berbagai fitur untuk mengelola data komoditas, harga pasar, stok pangan, 
                  serta lokasi-lokasi strategis seperti SPBU, SPBE, Agen, dan Pangkalan LPG yang ada di Kota Salatiga.
                </p>
                <p className="mb-4">
                  Dengan SIMDAG, masyarakat dapat dengan mudah memantau informasi harga komoditas terkini, 
                  lokasi fasilitas perdagangan, serta data statistik perdagangan yang transparan dan akurat.
                </p>
                <p>
                  Platform ini juga membantu pemerintah daerah dalam pengambilan keputusan strategis 
                  untuk meningkatkan kesejahteraan masyarakat melalui sektor perdagangan yang lebih baik.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Fitur Utama</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Monitoring Harga Pasar</h3>
                      <p className="text-gray-600 text-sm">Pantau harga komoditas terkini di berbagai pasar tradisional Kota Salatiga</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Manajemen Stok Pangan</h3>
                      <p className="text-gray-600 text-sm">Kelola dan pantau data stok komoditas pangan strategis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Peta Interaktif</h3>
                      <p className="text-gray-600 text-sm">Visualisasi lokasi SPBU, SPBE, Agen, dan Pangkalan LPG</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Statistik Perdagangan</h3>
                      <p className="text-gray-600 text-sm">Grafik dan chart interaktif untuk analisis data perdagangan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Laporan Komprehensif</h3>
                      <p className="text-gray-600 text-sm">Generate laporan dalam format Excel, PDF, dan Word</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Akses Publik</h3>
                      <p className="text-gray-600 text-sm">Informasi transparan yang dapat diakses oleh masyarakat</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tugas-fungsi':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Tugas dan <span className="text-green-600">Fungsi</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Berdasarkan Peraturan Walikota Salatiga Nomor 23 Tahun 2024
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Tugas Pokok</h2>
              </div>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  Berdasarkan Peraturan Walikota Salatiga Nomor 23 Tahun 2024 tentang Organisasi dan Tata Kerja 
                  Dinas Perdagangan Kota Salatiga, Dinas Perdagangan mempunyai tugas melaksanakan urusan pemerintahan 
                  bidang Perdagangan yang menjadi kewenangan Daerah serta tugas pembantuan yang diberikan kepada Daerah.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Fungsi Dinas</h2>
              </div>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-gray-800 mb-6">
                  Dinas dalam melaksanakan tugas menyelenggarakan fungsi:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Perumusan Kebijakan Bidang Perdagangan</h3>
                      <p className="text-gray-600">Menyusun dan merumuskan kebijakan strategis dalam bidang perdagangan untuk mendukung perekonomian daerah.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Pelaksanaan Kebijakan Bidang Perdagangan</h3>
                      <p className="text-gray-600">Mengimplementasikan kebijakan perdagangan yang telah ditetapkan untuk mencapai tujuan pembangunan ekonomi.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Pelaksanaan Evaluasi dan Pelaporan Bidang Perdagangan</h3>
                      <p className="text-gray-600">Melakukan monitoring, evaluasi, dan pelaporan terhadap pelaksanaan program dan kegiatan perdagangan.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Pelaksanaan Administrasi Dinas</h3>
                      <p className="text-gray-600">Menyelenggarakan kegiatan administrasi umum, kepegawaian, keuangan, dan ketatausahaan dinas.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Pelaksanaan Fungsi Lain</h3>
                      <p className="text-gray-600">Melaksanakan fungsi lain yang diberikan oleh Walikota terkait dengan tugas dan fungsinya.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'visi-misi':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Eye className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Visi & <span className="text-purple-600">Misi</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Komitmen Dinas Perdagangan Kota Salatiga untuk Melayani Masyarakat
              </p>
            </div>

            {/* Visi */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold">VISI</h2>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold leading-relaxed">
                  TERWUJUDNYA PELAYANAN PERDAGANGAN YANG BERKUALITAS UNTUK KESEJAHTERAAN MASYARAKAT
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">MISI</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">MENINGKATKAN KUALITAS LAYANAN</h3>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">MENINGKATKAN SUMBER DAYA MANUSIA LAYANAN</h3>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">MENINGKATKAN INOVASI LAYANAN</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Motto */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">MOTTO</h2>
              </div>
              <div className="text-center bg-purple-50 rounded-xl p-6">
                <p className="text-xl font-bold text-purple-800 mb-2">
                  KAMI "SIAP" MELAYANI
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <p className="font-semibold text-purple-800">SMART</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">I</span>
                    </div>
                    <p className="font-semibold text-purple-800">INNOVATIVE</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <p className="font-semibold text-purple-800">ACCOUNTABLE</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">P</span>
                    </div>
                    <p className="font-semibold text-purple-800">PROFESIONAL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maklumat */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">MAKLUMAT</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  DENGAN INI MENYATAKAN SANGGUP MENYELENGGARAKAN PELAYANAN SESUAI DENGAN STANDAR PELAYANAN 
                  YANG TELAH DITETAPKAN DAN AKAN MELAKUKAN PERBAIKAN SECARA TERUS MENERUS UNTUK DAPAT 
                  MEMBERIKAN JAMINAN PELAYANAN YANG LEBIH BAIK
                </p>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Tim <span className="text-orange-600">SIMDAG</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Tim Pengelola Inovasi dan Pengembang SIMDAG Salatiga
              </p>
            </div>

            {/* Tim Pengelola Inovasi */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Tim Pengelola Inovasi Dinas Perdagangan</h2>
              </div>
              
              {/* Penanggung Jawab */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Penanggung Jawab
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                       name: 'Agung Pitoyo, A.P., M.M.',
                       position: 'Plt. Kepala Dinas',
                       rank: 'Pembina Tingkat I (IV/b)',
                       photo: teamPhotos['agung-pitoyo'],
                       responsibilities: [
                         'Memutuskan ide inovasi',
                         'Memastikan inovasi berjalan sesuai tujuan',
                         'Memberikan arahan strategis pengembangan SIMDAG',
                         'Mengawasi implementasi kebijakan perdagangan'
                       ],
                       education: 'S2 Magister Manajemen, S1 Administrasi Pertanian',
                       experience: '15+ tahun di bidang pemerintahan dan perdagangan',
                       kategori: 'dinas'
                     });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['agung-pitoyo'] ? (
                          <img src={teamPhotos['agung-pitoyo']} alt="Agung Pitoyo" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Agung Pitoyo, A.P., M.M.</h4>
                        <p className="text-sm text-gray-600">Pembina Tingkat I (IV/b)</p>
                        <p className="text-sm text-orange-600 font-medium">Plt. Kepala Dinas</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">• Memutuskan ide inovasi</p>
                      <p>• Memastikan inovasi berjalan sesuai tujuan</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                       name: 'Inna Kartikasari, S.Pt, M.M.',
                       position: 'Sekretaris Dinas',
                       rank: 'Pembina (IV/a)',
                       photo: teamPhotos['inna-kartikasari'],
                       responsibilities: [
                         'Memutuskan ide inovasi',
                         'Memastikan inovasi berjalan sesuai tujuan',
                         'Koordinasi administrasi dinas',
                         'Pengawasan pelaksanaan program'
                       ],
                       education: 'S2 Magister Manajemen, S1 Peternakan',
                       experience: '12+ tahun di bidang administrasi pemerintahan',
                       kategori: 'dinas'
                     });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['inna-kartikasari'] ? (
                          <img src={teamPhotos['inna-kartikasari']} alt="Inna Kartikasari" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Inna Kartikasari, S.Pt, M.M.</h4>
                        <p className="text-sm text-gray-600">Pembina (IV/a)</p>
                        <p className="text-sm text-orange-600 font-medium">Sekretaris Dinas</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">• Memutuskan ide inovasi</p>
                      <p>• Memastikan inovasi berjalan sesuai tujuan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ketua */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Ketua
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                  setSelectedMember({
                    name: 'Fajar Nugroho Adi, S.STP, M.M',
                    position: 'Plt. Kepala Bidang Perdagangan',
                    rank: 'Pembina (IV/a)',
                    photo: teamPhotos['fajar-nugroho'],
                    responsibilities: [
                      'Mengoordinir pencarian ide-ide inovasi',
                      'Mengoordinir penyiapan inovasi SIMDAG',
                      'Mengoordinir penyiapan administrasi',
                      'Mengoordinir penyiapan aplikasi',
                      'Mengoordinir pengelolaan inovasi',
                      'Monitoring dan evaluasi inovasi',
                      'Supervisi bidang perdagangan',
                      'Koordinasi dengan stakeholder eksternal'
                    ],
                    education: 'S2 Magister Manajemen, S1 Sains dan Teknologi Pangan',
                    experience: '10+ tahun di bidang perdagangan dan teknologi pangan',
                    kategori: 'dinas'
                  });
                  setIsModalOpen(true);
                }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {teamPhotos['fajar-nugroho'] ? (
                        <img src={teamPhotos['fajar-nugroho']} alt="Fajar Nugroho Adi" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fajar Nugroho Adi, S.STP, M.M</h4>
                      <p className="text-sm text-gray-600">Pembina (IV/a)</p>
                      <p className="text-sm text-orange-600 font-medium">Plt. Kepala Bidang Perdagangan</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 grid md:grid-cols-2 gap-2">
                    <p>• Mengoordinir pencarian ide-ide</p>
                    <p>• Mengoordinir penyiapan inovasi</p>
                    <p>• Mengoordinir penyiapan administrasi</p>
                    <p>• Mengoordinir penyiapan aplikasi</p>
                    <p>• Mengoordinir pengelolaan inovasi</p>
                    <p>• Monitoring dan evaluasi inovasi</p>
                  </div>
                </div>
              </div>

              {/* Sekretaris */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Sekretaris
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                  setSelectedMember({
                    name: 'Wibyca Fuisyanuar, S.T.',
                    position: 'Analis Perdagangan Ahli Muda',
                    rank: 'Penata Tingkat I (III/d)',
                    photo: teamPhotos['wibyca-fuisyanuar'],
                    responsibilities: [
                      'Menyiapkan kelengkapan administrasi inovasi',
                      'Menyusun SOP, Juklak/Juknis SIMDAG',
                      'Mendampingi pelaksanaan inovasi',
                      'Membantu mencarikan solusi kendala teknis',
                      'Analisis data perdagangan',
                      'Koordinasi dengan tim teknis'
                    ],
                    education: 'S1 Teknik',
                    experience: '8+ tahun di bidang analisis perdagangan dan teknologi',
                    kategori: 'dinas'
                  });
                  setIsModalOpen(true);
                }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {teamPhotos['wibyca-fuisyanuar'] ? (
                        <img src={teamPhotos['wibyca-fuisyanuar']} alt="Wibyca Fuisyanuar" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Wibyca Fuisyanuar, S.T.</h4>
                      <p className="text-sm text-gray-600">Penata Tingkat I (III/d)</p>
                      <p className="text-sm text-orange-600 font-medium">Analis Perdagangan Ahli Muda</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 grid md:grid-cols-2 gap-2">
                    <p>• Menyiapkan kelengkapan administrasi</p>
                    <p>• Menyusun SOP, Juklak/Juknis</p>
                    <p>• Mendampingi pelaksanaan inovasi</p>
                    <p>• Membantu mencarikan solusi kendala</p>
                  </div>
                </div>
              </div>

              {/* Tim Teknis Pelaksana */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Tim Teknis Pelaksana Inovasi
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                      name: 'Amalia Rizky Hutami, A.Md',
                      position: 'Penera Terampil',
                      rank: 'Pengatur Tingkat I (II/d)',
                      photo: teamPhotos['amalia-rizky'],
                      responsibilities: [
                        'Mengumpulkan dan memverifikasi data',
                        'Melaksanakan inovasi sesuai tujuan',
                        'Menyiapkan dokumentasi dan video',
                        'Penimbangan dan pengukuran komoditas',
                        'Kalibrasi alat ukur perdagangan'
                      ],
                      education: 'D3 (Ahli Madya)',
                      experience: '6+ tahun di bidang metrologi perdagangan',
                      kategori: 'dinas'
                    });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['amalia-rizky'] ? (
                          <img src={teamPhotos['amalia-rizky']} alt="Amalia Rizky Hutami" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Amalia Rizky Hutami, A.Md</h4>
                        <p className="text-xs text-gray-600">Pengatur Tingkat I (II/d)</p>
                        <p className="text-xs text-orange-600 font-medium">Penera Terampil</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                      name: 'Priska Pasur Wulansari, S.Si',
                      position: 'Penera Pertama',
                      rank: 'Penata Muda Tingkat 1 (III/b)',
                      photo: teamPhotos['priska-pasur'],
                      responsibilities: [
                        'Mengumpulkan dan memverifikasi data',
                        'Melaksanakan inovasi sesuai tujuan',
                        'Menyiapkan dokumentasi dan video',
                        'Analisis data metrologi',
                        'Pengawasan alat ukur perdagangan'
                      ],
                      education: 'S1 Sains',
                      experience: '5+ tahun di bidang metrologi dan sains',
                      kategori: 'dinas'
                    });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['priska-pasur'] ? (
                          <img src={teamPhotos['priska-pasur']} alt="Priska Pasur Wulansari" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Priska Pasur Wulansari, S.Si</h4>
                        <p className="text-xs text-gray-600">Penata Muda Tingkat 1 (III/b)</p>
                        <p className="text-xs text-orange-600 font-medium">Penera Pertama</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                      name: 'Ardian Prasetyo, S.Kom',
                      position: 'Penera Terampil',
                      rank: 'Pengatur Tingkat I (II/d)',
                      photo: teamPhotos['ardian-prasetyo'],
                      responsibilities: [
                        'Mengumpulkan dan memverifikasi data',
                        'Melaksanakan inovasi sesuai tujuan',
                        'Menyiapkan dokumentasi dan video',
                        'Dukungan teknis IT untuk SIMDAG',
                        'Maintenance sistem dan database'
                      ],
                      education: 'S1 Komputer',
                      experience: '7+ tahun di bidang IT dan metrologi',
                      kategori: 'dinas'
                    });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['ardian-prasetyo'] ? (
                          <img src={teamPhotos['ardian-prasetyo']} alt="Ardian Prasetyo" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Ardian Prasetyo, S.Kom</h4>
                        <p className="text-xs text-gray-600">Pengatur Tingkat I (II/d)</p>
                        <p className="text-xs text-orange-600 font-medium">Penera Terampil</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                      name: 'Zati Wulandari, A.Md',
                      position: 'Pengolah Data dan Informasi',
                      rank: 'Pengatur Tingkat I (II/d)',
                      photo: teamPhotos['zati-wulandari'],
                      responsibilities: [
                        'Mengumpulkan dan memverifikasi data',
                        'Melaksanakan inovasi sesuai tujuan',
                        'Menyiapkan dokumentasi dan video',
                        'Pengolahan data perdagangan',
                        'Analisis informasi pasar'
                      ],
                      education: 'D3 (Ahli Madya)',
                      experience: '8+ tahun di bidang pengolahan data',
                      kategori: 'dinas'
                    });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['zati-wulandari'] ? (
                          <img src={teamPhotos['zati-wulandari']} alt="Zati Wulandari" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Zati Wulandari, A.Md</h4>
                        <p className="text-xs text-gray-600">Pengatur Tingkat I (II/d)</p>
                        <p className="text-xs text-orange-600 font-medium">Pengolah Data dan Informasi</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => {
                    setSelectedMember({
                      name: 'Sarjiyana',
                      position: 'Pengadministrasi Perkantoran',
                      rank: 'Penata Muda (III/a)',
                      photo: teamPhotos['sarjiyana'],
                      responsibilities: [
                        'Mengumpulkan, memverifikasi, dan memastikan kesiapan data dukung inovasi',
                        'Melaksanakan inovasi sesuai dengan tujuan yang telah ditetapkan',
                        'Menyiapkan video dan/atau dokumentasi lainnya guna pemenuhan data dukung penilaian inovasi'
                      ],
                      education: 'SMA/Sederajat',
                      experience: '10+ tahun di bidang administrasi perkantoran',
                      kategori: 'dinas'
                    });
                    setIsModalOpen(true);
                  }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {teamPhotos['sarjiyana'] ? (
                          <img src={teamPhotos['sarjiyana']} alt="Sarjiyana" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Sarjiyana</h4>
                        <p className="text-xs text-gray-600">Penata Muda (III/a)</p>
                        <p className="text-xs text-orange-600 font-medium">Pengadministrasi Perkantoran</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Tugas Tim Teknis:</h4>
                  <div className="text-sm text-purple-700 grid md:grid-cols-3 gap-2">
                    <p>• Mengumpulkan dan memverifikasi data</p>
                    <p>• Melaksanakan inovasi sesuai tujuan</p>
                    <p>• Menyiapkan dokumentasi dan video</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tim Pengembang */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold">Tim Pengembang SIMDAG</h2>
              </div>
              <p className="text-orange-100 mb-6">
                SIMDAG dikembangkan oleh tim yang berdedikasi untuk menciptakan solusi teknologi 
                yang dapat membantu meningkatkan efisiensi dalam sektor perdagangan.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center cursor-pointer hover:bg-white/10 p-4 rounded-lg transition-colors" onClick={() => {
                  setSelectedMember({
                    name: 'Aryanto Harry Wibowo SH.',
                    position: 'Full Stack Developer',
                    rank: 'Lead Developer',
                    photo: teamPhotos['bowo-bisma'],
                    responsibilities: [
                      'Arsitektur sistem SIMDAG',
                      'Pengembangan backend dan frontend',
                      'Koordinasi tim pengembang',
                      'Code review dan quality assurance',
                      'Deployment dan maintenance sistem',
                      'Integrasi dengan sistem eksternal'
                    ],
                    education: 'S1 Teknik Informatika',
                    experience: '5+ tahun pengembangan web aplikasi',
                    kategori: 'pengembang'
                  });
                  setIsModalOpen(true);
                }}>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {teamPhotos['bowo-bisma'] ? (
                      <img src={teamPhotos['bowo-bisma']} alt="Aryanto Harry Wibowo SH." className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Aryanto Harry Wibowo SH.</h3>
                  <p className="text-orange-200 text-sm">Full Stack Developer</p>
                </div>
                <div className="text-center cursor-pointer hover:bg-white/10 p-4 rounded-lg transition-colors" onClick={() => {
                  setSelectedMember({
                    name: 'Rangga Prawiro Utomo',
                    position: 'Full Stack Developer',
                    rank: 'UI/UX Developer',
                    photo: teamPhotos['rangga-prawiro'],
                    responsibilities: [
                      'Pengembangan API dan database',
                      'Optimasi performa backend',
                      'Keamanan sistem dan data',
                      'Integrasi dengan database',
                      'Dokumentasi teknis API',
                      'Testing dan debugging backend'
                    ],
                    education: 'S1 Sistem Informasi',
                    experience: '4+ tahun pengembangan backend',
                    kategori: 'pengembang'
                  });
                  setIsModalOpen(true);
                }}>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {teamPhotos['rangga-prawiro'] ? (
                      <img src={teamPhotos['rangga-prawiro']} alt="Rangga Prawiro Utomo" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Rangga Prawiro Utomo</h3>
                  <p className="text-orange-200 text-sm">Full Stack Developer</p>
                </div>
                <div className="text-center cursor-pointer hover:bg-white/10 p-4 rounded-lg transition-colors" onClick={() => {
                  setSelectedMember({
                    name: 'Juannito Eriyadi',
                    position: 'Backend Developer',
                    rank: 'Full Stack Developer',
                    photo: teamPhotos['juanito-eriyadi'],
                    responsibilities: [
                      'Pengembangan antarmuka pengguna',
                      'Implementasi desain responsif',
                      'Optimasi user experience',
                      'Integrasi frontend dengan API',
                      'Testing compatibility browser',
                      'Maintenance dan update UI'
                    ],
                    education: 'S1 Desain Komunikasi Visual',
                    experience: '3+ tahun pengembangan frontend',
                    kategori: 'pengembang'
                  });
                  setIsModalOpen(true);
                }}>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    {teamPhotos['juanito-eriyadi'] ? (
                      <img src={teamPhotos['juanito-eriyadi']} alt="Juanito Eriyadi" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Juannito Eriyadi</h3>
                  <p className="text-orange-200 text-sm">Full Stack Developer</p>
                </div>
              </div>
            </div>


          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Submenu Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {submenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubmenu(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeSubmenu === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Team Modal */}
      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
      />
    </div>
  );
}
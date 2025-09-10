// src/components/admin/settings/TeamPhotosSettings.tsx
import { useState, useEffect } from 'react';
import { Users, Upload, Trash2, Camera, AlertCircle } from 'lucide-react';
import axios from 'axios';
import PhotoModal from '../../PhotoModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  category: string;
  photo?: string;
  nip?: string;
  responsibilities?: string;
  is_active?: boolean;
}

interface TeamPhotoAPI {
  id: number;
  member_id: string;
  name: string;
  position: string;
  category: string;
  nip?: string;
  photo?: string;
  responsibilities?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  // Penanggung Jawab
  {
    id: 'agung-pitoyo',
    name: 'Agung Pitoyo, A.P., M.M.',
    position: 'Plt. Kepala Dinas',
    category: 'Penanggung Jawab'
  },
  {
    id: 'inna-kartikasari',
    name: 'Inna Kartikasari, S.Pt, M.M.',
    position: 'Sekretaris Dinas',
    category: 'Penanggung Jawab'
  },
  // Ketua
  {
    id: 'fajar-nugroho',
    name: 'Fajar Nugroho Adi, S.STP, M.M',
    position: 'Plt. Kepala Bidang Perdagangan',
    category: 'Ketua'
  },
  // Sekretaris
  {
    id: 'wibyca-fuisyanuar',
    name: 'Wibyca Fuisyanuar, S.T.',
    position: 'Analis Perdagangan Ahli Muda',
    category: 'Sekretaris'
  },
  // Tim Teknis
  {
    id: 'amalia-rizky',
    name: 'Amalia Rizky Hutami, A.Md',
    position: 'Penera Terampil',
    category: 'Tim Teknis'
  },
  {
    id: 'priska-pasur',
    name: 'Priska Pasur Wulansari, S.Si',
    position: 'Penera Pertama',
    category: 'Tim Teknis'
  },
  {
    id: 'ardian-prasetyo',
    name: 'Ardian Prasetyo, S.Kom',
    position: 'Penera Terampil',
    category: 'Tim Teknis'
  },
  {
    id: 'zati-wulandari',
    name: 'Zati Wulandari, A.Md',
    position: 'Pengolah Data dan Informasi',
    category: 'Tim Teknis'
  },
  {
    id: 'sarjiyana',
    name: 'Sarjiyana',
    position: 'Pengadministrasi Perkantoran',
    category: 'Tim Teknis'
  },
  // Tim Pengembang
  {
    id: 'bowo-bisma',
    name: 'Aryanto Harry Wibowo SH.',
    position: 'Full Stack Developer',
    category: 'Tim Pengembang'
  },
  {
    id: 'rangga-prawiro',
    name: 'Rangga Prawiro Utomo',
    position: 'Full Stack Developer',
    category: 'Tim Pengembang'
  },
  {
    id: 'juanito-eriyadi',
    name: 'Juanito Eriyadi',
    position: 'Full Stack Developer',
    category: 'Tim Pengembang'
  }
];

const CATEGORY_COLORS = {
  'Penanggung Jawab': 'bg-red-500',
  'Ketua': 'bg-blue-500',
  'Sekretaris': 'bg-green-500',
  'Tim Teknis': 'bg-purple-500',
  'Tim Pengembang': 'bg-orange-500'
};

export default function TeamPhotosSettings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{url: string, name: string} | null>(null);

  const handlePhotoClick = (photoUrl: string, memberName: string) => {
    setSelectedPhoto({ url: photoUrl, name: memberName });
    setIsPhotoModalOpen(true);
  };

  // Load team photos from backend API
  useEffect(() => {
    loadTeamPhotos();
  }, []);

  // Reload data when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadTeamPhotos();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadTeamPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/public/team-photos/active`);
      const apiPhotos: TeamPhotoAPI[] = response.data;
      
      // Merge API data with local TEAM_MEMBERS
      setTeamMembers(prev => 
        prev.map(member => {
          const apiPhoto = apiPhotos.find(p => p.member_id === member.id);
          if (apiPhoto && apiPhoto.photo) {
            const photoUrl = `${API_BASE_URL}${apiPhoto.photo}`;
            return {
              ...member,
              photo: photoUrl,
              nip: apiPhoto.nip,
              responsibilities: apiPhoto.responsibilities
            };
          }
          return member;
        })
      );
    } catch (error) {
      console.error('Error loading team photos:', error);
      setErrorMessage('Gagal memuat foto tim dari server');
    } finally {
      setLoading(false);
    }
  };

  const syncMemberToBackend = async (member: TeamMember) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setErrorMessage('Token autentikasi tidak ditemukan');
        return;
      }

      // Check if member exists in backend
      try {
        await axios.get(`${API_BASE_URL}/team-photos/member/${member.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Member exists, no need to create
      } catch (error: any) {
        if (error.response?.status === 404) {
          // Member doesn't exist, create it
          await axios.post(`${API_BASE_URL}/team-photos`, {
            member_id: member.id,
            name: member.name,
            position: member.position,
            category: member.category,
            nip: member.nip || '',
            responsibilities: member.responsibilities || '',
            is_active: true
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error syncing member to backend:', error);
      throw error;
    }
  };

  const handlePhotoUpload = async (memberId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('File harus berupa gambar (JPG, PNG, GIF, dll.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 5MB');
      return;
    }

    setUploadingId(memberId);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setErrorMessage('Token autentikasi tidak ditemukan');
        setUploadingId(null);
        return;
      }

      const member = teamMembers.find(m => m.id === memberId);
      if (!member) {
        setErrorMessage('Anggota tim tidak ditemukan');
        setUploadingId(null);
        return;
      }

      // Sync member to backend first
      await syncMemberToBackend(member);

      // Upload photo using public endpoint
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('memberName', member.name);
      formData.append('position', member.position);
      formData.append('category', member.category);
      formData.append('nip', member.nip || '');
      formData.append('responsibilities', member.responsibilities || '');
      formData.append('isActive', 'true');

      const response = await axios.patch(`${API_BASE_URL}/public/team-photos/member/${memberId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update local state with new photo URL
      const photoUrl = `${API_BASE_URL}${response.data.photo}`;
      setTeamMembers(prev => 
        prev.map(m => 
          m.id === memberId 
            ? { ...m, photo: photoUrl }
            : m
        )
      );

      setSuccessMessage(`Foto ${member.name} berhasil diupload!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reload all team photos to ensure consistency
      await loadTeamPhotos();
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setErrorMessage(error.response?.data?.message || 'Gagal mengupload foto');
    } finally {
      setUploadingId(null);
    }
  };

  const handlePhotoDelete = async (memberId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setErrorMessage('Token autentikasi tidak ditemukan');
        return;
      }

      const member = teamMembers.find(m => m.id === memberId);
      if (!member) {
        setErrorMessage('Anggota tim tidak ditemukan');
        return;
      }

      // Delete photo from backend
      await axios.delete(`${API_BASE_URL}/team-photos/member/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove photo from local state
      setTeamMembers(prev => 
        prev.map(m => 
          m.id === memberId 
            ? { ...m, photo: undefined }
            : m
        )
      );

      setSuccessMessage(`Foto ${member.name} berhasil dihapus!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      setErrorMessage(error.response?.data?.message || 'Gagal menghapus foto');
    }
  };



  const groupedMembers = teamMembers.reduce((acc, member) => {
    if (!acc[member.category]) {
      acc[member.category] = [];
    }
    acc[member.category].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  if (loading) {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <Camera className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Kelola Foto Tim</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Memuat foto tim...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Kelola Foto Tim</h2>
        </div>

      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{errorMessage}</span>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Petunjuk Upload Foto:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Format yang didukung: JPG, PNG, GIF</li>
          <li>• Ukuran maksimal: 5MB</li>
          <li>• Rekomendasi: Foto persegi (1:1) untuk hasil terbaik</li>
          <li>• Foto akan disimpan di database dan ditampilkan di halaman publik</li>
        </ul>
      </div>

      {/* Team Members by Category */}
      {Object.entries(groupedMembers).map(([category, members]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className={`w-3 h-3 ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]} rounded-full`}></div>
            {category}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-xl p-6 border">
                <div className="flex flex-col items-center">
                  {/* Photo Display */}
                  <div className="w-20 h-20 mb-4 relative">
                    {member.photo ? (
                      <div 
                        className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handlePhotoClick(member.photo!, member.name)}
                        title="Klik untuk memperbesar foto"
                      >
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    
                    {uploadingId === member.id && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <h4 className="font-semibold text-gray-900 text-center mb-1">{member.name}</h4>
                  <p className="text-sm text-gray-600 text-center mb-4">{member.position}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(member.id, e)}
                        className="hidden"
                        disabled={uploadingId === member.id}
                      />
                      <div className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        {member.photo ? 'Ganti' : 'Upload'}
                      </div>
                    </label>
                    
                    {member.photo && (
                      <button
                        onClick={() => handlePhotoDelete(member.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Catatan:</strong> Foto yang diupload akan disimpan di database server dan 
          ditampilkan di halaman publik untuk masyarakat dapat melihat struktur organisasi.
        </p>
      </div>
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setSelectedPhoto(null);
          }}
          photoUrl={selectedPhoto.url}
          altText={selectedPhoto.name}
        />
      )}
    </div>
  );
}
// src/components/TeamModal.tsx

import { useState } from 'react';
import { X, Users } from 'lucide-react';
import PhotoModal from './PhotoModal';

interface TeamMember {
  name: string;
  position: string;
  rank: string;
  photo?: string;
  responsibilities: string[];
  education?: string;
  experience?: string;
  nip?: string;
  kategori?: 'dinas' | 'pengembang';
}

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export default function TeamModal({ isOpen, onClose, member }: TeamModalProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Detail Anggota Tim</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Photo and Basic Info */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" onClick={() => member.photo && setIsPhotoModalOpen(true)}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-16 h-16 text-gray-400" />
                )}
              </div>
              {member.photo && (
                <p className="text-xs text-gray-500 text-center mt-1">Klik untuk memperbesar</p>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
              {member.nip && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">NIP:</span> {member.nip}
                </p>
              )}
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Pangkat:</span> {member.rank}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Jabatan:</span> {member.position}
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Tim Pengelola Inovasi
                </span>
              </div>
            </div>
          </div>

          {/* Tugas dan Tanggung Jawab */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Tugas dan Tanggung Jawab
            </h4>
            <ul className="space-y-2">
              {member.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori Tim */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">
              {member.kategori === 'pengembang' ? 'Tim Pengembang SIMDAG' : 'Tim Pengelola Inovasi Dinas Perdagangan Kota Salatiga'}
            </h5>
            <p className="text-sm text-blue-700">
              {member.kategori === 'pengembang' 
                ? 'Tim teknis pengembangan Sistem Informasi Manajemen Data Pangan'
                : 'Berdasarkan Peraturan Walikota Salatiga Nomor 23 Tahun 2024'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
      
      {/* Photo Modal */}
      {member.photo && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          photoUrl={member.photo}
          altText={member.name}
        />
      )}
    </div>
  );
}
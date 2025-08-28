// src/components/MapSection.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// Perbaikan untuk ikon default Leaflet yang terkadang tidak muncul
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Buat ikon dengan warna berbeda untuk setiap kategori
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

// Ikon untuk setiap kategori
const icons = {
  market: createColoredIcon('#10B981'), // Hijau
  spbu: createColoredIcon('#3B82F6'),   // Biru
  agen: createColoredIcon('#F59E0B'),   // Kuning
  pangkalan_lpg: createColoredIcon('#EF4444'), // Merah
  spbe: createColoredIcon('#8B5CF6'),   // Ungu
  distributor: createColoredIcon('#EC4899'), // Pink
};

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'market' | 'spbu' | 'agen' | 'pangkalan_lpg' | 'spbe' | 'distributor';
}

interface LocationData {
  markets: Location[];
  spbu: Location[];
  agen: Location[];
  pangkalanLpg: Location[];
  spbe: Location[];
  distributors: Location[];
}

interface MapProps {
  selectedLocation?: Location | null;
  locations?: Location[];
}

// Komponen kecil untuk mengubah pusat peta saat state berubah
function ChangeMapView({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15); // Angka 15 adalah level zoom
  }, [center, map]);

  return null;
}

export default function MapSection({ selectedLocation }: MapProps) {
  const [locations, setLocations] = useState<LocationData>({
    markets: [],
    spbu: [],
    agen: [],
    pangkalanLpg: [],
    spbe: [],
    distributors: []
  });
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState({
    market: true,
    spbu: true,
    agen: true,
    pangkalan_lpg: true,
    spbe: true,
    distributor: true
  });
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-7.3311396711663885, 110.50496997524012]);
  const [expandedCategories, setExpandedCategories] = useState({
    market: true,
    spbu: false,
    agen: false,
    pangkalan_lpg: false,
    spbe: false,
    distributor: false
  });
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const mapRef = useRef<any>(null);

  // Fetch data lokasi dari API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/public/locations');
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Tentukan posisi tengah awal
  const initialCenter: LatLngExpression = selectedLocation && selectedLocation.latitude && selectedLocation.longitude
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : [-7.3311396711663885, 110.50496997524012]; // Koordinat default

  // Gabungkan semua lokasi yang visible
  const allVisibleLocations = [
    ...(visibleCategories.market ? locations.markets : []),
    ...(visibleCategories.spbu ? locations.spbu : []),
    ...(visibleCategories.agen ? locations.agen : []),
    ...(visibleCategories.pangkalan_lpg ? locations.pangkalanLpg : []),
    ...(visibleCategories.spbe ? locations.spbe : []),
    ...(visibleCategories.distributor ? locations.distributors : [])
  ];

  const categoryLabels = {
    market: 'Pasar',
    spbu: 'SPBU',
    agen: 'Agen',
    pangkalan_lpg: 'Pangkalan LPG',
    spbe: 'SPBE',
    distributor: 'Distributor'
  };

  const toggleCategory = (category: keyof typeof visibleCategories) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleCategoryExpansion = (category: keyof typeof expandedCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleLocationClick = (location: Location) => {
    setMapCenter([location.latitude, location.longitude]);
    setSelectedMarker(location);
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
    // Delay untuk memastikan transisi selesai sebelum resize peta
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 350); // Sedikit lebih lama dari durasi transisi (300ms)
  };

  if (loading) {
    return (
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-600">Memuat peta...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[600px] bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 relative">
      {/* Tombol Toggle Filter */}
      <button
        onClick={toggleFilter}
        className="absolute top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-2 shadow-md transition-all duration-200 hover:shadow-lg"
        style={{ left: isFilterVisible ? 'calc(58.33% + 4px)' : '4px' }}
      >
        <svg 
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isFilterVisible ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Filter Kategori - Kolom Kiri */}
      <div className={`${isFilterVisible ? 'w-1/4' : 'w-0'} bg-gray-50 border-r border-gray-300 transition-all duration-300 overflow-hidden ${isFilterVisible ? 'p-4' : 'p-0'}`}>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Filter Kategori</h4>
        <div className="space-y-3">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const categoryKey = key as keyof typeof visibleCategories;
            const iconColor = {
              market: '#10B981',
              spbu: '#3B82F6',
              agen: '#F59E0B',
              pangkalan_lpg: '#EF4444',
              spbe: '#8B5CF6',
              distributor: '#EC4899'
            }[categoryKey];
            
            return (
              <label key={key} className="flex items-center space-x-3 cursor-pointer text-sm hover:bg-white hover:shadow-sm rounded-lg p-3 transition-all duration-200">
                <input
                  type="checkbox"
                  checked={visibleCategories[categoryKey]}
                  onChange={() => toggleCategory(categoryKey)}
                  className="rounded w-4 h-4"
                />
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: iconColor }}
                ></div>
                <span className="text-sm text-gray-800 font-medium">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Dropdown Konten - Kolom Tengah */}
      <div className={`${isFilterVisible ? 'w-1/3' : 'w-0'} bg-white border-r border-gray-300 h-full transition-all duration-300 overflow-hidden`}>
        <div className="p-4 space-y-4 h-full overflow-y-auto">
          
          {/* Market */}
           {visibleCategories.market && (
             <div className="mb-5">
               <button
                 onClick={() => toggleCategoryExpansion('market')}
                 className="flex items-center justify-between w-full p-4 bg-green-50 hover:bg-green-100 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 shadow-sm"></div>
                   <span className="font-semibold text-gray-800 text-sm sm:text-base">Pasar ({locations.markets.length})</span>
                 </div>
                 <svg className={`w-6 h-6 transform transition-all duration-300 ${expandedCategories.market ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {expandedCategories.market && (
                 <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                   {locations.markets.map((location) => (
                     <button
                       key={location.id}
                       onClick={() => handleLocationClick(location)}
                       className="w-full text-left p-3 hover:bg-green-50 hover:shadow-sm rounded-lg text-sm text-gray-700 border-l-4 border-green-500 ml-2 transition-all duration-200 transform hover:translate-x-1"
                     >
                       <div className="font-semibold text-gray-800">{location.name}</div>
                       <div className="text-xs text-gray-500 mt-1 leading-relaxed">{location.address}</div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}



          {/* SPBU */}
           {visibleCategories.spbu && (
             <div className="mb-5">
               <button
                 onClick={() => toggleCategoryExpansion('spbu')}
                 className="flex items-center justify-between w-full p-4 bg-blue-50 hover:bg-blue-100 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 shadow-sm"></div>
                   <span className="font-semibold text-gray-800 text-sm sm:text-base">SPBU ({locations.spbu.length})</span>
                 </div>
                 <svg className={`w-6 h-6 transform transition-all duration-300 ${expandedCategories.spbu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {expandedCategories.spbu && (
                 <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                   {locations.spbu.map((location) => (
                     <button
                       key={location.id}
                       onClick={() => handleLocationClick(location)}
                       className="w-full text-left p-3 hover:bg-blue-50 hover:shadow-sm rounded-lg text-sm text-gray-700 border-l-4 border-blue-500 ml-2 transition-all duration-200 transform hover:translate-x-1"
                     >
                       <div className="font-semibold text-gray-800">{location.name}</div>
                       <div className="text-xs text-gray-500 mt-1 leading-relaxed">{location.address}</div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}

           {/* Agen */}
           {visibleCategories.agen && (
             <div className="mb-5">
               <button
                 onClick={() => toggleCategoryExpansion('agen')}
                 className="flex items-center justify-between w-full p-4 bg-yellow-50 hover:bg-yellow-100 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-500 shadow-sm"></div>
                   <span className="font-semibold text-gray-800 text-sm sm:text-base">Agen ({locations.agen.length})</span>
                 </div>
                 <svg className={`w-6 h-6 transform transition-all duration-300 ${expandedCategories.agen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {expandedCategories.agen && (
                 <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                   {locations.agen.map((location) => (
                     <button
                       key={location.id}
                       onClick={() => handleLocationClick(location)}
                       className="w-full text-left p-3 hover:bg-yellow-50 hover:shadow-sm rounded-lg text-sm text-gray-700 border-l-4 border-yellow-500 ml-2 transition-all duration-200 transform hover:translate-x-1"
                     >
                       <div className="font-semibold text-gray-800">{location.name}</div>
                       <div className="text-xs text-gray-500 mt-1 leading-relaxed">{location.address}</div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}

           {/* Pangkalan LPG */}
           {visibleCategories.pangkalan_lpg && (
             <div className="mb-5">
               <button
                 onClick={() => toggleCategoryExpansion('pangkalan_lpg')}
                 className="flex items-center justify-between w-full p-4 bg-red-50 hover:bg-red-100 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500 shadow-sm"></div>
                   <span className="font-semibold text-gray-800 text-sm sm:text-base">Pangkalan LPG ({locations.pangkalanLpg.length})</span>
                 </div>
                 <svg className={`w-6 h-6 transform transition-all duration-300 ${expandedCategories.pangkalan_lpg ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {expandedCategories.pangkalan_lpg && (
                 <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                   {locations.pangkalanLpg.map((location) => (
                     <button
                       key={location.id}
                       onClick={() => handleLocationClick(location)}
                       className="w-full text-left p-3 hover:bg-red-50 hover:shadow-sm rounded-lg text-sm text-gray-700 border-l-4 border-red-500 ml-2 transition-all duration-200 transform hover:translate-x-1"
                     >
                       <div className="font-semibold text-gray-800">{location.name}</div>
                       <div className="text-xs text-gray-500 mt-1 leading-relaxed">{location.address}</div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}

           {/* SPBE */}
           {visibleCategories.spbe && (
             <div className="mb-5">
               <button
                 onClick={() => toggleCategoryExpansion('spbe')}
                 className="flex items-center justify-between w-full p-4 bg-purple-50 hover:bg-purple-100 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-purple-500 shadow-sm"></div>
                   <span className="font-semibold text-gray-800 text-sm sm:text-base">SPBE ({locations.spbe.length})</span>
                 </div>
                 <svg className={`w-6 h-6 transform transition-all duration-300 ${expandedCategories.spbe ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {expandedCategories.spbe && (
                 <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                   {locations.spbe.map((location) => (
                     <button
                       key={location.id}
                       onClick={() => handleLocationClick(location)}
                       className="w-full text-left p-3 hover:bg-purple-50 hover:shadow-sm rounded-lg text-sm text-gray-700 border-l-4 border-purple-500 ml-2 transition-all duration-200 transform hover:translate-x-1"
                     >
                       <div className="font-semibold text-gray-800">{location.name}</div>
                       <div className="text-xs text-gray-500 mt-1 leading-relaxed">{location.address}</div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}

           {/* Distributor */}
           {visibleCategories.distributor && (
             <div className="mb-5">
               <button
                 onClick={() => toggleCategoryExpansion('distributor')}
                 className="flex items-center justify-between w-full p-4 bg-pink-50 hover:bg-pink-100 hover:shadow-md rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 <div className="flex items-center space-x-2 sm:space-x-3">
                   <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-pink-500 shadow-sm"></div>
                   <span className="font-semibold text-gray-800 text-sm sm:text-base">Distributor ({locations.distributors.length})</span>
                 </div>
                 <svg className={`w-6 h-6 transform transition-all duration-300 ${expandedCategories.distributor ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
               {expandedCategories.distributor && (
                 <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                   {locations.distributors.map((location) => (
                     <button
                       key={location.id}
                       onClick={() => handleLocationClick(location)}
                       className="w-full text-left p-3 hover:bg-pink-50 hover:shadow-sm rounded-lg text-sm text-gray-700 border-l-4 border-pink-500 ml-2 transition-all duration-200 transform hover:translate-x-1"
                     >
                       <div className="font-semibold text-gray-800">{location.name}</div>
                       <div className="text-xs text-gray-500 mt-1 leading-relaxed">{location.address}</div>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           )}

          </div>
      </div>

      {/* Peta - Kolom Kanan */}
      <div className="flex-1 h-full relative transition-all duration-300">
        <div className="absolute inset-0 bg-gray-50 overflow-hidden">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
            className="z-10"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              errorTileUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE0Ij5UaWxlIEVycm9yPC90ZXh0Pjwvc3ZnPg=="
            />
            <ChangeMapView center={mapCenter} />
            {allVisibleLocations.map(location => {
              const isHovered = hoveredMarker?.id === location.id && hoveredMarker?.type === location.type;
              const isSelected = selectedMarker?.id === location.id && selectedMarker?.type === location.type;
              
              // Buat ikon dengan efek hover/selected
              const markerIcon = isHovered || isSelected ? 
                createColoredIcon({
                  market: '#059669', // Hijau lebih gelap
                  spbu: '#2563EB',   // Biru lebih gelap
                  agen: '#D97706',   // Kuning lebih gelap
                  pangkalan_lpg: '#DC2626', // Merah lebih gelap
                  spbe: '#7C3AED',   // Ungu lebih gelap
                  distributor: '#BE185D', // Pink lebih gelap
                }[location.type]) : icons[location.type];
              
              // Skip marker jika kategori tidak visible
              if (!visibleCategories[location.type]) {
                return null;
              }
              
              return (
                <Marker 
                  key={`${location.type}-${location.id}`} 
                  position={[location.latitude, location.longitude]}
                  icon={markerIcon}
                  eventHandlers={{
                    mouseover: () => setHoveredMarker(location),
                    mouseout: () => setHoveredMarker(null),
                    click: () => setSelectedMarker(location)
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <b>{location.name}</b><br />
                      <span className="text-sm text-gray-600">{categoryLabels[location.type]}</span><br />
                      <span className="text-sm">{location.address}</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
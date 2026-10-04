import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search, Navigation, MapPin } from 'lucide-react';

const PROVINCIAS_LIST = [
  'Todas',
  'San José',
  'Alajuela',
  'Cartago',
  'Heredia',
  'Guanacaste',
  'Puntarenas',
  'Limón'
];

// Componente interno que maneja la lógica de Places
function PlacesSearchHandler({ selectedProvince, searchQuery, onResults, activePlace }) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState(null);

  // Inicializar PlacesService
  useEffect(() => {
    if (!placesLibrary || !map) return;
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  // Ejecutar búsqueda cuando cambie la provincia o la búsqueda
  useEffect(() => {
    if (!placesService || !map) return;

    let query = "Correos de Costa Rica";
    if (searchQuery) {
      query += ` ${searchQuery}`;
    } else if (selectedProvince !== 'Todas') {
      query += ` ${selectedProvince}`;
    }

    const request = {
      query: query,
      fields: ['name', 'geometry', 'formatted_address', 'place_id']
    };

    placesService.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        onResults(results);
        
        // Centrar mapa si no hay un lugar activo seleccionado
        if (!activePlace) {
          const bounds = new window.google.maps.LatLngBounds();
          results.forEach((place) => {
            if (place.geometry?.viewport) {
              bounds.union(place.geometry.viewport);
            } else if (place.geometry?.location) {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds, 50); // padding
        }
      } else {
        onResults([]);
      }
    });
  }, [placesService, selectedProvince, searchQuery]);

  // Manejar centrado manual al seleccionar un lugar
  useEffect(() => {
    if (activePlace && map && activePlace.geometry?.location) {
      map.panTo(activePlace.geometry.location);
      map.setZoom(15);
    }
  }, [activePlace, map]);

  return null;
}

export default function GoogleMapsLocator({ onSelectBranchForAppointment }) {
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-200">
        <h3 className="text-xl font-bold mb-2">Falta API Key de Google Maps</h3>
        <p>Por favor, añade <code>VITE_GOOGLE_MAPS_API_KEY</code> a tu archivo <code>.env</code> para habilitar el mapa dinámico de sucursales.</p>
      </div>
    );
  }

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setActivePlace(null);
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // En un caso real podrías hacer una búsqueda por coordenadas
          // Aquí simulamos buscar "Correos de Costa Rica Cerca"
          setSearchQuery('Cerca de mi');
          setSelectedProvince('Todas');
          setActivePlace(null);
        },
        () => {
          alert('No se pudo obtener la ubicación.');
        }
      );
    }
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Buscador y Botones */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar sucursal (ej: Escazú)"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-azul-primario shadow-2xs"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#005a92] hover:bg-[#004875] text-white text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>

          <button
            onClick={handleNearMe}
            className="bg-white hover:bg-gray-50 text-[#0066A1] border border-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition whitespace-nowrap"
          >
            <span>Cerca de mí</span>
            <Navigation className="w-4 h-4 text-[#0066A1]" />
          </button>
        </div>

        {/* Filtros de Provincias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {PROVINCIAS_LIST.map((prov) => {
            const isSelected = selectedProvince.toLowerCase() === prov.toLowerCase();
            return (
              <button
                key={prov}
                onClick={() => {
                  setSelectedProvince(prov);
                  setSearchQuery(''); // Limpiar busqueda de texto al usar provincia
                  setSearchInput('');
                  setActivePlace(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#eef7fc] text-[#0066A1] border border-[#0066A1] font-bold shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {prov}
              </button>
            );
          })}
        </div>

        {/* Mapa y Lista */}
        <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
          {/* MAPA */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative h-full">
            <Map
              defaultCenter={{ lat: 9.7489, lng: -83.7534 }} // Centro de Costa Rica
              defaultZoom={7}
              mapId="SUCURSALES_MAP"
              disableDefaultUI={true}
              zoomControl={true}
            >
              <PlacesSearchHandler 
                selectedProvince={selectedProvince} 
                searchQuery={searchQuery}
                onResults={setPlaces}
                activePlace={activePlace}
              />
              
              {places.map((place) => (
                <Marker
                  key={place.place_id}
                  position={place.geometry.location}
                  onClick={() => setActivePlace(place)}
                  title={place.name}
                />
              ))}
            </Map>
          </div>

          {/* LISTA DE RESULTADOS */}
          <div className="lg:w-[400px] flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">
                Resultados {places.length > 0 && `(${places.length})`}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {places.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  No se encontraron sucursales para esta búsqueda.
                </div>
              ) : (
                places.map((place) => {
                  const isActive = activePlace?.place_id === place.place_id;
                  const lat = place.geometry.location.lat();
                  const lng = place.geometry.location.lng();
                  
                  return (
                    <div
                      key={place.place_id}
                      onClick={() => setActivePlace(place)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isActive 
                          ? 'border-verde-oficial bg-verde-oficial/5' 
                          : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{place.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                        {place.formatted_address}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0066A1] hover:text-[#004875] bg-[#eef7fc] hover:bg-[#e1f0fa] px-3 py-1.5 rounded-md transition"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Cómo llegar
                        </a>
                        
                        {onSelectBranchForAppointment && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectBranchForAppointment({
                                nombre: place.name,
                                direccion: place.formatted_address,
                                lat,
                                lng
                              });
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-verde-oficial hover:text-green-800 bg-verde-oficial/10 hover:bg-verde-oficial/20 px-3 py-1.5 rounded-md transition cursor-pointer"
                          >
                            Agendar Cita VES
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Maximize2, X, Phone, Clock, ExternalLink } from 'lucide-react';
import L from 'leaflet';
import { SUCURSALES_DATA, PROVINCIAS_LIST } from '../../data/sucursalesData';

const normalizeStr = (str = '') =>
  String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const SucursalesMapLocator = ({ onSelectBranchForAppointment = null }) => {
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranch, setActiveBranch] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const cardListRef = useRef(null);

  // Filtrado de sucursales según provincia seleccionada y término de búsqueda
  const normQuery = normalizeStr(searchQuery);
  const filteredBranches = SUCURSALES_DATA.filter((branch) => {
    const matchProvince = selectedProvince === 'Todas' || branch.provincia.toLowerCase() === selectedProvince.toLowerCase();
    if (!matchProvince) return false;

    if (!normQuery) return true;
    return (
      normalizeStr(branch.nombre).includes(normQuery) ||
      normalizeStr(branch.direccion).includes(normQuery) ||
      normalizeStr(branch.codigoPostal).includes(normQuery) ||
      normalizeStr(branch.canton).includes(normQuery)
    );
  });

  // Sucursal activa inicial (Aguas Zarcas si estamos en Alajuela, o la primera)
  useEffect(() => {
    if (filteredBranches.length > 0) {
      const preferred = filteredBranches.find(b => b.nombre.includes('Aguas Zarcas')) || filteredBranches[0];
      setActiveBranch(preferred);
    } else {
      setActiveBranch(null);
    }
  }, [selectedProvince]);

  // Inicializar mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [10.15, -84.35],
        zoom: 9.5,
        zoomControl: false,
        attributionControl: true
      });

      // Capa oficial de OpenStreetMap con caché estándar
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Controles de zoom arriba a la derecha (como en la captura)
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      // Use LayerGroup (built-in) instead of MarkerClusterGroup since the plugin is not installed
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Cleanup al desmontar
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar marcadores en el mapa cuando cambian las sucursales o la sucursal activa
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (filteredBranches.length === 0) return;

    const bounds = L.latLngBounds();

    filteredBranches.forEach((branch) => {
      const isSelected = activeBranch && activeBranch.id === branch.id;

      // Marcador clásico rojo con centro blanco (como en la imagen del usuario)
      const redPinHtml = `
        <div style="position: relative; width: 28px; height: 36px; cursor: pointer; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35)); transition: transform 0.2s;">
          <svg viewBox="0 0 24 32" width="28" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="#DC2626" stroke="#991B1B" stroke-width="1"/>
            <circle cx="12" cy="11" r="4.5" fill="#FFFFFF"/>
          </svg>
        </div>
      `;

      // Marcador objetivo azul/blanco para la sucursal seleccionada (exacto a la captura)
      const activePinHtml = `
        <div style="position: relative; width: 32px; height: 32px; cursor: pointer; filter: drop-shadow(0 3px 8px rgba(0,102,161,0.5));">
          <div style="position: absolute; inset: -3px; border-radius: 9999px; background: rgba(0, 102, 161, 0.25);"></div>
          <div style="position: absolute; inset: 0; border-radius: 9999px; background: #0066A1; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            <div style="width: 8px; height: 8px; border-radius: 9999px; background: #FFFFFF;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: isSelected ? 'custom-active-pin' : 'custom-standard-pin',
        html: isSelected ? activePinHtml : redPinHtml,
        iconSize: isSelected ? [32, 32] : [28, 36],
        iconAnchor: isSelected ? [16, 16] : [14, 36],
        popupAnchor: [0, -25]
      });

      const marker = L.marker([branch.lat, branch.lng], { icon: customIcon });

      marker.on('click', () => {
        setActiveBranch(branch);
        // Desplazar la tarjeta activa en la lista lateral
        const cardElem = document.getElementById(`branch-card-${branch.id}`);
        if (cardElem && cardListRef.current) {
          cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      markersLayer.addLayer(marker);
      bounds.extend([branch.lat, branch.lng]);
    });

    // Centrar mapa suavemente si cambia de provincia o filtro
    if (bounds.isValid() && filteredBranches.length > 0) {
      if (activeBranch) {
        map.panTo([activeBranch.lat, activeBranch.lng], { animate: true, duration: 0.6 });
      } else {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    }
  }, [filteredBranches, activeBranch]);

  // Selección de tarjeta en la lista
  const handleSelectCard = (branch) => {
    setActiveBranch(branch);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([branch.lat, branch.lng], 13.5, {
        animate: true,
        duration: 0.8
      });
    }
  };

  // Botón "Cerca de mí"
  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Encontrar sucursal más cercana
          let closest = SUCURSALES_DATA[0];
          let minDist = Infinity;
          SUCURSALES_DATA.forEach((b) => {
            const dist = Math.hypot(b.lat - userLat, b.lng - userLng);
            if (dist < minDist) {
              minDist = dist;
              closest = b;
            }
          });

          setSelectedProvince(closest.provincia);
          setActiveBranch(closest);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([closest.lat, closest.lng], 14, { animate: true });
          }
        },
        () => {
          // Fallback Alajuela Centro / Central
          const defaultNear = SUCURSALES_DATA.find(b => b.nombre.includes('Alajuela')) || SUCURSALES_DATA[0];
          setSelectedProvince(defaultNear.provincia);
          setActiveBranch(defaultNear);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([defaultNear.lat, defaultNear.lng], 13.5, { animate: true });
          }
        }
      );
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* 1. Barra de Búsqueda y Botones (Exacto a la captura) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sucursal, código o dirección"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Botón Buscar (Azul oscuro) */}
        <button
          type="button"
          onClick={() => {
            if (filteredBranches.length > 0) {
              handleSelectCard(filteredBranches[0]);
            }
          }}
          className="bg-[#005a92] hover:bg-[#004875] text-white text-sm font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Buscar</span>
        </button>

        {/* Botón Cerca de mí (Borde sutil) */}
        <button
          type="button"
          onClick={handleNearMe}
          className="bg-white hover:bg-gray-50 text-[#0066A1] border border-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer whitespace-nowrap"
        >
          <span>Cerca de mí</span>
          <Navigation className="w-4 h-4 text-[#0066A1]" />
        </button>
      </div>

      {/* 2. Pestañas / Filtros de Provincias (Pills como en la imagen) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        {PROVINCIAS_LIST.map((prov) => {
          const isSelected = selectedProvince.toLowerCase() === prov.toLowerCase();
          return (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvince(prov)}
              className={`px-4 py-1.5 rounded-full text-xs transition cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#eef7fc] text-[#0066A1] border border-[#0066A1] font-bold shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium'
              }`}
            >
              {prov}
            </button>
          );
        })}
      </div>

      {/* 3. Contenedor Principal Dividido: Mapa a la izquierda + Lista de sucursales a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-2">
        
        {/* Columna Izquierda: Mapa OpenStreetMap Interactivo (7 cols) */}
        <div className={`lg:col-span-7 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs relative flex flex-col min-h-[460px] sm:min-h-[520px] ${isFullScreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : ''}`}>
          
          {/* Contenedor DOM para el mapa Leaflet */}
          <div ref={mapContainerRef} className="w-full h-full flex-1 min-h-[440px] z-0" />

          {/* Botón flotante inferior: "Abrir mapa completo" (como en la captura) */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="absolute bottom-3 right-3 z-[1000] bg-white hover:bg-gray-50 text-gray-700 hover:text-azul-oscuro text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md border border-gray-200 transition cursor-pointer flex items-center gap-1.5"
          >
            {isFullScreen ? (
              <>
                <X className="w-3.5 h-3.5 text-gray-500" />
                <span>Cerrar mapa</span>
              </>
            ) : (
              <>
                <span>Abrir mapa completo</span>
              </>
            )}
          </button>

          {/* Indicador sutil de sucursal seleccionada en el mapa */}
          {activeBranch && (
            <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-xs max-w-[260px] hidden sm:block">
              <span className="font-bold text-azul-oscuro block truncate">{activeBranch.nombre}</span>
              <span className="text-[11px] text-gray-500 truncate block">{activeBranch.direccion}</span>
            </div>
          )}

        </div>

        {/* Columna Derecha: Lista de Sucursales (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          
          <div>
            {/* Título de conteo exacto (ej. "19 sucursales en Alajuela") */}
            <h3 className="text-sm font-bold text-gray-800 mb-2.5">
              {filteredBranches.length} sucursales en {selectedProvince}
            </h3>

            {/* Lista scrollable de tarjetas */}
            <div 
              ref={cardListRef}
              className="space-y-2.5 max-h-[460px] sm:max-h-[490px] overflow-y-auto pr-1.5"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
            >
              {filteredBranches.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
                  No se encontraron sucursales para "{searchQuery}" en {selectedProvince}.
                </div>
              ) : (
                filteredBranches.map((branch) => {
                  const isSelected = activeBranch && activeBranch.id === branch.id;
                  return (
                    <div
                      key={branch.id}
                      id={`branch-card-${branch.id}`}
                      onClick={() => handleSelectCard(branch)}
                      className={`p-3.5 rounded-xl transition-all cursor-pointer text-left select-none ${
                        isSelected
                          ? 'bg-[#f0f8fd] border-2 border-[#0066A1] shadow-xs'
                          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="text-sm font-bold text-gray-900 leading-snug">
                        {branch.nombre}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {branch.direccion} · Código {branch.codigoPostal}
                      </p>

                      {/* Botón de agendar cita si fue provisto */}
                      {isSelected && onSelectBranchForAppointment && (
                        <div className="mt-2.5 pt-2 border-t border-sky-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-azul-primario font-semibold">
                            ● Ventanilla Activa
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectBranchForAppointment(branch);
                            }}
                            className="text-[11px] font-bold text-azul-primario hover:underline"
                          >
                            Agendar cita oficial →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Badge inferior: "Sucursal en el directorio" (como en la captura) */}
          <div className="mt-3 pt-1">
            <span className="inline-block bg-[#ecfdf5] text-[#047857] border border-emerald-200 text-xs px-2.5 py-1 rounded-md font-medium">
              Sucursal en el directorio
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

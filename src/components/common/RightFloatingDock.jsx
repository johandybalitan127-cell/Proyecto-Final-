import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Package, VolumeX, LogOut, User, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';

export const RightFloatingDock = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { 
    setIsModalOpen, 
    colorblindMode, 
    highContrast, 
    textScale, 
    setTextScale, 
    isSpeaking, 
    stopSpeaking 
  } = useAccessibility();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <aside 
      aria-label="Panel lateral de accesos rápidos y perfil"
      className="fixed right-3 sm:right-4 top-24 sm:top-28 z-40 select-none hidden sm:flex flex-col items-center"
    >
      {/* Dock Container */}
      <div className={`relative bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-xl rounded-2xl p-2 flex flex-col items-center gap-2 transition-all duration-300 ${
        isCollapsed ? 'translate-x-12 opacity-80 hover:opacity-100 hover:translate-x-0' : 'translate-x-0'
      }`}>
        
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-azul-primario flex items-center justify-center transition text-xs -mb-1"
          title={isCollapsed ? "Expandir barra lateral" : "Ocultar a un lado"}
          aria-label={isCollapsed ? "Expandir barra lateral" : "Ocultar a un lado"}
        >
          {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* 1. User Profile Button */}
        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-xl bg-azul-oscuro text-white text-xs font-bold flex items-center justify-center shadow-md hover:ring-2 hover:ring-sky-300 transition-all relative group"
              aria-label={`Perfil de ${user?.nombre || 'Usuario'}`}
              title={`${user?.nombre} (${user?.rol})`}
            >
              {user?.avatar || 'CR'}
              {/* Online indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>

              {/* Tooltip */}
              <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {user?.nombre?.split(' ')[0]} · {user?.rol}
              </span>
            </button>

            {/* Dropdown Menu (Opens to the left so it never gets cut off) */}
            {userMenuOpen && (
              <div className="absolute right-full top-0 mr-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2.5 border-b border-gray-100 bg-sky-50/50 rounded-t-xl">
                  <p className="text-[11px] font-medium text-gray-500">Sesión iniciada como</p>
                  <p className="text-xs font-bold text-azul-oscuro truncate">{user.nombre}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-azul-oscuro">
                    {user.rol}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/cuenta/perfil"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-azul-primario transition-colors"
                  >
                    <User className="w-4 h-4 text-azul-primario" />
                    <span>Mi Perfil y Casillero</span>
                  </Link>

                  <Link
                    to="/cuenta/historial"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-sky-50 hover:text-azul-primario transition-colors"
                  >
                    <Package className="w-4 h-4 text-azul-primario" />
                    <span>Historial de Envíos</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Panel Administrativo (SIP)</span>
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="w-10 h-10 rounded-xl bg-azul-primario text-white flex items-center justify-center shadow-md hover:bg-azul-oscuro transition group relative"
            title="Iniciar Sesión"
            aria-label="Iniciar Sesión"
          >
            <User className="w-5 h-5" />
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Ingresar al sistema
            </span>
          </Link>
        )}

        {/* 2. Admin Panel Direct Link (if admin) */}
        {isAdmin && (
          <Link
            to="/admin"
            className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center justify-center transition shadow-2xs group relative"
            title="Panel de Administración"
            aria-label="Ir al Panel de Administración"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Panel Administrativo (SIP)
            </span>
          </Link>
        )}

        {/* 3. Virtual Branch Quick Access */}
        <Link
          to="/cuenta/perfil"
          className="w-10 h-10 rounded-xl bg-sky-50 text-azul-primario border border-sky-200 hover:bg-sky-100 flex items-center justify-center transition shadow-2xs group relative"
          title="Sucursal Virtual"
          aria-label="Ir a Sucursal Virtual"
        >
          <Package className="w-5 h-5 text-azul-primario" />
          <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Sucursal Virtual
          </span>
        </Link>

        {/* Divider */}
        <div className="w-6 h-px bg-gray-200 my-0.5" />

        {/* 4. Accessibility Settings (♿) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all group relative ${
            colorblindMode !== 'none' || highContrast
              ? 'bg-amber-400 text-black border-black font-extrabold shadow-md'
              : 'border-gray-200 text-gray-700 hover:text-azul-primario hover:border-azul-primario hover:bg-gray-50'
          }`}
          title="Accesibilidad (Alt + A)"
          aria-label="Configuración de Accesibilidad"
        >
          <span className="text-lg leading-none" role="img" aria-label="Símbolo de accesibilidad">♿</span>
          <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Accesibilidad (Lector, Daltonismo, Contraste)
          </span>
        </button>

        {/* 5. Font Scale Stepper (A / A+ / A++) */}
        <div className="flex flex-col items-center bg-gray-50 rounded-xl border border-gray-200 p-0.5 gap-0.5" role="group" aria-label="Tamaño de texto">
          <button
            onClick={() => setTextScale('normal')}
            className={`w-8 h-6 rounded-lg text-[10px] font-bold transition flex items-center justify-center ${
              textScale === 'normal' ? 'bg-white text-azul-primario shadow-2xs' : 'text-gray-500 hover:text-azul-primario'
            }`}
            title="Texto Normal (100%)"
          >
            A
          </button>
          <button
            onClick={() => setTextScale('large')}
            className={`w-8 h-6 rounded-lg text-[10px] font-bold transition flex items-center justify-center ${
              textScale === 'large' ? 'bg-white text-azul-primario shadow-2xs' : 'text-gray-500 hover:text-azul-primario'
            }`}
            title="Texto Grande (120%)"
          >
            A+
          </button>
          <button
            onClick={() => setTextScale('xlarge')}
            className={`w-8 h-6 rounded-lg text-[10px] font-bold transition flex items-center justify-center ${
              textScale === 'xlarge' ? 'bg-white text-azul-primario shadow-2xs' : 'text-gray-500 hover:text-azul-primario'
            }`}
            title="Texto Extra Grande (140%)"
          >
            A++
          </button>
        </div>

        {/* 6. Active Voice Stop Button (if speaking) */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg animate-pulse hover:bg-rose-700 transition group relative"
            title="Detener lectura de voz (Esc)"
            aria-label="Detener lectura de voz"
          >
            <VolumeX className="w-5 h-5" />
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Pausar Voz
            </span>
          </button>
        )}

      </div>
    </aside>
  );
};

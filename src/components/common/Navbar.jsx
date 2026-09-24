import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Package, Menu, X, User, LogOut, ShieldCheck, ChevronDown, Volume2, VolumeX, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { 
    setIsModalOpen, 
    highContrast, 
    colorblindMode, 
    textScale,
    setTextScale,
    isSpeaking, 
    stopSpeaking, 
    readCurrentPage 
  } = useAccessibility();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Rastreo', path: '/rastreo' },
    { name: 'Oficinas', path: '/oficinas' },
    { name: 'Ayuda', path: '/ayuda' },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[5rem] py-2 flex-wrap gap-y-2">
          
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="w-12 h-12 rounded-xl bg-azul-primario text-white flex items-center justify-center shadow-md group-hover:bg-azul-oscuro transition-colors">
              <Package className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-azul-primario leading-none font-sans">
                Correos <span className="text-azul-oscuro font-extrabold">de Costa Rica</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase mt-1">
                Plataforma Digital Ciudadana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-azul-primario bg-sky-50 font-semibold'
                      : 'text-gris-oscuro hover:text-azul-primario hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Stop Voice Reading button when speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse hover:bg-rose-700 transition"
                title="Detener voz (Esc)"
                aria-label="Detener lectura de voz en curso"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Pausar Voz</span>
              </button>
            )}

            {/* Quick Font Size Adjuster (A / A+ / A++) */}
            <div 
              className="hidden sm:inline-flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200" 
              role="group"
              aria-label="Ajuste rápido de tamaño de texto"
              title="Ajuste rápido de tamaño de texto (Atajo Alt + T)"
            >
              <button 
                onClick={() => setTextScale('normal')} 
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  textScale === 'normal' 
                    ? 'bg-white text-azul-primario shadow-2xs' 
                    : 'text-gray-600 hover:text-azul-primario'
                }`}
                aria-pressed={textScale === 'normal'}
                aria-label="Tamaño de texto normal 100%"
                title="Texto Normal (100%)"
              >
                A
              </button>
              <button 
                onClick={() => setTextScale('large')} 
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  textScale === 'large' 
                    ? 'bg-white text-azul-primario shadow-2xs' 
                    : 'text-gray-600 hover:text-azul-primario'
                }`}
                aria-pressed={textScale === 'large'}
                aria-label="Tamaño de texto grande 120%"
                title="Texto Grande (120%)"
              >
                A+
              </button>
              <button 
                onClick={() => setTextScale('xlarge')} 
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  textScale === 'xlarge' 
                    ? 'bg-white text-azul-primario shadow-2xs' 
                    : 'text-gray-600 hover:text-azul-primario'
                }`}
                aria-pressed={textScale === 'xlarge'}
                aria-label="Tamaño de texto extra grande 140%"
                title="Texto Extra Grande (140%)"
              >
                A++
              </button>
            </div>

            {/* Accessibility Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 ${
                colorblindMode !== 'none' || highContrast
                  ? 'bg-amber-400 text-black border-black font-extrabold shadow-sm'
                  : 'border-gray-200 text-gray-700 hover:text-azul-primario hover:border-azul-primario bg-white hover:bg-gray-50'
              }`}
              aria-label="Abrir panel de accesibilidad para personas ciegas y daltónicas (Atajo Alt + A)"
              title="Accesibilidad: Lector de voz, Daltonismo y Alto Contraste (Alt + A)"
            >
              <span className="text-base leading-none" role="img" aria-label="Símbolo de accesibilidad">♿</span>
              <span className="hidden sm:inline">Accesibilidad</span>
              {colorblindMode !== 'none' && (
                <span className="hidden md:inline text-[9px] px-1.5 py-0.5 rounded bg-black text-amber-300 font-mono uppercase">
                  {colorblindMode}
                </span>
              )}
            </button>

            {/* Virtual Branch Button */}
            <Link
              to="/cuenta/perfil"
              className="hidden lg:inline-flex btn-primario text-sm py-2 px-3.5 shadow-sm"
            >
              <span>Sucursal Virtual</span>
              <span className="text-xs">→</span>
            </Link>

            {/* Admin Panel Direct Link (if admin) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Panel Admin</span>
              </Link>
            )}

            {/* User Dropdown / Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-azul-oscuro text-white text-xs font-bold flex items-center justify-center shadow-inner">
                    {user?.avatar || 'CR'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-gris-oscuro line-clamp-1 max-w-[110px]">
                      {user?.nombre?.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {user?.rol}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Sesión iniciada como</p>
                      <p className="text-sm font-semibold text-gris-oscuro truncate">{user.nombre}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-azul-oscuro">
                        {user.rol}
                      </span>
                    </div>

                    <Link
                      to="/cuenta/perfil"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-azul-primario"
                    >
                      <User className="w-4 h-4" />
                      <span>Mi Perfil y Libreta</span>
                    </Link>

                    <Link
                      to="/cuenta/historial"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-azul-primario"
                    >
                      <Package className="w-4 h-4" />
                      <span>Historial de Envíos</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Panel Administrativo (SIP)</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 sm:px-3.5 sm:py-2 rounded-lg border border-gray-200 text-gris-oscuro hover:text-azul-primario hover:border-azul-primario transition flex items-center gap-1.5 text-xs font-semibold"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-azul-primario"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-gris-oscuro hover:bg-sky-50 hover:text-azul-primario"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link
              to="/cuenta/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center btn-primario text-sm py-2.5"
            >
              Sucursal Virtual →
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 px-3 rounded-lg text-sm font-semibold bg-emerald-100 text-emerald-800"
              >
                Ir a Panel Administrativo (SIP)
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

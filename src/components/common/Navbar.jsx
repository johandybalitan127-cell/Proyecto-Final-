import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Accessibility, User, ArrowRight, Menu, X, Package, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAccessibility } from '../../context/AccessibilityContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { setIsModalOpen } = useAccessibility();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Rastreo', path: '/rastreo' },
    { name: 'Oficinas', path: '/oficinas' },
    { name: 'Ayuda', path: '/ayuda' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group focus:outline-none flex-shrink-0">
            <img
              src="/correos-logo.png"
              alt="Correos de Costa Rica"
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://www.stickercr.com/wp-content/uploads/2024/08/Logo-version-b-1.png';
              }}
            />
            <span className="hidden sm:inline-block text-gray-300 font-light text-xl select-none mx-0.5">
              |
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wider text-gray-500 uppercase select-none whitespace-nowrap">
              Plataforma Digital Ciudadana
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[15px] font-medium transition-colors hover:text-azul-primario ${
                    isActive
                      ? 'text-azul-primario font-bold'
                      : 'text-gray-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            
            {/* Accessibility Icon */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-gray-700 hover:text-azul-primario hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-azul-primario/20"
              aria-label="Abrir panel de accesibilidad universal"
              title="Accesibilidad Universal (WCAG 2.1 AA)"
            >
              <Accessibility className="w-5 h-5 stroke-[1.9]" />
            </button>

            {/* Virtual Branch Button */}
            <Link
              to="/cuenta/perfil"
              className="hidden sm:inline-flex items-center gap-2 bg-[#0063a5] hover:bg-[#004f85] text-white text-sm font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <span>Sucursal Virtual</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* User Icon */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-1.5 text-gray-700 hover:text-azul-primario hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-azul-primario/20"
                  aria-label="Menú de usuario"
                  aria-expanded={userDropdownOpen}
                  title={user?.nombre || 'Mi Cuenta'}
                >
                  <User className="w-6 h-6 stroke-[1.8]" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 text-gray-700 hover:text-azul-primario hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-azul-primario/20"
                  aria-label="Iniciar Sesión"
                  title="Iniciar Sesión"
                >
                  <User className="w-6 h-6 stroke-[1.8]" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isAuthenticated && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Sesión iniciada como</p>
                    <p className="text-sm font-semibold text-gris-oscuro truncate">{user?.nombre || 'Usuario'}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-azul-oscuro">
                      {user?.rol || 'Ciudadano'}
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
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-50"
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
              className="block w-full text-center bg-[#0063a5] text-white rounded-lg font-semibold text-sm py-2.5 shadow-sm"
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

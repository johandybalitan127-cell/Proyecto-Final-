import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Package, Menu, X, User, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LogoCorreos } from './LogoCorreos';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Internacional', path: '/internacional' },
    { name: 'Rastreo', path: '/cuenta/rastreo' },
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
        <div className="flex items-center justify-between h-20 flex-nowrap gap-x-3">
          
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none flex-shrink-0">
            <LogoCorreos className="h-10 sm:h-12 w-auto" />
            <div className="flex flex-col hidden sm:block">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase mt-1">
                Plataforma Digital Ciudadana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
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
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            {/* Quick Virtual Branch Link */}
            <Link
              to="/cuenta/perfil"
              className="hidden lg:inline-flex btn-primario text-xs py-2 px-3 shadow-2xs whitespace-nowrap flex-shrink-0"
            >
              <span>Sucursal Virtual</span>
              <span className="text-xs">→</span>
            </Link>

            {/* User Dropdown / Login Button */}
            {isAuthenticated ? (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-left transition whitespace-nowrap"
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

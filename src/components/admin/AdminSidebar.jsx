import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, MapPin, Tag, MessageSquare, 
  Bot, BarChart3, Settings, LogOut, Package2, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Envíos y Paquetería', path: '/admin/envios', icon: Package, badge: '3.4k' },
    { name: 'Usuarios y Clientes', path: '/admin/usuarios', icon: Users },
    { name: 'Oficinas y Sucursales', path: '/admin/sucursales', icon: MapPin },
    { name: 'Servicios y Tarifas', path: '/admin/servicios-tarifas', icon: Tag },
    { name: 'Consultas y Peticiones', path: '/admin/consultas', icon: MessageSquare, badge: '14' },
    { name: 'Asistente IA (Logs & NLP)', path: '/admin/asistente-ia', icon: Bot, badge: '94%' },
    { name: 'Reportes y Estadísticas', path: '/admin/reportes', icon: BarChart3 },
    { name: 'Configuración del Sistema', path: '/admin/configuracion', icon: Settings },
  ];

  return (
    <>
      {/* Mobile / Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`w-[236px] bg-[#08203A] text-white flex-shrink-0 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 border-r border-[#0B2A4A] z-50 select-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-azul-primario flex items-center justify-center text-white shadow">
                <Package2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-none text-white font-sans">
                  Correos <span className="text-sky-400">CR</span>
                </h1>
                <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">
                  PANEL ADMINISTRATIVO
                </span>
              </div>
            </Link>

            {/* Close button on mobile/tablet */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Cerrar menú lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section title */}
          <div className="px-5 pt-4 pb-2">
            <span className="text-[10px] font-bold tracking-widest text-[#B9C8D6]/60 uppercase">
              GESTIÓN
            </span>
          </div>

          {/* Nav list */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-azul-primario text-white shadow-sm font-semibold'
                      : 'text-[#B9C8D6] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-white/10 bg-[#06172B]">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-verde-principal text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {user?.avatar || 'CM'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.nombre || 'Carlos Mora'}
                </p>
                <p className="text-[10px] text-gray-400 truncate leading-tight">
                  {user?.sucursal || 'Operador Zapote'}
                </p>
                <span className="text-[9px] text-emerald-400 font-mono">
                  {user?.codigoOperador || 'OP-8821'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-center">
            <Link to="/" className="text-[10px] text-[#B9C8D6] hover:text-white underline">
              ← Volver a la Vista Ciudadana
            </Link>
          </div>
        </div>

      </aside>
    </>
  );
};

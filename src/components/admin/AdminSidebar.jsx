import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Users, MapPin, Tag, MessageSquare, 
  Bot, BarChart3, Settings, LogOut, Package2, X, Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { LogoCorreos } from '../common/LogoCorreos';

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
    { name: 'Citas Premium', path: '/admin/citas-premium', icon: Zap, badge: 'NUEVO' },
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
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : 0 }}
        className={`w-[280px] bg-white border-r border-gray-100 flex-shrink-0 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 z-50 select-none shadow-[20px_0_40px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand header */}
          <div className="px-6 py-6 border-b border-gray-100/50 flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex flex-col gap-1 group">
              <LogoCorreos className="h-8 w-auto mb-2" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Dashboard Premium
              </span>
            </Link>

            {/* Close button on mobile/tablet */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section title */}
          <div className="px-6 pt-6 pb-2">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Principal
            </span>
          </div>

          {/* Nav list */}
          <nav className="px-4 space-y-1.5 overflow-y-auto pb-6 scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3 py-3 rounded-xl text-[13px] font-semibold transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Background Animation */}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <div className="relative flex items-center gap-3 z-10">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                      </motion.div>
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.badge === 'NUEVO' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="p-4 bg-slate-50 border-t border-gray-100">
          <div className="p-3 rounded-2xl bg-white border border-gray-100/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-inner">
                  {user?.avatar || 'AD'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                  {user?.nombre || 'Administrador'}
                </p>
                <p className="text-[10px] font-semibold text-slate-500 truncate leading-tight mt-0.5">
                  {user?.rol || 'Super Admin'}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-[11px] font-medium text-slate-400 hover:text-blue-600 transition-colors">
              ← Volver al Portal Ciudadano
            </Link>
          </div>
        </div>

      </motion.aside>
    </>
  );
};

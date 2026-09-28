import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, FileText, MapPin, User } from 'lucide-react';

export const MobileBottomBar = () => {
  const tabs = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Rastreo', path: '/cuenta/rastreo', icon: Package },
    { name: 'Trámites', path: '/servicios', icon: FileText },
    { name: 'Sucursales', path: '/oficinas', icon: MapPin },
    { name: 'Mi Cuenta', path: '/cuenta/perfil', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-azul-primario'
                  : 'text-gray-500 hover:text-azul-primario'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{tab.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

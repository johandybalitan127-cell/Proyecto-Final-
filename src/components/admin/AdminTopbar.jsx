import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, Calendar, CheckCircle2, Menu } from 'lucide-react';
import { checkServerStatus } from '../../services/api';

export const AdminTopbar = ({ 
  currentSection = 'Dashboard', 
  actionButton = null, 
  showDatePicker = false,
  onMenuToggle = null 
}) => {
  const [serverOnline, setServerOnline] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Centro Operativo Postal (Zapote)');

  useEffect(() => {
    const verifyServer = async () => {
      const online = await checkServerStatus();
      setServerOnline(online);
    };
    verifyServer();
    const interval = setInterval(verifyServer, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-2xs">
      
      {/* Left: Mobile Menu Toggle + Breadcrumbs & Server Sync Status */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
            aria-label="Abrir menú de navegación del panel"
          >
            <Menu className="w-5 h-5 text-azul-oscuro" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <div className="text-xs text-gray-500 font-medium">
            <span className="hidden sm:inline">Sistema Integral Postal (SIP-CR)</span>
            <span className="hidden sm:inline mx-1.5 text-gray-400">/</span>
            <strong className="text-azul-oscuro font-bold">{currentSection}</strong>
          </div>

          {/* Live sync badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{serverOnline ? 'json-server:3001 activo' : 'Caché Sincronizada'}</span>
            <span className="text-[10px] text-emerald-600 hidden md:inline">· Tiempo real</span>
          </div>
        </div>
      </div>

      {/* Right: Controls & Contextual Action */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
        
        {/* Global Search Bar */}
        <div className="relative hidden xl:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gris-oscuro bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario w-44 transition"
          />
        </div>

        {/* Center / Branch selector */}
        <div className="relative hidden sm:block">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs font-semibold text-gris-oscuro bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-azul-primario cursor-pointer appearance-none max-w-[190px] truncate"
          >
            <option value="Centro Operativo Postal (Zapote)">Zapote Operativo</option>
            <option value="Sucursal Central San José">Central San José</option>
            <option value="Alajuela Centro Regional">Alajuela Regional</option>
            <option value="Aduana Postal Santamaría">Aduana Santamaría</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date picker for dashboard / reportes */}
        {showDatePicker && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-azul-primario" />
            <span>Últimos 30 días</span>
          </div>
        )}

        {/* Contextual Action Button */}
        {actionButton && (
          <div>{actionButton}</div>
        )}

      </div>

    </header>
  );
};

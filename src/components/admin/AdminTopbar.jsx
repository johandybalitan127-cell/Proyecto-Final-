import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Plus, Calendar, CheckCircle2, Menu, Check, Clock, CalendarDays, Filter } from 'lucide-react';
import { checkServerStatus } from '../../services/api';

export const ADMIN_PERIOD_OPTIONS = [
  { id: 'hoy', label: 'Hoy', shortLabel: 'Hoy', desc: 'Últimas 24 horas', icon: Clock },
  { id: '7d', label: 'Últimos 7 días', shortLabel: '7 días', desc: 'Semana en curso', icon: CalendarDays },
  { id: '30d', label: 'Últimos 30 días', shortLabel: '30 días', desc: 'Mes estándar', icon: Calendar },
  { id: '90d', label: 'Último trimestre', shortLabel: 'Trimestre', desc: 'Últimos 90 días', icon: Calendar },
  { id: 'ano', label: 'Año actual (2024)', shortLabel: 'Año 2024', desc: 'Evolución anual completa', icon: Calendar }
];

export const AdminTopbar = ({ 
  currentSection = 'Dashboard', 
  actionButton = null, 
  showDatePicker = false,
  selectedPeriod,
  onPeriodChange,
  onMenuToggle = null,
  selectedBranch,
  onBranchChange
}) => {
  const [serverOnline, setServerOnline] = useState(false);
  const [localBranch, setLocalBranch] = useState('Sucursal Central San José');
  const [localPeriod, setLocalPeriod] = useState('30d');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [customRange, setCustomRange] = useState({ from: '', to: '' });
  const datePickerRef = useRef(null);

  const currentBranch = selectedBranch !== undefined ? selectedBranch : localBranch;
  const currentPeriod = selectedPeriod !== undefined ? selectedPeriod : localPeriod;

  const handleBranchChange = (value) => {
    if (onBranchChange) {
      onBranchChange(value);
    } else {
      setLocalBranch(value);
    }
  };

  const handlePeriodSelect = (periodId) => {
    if (onPeriodChange) {
      onPeriodChange(periodId);
    } else {
      setLocalPeriod(periodId);
    }
    setIsDatePickerOpen(false);
    setShowCustomInputs(false);
  };

  const handleCustomRangeApply = (e) => {
    e.preventDefault();
    if (!customRange.from || !customRange.to) return;
    const customObj = {
      id: 'custom',
      from: customRange.from,
      to: customRange.to,
      label: `${customRange.from} al ${customRange.to}`
    };
    if (onPeriodChange) {
      onPeriodChange(customObj);
    } else {
      setLocalPeriod(customObj);
    }
    setIsDatePickerOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  useEffect(() => {
    const verifyServer = async () => {
      const online = await checkServerStatus();
      setServerOnline(online);
    };
    verifyServer();
    const interval = setInterval(verifyServer, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentPeriodId = typeof currentPeriod === 'object' ? currentPeriod.id : currentPeriod;
  const activeOption = ADMIN_PERIOD_OPTIONS.find(p => p.id === currentPeriod || p.label === currentPeriod);
  const currentPeriodLabel = typeof currentPeriod === 'object' 
    ? (currentPeriod.label || `${currentPeriod.from} - ${currentPeriod.to}`)
    : (activeOption?.label || 'Últimos 30 días');

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
            value={currentBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="text-xs font-semibold text-gris-oscuro bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-azul-primario cursor-pointer appearance-none max-w-[210px] truncate"
          >
            <option value="Sucursal Central San José">Central San José</option>
            <option value="Centro Operativo Postal (Zapote)">Zapote Operativo</option>
            <option value="Alajuela Centro Regional">Alajuela Regional</option>
            <option value="Sucursal Heredia Central">Heredia Central</option>
            <option value="Sucursal Cartago Los Ángeles">Cartago Los Ángeles</option>
            <option value="Sucursal Liberia Centro">Liberia Guanacaste</option>
            <option value="Sucursal Puntarenas Puerto">Puntarenas Puerto</option>
            <option value="Sucursal Limón Centro">Limón Centro</option>
            <option value="Aduana Postal Santamaría">Aduana Santamaría</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date picker for dashboard / reportes - Interactive Dropdown */}
        {showDatePicker && (
          <div className="relative" ref={datePickerRef}>
            <button
              type="button"
              id="admin-date-picker-button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none ${
                isDatePickerOpen 
                  ? 'border-azul-primario ring-2 ring-azul-primario/20 bg-sky-50 text-azul-oscuro' 
                  : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 text-gray-700'
              }`}
              title="Seleccionar período de visualización"
              aria-label="Seleccionar período de fechas"
              aria-expanded={isDatePickerOpen}
            >
              <Calendar className="w-3.5 h-3.5 text-azul-primario shrink-0" />
              <span>{currentPeriodLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180 text-azul-primario' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDatePickerOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                role="menu"
              >
                <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Período de Análisis
                  </span>
                  <span className="text-[10px] bg-sky-100 text-azul-primario font-semibold px-2 py-0.5 rounded-full">
                    Filtro Temporal
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  {ADMIN_PERIOD_OPTIONS.map((opt) => {
                    const isSelected = currentPeriodId === opt.id || currentPeriod === opt.label;
                    const IconComp = opt.icon || Calendar;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handlePeriodSelect(opt.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                          isSelected 
                            ? 'bg-sky-50 text-azul-oscuro font-bold border border-sky-100' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-azul-oscuro'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-md ${isSelected ? 'bg-azul-primario text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="leading-tight">{opt.label}</div>
                            <div className="text-[10px] text-gray-400 font-normal leading-tight mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-azul-primario shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Date Range */}
                <div className="mt-1 pt-1.5 border-t border-gray-100">
                  {!showCustomInputs ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomInputs(true)}
                      className="w-full text-center py-1.5 px-2 text-[11px] font-semibold text-azul-primario hover:bg-sky-50 rounded-lg transition"
                    >
                      + Rango de fechas personalizado
                    </button>
                  ) : (
                    <form onSubmit={handleCustomRangeApply} className="p-2 bg-gray-50 rounded-lg space-y-2 text-xs">
                      <div className="text-[11px] font-bold text-gray-700">Definir rango personalizado:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-0.5">Desde:</label>
                          <input
                            type="date"
                            value={customRange.from}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, from: e.target.value }))}
                            required
                            className="w-full text-xs p-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-azul-primario"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-0.5">Hasta:</label>
                          <input
                            type="date"
                            value={customRange.to}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, to: e.target.value }))}
                            required
                            className="w-full text-xs p-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-azul-primario"
                          />
                        </div>
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          type="submit"
                          className="flex-1 py-1 px-2 bg-azul-primario hover:bg-azul-oscuro text-white text-[11px] font-bold rounded shadow-xs transition cursor-pointer"
                        >
                          Aplicar Rango
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCustomInputs(false)}
                          className="py-1 px-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[11px] rounded transition cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              </div>
            )}
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


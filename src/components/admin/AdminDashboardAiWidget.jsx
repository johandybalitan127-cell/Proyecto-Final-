import React, { useState } from 'react';
import { adminAiService } from '../../services/adminAiService';
import { GoogleIcon } from '../common/GoogleIcon';
import { formatAiTextWithGoogleFonts } from '../common/aiTextFormatter';

export const AdminDashboardAiWidget = ({ 
  currentBranch = 'Sucursal Central San José',
  currentPeriod = '30d',
  onOpenFullCopilot = () => {}
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [latestResponse, setLatestResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const periodLabel = typeof currentPeriod === 'object' ? currentPeriod.label : currentPeriod;

  const handleQuickAsk = async (text) => {
    setIsLoading(true);
    setQueryInput(text);
    try {
      const res = await adminAiService.processAdminMessage({
        message: text,
        currentBranch,
        currentPeriod
      });
      setLatestResponse(res);
    } catch (e) {
      console.warn('Error in dashboard AI widget:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim() || isLoading) return;
    handleQuickAsk(queryInput);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 text-gris-oscuro space-y-4">
      
      {/* Top Header Institucional con Google Fonts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-azul-primario text-white flex items-center justify-center shadow-xs border border-sky-400/30">
            <GoogleIcon name="smart_toy" size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-azul-oscuro flex items-center gap-1.5">
                <span>Copiloto Inteligente de Operaciones (IA)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-verde-principal text-white font-semibold tracking-wider uppercase">
                  En Vivo
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
              <GoogleIcon name="sensors" size={14} className="text-emerald-600 animate-pulse" />
              <span>Conectado a la base de datos de <strong className="text-azul-oscuro font-bold">{currentBranch}</strong> ({periodLabel})</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenFullCopilot(queryInput)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-azul-primario border border-sky-200 text-xs font-semibold transition self-start sm:self-auto cursor-pointer group"
        >
          <GoogleIcon name="auto_awesome" size={15} className="text-azul-primario group-hover:rotate-12 transition-transform" />
          <span>Abrir Copiloto Completo</span>
          <GoogleIcon name="chevron_right" size={16} />
        </button>
      </div>

      {/* Quick Action Chips con Iconos de Google Fonts (Sin emojis) */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <GoogleIcon name="bolt" size={14} className="text-amber-500" filled /> Consultas Rápidas de Administración:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickAsk('Resumen operativo general')}
            className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-azul-oscuro border border-gray-200 hover:border-sky-300 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <GoogleIcon name="bar_chart" size={15} className="text-azul-primario" />
            <span>Resumen General</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('¿Cuáles envíos presentan incidencias o demoras?')}
            className="px-3 py-1.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <GoogleIcon name="warning" size={15} className="text-rose-600" filled />
            <span>Envíos con Incidencias</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Rendimiento en Alajuela vs San José')}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-azul-primario border border-sky-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <GoogleIcon name="domain" size={15} className="text-azul-primario" />
            <span>Sede Alajuela vs San José</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Auditoría de usuarios y personal')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <GoogleIcon name="group" size={15} className="text-purple-600" />
            <span>Usuarios y Personal</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Estado de reclamos y tickets PQRS')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <GoogleIcon name="assignment" size={15} className="text-amber-600" />
            <span>Reclamos PQRS</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Recomendaciones de optimización IA')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <GoogleIcon name="psychology" size={15} className="text-emerald-700" />
            <span>Recomendaciones IA</span>
          </button>
        </div>
      </div>

      {/* Inline Quick Result Box si se generó una respuesta */}
      {latestResponse && (
        <div className="p-4 rounded-xl bg-gris-claro border border-gray-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-azul-primario bg-sky-100 px-2.5 py-0.5 rounded-md border border-sky-200 inline-flex items-center gap-1">
              <GoogleIcon name="memory" size={13} className="text-azul-primario" />
              <span>{latestResponse.dataBadge || 'Respuesta Oficial IA'}</span>
            </span>
            <button
              type="button"
              onClick={() => onOpenFullCopilot(queryInput)}
              className="text-xs text-azul-primario hover:text-azul-oscuro font-bold flex items-center gap-1 transition cursor-pointer group"
            >
              <span>Continuar en Copiloto</span>
              <GoogleIcon name="arrow_forward" size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="text-xs sm:text-sm text-gris-oscuro leading-relaxed max-h-56 overflow-y-auto pr-1 space-y-1">
            {formatAiTextWithGoogleFonts(latestResponse.text)}
          </div>

          {latestResponse.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-200">
              {latestResponse.metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white border border-gray-200 text-center shadow-2xs">
                  <div className="text-[10px] text-gray-500 font-medium">{m.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-azul-oscuro">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input de Consulta Rápida con Icono Google Fonts */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Haz una pregunta rápida sobre métricas, envíos, sedes o personal..."
          className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gris-oscuro placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-azul-primario focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!queryInput.trim() || isLoading}
          className="px-4 py-2.5 bg-azul-primario hover:bg-azul-oscuro disabled:opacity-40 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon name="send" size={16} className="text-white" />
          )}
          <span className="hidden sm:inline text-xs">Consultar</span>
        </button>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, ArrowRight, Zap, Activity, AlertTriangle, 
  BarChart3, CheckCircle2, ChevronRight, ShieldCheck, Users, Package 
} from 'lucide-react';
import { adminAiService } from '../../services/adminAiService';

/**
 * Renderiza texto enriquecido con formato institucional
 */
const renderFormattedText = (content = '') => {
  return content.split('\n').map((line, idx) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={idx} className="block leading-relaxed">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-azul-oscuro">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </span>
    );
  });
};

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
      
      {/* Top Header Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-azul-primario text-white flex items-center justify-center shadow-xs border border-sky-400/30">
            <Bot className="w-5 h-5" />
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
              <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Conectado a la base de datos de <strong className="text-azul-oscuro font-bold">{currentBranch}</strong> ({periodLabel})</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenFullCopilot(queryInput)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-azul-primario border border-sky-200 text-xs font-semibold transition self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-azul-primario" />
          <span>Abrir Copiloto Completo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Chips Institucionales */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Consultas Rápidas de Administración:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickAsk('Resumen operativo general')}
            className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-azul-oscuro border border-gray-200 hover:border-sky-300 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📊 Resumen General</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('¿Cuáles envíos presentan incidencias o demoras?')}
            className="px-3 py-1.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>⚠️ Envíos con Incidencias</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Rendimiento en Alajuela vs San José')}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-azul-primario border border-sky-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🏢 Sede Alajuela vs San José</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Auditoría de usuarios y personal')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>👥 Usuarios y Personal</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Estado de reclamos y tickets PQRS')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📋 Reclamos PQRS</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Recomendaciones de optimización IA')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🧠 Recomendaciones IA</span>
          </button>
        </div>
      </div>

      {/* Inline Quick Result Box si se generó una respuesta */}
      {latestResponse && (
        <div className="p-4 rounded-xl bg-gris-claro border border-gray-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-azul-primario bg-sky-100 px-2.5 py-0.5 rounded-md border border-sky-200">
              {latestResponse.dataBadge || 'Respuesta Oficial IA'}
            </span>
            <button
              type="button"
              onClick={() => onOpenFullCopilot(queryInput)}
              className="text-xs text-azul-primario hover:text-azul-oscuro font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>Continuar en Copiloto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs sm:text-sm text-gris-oscuro leading-relaxed max-h-56 overflow-y-auto pr-1">
            {renderFormattedText(latestResponse.text)}
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

      {/* Barra de Entrada */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Escribe tu consulta operativa (ej. ¿Cuántos envíos hay en tránsito?, #CR098421734CR)..."
          className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-gris-oscuro placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-azul-primario focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!queryInput.trim() || isLoading}
          className="px-4 py-2 bg-azul-primario hover:bg-azul-oscuro disabled:opacity-40 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Bot, Sparkles, Send, ArrowRight, Zap, Activity, AlertTriangle, 
  BarChart3, CheckCircle2, ChevronRight, ShieldCheck, Users, Package 
} from 'lucide-react';
import { adminAiService } from '../../services/adminAiService';

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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-azul-oscuro rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-slate-700/60 space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md border border-sky-400/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>Copiloto Inteligente de Operaciones (IA)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold tracking-wider uppercase">
                  En Vivo
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3 text-sky-400 animate-pulse" />
              <span>Conectado a la base de datos de <strong className="text-white">{currentBranch}</strong> ({periodLabel})</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenFullCopilot(queryInput)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-semibold transition self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Abrir Copiloto Completo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Consultas Rápidas de Administración:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickAsk('Resumen operativo general')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-sky-950/80 text-slate-300 hover:text-sky-200 border border-slate-700 hover:border-sky-500/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📊 Resumen General</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('¿Cuáles envíos presentan incidencias o demoras?')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>⚠️ Envíos con Incidencias</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Rendimiento en Alajuela vs San José')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🏢 Sede Alajuela vs San José</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Auditoría de usuarios y personal')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>👥 Usuarios y Personal</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Estado de reclamos y tickets PQRS')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-amber-950/80 text-slate-300 hover:text-amber-200 border border-slate-700 hover:border-amber-500/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>📋 Reclamos PQRS</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAsk('Recomendaciones de optimización IA')}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-purple-950/80 text-slate-300 hover:text-purple-200 border border-slate-700 hover:border-purple-500/50 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🧠 Recomendaciones IA</span>
          </button>
        </div>
      </div>

      {/* Inline Quick Result Box if an answer is generated */}
      {latestResponse && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700/80 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-md border border-sky-500/20">
              {latestResponse.dataBadge || 'Respuesta Oficial IA'}
            </span>
            <button
              type="button"
              onClick={() => onOpenFullCopilot(queryInput)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition"
            >
              <span>Continuar en Copiloto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-1">
            {latestResponse.text}
          </div>

          {latestResponse.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
              {latestResponse.metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-medium">{m.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-sky-400">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Escribe tu consulta operativa (ej. ¿Cuántos envíos hay en tránsito?, #CR098421734CR)..."
          className="flex-1 bg-slate-950/70 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition"
        />
        <button
          type="submit"
          disabled={!queryInput.trim() || isLoading}
          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-azul-primario hover:from-sky-500 hover:to-azul-oscuro disabled:opacity-40 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
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

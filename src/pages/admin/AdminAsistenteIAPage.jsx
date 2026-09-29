import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, CheckCircle2, AlertCircle, Clock, Zap, Search, Activity, Cpu, ArrowRight
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { iaLogsService } from '../../services/iaLogsService';

export const AdminAsistenteIAPage = () => {
  const { openCopilot } = useOutletContext() || {};
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await iaLogsService.getAll();
      setLogs(data);
    };
    load();
  }, []);

  const filteredLogs = logs.filter(l =>
    l.consulta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.intencion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminTopbar 
        currentSection="Asistente IA (Logs & NLP)" 
        actionButton={
          <button
            type="button"
            onClick={() => openCopilot && openCopilot('')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-sky-400/50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>Lanzar Copiloto Admin</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>
        }
      />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Auditoría de Conversaciones e Inteligencia Natural (NLP)
          </h1>
          <p className="text-xs text-gray-500">
            Monitoreo en tiempo real de consultas ciudadanas, detección de intenciones y tasa de resolución automática.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Consultas Atendidas"
            value="1,290"
            delta="Mes en curso"
            deltaType="neutral"
            icon={Bot}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Resueltas por IA"
            value="94%"
            delta="Alta precisión"
            deltaType="positive"
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Escaladas a Asesor"
            value="6%"
            delta="Casos complejos"
            deltaType="neutral"
            icon={AlertCircle}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Tiempo de Respuesta"
            value="1.2s"
            delta="⚡ Ultrarrápido"
            deltaType="positive"
            icon={Zap}
            iconBg="bg-purple-100 text-purple-700"
          />
        </div>

        {/* 2 Column Split (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Logs Table (8 cols ~ 70%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-azul-oscuro">Registro de Logs en Vivo</h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar por texto, intención..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border text-xs bg-gray-50 focus:bg-white w-52"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <th className="py-2.5 px-3">Hora</th>
                    <th className="py-2.5 px-3">Usuario</th>
                    <th className="py-2.5 px-3">Consulta Ciudadana</th>
                    <th className="py-2.5 px-3">Intención NLP</th>
                    <th className="py-2.5 px-3">Confianza</th>
                    <th className="py-2.5 px-3 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-2.5 px-3 font-mono text-gray-500 text-[11px]">
                        {log.hora}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-gris-oscuro">
                        {log.usuario}
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 italic max-w-[200px] truncate">
                        "{log.consulta}"
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="badge-azul text-[10px]">
                          {log.intencion}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-azul-oscuro">
                        {log.confianza}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.resultado === 'Resuelto'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.resultado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 pt-1">
              <span>{filteredLogs.length} eventos registrados</span>
              <span className="text-emerald-600 font-semibold">● Motor activo en streaming</span>
            </div>

          </div>

          {/* Right Column: Intenciones & Estado del Modelo (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Acceso Directo al Copiloto Operativo IA */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-azul-oscuro p-5 rounded-2xl border border-slate-700/80 text-white space-y-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                    Copiloto Operativo IA
                  </h3>
                  <p className="text-[10px] text-sky-300">Inteligencia Administrativa en Vivo</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Interactúa directamente con la IA para auditar envíos con incidencias, consultar el rendimiento de cualquier sede y analizar usuarios o PQRS.
              </p>
              <button
                type="button"
                onClick={() => openCopilot && openCopilot('')}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-azul-primario hover:from-sky-500 hover:to-azul-oscuro text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Abrir Chat de IA para Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Intenciones Más Frecuentes */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Intenciones Más Frecuentes
              </h3>

              <div className="space-y-2.5 pt-1">
                {[
                  { intent: 'rastreo_envio', pct: '46%', color: 'bg-azul-primario' },
                  { intent: 'cotizar_tarifa', pct: '24%', color: 'bg-verde-principal' },
                  { intent: 'consulta_horario', pct: '16%', color: 'bg-amber-500' },
                  { intent: 'reclamo_daño', pct: '14%', color: 'bg-rose-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-mono text-gray-600 font-bold">{item.intent}</span>
                      <span className="font-bold text-gris-oscuro">{item.pct}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado del Modelo */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Estado del Modelo NLP
              </h3>

              <div className="space-y-2 text-gray-600 pt-1 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border">
                  <span>Motor NLP Conectado</span>
                  <span className="text-emerald-700 font-bold">Activo (v2.4)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border">
                  <span>Base de Conocimiento</span>
                  <span className="text-emerald-700 font-bold">Sincronizada</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border">
                  <span>Latencia de Inferencia</span>
                  <span className="font-mono text-azul-primario font-bold">240 ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border">
                  <span>Entrenamiento UPU CR</span>
                  <span className="text-gray-500">Actualizado hoy</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleIcon } from '../../components/common/GoogleIcon';
import { citasService } from '../../services/citasService';
import { updateItem } from '../../services/api';

const ESTADO_CONFIG = {
  Confirmada: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'check_circle', dot: 'bg-emerald-500' },
  Cancelada: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: 'cancel', dot: 'bg-red-500' },
  Completada: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', icon: 'task_alt', dot: 'bg-sky-500' },
  Pendiente: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: 'schedule', dot: 'bg-amber-500' },
};

const FILTROS_ESTADO = ['Todas', 'Confirmada', 'Completada', 'Cancelada'];

export const AdminCitasPremiumPage = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // ─── Carga de citas desde la API/localStorage ──────────
  const fetchCitas = useCallback(async () => {
    try {
      const all = await citasService.getAll();
      setCitas(all.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error cargando citas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial + polling cada 10 segundos (tiempo real)
  useEffect(() => {
    fetchCitas();
    const interval = setInterval(fetchCitas, 10000);
    return () => clearInterval(interval);
  }, [fetchCitas]);

  // ─── Acciones del admin ────────────────────────────────
  const handleCompletar = async (id) => {
    try {
      await updateItem('citas', id, { estado: 'Completada' });
      fetchCitas();
    } catch (err) {
      console.error('Error al completar cita:', err);
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('¿Cancelar esta cita? Se notificará al cliente.')) return;
    await citasService.cancel(id);
    fetchCitas();
  };

  // ─── Filtrado ──────────────────────────────────────────
  const filteredCitas = citas.filter((c) => {
    const matchSearch =
      (c.usuario || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.codigoCita || c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.sucursal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.tramiteLabel || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filtroEstado === 'Todas' || c.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  // ─── Métricas resumen ──────────────────────────────────
  const totalConfirmadas = citas.filter((c) => c.estado === 'Confirmada').length;
  const totalCompletadas = citas.filter((c) => c.estado === 'Completada').length;
  const totalCanceladas = citas.filter((c) => c.estado === 'Cancelada').length;
  const ingresoTotal = citas
    .filter((c) => c.estado !== 'Cancelada')
    .reduce((sum, c) => sum + (c.monto || 5000), 0);

  const citasHoy = citas.filter((c) => {
    const hoy = new Date().toISOString().split('T')[0];
    return c.fecha === hoy && c.estado === 'Confirmada';
  }).length;

  // ─── RENDER ────────────────────────────────────────────
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-400/30">
              <GoogleIcon name="bolt" size={22} className="text-white" filled />
            </div>
            Agenda VIP · Fila Cero
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Citas premium reservadas por clientes en tiempo real · Última sync:{' '}
            <span className="font-mono text-xs text-blue-600">
              {lastUpdate.toLocaleTimeString('es-CR')}
            </span>
          </p>
        </div>

        <button
          onClick={fetchCitas}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
        >
          <GoogleIcon name="refresh" size={16} className="text-blue-600" />
          Actualizar ahora
        </button>
      </div>

      {/* ── KPIs ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Citas', value: citas.length, icon: 'event', color: 'blue' },
          { label: 'Hoy Pendientes', value: citasHoy, icon: 'today', color: 'amber' },
          { label: 'Confirmadas', value: totalConfirmadas, icon: 'check_circle', color: 'emerald' },
          { label: 'Completadas', value: totalCompletadas, icon: 'task_alt', color: 'sky' },
          { label: 'Ingresos', value: `₡${ingresoTotal.toLocaleString()}`, icon: 'payments', color: 'violet' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-${kpi.color}-100 flex items-center justify-center`}>
                <GoogleIcon name={kpi.icon} size={17} className={`text-${kpi.color}-600`} filled />
              </div>
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{kpi.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ── Barra de filtros ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <GoogleIcon name="search" size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, código o sucursal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white text-sm shadow-sm"
          />
        </div>

        {/* Filtro por estado */}
        <div className="flex gap-1.5">
          {FILTROS_ESTADO.map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filtroEstado === f
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
              {f !== 'Todas' && (
                <span className="ml-1 opacity-70">
                  ({citas.filter((c) => c.estado === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabla de Citas ────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Cargando citas en tiempo real...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sucursal & Trámite</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha & Hora</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Pago</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCitas.map((cita) => {
                  const estadoCfg = ESTADO_CONFIG[cita.estado] || ESTADO_CONFIG.Pendiente;
                  return (
                    <tr key={cita.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Cliente */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 text-sm">
                            {(cita.usuario || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{cita.usuario || 'Cliente'}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{cita.codigoCita || cita.id}</p>
                            {cita.correo && <p className="text-[10px] text-gray-400">{cita.correo}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Sucursal & Trámite */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                            <GoogleIcon name="location_on" size={14} className="text-gray-400" />
                            {cita.sucursal}
                          </p>
                          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded inline-block">
                            {cita.tramiteLabel || cita.tramite}
                          </span>
                        </div>
                      </td>

                      {/* Fecha & Hora */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <GoogleIcon name="calendar_today" size={14} className="text-gray-400" />
                            {cita.fecha}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <GoogleIcon name="schedule" size={14} className="text-gray-400" />
                            {cita.hora}
                          </p>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${estadoCfg.bg} ${estadoCfg.text} ${estadoCfg.border}`}>
                          <GoogleIcon name={estadoCfg.icon} size={13} filled />
                          {cita.estado}
                        </span>
                      </td>

                      {/* Pago */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-slate-700">
                          ₡{Number(cita.monto || 5000).toLocaleString()}
                        </span>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          {cita.estado !== 'Cancelada' ? '✓ Pagado' : '↩ Reembolso'}
                        </p>
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition">
                          {cita.estado === 'Confirmada' && (
                            <>
                              <button
                                onClick={() => handleCompletar(cita.id)}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <GoogleIcon name="check" size={13} />
                                Atendido
                              </button>
                              <button
                                onClick={() => handleCancelar(cita.id)}
                                className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <GoogleIcon name="close" size={13} />
                                Cancelar
                              </button>
                            </>
                          )}
                          {cita.estado === 'Completada' && (
                            <span className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                              <GoogleIcon name="task_alt" size={13} filled />
                              Finalizada
                            </span>
                          )}
                          {cita.estado === 'Cancelada' && (
                            <span className="text-xs text-gray-400 font-semibold">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCitas.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <GoogleIcon name="event_busy" size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm font-medium">
                        {searchTerm || filtroEstado !== 'Todas'
                          ? 'No se encontraron citas con esos filtros'
                          : 'Aún no hay citas premium agendadas'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Las citas aparecerán aquí cuando los clientes las reserven desde el portal
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sincronización automática cada 10 segundos</span>
        </div>
        <span>{filteredCitas.length} de {citas.length} citas mostradas</span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, CheckCircle2, MessageSquare, Download, ArrowUpRight, 
  Clock, MapPin, Eye, Edit, Trash2, Calendar
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { enviosService } from '../../services/enviosService';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getBranchDashboardData } from '../../data/branchDashboardData';

export const AdminDashboardPage = () => {
  const [envios, setEnvios] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('Sucursal Central San José');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    const load = async () => {
      const data = await enviosService.getAll();
      setEnvios(data);
    };
    load();
  }, []);

  // Obtenemos los datos dinámicos y porcentajes exclusivos de la sede y período seleccionado
  const branchData = getBranchDashboardData(selectedBranch, selectedPeriod);
  const { 
    stats, 
    estados: estadosData, 
    servicios: serviciosData, 
    enviosPorMes, 
    chartData,
    chartTitulo,
    periodoBadge,
    periodLabel,
    actividadReciente, 
    picoMesTexto, 
    subtitulo, 
    nombreCorto 
  } = branchData;

  const exportCSV = () => {
    const periodSlug = typeof selectedPeriod === 'object' ? 'personalizado' : selectedPeriod;
    const headers = 'ID,Guia,Remitente,Destinatario,Servicio,Estado,Fecha,Sede\n';
    const rows = envios.map(e => `${e.id},${e.guia},"${e.remitente}","${e.destinatario}","${e.servicio}",${e.estado},${e.fecha},"${selectedBranch}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `envios-sip-cr-${nombreCorto.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${periodSlug}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Topbar con selector de sede y selector de período activo */}
      <AdminTopbar
        currentSection="Dashboard Ejecutivo"
        showDatePicker={true}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        actionButton={
          <button onClick={exportCSV} className="btn-neutro text-xs py-1.5 px-3">
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        }
      />

      <div className="px-6 space-y-6">
        
        {/* Page Title & Subtitle */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
              Centro de Operaciones y Monitoreo Postal
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-azul-primario border border-sky-200">
              {nombreCorto}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>{periodLabel || 'Últimos 30 días'}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {subtitulo}
          </p>
        </div>

        {/* 4 Stat Cards con valores y porcentajes dinámicos por sede y período */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Envíos Registrados"
            value={stats.registrados.valor}
            delta={stats.registrados.delta}
            deltaType={stats.registrados.deltaType}
            icon={Package}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Envíos en Tránsito"
            value={stats.transito.valor}
            delta={stats.transito.delta}
            deltaType={stats.transito.deltaType}
            icon={Truck}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Envíos Entregados"
            value={stats.entregados.valor}
            delta={stats.entregados.delta}
            deltaType={stats.entregados.deltaType}
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Consultas de Usuarios"
            value={stats.consultas.valor}
            delta={stats.consultas.delta}
            deltaType={stats.consultas.deltaType}
            icon={MessageSquare}
            iconBg="bg-purple-100 text-purple-700"
          />
        </div>

        {/* Charts Row: Monthly / Temporal Trend & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Trend Chart adaptado al período (8 cols) */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-azul-oscuro">{chartTitulo || 'Evolución de Envíos'}</h3>
                <p className="text-[11px] text-gray-500">{picoMesTexto}</p>
              </div>
              <span className="badge-azul text-[10px]">{periodoBadge || '30 días'}</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData || enviosPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #E2E8F0' }}
                    formatter={(val) => [`${val.toLocaleString()} guías`, 'Envíos']}
                  />
                  <Line
                    type="monotone"
                    dataKey="envios"
                    stroke="#0066A1"
                    strokeWidth={3}
                    dot={{ fill: '#0066A1', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Donut Chart (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-azul-oscuro">Estado de los Envíos</h3>
              <p className="text-[11px] text-gray-500">Resolución de retenciones aduanales — Promedio 3.2 días</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estadosData}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {estadosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, 'Porcentaje']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {estadosData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 truncate">{item.name}:</span>
                  <span className="font-bold text-gris-oscuro">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 2-Column Split: Table (70%) + Recent Activity Timeline (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Table: Últimos Envíos Registrados (8 cols ~ 70%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-azul-oscuro">Últimos Envíos Registrados</h3>
                <p className="text-[11px] text-gray-500">Monitoreo continuo de admisión y despacho en sucursales</p>
              </div>
              <Link to="/admin/envios" className="text-xs font-bold text-azul-primario hover:underline">
                Ver todos (3.4k) →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                    <th className="py-3 px-4">Número de Guía</th>
                    <th className="py-3 px-4">Cliente / Remitente</th>
                    <th className="py-3 px-4">Servicio</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Fecha y Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {envios.slice(0, 6).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-azul-oscuro">
                        #{item.guia}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {item.remitente}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.servicio}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.estado} size="xs" />
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-[11px]">
                        {item.fecha} · 10:15 am
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
              <span>Mostrando 6 de {envios.length} envíos</span>
              <span>Actualizado hace 2 segundos</span>
            </div>
          </div>

          {/* Side Panel: Actividad Reciente & Distribución (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tipo de Servicio Bars */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                Tipo de Servicio (% de Volumen)
              </h3>
              <div className="space-y-3 pt-1">
                {serviciosData.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-600">{s.servicio}</span>
                      <span className="font-bold text-gris-oscuro">{s.porcentaje}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${s.porcentaje}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline: Actividad Reciente */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                  Actividad Reciente
                </h3>
                <span className="text-[10px] text-gray-400">En tiempo real</span>
              </div>

              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {actividadReciente.map((act, idx) => (
                  <div key={idx} className="relative pl-6 space-y-0.5 text-xs">
                    <span className={`absolute left-0 top-1 w-4 h-4 rounded-full ${act.color} ring-4 ring-white`}></span>
                    <p className="font-medium text-gris-oscuro text-[11px] leading-snug">{act.text}</p>
                    <span className="text-[10px] text-gray-400 block">{act.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 text-center">
                <Link to="/admin/asistente-ia" className="text-xs font-semibold text-azul-primario hover:underline">
                  Ver log completo del sistema →
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

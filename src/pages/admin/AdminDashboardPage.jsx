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

export const AdminDashboardPage = () => {
  const [envios, setEnvios] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await enviosService.getAll();
      setEnvios(data);
    };
    load();
  }, []);

  // Data for "Envíos por Mes" (Line chart with peak in June: 15,420)
  const enviosPorMes = [
    { mes: 'Ene', envios: 10200 },
    { mes: 'Feb', envios: 11450 },
    { mes: 'Mar', envios: 12800 },
    { mes: 'Abr', envios: 13600 },
    { mes: 'May', envios: 14200 },
    { mes: 'Jun', envios: 15420 },
    { mes: 'Jul', envios: 14100 },
    { mes: 'Ago', envios: 13900 },
    { mes: 'Set', envios: 14500 },
    { mes: 'Oct', envios: 14820 },
    { mes: 'Nov', envios: 15100 },
    { mes: 'Dic', envios: 15300 },
  ];

  // Data for "Tipo de Servicio" (Horizontal bars)
  const serviciosData = [
    { servicio: 'Pymexpress', porcentaje: 40, color: '#78BE20' },
    { servicio: 'EMS Internacional', porcentaje: 28, color: '#0066A1' },
    { servicio: 'Paquete Postal', porcentaje: 22, color: '#004B78' },
    { servicio: 'Box Miami / API', porcentaje: 10, color: '#F59E0B' },
  ];

  // Data for "Estado de los Envíos" (Donut)
  const estadosData = [
    { name: 'Entregado', value: 75, color: '#78BE20' },
    { name: 'En tránsito', value: 20, color: '#0066A1' },
    { name: 'Aduanas', value: 3, color: '#F59E0B' },
    { name: 'Incidencias', value: 2, color: '#EF4444' },
  ];

  const exportCSV = () => {
    const headers = 'ID,Guia,Remitente,Destinatario,Servicio,Estado,Fecha\n';
    const rows = envios.map(e => `${e.id},${e.guia},"${e.remitente}","${e.destinatario}","${e.servicio}",${e.estado},${e.fecha}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `envios-sip-cr-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Topbar */}
      <AdminTopbar
        currentSection="Dashboard Ejecutivo"
        showDatePicker={true}
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
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Centro de Operaciones y Monitoreo Postal
          </h1>
          <p className="text-xs text-gray-500">
            Vista general del flujo nacional e internacional de paquetería, aduanas y atenciones ciudadanas.
          </p>
        </div>

        {/* 4 Stat Cards (Prompt section 7.0) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Envíos Registrados"
            value="14,820"
            delta="+12.4%"
            deltaType="positive"
            icon={Package}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Envíos en Tránsito"
            value="3,415"
            delta="112 rutas"
            deltaType="neutral"
            icon={Truck}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Envíos Entregados"
            value="11,180"
            delta="98.2% a tiempo"
            deltaType="positive"
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Consultas de Usuarios"
            value="1,290"
            delta="94% IA resueltas"
            deltaType="positive"
            icon={MessageSquare}
            iconBg="bg-purple-100 text-purple-700"
          />
        </div>

        {/* Charts Row: Monthly Shipments & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Monthly Trend (8 cols) */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-azul-oscuro">Envíos por Mes — Evolución 2024</h3>
                <p className="text-[11px] text-gray-500">Pico máximo registrado en Junio con 15,420 guías</p>
              </div>
              <span className="badge-azul text-[10px]">Anual</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enviosPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                {[
                  { time: 'Hace 4 minutos', text: 'Paquete #CR098421734CR ingresó a Hub Alajuela', color: 'bg-azul-primario' },
                  { time: 'Hace 12 minutos', text: 'Guía #CR109283745CR entregada con firma digital', color: 'bg-verde-principal' },
                  { time: 'Hace 28 minutos', text: 'Ticket PQRS #PQ-2025-0144 clasificado por N8N', color: 'bg-amber-500' },
                  { time: 'Hace 45 minutos', text: 'Cierre de manifiesto aéreo Box Miami #8842', color: 'bg-purple-600' },
                ].map((act, idx) => (
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

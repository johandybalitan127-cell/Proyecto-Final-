import React, { useState } from 'react';
import { 
  BarChart3, FileDown, Calendar, TrendingUp, CheckCircle2, Clock, 
  Package, ShieldCheck, Download
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { useToast } from '../../context/ToastContext';

export const AdminReportesPage = () => {
  const { addToast } = useToast();

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

  const sucursalesData = [
    { sucursal: 'Zapote Central', envios: 4200 },
    { sucursal: 'Alajuela Centro', envios: 2850 },
    { sucursal: 'Heredia Central', envios: 2410 },
    { sucursal: 'Cartago', envios: 1980 },
    { sucursal: 'Liberia', envios: 1350 },
    { sucursal: 'Limón Centro', envios: 1120 },
  ];

  const estadosDonut = [
    { name: 'Entregados', value: 11180, color: '#78BE20' },
    { name: 'En Tránsito', value: 3415, color: '#0066A1' },
    { name: 'En Aduanas', value: 180, color: '#F59E0B' },
    { name: 'Incidencias', value: 45, color: '#EF4444' },
  ];

  const downloadReport = (format) => {
    addToast(`Generando reporte ${format.toUpperCase()} del Sistema Integral Postal (SIP-CR)...`, 'info');
    setTimeout(() => {
      const content = `REPORTE OFICIAL DE RENDIMIENTO POSTAL - CORREOS DE COSTA RICA\nPeríodo: 2024-2025\nTotal Envíos: 14,820\nEfectividad: 98.2%\nTiempo Retención Aduanas: 3.2 días\nGenerado: ${new Date().toLocaleString()}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `reporte-ejecutivo-correos-cr.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      addToast(`Descarga de reporte ${format.toUpperCase()} completada`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <AdminTopbar currentSection="Reportes y Estadísticas" showDatePicker={true} />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Reportes Ejecutivos y Métricas Operacionales
          </h1>
          <p className="text-xs text-gray-500">
            Inteligencia de negocios, trazabilidad de entregas y volumen logístico en las 7 provincias.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Envíos del Período"
            value="14,820"
            delta="Junio pico máximo"
            deltaType="positive"
            icon={Package}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Efectividad de Entrega"
            value="98.2%"
            delta="Normativa UPU"
            deltaType="positive"
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Retención en Aduanas"
            value="3.2 días"
            delta="Agilidad fiscal"
            deltaType="neutral"
            icon={Clock}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Crecimiento Pymexpress"
            value="+18%"
            delta="Mipymes activas"
            deltaType="positive"
            icon={TrendingUp}
            iconBg="bg-purple-100 text-purple-700"
          />
        </div>

        {/* Line Chart: Envíos por Mes — Evolución 2024 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-azul-oscuro">Envíos por Mes — Evolución 2024</h3>
              <p className="text-[11px] text-gray-500">Comportamiento del tráfico postal nacional e internacional</p>
            </div>
            <span className="badge-verde text-[10px]">Ene – Dic 2024</span>
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

        {/* 2 Charts Grid: Bar Chart + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bar Chart: Desempeño por Sucursal */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-azul-oscuro">Desempeño por Sucursal Principal</h3>
              <p className="text-[11px] text-gray-500">Volumen de admisión y entrega por nodo logístico</p>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sucursalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="sucursal" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #E2E8F0' }}
                    formatter={(val) => [`${val} guías`, 'Volumen']}
                  />
                  <Bar dataKey="envios" fill="#78BE20" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Estado de los Envíos & Export Panel */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-azul-oscuro">Distribución del Estado de Envíos</h3>
              <p className="text-[11px] text-gray-500">Trazabilidad en tiempo real sobre 14,820 guías</p>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estadosDonut}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {estadosDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val.toLocaleString()} paquetes`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Export buttons row (Prompt section 7.7) */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => downloadReport('pdf')}
                className="btn-primario text-xs py-2.5 flex-1 justify-center"
              >
                <FileDown className="w-4 h-4" />
                <span>Descargar PDF Ejecutivo</span>
              </button>
              <button
                onClick={() => downloadReport('xlsx')}
                className="btn-neutro text-xs py-2.5 flex-1 justify-center"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Descargar Excel Detallado</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

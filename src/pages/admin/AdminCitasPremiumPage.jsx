import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Zap, CheckCircle2, User, Search } from 'lucide-react';

export const AdminCitasPremiumPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fake data for appointments booked by users
  const [citas, setCitas] = useState([
    {
      id: 'CIT-001',
      usuario: 'María Elena Rojas',
      sucursal: 'San Pedro',
      tramite: 'Retiro de Paquetería',
      fecha: '2026-10-15',
      hora: '10:00 AM',
      estado: 'Confirmada',
      pago: '₡5,000 (Pagado)'
    },
    {
      id: 'CIT-002',
      usuario: 'Inversiones del Valle S.A.',
      sucursal: 'Heredia Centro',
      tramite: 'Envío de Paquetería (Múltiple)',
      fecha: '2026-10-15',
      hora: '01:00 PM',
      estado: 'Confirmada',
      pago: '₡5,000 (Pagado)'
    },
    {
      id: 'CIT-003',
      usuario: 'Andrés Fallas Solano',
      sucursal: 'Zapote Central',
      tramite: 'Trámite de Pasaporte VES',
      fecha: '2026-10-16',
      hora: '08:00 AM',
      estado: 'Confirmada',
      pago: '₡5,000 (Pagado)'
    }
  ]);

  const filteredCitas = citas.filter(c => 
    c.usuario.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sucursal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-500" />
            Agenda VIP (Fila Cero)
          </h1>
          <p className="text-sm text-slate-500 mt-2">Gestiona las citas prioritarias pagadas por los clientes.</p>
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white text-sm w-full md:w-72 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Detalle del Cliente</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sucursal & Trámite</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha & Hora</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado de Pago</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCitas.map(cita => (
                <tr key={cita.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{cita.usuario}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{cita.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {cita.sucursal}
                      </p>
                      <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded inline-block">
                        {cita.tramite}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {cita.fecha}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {cita.hora}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {cita.pago}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                      Atender ahora
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCitas.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-400 text-sm">
                    No se encontraron citas programadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

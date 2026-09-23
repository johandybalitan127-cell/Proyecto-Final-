import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import { enviosService } from '../../services/enviosService';

export const HistorialPage = () => {
  const [envios, setEnvios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await enviosService.getAll();
      setEnvios(data);
    };
    load();
  }, []);

  const filtered = envios.filter((e) =>
    e.guia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.remitente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-azul-oscuro">Historial de Envíos</h1>
          <p className="text-xs text-gray-500">Consulta tus trámites de paquetería recientes y comprobantes</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por guía o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Número de Guía</th>
                <th className="py-3.5 px-4">Servicio</th>
                <th className="py-3.5 px-4">Ruta</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-azul-oscuro">
                    #{item.guia}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-700">
                    {item.servicio}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                    {item.origen} → {item.destino}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {item.fecha}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.estado === 'Entregado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.estado === 'En tránsito'
                        ? 'bg-sky-100 text-azul-oscuro'
                        : item.estado === 'En aduana'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/rastreo/${item.guia}`}
                      className="text-xs font-semibold text-azul-primario hover:underline inline-flex items-center gap-1"
                    >
                      <span>Rastrear</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

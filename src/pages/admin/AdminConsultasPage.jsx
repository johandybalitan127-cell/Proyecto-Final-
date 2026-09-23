import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Clock, CheckCircle2, AlertTriangle, Search, Eye, 
  Edit, Trash2, Workflow, Filter, Send
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { consultasService } from '../../services/consultasService';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminConsultasPage = () => {
  const { addToast } = useToast();
  const [consultas, setConsultas] = useState([]);
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'delete'
  const [resolutionNote, setResolutionNote] = useState('');

  const loadData = async () => {
    const list = await consultasService.getAll();
    setConsultas(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const estados = ['Todos', 'Pendiente', 'En proceso', 'Resuelto'];

  const filtered = consultas.filter((c) => {
    const matchEstado = filterEstado === 'Todos' || c.estado === filterEstado;
    const matchSearch = !searchTerm ||
      c.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.asunto.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchSearch;
  });

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket) return;
    await consultasService.update(selectedTicket.id, {
      estado: newStatus,
      resolucion: resolutionNote || 'Caso tramitado bajo normativa postal'
    });
    addToast(`Ticket #${selectedTicket.ticket} marcado como ${newStatus}`, 'success');
    setModalMode(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;
    await consultasService.delete(selectedTicket.id);
    addToast(`Ticket #${selectedTicket.ticket} descartado`, 'info');
    setModalMode(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <AdminTopbar currentSection="Consultas y Peticiones (PQRS)" />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Gestión de Consultas, Reclamos y Peticiones (PQRS)
          </h1>
          <p className="text-xs text-gray-500">
            Control de tickets con clasificación automatizada e inteligencia de enrutamiento N8N.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total de Tickets"
            value="1,290"
            delta="Período 2024"
            deltaType="neutral"
            icon={MessageSquare}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Pendientes"
            value="14"
            delta="Requieren acción"
            deltaType="negative"
            icon={AlertTriangle}
            iconBg="bg-rose-100 text-rose-700"
          />
          <StatCard
            label="En Proceso"
            value="38"
            delta="En investigación"
            deltaType="neutral"
            icon={Clock}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Resueltos"
            value="1,238"
            delta="96% satisfacción"
            deltaType="positive"
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-verde-principal"
          />
        </div>

        {/* 2-Column Split (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Table Column (8 cols ~ 70%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {estados.map((est) => (
                  <button
                    key={est}
                    onClick={() => setFilterEstado(est)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      filterEstado === est
                        ? 'bg-azul-primario text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {est}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ticket, usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-azul-primario w-48"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <th className="py-3 px-3">Ticket</th>
                    <th className="py-3 px-3">Usuario</th>
                    <th className="py-3 px-3">Asunto</th>
                    <th className="py-3 px-3">Categoría</th>
                    <th className="py-3 px-3">Prioridad</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-azul-oscuro">
                        #{item.ticket}
                      </td>
                      <td className="py-3 px-3 font-medium text-gris-oscuro">
                        <span className="block truncate max-w-[120px]">{item.usuario}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600 truncate max-w-[180px]">
                        {item.asunto}
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge-azul text-[10px]">{item.categoria}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge-gris text-[10px]">{item.prioridad}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.estado === 'Resuelto'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.estado === 'En proceso'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedTicket(item);
                              setModalMode('view');
                            }}
                            className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            title="Ver gestión"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(item);
                              setModalMode('delete');
                            }}
                            className="p-1 rounded-md text-red-500 hover:bg-red-50"
                            title="Eliminar ticket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2">
              <span>Mostrando {filtered.length} de {consultas.length} tickets PQRS</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-azul-primario text-white font-bold">1</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
              </div>
            </div>

          </div>

          {/* Right Column: Tickets por Categoría & N8N Flow Panel (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tickets por Categoría */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Tickets por Categoría
              </h3>

              <div className="space-y-2.5 pt-1">
                {[
                  { label: 'Reclamos por Demora / Daño', pct: '42%', color: 'bg-rose-500' },
                  { label: 'Aduanas & Aforo Fiscal', pct: '28%', color: 'bg-amber-500' },
                  { label: 'Solicitudes Comerciales Pymes', pct: '18%', color: 'bg-azul-primario' },
                  { label: 'Consultas de Información', pct: '12%', color: 'bg-verde-principal' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-bold text-gris-oscuro">{item.pct}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Flujo N8N Activo (Prompt Section 7.5) */}
            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-azul-primario" />
                <h3 className="font-bold text-azul-oscuro">Flujo N8N Activo (PQRS)</h3>
              </div>

              <div className="space-y-2 text-gray-600 text-[11px] leading-relaxed">
                <p>
                  <strong>Flujo de Automatización #2:</strong> Cuando un ciudadano remite una consulta desde el portal web:
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-sky-100 font-mono text-[10px] space-y-1">
                  <div>1. Formulario Web → Webhook N8N</div>
                  <div>2. Clasificador NLP analiza texto y urgencia</div>
                  <div>3. Enrutamiento automático al departamento</div>
                  <div>4. Disparo de correo con acuse de recibo</div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Webhook N8N en escucha activa</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* View / Resolve Modal */}
      <Modal
        isOpen={modalMode === 'view' && !!selectedTicket}
        onClose={() => setModalMode(null)}
        title={`Gestión de Ticket #${selectedTicket?.ticket}`}
        subtitle={`Asunto: ${selectedTicket?.asunto}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 border space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Usuario Solicitante:</span>
              <span className="font-bold text-gris-oscuro">{selectedTicket?.usuario}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fecha de Radicación:</span>
              <span className="font-bold">{selectedTicket?.fecha}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Categoría / Prioridad:</span>
              <span>{selectedTicket?.categoria} · {selectedTicket?.prioridad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Departamento Asignado (N8N):</span>
              <span className="font-semibold text-azul-primario">{selectedTicket?.n8nDepartment || 'Auditoría Postal'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gris-oscuro">Mensaje del Ciudadano:</label>
            <p className="p-3 bg-white border rounded-xl text-gray-700 italic">
              "{selectedTicket?.mensaje || 'Sin detalle adicional'}"
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gris-oscuro">Resolución Oficial:</label>
            <textarea
              rows="2"
              placeholder="Indica la resolución del caso..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => handleUpdateStatus('En proceso')}
              className="btn-neutro text-xs py-2 px-3"
            >
              Marcar En Proceso
            </button>
            <button
              onClick={() => handleUpdateStatus('Resuelto')}
              className="btn-secundario text-xs py-2 px-4"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolver Ticket</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={modalMode === 'delete' && !!selectedTicket}
        onClose={() => setModalMode(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            ¿Deseas eliminar permanentemente el ticket <strong>#{selectedTicket?.ticket}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalMode(null)} className="btn-neutro text-xs py-2 px-3">
              Cancelar
            </button>
            <button onClick={handleDelete} className="btn-alerta text-xs py-2 px-4">
              Eliminar Ticket
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

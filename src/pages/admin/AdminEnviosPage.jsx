import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, CheckCircle2, AlertTriangle, Plus, Search, Eye, 
  Edit, Trash2, Filter, X, Save, AlertCircle, Printer
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { enviosService } from '../../services/enviosService';
import { Modal } from '../../components/common/Modal';
import { StepperTracking } from '../../components/common/StepperTracking';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AdminEnviosPage = () => {
  const { addToast } = useToast();
  const [envios, setEnvios] = useState([]);
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterServicio, setFilterServicio] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Quick form state
  const [quickDestinatario, setQuickDestinatario] = useState('');
  const [quickServicio, setQuickServicio] = useState('EMS Courier Nacional');

  // Modals state
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'delete' | 'create'
  const [editForm, setEditForm] = useState({});

  const loadData = async () => {
    const data = await enviosService.getAll();
    setEnvios(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const estados = ['Todos', 'En tránsito', 'Entregado', 'En aduana', 'Procesando'];
  const servicios = ['Todos', 'EMS Courier Nacional', 'Pymexpress', 'Box Correos Miami', 'Paquete Postal Regular', 'EMS Internacional'];

  const filtered = envios.filter((e) => {
    const matchEstado = filterEstado === 'Todos' || e.estado.toLowerCase() === filterEstado.toLowerCase();
    const matchServicio = filterServicio === 'Todos' || e.servicio.toLowerCase() === filterServicio.toLowerCase();
    const matchSearch = !searchTerm ||
      e.guia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.remitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.destinatario.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchServicio && matchSearch;
  });

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    if (!quickDestinatario.trim()) return;

    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    const newGuia = `CR${randomDigits}CR`;

    const newEnvio = {
      guia: newGuia,
      remitente: 'Ventanilla Central Zapote',
      destinatario: quickDestinatario.trim(),
      servicio: quickServicio,
      origen: 'San José Central',
      destino: 'Alajuela / GAM',
      estado: 'Procesando',
      fecha: new Date().toISOString().split('T')[0],
      ruta: 'Zapote → Hub Central Distribución',
      repartidorId: 'REP-101'
    };

    await enviosService.create(newEnvio);
    addToast(`Guía oficial #${newGuia} generada con éxito`, 'success');
    setQuickDestinatario('');
    loadData();
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedEnvio) return;
    await enviosService.update(selectedEnvio.id, editForm);
    addToast(`Envío #${selectedEnvio.guia} actualizado`, 'success');
    setModalMode(null);
    setSelectedEnvio(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedEnvio) return;
    await enviosService.delete(selectedEnvio.id);
    addToast(`Envío #${selectedEnvio.guia} eliminado del sistema`, 'info');
    setModalMode(null);
    setSelectedEnvio(null);
    loadData();
  };

  const openModal = (envio, mode) => {
    setSelectedEnvio(envio);
    setEditForm(envio || {});
    setModalMode(mode);
  };

  return (
    <div className="space-y-6">
      
      {/* Topbar */}
      <AdminTopbar
        currentSection="Envíos y Paquetería"
        actionButton={
          <button
            onClick={() => {
              setSelectedEnvio(null);
              setEditForm({
                guia: `CR${Math.floor(100000000 + Math.random() * 900000000)}CR`,
                remitente: '',
                destinatario: '',
                servicio: 'EMS Courier Nacional',
                origen: 'San José Central',
                destino: 'Heredia Centro',
                estado: 'En tránsito',
                fecha: new Date().toISOString().split('T')[0],
                ruta: 'San José → Zapote → Heredia'
              });
              setModalMode('create');
            }}
            className="btn-primario text-xs py-1.5 px-3"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Envío</span>
          </button>
        }
      />

      <div className="px-6 space-y-6">
        
        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Gestión Integral de Envíos y Guías Postales
          </h1>
          <p className="text-xs text-gray-500">
            Control de admisión, centros de clasificación, aduanas y confirmación de entrega en ruta.
          </p>
        </div>

        {/* 4 Stat Cards */}
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
            label="En Tránsito"
            value="3,415"
            delta="112 rutas"
            deltaType="neutral"
            icon={Truck}
            iconBg="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Entregados"
            value="11,180"
            delta="98.2%"
            deltaType="positive"
            icon={CheckCircle2}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Incidencias / Aduanas"
            value="112"
            delta="Revisión manual"
            deltaType="negative"
            icon={AlertTriangle}
            iconBg="bg-rose-100 text-rose-700"
          />
        </div>

        {/* 2-Column Layout (≈70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Table Column (8 cols ~ 70%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden space-y-4 p-5">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {estados.map((est) => (
                  <button
                    key={est}
                    onClick={() => setFilterEstado(est)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      filterEstado === est
                        ? 'bg-azul-primario text-white shadow-2xs'
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
                  placeholder="Buscar guía, cliente..."
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
                    <th className="py-3 px-3">Guía</th>
                    <th className="py-3 px-3">Cliente / Remitente</th>
                    <th className="py-3 px-3">Servicio</th>
                    <th className="py-3 px-3">Ruta</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3">Fecha</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-azul-oscuro">
                        #{item.guia}
                      </td>
                      <td className="py-3 px-3 text-gris-oscuro font-medium">
                        <span className="block truncate max-w-[120px]">{item.remitente}</span>
                        <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">Para: {item.destinatario}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {item.servicio}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-[11px]">
                        <span className="block truncate max-w-[130px]">{item.origen} → {item.destino}</span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={item.estado} size="xs" />
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-[11px] whitespace-nowrap">
                        {item.fecha}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openModal(item, 'view')}
                            className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            title="Ver detalle"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openModal(item, 'edit')}
                            className="p-1 rounded-md text-azul-primario hover:bg-sky-50"
                            title="Editar envío"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openModal(item, 'delete')}
                            className="p-1 rounded-md text-red-500 hover:bg-red-50"
                            title="Eliminar registro"
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

            {/* Pagination & Footer */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2">
              <span>Mostrando 1–{filtered.length} de {envios.length} registros</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-azul-primario text-white font-bold">1</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">3</button>
              </div>
            </div>

          </div>

          {/* Right Column: Distribución & Mini-Formulario (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Mini-formulario "Nuevo Envío Rápido" */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-verde-principal" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                  Nuevo Envío Rápido
                </h3>
              </div>

              <form onSubmit={handleQuickCreate} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500">Número de Guía (Autogenerado):</label>
                  <input
                    type="text"
                    disabled
                    value="Autogenerado al emitir"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-xs font-mono text-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600">Destinatario:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre del cliente..."
                    value={quickDestinatario}
                    onChange={(e) => setQuickDestinatario(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-azul-primario"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600">Tipo de Servicio:</label>
                  <select
                    value={quickServicio}
                    onChange={(e) => setQuickServicio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-azul-primario"
                  >
                    <option value="EMS Courier Nacional">EMS Courier Nacional</option>
                    <option value="Pymexpress">Pymexpress</option>
                    <option value="Box Correos Miami">Box Correos Miami</option>
                    <option value="Paquete Postal Regular">Paquete Postal Regular</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-secundario text-xs py-2.5 font-bold justify-center"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Generar Guía</span>
                </button>
              </form>
            </div>

            {/* Distribución por Servicio (Barras de progreso) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                Distribución por Servicio
              </h3>

              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'EMS Courier', count: '48%', color: 'bg-azul-primario' },
                  { label: 'Pymexpress', count: '32%', color: 'bg-verde-principal' },
                  { label: 'Box Correos Miami', count: '12%', color: 'bg-amber-500' },
                  { label: 'Internacional UPU', count: '8%', color: 'bg-purple-600' },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">{s.label}</span>
                      <span className="font-bold text-gris-oscuro">{s.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color}`} style={{ width: s.count }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* View Detail Modal */}
      <Modal
        isOpen={modalMode === 'view' && !!selectedEnvio}
        onClose={() => setModalMode(null)}
        title={`Detalle de Envío #${selectedEnvio?.guia}`}
        subtitle={`${selectedEnvio?.servicio} · Registrado el ${selectedEnvio?.fecha}`}
      >
        <div className="space-y-4">
          <StepperTracking envio={selectedEnvio} />

          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px]">Remitente</span>
              <p className="font-bold text-gris-oscuro">{selectedEnvio?.remitente}</p>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px]">Destinatario</span>
              <p className="font-bold text-gris-oscuro">{selectedEnvio?.destinatario}</p>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px]">Origen / Destino</span>
              <p className="text-gray-700">{selectedEnvio?.origen} → {selectedEnvio?.destino}</p>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px]">Repartidor Asignado</span>
              <p className="text-gray-700">{selectedEnvio?.repartidorId || 'ZAP-04'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="btn-neutro text-xs py-2 px-3"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Guía</span>
            </button>
            <button
              onClick={() => setModalMode(null)}
              className="btn-primario text-xs py-2 px-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={(modalMode === 'edit' || modalMode === 'create') && !!editForm}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Nuevo Envío Postal' : `Editar Envío #${editForm?.guia}`}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (modalMode === 'create') {
              await enviosService.create(editForm);
              addToast(`Envío #${editForm.guia} creado`, 'success');
            } else {
              await enviosService.update(selectedEnvio.id, editForm);
              addToast(`Envío #${editForm.guia} actualizado`, 'success');
            }
            setModalMode(null);
            loadData();
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Número de Guía:</label>
              <input
                type="text"
                required
                value={editForm.guia || ''}
                onChange={(e) => setEditForm({ ...editForm, guia: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Estado:</label>
              <select
                value={editForm.estado || 'Procesando'}
                onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
              >
                <option value="Procesando">Procesando</option>
                <option value="En tránsito">En tránsito</option>
                <option value="En aduana">En aduana</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Remitente:</label>
              <input
                type="text"
                required
                value={editForm.remitente || ''}
                onChange={(e) => setEditForm({ ...editForm, remitente: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Destinatario:</label>
              <input
                type="text"
                required
                value={editForm.destinatario || ''}
                onChange={(e) => setEditForm({ ...editForm, destinatario: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Origen:</label>
              <input
                type="text"
                value={editForm.origen || ''}
                onChange={(e) => setEditForm({ ...editForm, origen: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Destino:</label>
              <input
                type="text"
                value={editForm.destino || ''}
                onChange={(e) => setEditForm({ ...editForm, destino: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Servicio:</label>
            <input
              type="text"
              value={editForm.servicio || ''}
              onChange={(e) => setEditForm({ ...editForm, servicio: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border text-xs"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalMode(null)}
              className="btn-neutro text-xs py-2 px-3"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primario text-xs py-2 px-4">
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalMode === 'delete' && !!selectedEnvio}
        onClose={() => setModalMode(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            ¿Estás seguro de que deseas eliminar permanentemente el envío con guía <strong>#{selectedEnvio?.guia}</strong>? Esta acción no se puede revertir en el sistema postal.
          </p>

          <div className="flex justify-end gap-2">
            <button onClick={() => setModalMode(null)} className="btn-neutro text-xs py-2 px-3">
              Cancelar
            </button>
            <button onClick={handleDelete} className="btn-alerta text-xs py-2 px-4">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Descartar Envío</span>
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

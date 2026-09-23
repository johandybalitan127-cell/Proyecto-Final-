import React, { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Globe, Plus, Search, Eye, Edit, Trash2, Save, Building
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { sucursalesService } from '../../services/sucursalesService';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminSucursalesPage = () => {
  const { addToast } = useToast();
  const [sucursales, setSucursales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [provFilter, setProvFilter] = useState('Todas');

  // Form state
  const [newBranch, setNewBranch] = useState({
    nombre: '',
    provincia: 'San José',
    direccion: '',
    lat: 9.93,
    lng: -84.08,
    horario: 'Lun–Vie 8:00 a.m.–5:00 p.m.',
    estado: 'Abierto'
  });

  const [modalMode, setModalMode] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadData = async () => {
    const list = await sucursalesService.getAll();
    setSucursales(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const provincias = ['Todas', 'San José', 'Alajuela', 'Heredia', 'Cartago', 'Guanacaste', 'Puntarenas', 'Limón'];

  const filtered = sucursales.filter((s) => {
    const matchProv = provFilter === 'Todas' || s.provincia === provFilter;
    const matchSearch = !searchTerm ||
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.direccion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProv && matchSearch;
  });

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!newBranch.nombre || !newBranch.direccion) return;

    await sucursalesService.create(newBranch);
    addToast(`Sucursal "${newBranch.nombre}" agregada con éxito`, 'success');
    setNewBranch({
      nombre: '',
      provincia: 'San José',
      direccion: '',
      lat: 9.93,
      lng: -84.08,
      horario: 'Lun–Vie 8:00 a.m.–5:00 p.m.',
      estado: 'Abierto'
    });
    loadData();
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      await sucursalesService.create(editForm);
      addToast('Sucursal creada exitosamente', 'success');
    } else {
      await sucursalesService.update(selectedBranch.id, editForm);
      addToast(`Sucursal ${editForm.nombre} actualizada`, 'success');
    }
    setModalMode(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedBranch) return;
    await sucursalesService.delete(selectedBranch.id);
    addToast(`Sucursal ${selectedBranch.nombre} eliminada`, 'info');
    setModalMode(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <AdminTopbar
        currentSection="Oficinas y Sucursales"
        actionButton={
          <button
            onClick={() => {
              setSelectedBranch(null);
              setEditForm({
                nombre: '',
                provincia: 'San José',
                direccion: '',
                lat: 9.928,
                lng: -84.08,
                horario: 'Lun–Vie 8:00 a.m.–5:00 p.m.',
                estado: 'Abierto',
                telefono: '(+506) 2257-8888'
              });
              setModalMode('create');
            }}
            className="btn-primario text-xs py-1.5 px-3"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Sucursal</span>
          </button>
        }
      />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Red de Oficinas y Sucursales Postales
          </h1>
          <p className="text-xs text-gray-500">
            Administración de las 110 sucursales, geolocalización de ventanillas y horarios en las 7 provincias.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Sucursales Activas"
            value="110"
            delta="100% red"
            deltaType="positive"
            icon={Building}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Provincias Cubiertas"
            value="7"
            delta="84 cantones"
            deltaType="positive"
            icon={Globe}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Casilleros / API"
            value="64"
            delta="Puntos activos"
            deltaType="neutral"
            icon={MapPin}
            iconBg="bg-purple-100 text-purple-700"
          />
          <StatCard
            label="Espera Promedio"
            value="6.4 min"
            delta="-18% con VES"
            deltaType="positive"
            icon={Clock}
            iconBg="bg-amber-100 text-amber-700"
          />
        </div>

        {/* 2 Column Layout (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Table Column (8 cols ~ 70%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {provincias.map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvFilter(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      provFilter === p
                        ? 'bg-azul-primario text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar sucursal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-azul-primario w-44"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <th className="py-3 px-3">Sucursal</th>
                    <th className="py-3 px-3">Provincia</th>
                    <th className="py-3 px-3">Dirección</th>
                    <th className="py-3 px-3">Horario</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-3 font-semibold text-gris-oscuro">
                        <span className="block truncate max-w-[150px]">{item.nombre}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge-azul text-[10px]">{item.provincia}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-[11px] truncate max-w-[160px]">
                        {item.direccion}
                      </td>
                      <td className="py-3 px-3 text-gray-600 text-[11px] truncate max-w-[130px]">
                        {item.horario}
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge-verde text-[10px]">
                          ● {item.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedBranch(item);
                              setEditForm(item);
                              setModalMode('edit');
                            }}
                            className="p-1 rounded-md text-azul-primario hover:bg-sky-50"
                            title="Editar sucursal"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBranch(item);
                              setModalMode('delete');
                            }}
                            className="p-1 rounded-md text-red-500 hover:bg-red-50"
                            title="Eliminar sucursal"
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
              <span>Mostrando {filtered.length} de {sucursales.length} sucursales</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-azul-primario text-white font-bold">1</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
              </div>
            </div>

          </div>

          {/* Right Column: Cobertura por Provincia & Formulario (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Formulario Nueva Sucursal */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-verde-principal" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                  Nueva Sucursal
                </h3>
              </div>

              <form onSubmit={handleCreateBranch} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Nombre de la Sucursal:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sucursal Moravia Centro"
                    value={newBranch.nombre}
                    onChange={(e) => setNewBranch({ ...newBranch, nombre: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Provincia:</label>
                  <select
                    value={newBranch.provincia}
                    onChange={(e) => setNewBranch({ ...newBranch, provincia: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs bg-white"
                  >
                    {provincias.filter(p => p !== 'Todas').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Dirección Exacta:</label>
                  <input
                    type="text"
                    required
                    placeholder="Frente a parque..."
                    value={newBranch.direccion}
                    onChange={(e) => setNewBranch({ ...newBranch, direccion: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500">Latitud:</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newBranch.lat}
                      onChange={(e) => setNewBranch({ ...newBranch, lat: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 rounded border text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500">Longitud:</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={newBranch.lng}
                      onChange={(e) => setNewBranch({ ...newBranch, lng: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 rounded border text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Horario Oficial:</label>
                  <input
                    type="text"
                    value={newBranch.horario}
                    onChange={(e) => setNewBranch({ ...newBranch, horario: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border text-xs"
                  />
                </div>

                <button type="submit" className="w-full btn-secundario text-xs py-2 font-bold justify-center">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar Sucursal</span>
                </button>
              </form>
            </div>

            {/* Cobertura por Provincia (Barras) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Cobertura por Provincia
              </h3>

              <div className="space-y-2 pt-1">
                {[
                  { prov: 'San José', count: 38, pct: '35%' },
                  { prov: 'Alajuela', count: 22, pct: '20%' },
                  { prov: 'Heredia', count: 14, pct: '13%' },
                  { prov: 'Cartago', count: 12, pct: '11%' },
                  { prov: 'Guanacaste', count: 10, pct: '9%' },
                  { prov: 'Puntarenas', count: 8, pct: '7%' },
                  { prov: 'Limón', count: 6, pct: '5%' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-600">{item.prov} ({item.count})</span>
                      <span className="font-bold text-gris-oscuro">{item.pct}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-azul-primario rounded-full" style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={(modalMode === 'edit' || modalMode === 'create') && !!editForm}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Crear Sucursal' : `Editar: ${editForm?.nombre}`}
      >
        <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-600">Nombre:</label>
            <input
              type="text"
              required
              value={editForm.nombre || ''}
              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-600">Provincia:</label>
              <select
                value={editForm.provincia || 'San José'}
                onChange={(e) => setEditForm({ ...editForm, provincia: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white"
              >
                {provincias.filter(p => p !== 'Todas').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-600">Estado:</label>
              <select
                value={editForm.estado || 'Abierto'}
                onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white"
              >
                <option value="Abierto">Abierto</option>
                <option value="Cierra pronto">Cierra pronto</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-600">Dirección:</label>
            <input
              type="text"
              required
              value={editForm.direccion || ''}
              onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-600">Horario:</label>
            <input
              type="text"
              value={editForm.horario || ''}
              onChange={(e) => setEditForm({ ...editForm, horario: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setModalMode(null)} className="btn-neutro text-xs py-2 px-3">
              Cancelar
            </button>
            <button type="submit" className="btn-primario text-xs py-2 px-4">
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={modalMode === 'delete' && !!selectedBranch}
        onClose={() => setModalMode(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            ¿Deseas eliminar la sucursal <strong>{selectedBranch?.nombre}</strong>? Esta acción la removerá del mapa y del localizador ciudadano.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalMode(null)} className="btn-neutro text-xs py-2 px-3">
              Cancelar
            </button>
            <button onClick={handleDelete} className="btn-alerta text-xs py-2 px-4">
              Eliminar Sucursal
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

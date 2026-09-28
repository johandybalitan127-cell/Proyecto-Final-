import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, UserCheck, UserX, Plus, Search, Eye, 
  Edit, Trash2, Save, Mail, Phone, Building
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { usuariosService } from '../../services/usuariosService';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AdminUsuariosPage = () => {
  const { addToast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');

  // Quick form
  const [quickForm, setQuickForm] = useState({
    nombre: '',
    correo: '',
    rol: 'Usuario',
    estado: 'Activo'
  });

  // Modal
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadData = async () => {
    const list = await usuariosService.getAll();
    setUsuarios(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const roles = ['Todos', 'Usuario', 'Administrador', 'Cliente Empresarial'];

  const filtered = usuarios.filter((u) => {
    const matchRole = roleFilter === 'Todos' || u.rol === roleFilter;
    const matchSearch = !searchTerm ||
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleQuickCreate = async (e) => {
    e.preventDefault();
    if (!quickForm.nombre || !quickForm.correo) return;

    await usuariosService.create(quickForm);
    addToast(`Usuario ${quickForm.nombre} creado con éxito`, 'success');
    setQuickForm({ nombre: '', correo: '', rol: 'Usuario', estado: 'Activo' });
    loadData();
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      await usuariosService.create(editForm);
      addToast(`Usuario creado correctamente`, 'success');
    } else {
      await usuariosService.update(selectedUser.id, editForm);
      addToast(`Usuario ${editForm.nombre} actualizado`, 'success');
    }
    setModalMode(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    await usuariosService.delete(selectedUser.id);
    addToast(`Usuario ${selectedUser.nombre} eliminado`, 'info');
    setModalMode(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <AdminTopbar
        currentSection="Usuarios y Clientes"
        actionButton={
          <button
            onClick={() => {
              setSelectedUser(null);
              setEditForm({
                nombre: '',
                correo: '',
                rol: 'Usuario',
                estado: 'Activo',
                sucursal: 'Zapote Central',
                telefono: '+506 '
              });
              setModalMode('create');
            }}
            className="btn-primario text-xs py-1.5 px-3"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Usuario</span>
          </button>
        }
      />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Administración de Usuarios y Cuentas Ciudadanas
          </h1>
          <p className="text-xs text-gray-500">
            Padrón de cuentas de clientes, operadores de sucursal y administradores del sistema SIP-CR.
          </p>
        </div>

        {/* 4 Stat cards (Prompt section 7.2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Usuarios Totales"
            value="8,942"
            delta="+3.1%"
            deltaType="positive"
            icon={Users}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Administradores"
            value="12"
            delta="SIP Central"
            deltaType="neutral"
            icon={ShieldCheck}
            iconBg="bg-purple-100 text-purple-700"
          />
          <StatCard
            label="Clientes Activos"
            value="8,510"
            delta="95.2%"
            deltaType="positive"
            icon={UserCheck}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Cuentas Suspendidas"
            value="420"
            delta="Auditoría UPU"
            deltaType="negative"
            icon={UserX}
            iconBg="bg-rose-100 text-rose-700"
          />
        </div>

        {/* 2 Column layout (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Table Column (8 cols ~ 70%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-4">
            
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      roleFilter === r
                        ? 'bg-azul-primario text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar usuario o correo..."
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
                    <th className="py-3 px-3">Nombre</th>
                    <th className="py-3 px-3">Correo</th>
                    <th className="py-3 px-3">Rol</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3">Fecha de Registro</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-3 font-semibold text-gris-oscuro">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-azul-oscuro text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {user.avatar || user.nombre.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[130px]">{user.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600 truncate max-w-[140px]">
                        {user.correo}
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge-azul text-[10px]">
                          {user.rol}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={user.estado} size="xs" />
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-[11px] whitespace-nowrap">
                        {user.fechaRegistro}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setEditForm(user);
                              setModalMode('edit');
                            }}
                            className="p-1 rounded-md text-azul-primario hover:bg-sky-50"
                            title="Editar usuario"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalMode('delete');
                            }}
                            className="p-1 rounded-md text-red-500 hover:bg-red-50"
                            title="Eliminar usuario"
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
              <span>Mostrando 1–{filtered.length} de {usuarios.length} registros</span>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-azul-primario text-white font-bold">1</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
              </div>
            </div>

          </div>

          {/* Side Panel: Roles del Sistema + Formulario Rápido (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Create Form */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-azul-primario" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                  Nuevo Usuario Rápido
                </h3>
              </div>

              <form onSubmit={handleQuickCreate} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofía Solano"
                    value={quickForm.nombre}
                    onChange={(e) => setQuickForm({ ...quickForm, nombre: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-azul-primario"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.cr"
                    value={quickForm.correo}
                    onChange={(e) => setQuickForm({ ...quickForm, correo: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-azul-primario"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600">Rol:</label>
                  <select
                    value={quickForm.rol}
                    onChange={(e) => setQuickForm({ ...quickForm, rol: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                  >
                    <option value="Usuario">Usuario (Ciudadano)</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Cliente Empresarial">Cliente Empresarial</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primario text-xs py-2 font-bold justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear Usuario</span>
                </button>
              </form>
            </div>

            {/* Roles del Sistema */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Roles y Permisos del Sistema
              </h3>

              <div className="space-y-3 text-gray-600 pt-1">
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                  <span className="font-bold text-purple-900 block text-xs">Administrador (Total)</span>
                  <span className="text-[11px]">Gestión total de los 6 CRUDs, auditoría de NLP y configuración.</span>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                  <span className="font-bold text-azul-oscuro block text-xs">Operador de Sucursal</span>
                  <span className="text-[11px]">Admisión de paquetería, cambio de estado y atención en ventanilla.</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="font-bold text-emerald-900 block text-xs">Usuario / Cliente Ciudadano</span>
                  <span className="text-[11px]">Rastreo satelital, casillero Miami y radicación de PQRS con ticket.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={(modalMode === 'edit' || modalMode === 'create') && !!editForm}
        onClose={() => setModalMode(null)}
        title={modalMode === 'create' ? 'Crear Nuevo Usuario' : `Editar Usuario: ${editForm?.nombre}`}
      >
        <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-gray-600">Nombre Completo:</label>
            <input
              type="text"
              required
              value={editForm.nombre || ''}
              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-gray-600">Correo Electrónico:</label>
            <input
              type="email"
              required
              value={editForm.correo || ''}
              onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-600">Rol:</label>
              <select
                value={editForm.rol || 'Usuario'}
                onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white"
              >
                <option value="Usuario">Usuario</option>
                <option value="Administrador">Administrador</option>
                <option value="Cliente Empresarial">Cliente Empresarial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-600">Estado:</label>
              <select
                value={editForm.estado || 'Activo'}
                onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white"
              >
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
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

      {/* Delete confirmation */}
      <Modal
        isOpen={modalMode === 'delete' && !!selectedUser}
        onClose={() => setModalMode(null)}
        title="Confirmar Eliminación de Usuario"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            ¿Deseas eliminar permanentemente la cuenta de <strong>{selectedUser?.nombre}</strong> ({selectedUser?.correo})? Esta acción revocará todos sus permisos.
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalMode(null)} className="btn-neutro text-xs py-2 px-3">
              Cancelar
            </button>
            <button onClick={handleDelete} className="btn-alerta text-xs py-2 px-4">
              Eliminar Usuario
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

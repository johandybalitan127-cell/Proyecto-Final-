import React, { useState, useEffect } from 'react';
import { 
  Tag, Calculator, DollarSign, Layers, Plus, Edit, Trash2, Save, CheckCircle2
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { serviciosService } from '../../services/serviciosService';
import { tarifasService } from '../../services/tarifasService';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const AdminServiciosTarifasPage = () => {
  const { addToast } = useToast();
  const [servicios, setServicios] = useState([]);
  const [tarifas, setTarifas] = useState([]);

  // Calculator state
  const [calcPeso, setCalcPeso] = useState('2');
  const [calcTipo, setCalcTipo] = useState('EMS Courier Nacional');
  const [calcResult, setCalcResult] = useState(3400);

  // Modals
  const [modalType, setModalType] = useState(null); // 'service' | 'tariff'
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'delete'
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemForm, setItemForm] = useState({});

  const loadData = async () => {
    const s = await serviciosService.getAll();
    const t = await tarifasService.getAll();
    setServicios(s);
    setTarifas(t);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCalculate = (e) => {
    e.preventDefault();
    const res = tarifasService.estimateTariff(calcPeso, calcTipo);
    setCalcResult(res);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (modalType === 'service') {
      if (modalMode === 'create') {
        await serviciosService.create(itemForm);
        addToast(`Servicio "${itemForm.nombre}" creado`, 'success');
      } else {
        await serviciosService.update(selectedItem.id, itemForm);
        addToast(`Servicio "${itemForm.nombre}" actualizado`, 'success');
      }
    } else {
      if (modalMode === 'create') {
        await tarifasService.create(itemForm);
        addToast('Tarifa agregada al tarifario oficial', 'success');
      } else {
        await tarifasService.update(selectedItem.id, itemForm);
        addToast('Tarifa actualizada', 'success');
      }
    }
    setModalMode(null);
    loadData();
  };

  const handleDelete = async () => {
    if (modalType === 'service') {
      await serviciosService.delete(selectedItem.id);
      addToast('Servicio eliminado', 'info');
    } else {
      await tarifasService.delete(selectedItem.id);
      addToast('Tarifa eliminada', 'info');
    }
    setModalMode(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <AdminTopbar
        currentSection="Servicios y Tarifas"
        actionButton={
          <div className="flex gap-2">
            <button
              onClick={() => {
                setModalType('service');
                setSelectedItem(null);
                setItemForm({ nombre: '', descripcion: '', tipo: 'Nacional', estado: 'Activo' });
                setModalMode('create');
              }}
              className="btn-primario text-xs py-1.5 px-3"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Servicio</span>
            </button>
            <button
              onClick={() => {
                setModalType('tariff');
                setSelectedItem(null);
                setItemForm({ rangoPeso: '0 - 1 kg', tipoEnvio: 'EMS Courier Nacional', dimensionesMax: '30 x 20 x 10 cm', costo: 2350 });
                setModalMode('create');
              }}
              className="btn-secundario text-xs py-1.5 px-3"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Tarifa</span>
            </button>
          </div>
        }
      />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Catálogo Oficial de Servicios y Estructura Tarifaria
          </h1>
          <p className="text-xs text-gray-500">
            Regulación de tarifas postales, servicios express, casilleros y aranceles UPU vigentes.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Servicios Activos"
            value="18"
            delta="4 líneas"
            deltaType="positive"
            icon={Tag}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Rangos de Tarifa"
            value="46"
            delta="Aprobadas UPU"
            deltaType="neutral"
            icon={Layers}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Tarifa Promedio"
            value="₡4,250"
            delta="Base Nacional"
            deltaType="neutral"
            icon={DollarSign}
            iconBg="bg-purple-100 text-purple-700"
          />
          <StatCard
            label="Ajustes Pendientes"
            value="3"
            delta="Revisión SUTEL"
            deltaType="negative"
            icon={Calculator}
            iconBg="bg-amber-100 text-amber-700"
          />
        </div>

        {/* 2-Column Split (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main 2 Stacked Tables (8 cols ~ 70%) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Table 1: Catálogo de Servicios */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-azul-oscuro">Catálogo de Servicios Postales</h3>
                <span className="text-[11px] text-gray-400">{servicios.length} activos</span>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                      <th className="py-2.5 px-3">Servicio</th>
                      <th className="py-2.5 px-3">Descripción</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {servicios.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-2.5 px-3 font-semibold text-gris-oscuro">
                          {s.nombre}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 text-[11px] truncate max-w-[200px]">
                          {s.descripcion}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="badge-azul text-[10px]">{s.tipo}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="badge-verde text-[10px]">{s.estado}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setModalType('service');
                                setSelectedItem(s);
                                setItemForm(s);
                                setModalMode('edit');
                              }}
                              className="p-1 text-azul-primario hover:bg-sky-50 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setModalType('service');
                                setSelectedItem(s);
                                setModalMode('delete');
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
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
            </div>

            {/* Table 2: Tabla de Tarifas */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-azul-oscuro">Tabla Oficial de Tarifas</h3>
                <span className="text-[11px] text-gray-400">{tarifas.length} rangos registrados</span>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                      <th className="py-2.5 px-3">Rango de Peso</th>
                      <th className="py-2.5 px-3">Tipo de Envío</th>
                      <th className="py-2.5 px-3">Dimensiones Máx.</th>
                      <th className="py-2.5 px-3 font-mono">Costo (₡)</th>
                      <th className="py-2.5 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tarifas.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-2.5 px-3 font-semibold text-gris-oscuro">
                          {t.rangoPeso}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">
                          {t.tipoEnvio}
                        </td>
                        <td className="py-2.5 px-3 text-gray-400 text-[11px]">
                          {t.dimensionesMax}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-azul-oscuro">
                          ₡{t.costo?.toLocaleString('es-CR')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setModalType('tariff');
                                setSelectedItem(t);
                                setItemForm(t);
                                setModalMode('edit');
                              }}
                              className="p-1 text-azul-primario hover:bg-sky-50 rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setModalType('tariff');
                                setSelectedItem(t);
                                setModalMode('delete');
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
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
            </div>

          </div>

          {/* Right Column: Distribución & Calculadora Rápida (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Calculadora Rápida */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-azul-primario" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
                  Calculadora Rápida
                </h3>
              </div>

              <form onSubmit={handleCalculate} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Peso (Kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={calcPeso}
                    onChange={(e) => setCalcPeso(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Tipo de Envío:</label>
                  <select
                    value={calcTipo}
                    onChange={(e) => setCalcTipo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border bg-white"
                  >
                    <option value="EMS Courier Nacional">EMS Courier Nacional</option>
                    <option value="Pymexpress">Pymexpress</option>
                    <option value="EMS Internacional">EMS Internacional</option>
                    <option value="Casillero Box">Casillero Box</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 text-center border border-sky-100">
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Costo Estimado</span>
                  <p className="text-xl font-extrabold text-azul-oscuro">
                    ₡{calcResult.toLocaleString('es-CR')}
                  </p>
                </div>

                <button type="submit" className="w-full btn-primario text-xs py-2 font-bold justify-center">
                  Calcular Tarifa
                </button>
              </form>
            </div>

            {/* Distribución de Ingresos */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Distribución de Ingresos
              </h3>

              <div className="space-y-2.5 pt-1">
                {[
                  { label: 'EMS Courier Nacional', pct: '44%', color: 'bg-azul-primario' },
                  { label: 'EMS Internacional', pct: '26%', color: 'bg-azul-oscuro' },
                  { label: 'Pymexpress & Emprendedores', pct: '20%', color: 'bg-verde-principal' },
                  { label: 'Box Correos Miami', pct: '10%', color: 'bg-amber-500' },
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

          </div>

        </div>

      </div>

      {/* Edit / Create Modal for Service or Tariff */}
      <Modal
        isOpen={(modalMode === 'edit' || modalMode === 'create') && !!itemForm}
        onClose={() => setModalMode(null)}
        title={modalType === 'service' ? (modalMode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio') : (modalMode === 'create' ? 'Nueva Tarifa' : 'Editar Tarifa')}
      >
        <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
          {modalType === 'service' ? (
            <>
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">Nombre del Servicio:</label>
                <input
                  type="text"
                  required
                  value={itemForm.nombre || ''}
                  onChange={(e) => setItemForm({ ...itemForm, nombre: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">Descripción:</label>
                <textarea
                  rows="2"
                  value={itemForm.descripcion || ''}
                  onChange={(e) => setItemForm({ ...itemForm, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Tipo:</label>
                  <select
                    value={itemForm.tipo || 'Nacional'}
                    onChange={(e) => setItemForm({ ...itemForm, tipo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Nacional">Nacional</option>
                    <option value="Internacional">Internacional</option>
                    <option value="Comercio Electrónico">Comercio Electrónico</option>
                    <option value="Casillero">Casillero</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Estado:</label>
                  <select
                    value={itemForm.estado || 'Activo'}
                    onChange={(e) => setItemForm({ ...itemForm, estado: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Activo">Activo</option>
                    <option value="En revisión">En revisión</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Rango de Peso:</label>
                  <input
                    type="text"
                    required
                    value={itemForm.rangoPeso || ''}
                    onChange={(e) => setItemForm({ ...itemForm, rangoPeso: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Costo (₡):</label>
                  <input
                    type="number"
                    required
                    value={itemForm.costo || 0}
                    onChange={(e) => setItemForm({ ...itemForm, costo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">Tipo de Envío:</label>
                <input
                  type="text"
                  required
                  value={itemForm.tipoEnvio || ''}
                  onChange={(e) => setItemForm({ ...itemForm, tipoEnvio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-gray-600">Dimensiones Máximas:</label>
                <input
                  type="text"
                  value={itemForm.dimensionesMax || ''}
                  onChange={(e) => setItemForm({ ...itemForm, dimensionesMax: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </>
          )}

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
        isOpen={modalMode === 'delete' && !!selectedItem}
        onClose={() => setModalMode(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            ¿Deseas eliminar este registro del tarifario oficial de Correos de Costa Rica?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setModalMode(null)} className="btn-neutro text-xs py-2 px-3">
              Cancelar
            </button>
            <button onClick={handleDelete} className="btn-alerta text-xs py-2 px-4">
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

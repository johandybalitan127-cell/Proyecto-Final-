import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Check, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export const PerfilPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    nombre: user?.nombre || 'María Elena Rojas',
    correo: user?.correo || 'm.rojas@gmail.com',
    telefono: user?.telefono || '+506 8765-4321',
    direccion: 'Costado Norte de Iglesia Santa Teresita, Barrio Escalante, San José',
    sucursalFavorita: user?.sucursal || 'San Pedro Montes de Oca',
    casilleroMiami: 'CR-BOX-88421'
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Perfil y libreta de direcciones actualizados correctamente', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-azul-oscuro text-white text-xl font-bold flex items-center justify-center shadow-md">
            {user?.avatar || 'CR'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-azul-oscuro">{user?.nombre || 'María Elena Rojas'}</h1>
              <span className="badge-verde text-xs">{user?.rol || 'Ciudadano'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Identificador Postal: {user?.id || 'USR-002'} · Miembro verificado</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cuenta/historial" className="btn-neutro text-xs py-2 px-3">
            Ver Historial de Envíos
          </Link>
          <Link to="/cuenta/paquetes-guardados" className="btn-primario text-xs py-2 px-3">
            Paquetes Guardados
          </Link>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-azul-oscuro">Datos Personales y Domicilio Postal</h2>
          <p className="text-xs text-gray-500">Esta información se utilizará para autocompletar tus guías y envíos.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Nombre y Apellidos:</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Correo Electrónico:</label>
              <input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Teléfono Móvil:</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Sucursal Favorita de Retiro:</label>
              <input
                type="text"
                value={form.sucursalFavorita}
                onChange={(e) => setForm({ ...form, sucursalFavorita: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gris-oscuro">Dirección de Entrega Frecuente (Costa Rica):</label>
            <textarea
              rows="2"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
            ></textarea>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-azul-oscuro block">Casillero Box Correos Miami Asignado:</span>
              <span className="font-mono text-azul-primario font-bold">{form.casilleroMiami}</span>
            </div>
            <span className="badge-verde text-[10px]">Activo y Verificado</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primario text-xs py-2.5 px-6">
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

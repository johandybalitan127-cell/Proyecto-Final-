import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Check, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../../components/common/GoogleIcon';

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

      {/* === CITA PREMIUM BANNER === */}
      <Link
        to="/cuenta/citas-premium"
        className="group block relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      >
        {/* Fondo con gradiente animado */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 sm:p-7">
          {/* Círculos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-10 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            {/* Left: icono + texto */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <GoogleIcon name="bolt" size={30} className="text-amber-400" filled />
                </div>
                {/* Pulso animado */}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="animate-ping absolute w-4 h-4 rounded-full bg-amber-400 opacity-75" />
                  <span className="w-2 h-2 bg-amber-300 rounded-full relative" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    Servicio Exclusivo
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  Cita Premium · Fila Cero
                </h2>
                <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-md">
                  Salta la fila y recibe atención prioritaria en cualquier sucursal de Correos de Costa Rica.
                </p>

                {/* Beneficios rápidos */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Sin esperas', 'Horario reservado', 'Asesor dedicado'].map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-100 bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                      <GoogleIcon name="check_circle" size={11} className="text-emerald-400" filled />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: precio + CTA */}
            <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
              <div className="text-right">
                <span className="text-blue-300 text-xs block">Por solo</span>
                <span className="text-3xl font-extrabold text-white">₡5,000</span>
                <span className="text-blue-300 text-xs block">por cita</span>
              </div>
              <div className="flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg group-hover:bg-amber-400 group-hover:text-white transition-colors duration-300">
                <GoogleIcon name="event_available" size={16} filled />
                <span>Agendar Cita</span>
                <GoogleIcon name="arrow_forward" size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>

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

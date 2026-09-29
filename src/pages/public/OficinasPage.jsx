import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, User, LogIn, Calendar, Clock, MapPin } from 'lucide-react';
import { SucursalesMapLocator } from '../../components/public/SucursalesMapLocator';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const OficinasPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [selectedBranchForAppointment, setSelectedBranchForAppointment] = useState(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    nombre: '',
    cedula: '',
    tramite: 'Pasaporte Biométrico',
    fecha: '',
    hora: '09:00 a.m.'
  });

  const handleOpenAppointment = (branch) => {
    if (!isAuthenticated) {
      addToast('Debes iniciar sesión con tu cuenta ciudadana para agendar una cita oficial.', 'info');
      navigate('/login', { state: { from: '/oficinas' } });
      return;
    }

    setSelectedBranchForAppointment(branch);
    setAppointmentForm((prev) => ({
      ...prev,
      nombre: user?.nombre || prev.nombre || '',
      cedula: user?.cedula || prev.cedula || ''
    }));
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Debes iniciar sesión para confirmar tu cita.', 'error');
      navigate('/login', { state: { from: '/oficinas' } });
      return;
    }

    setAppointmentSuccess(true);
    addToast('¡Cita oficial agendada con éxito!', 'success');
    setTimeout(() => {
      setAppointmentSuccess(false);
      setSelectedBranchForAppointment(null);
      setAppointmentForm({ nombre: '', cedula: '', tramite: 'Pasaporte Biométrico', fecha: '', hora: '09:00 a.m.' });
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Localizador Geográfico Oficial Interactivo (Exacto a la captura) */}
      <SucursalesMapLocator onSelectBranchForAppointment={handleOpenAppointment} />

      {/* Modal para agendar Citas VES (Pasaporte / Cédula / DIMEX) */}
      <Modal
        isOpen={!!selectedBranchForAppointment}
        onClose={() => {
          setSelectedBranchForAppointment(null);
          setAppointmentSuccess(false);
        }}
        title={`Agendar Cita Oficial — ${selectedBranchForAppointment?.nombre || 'Sucursal'}`}
      >
        {appointmentSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-verde-principal flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-azul-oscuro">¡Cita Registrada Exitosamente!</h3>
            <p className="text-xs text-gray-600">
              Se ha emitido el comprobante digital para <strong>{appointmentForm.nombre}</strong> el día{' '}
              <strong>{appointmentForm.fecha}</strong> a las <strong>{appointmentForm.hora}</strong> en{' '}
              <strong>{selectedBranchForAppointment?.nombre}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 text-xs text-gray-700">
              <MapPin className="w-4 h-4 text-azul-primario shrink-0" />
              <div>
                <span className="font-bold text-azul-oscuro block">{selectedBranchForAppointment?.nombre}</span>
                <span className="text-[11px] text-gray-500">{selectedBranchForAppointment?.direccion}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Nombre Completo del Solicitante:</label>
              <input
                type="text"
                required
                value={appointmentForm.nombre}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, nombre: e.target.value })}
                placeholder="Ej. María Elena Rojas"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Número de Cédula o Documento DIMEX:</label>
              <input
                type="text"
                required
                value={appointmentForm.cedula}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, cedula: e.target.value })}
                placeholder="Ej. 1-1234-0567"
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gris-oscuro">Trámite Consular:</label>
                <select
                  value={appointmentForm.tramite}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, tramite: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                >
                  <option value="Pasaporte Biométrico">Pasaporte Biométrico</option>
                  <option value="Cédula de Residencia DIMEX">Cédula de Residencia DIMEX</option>
                  <option value="Permiso de Salida Menor">Permiso de Salida Menor</option>
                  <option value="Ventanilla Rápida Paquetes">Ventanilla Rápida Paquetes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gris-oscuro">Fecha Deseada:</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentForm.fecha}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, fecha: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gris-oscuro">Horario de Atención:</label>
              <select
                value={appointmentForm.hora}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, hora: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              >
                <option value="08:30 a.m.">08:30 a.m. — Matutino</option>
                <option value="09:15 a.m.">09:15 a.m. — Matutino</option>
                <option value="10:00 a.m.">10:00 a.m. — Matutino</option>
                <option value="11:30 a.m.">11:30 a.m. — Mediodía</option>
                <option value="01:15 p.m.">01:15 p.m. — Vespertino</option>
                <option value="02:30 p.m.">02:30 p.m. — Vespertino</option>
                <option value="03:45 p.m.">03:45 p.m. — Vespertino</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 text-[11px] text-azul-oscuro flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
              <span>Recuerda presentarte 10 minutos antes con el comprobante bancario del arancel consular correspondiente.</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBranchForAppointment(null)}
                className="btn-neutro text-xs py-2 px-4 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-secundario text-xs py-2 px-5 cursor-pointer font-bold"
              >
                Confirmar Cita Oficial
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

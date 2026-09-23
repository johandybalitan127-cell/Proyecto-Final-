import React, { useState, useEffect } from 'react';
import { 
  MapPin, Clock, Phone, Navigation, Search, Calendar, CheckCircle2, 
  FileCheck, ShieldCheck, Ticket, Filter, ExternalLink
} from 'lucide-react';
import { sucursalesService } from '../../services/sucursalesService';
import { Modal } from '../../components/common/Modal';

export const OficinasPage = () => {
  const [sucursales, setSucursales] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchForAppointment, setSelectedBranchForAppointment] = useState(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    nombre: '',
    cedula: '',
    tramite: 'Pasaporte Biométrico',
    fecha: '',
    hora: '09:00 a.m.'
  });

  const provincias = ['Todas', 'San José', 'Alajuela', 'Heredia', 'Cartago', 'Guanacaste', 'Puntarenas', 'Limón'];

  useEffect(() => {
    const loadBranches = async () => {
      const data = await sucursalesService.getAll();
      setSucursales(data);
    };
    loadBranches();
  }, []);

  const filtered = sucursales.filter((s) => {
    const matchProv = selectedProvincia === 'Todas' || s.provincia.toLowerCase() === selectedProvincia.toLowerCase();
    const matchQuery = !searchQuery || 
      s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.direccion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProv && matchQuery;
  });

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setAppointmentSuccess(true);
    setTimeout(() => {
      setAppointmentSuccess(false);
      setSelectedBranchForAppointment(null);
      setAppointmentForm({ nombre: '', cedula: '', tramite: 'Pasaporte Biométrico', fecha: '', hora: '09:00 a.m.' });
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-azul-primario uppercase tracking-wider">
          Red Postal Territorial de Costa Rica
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-azul-oscuro font-sans tracking-tight">
          Localizador de Oficinas y Sucursales
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Encuentra horarios, trámites consulares VES, ventanillas rápidas y casilleros en las más de 110 sucursales en todo el país.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de sucursal, cantón o dirección..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
          />
        </div>

        {/* Province Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {provincias.map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvincia(prov)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedProvincia === prov
                  ? 'bg-azul-primario text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>Mostrando {filtered.length} sucursales autorizadas</span>
          <span className="text-verde-oscuro">● Todas con Ventanilla Ciudadana Activa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="badge-azul text-[11px] font-semibold">{branch.provincia}</span>
                  <span className="badge-verde text-[11px] font-semibold">● {branch.estado}</span>
                </div>

                <h3 className="text-lg font-bold text-azul-oscuro leading-snug">
                  {branch.nombre}
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
                    <span>{branch.direccion}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{branch.horario}</span>
                  </div>
                  {branch.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{branch.telefono}</span>
                    </div>
                  )}
                </div>

                {branch.serviciosEspeciales && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {branch.serviciosEspeciales.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-azul-primario border border-sky-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedBranchForAppointment(branch)}
                  className="btn-primario text-xs py-2 px-3 flex-1 justify-center"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar Cita</span>
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.nombre + ' Correos Costa Rica')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-neutro text-xs py-2 px-3"
                  title="Ver en Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      <Modal
        isOpen={!!selectedBranchForAppointment}
        onClose={() => setSelectedBranchForAppointment(null)}
        title="Agendar Cita Oficial — Convenio VES / SIDGE"
        subtitle={selectedBranchForAppointment?.nombre}
      >
        {appointmentSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-azul-oscuro">¡Cita Confirmada con Éxito!</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Hemos reservado tu turno oficial en <strong>{selectedBranchForAppointment?.nombre}</strong>. Se ha generado tu código de atención prioritario.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookAppointment} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-3">
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
                  value={appointmentForm.fecha}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, fecha: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 text-[11px] text-azul-oscuro flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
              <span>Recuerda presentarte 10 minutos antes con el comprobante bancario del arancel consular correspondiente.</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBranchForAppointment(null)}
                className="btn-neutro text-xs py-2 px-4"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-secundario text-xs py-2 px-5"
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

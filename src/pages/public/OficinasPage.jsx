import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, Phone, Navigation, Search, Calendar, CheckCircle2, 
  ShieldCheck, X, Lock, User, LogIn
} from 'lucide-react';
import { sucursalesService } from '../../services/sucursalesService';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

const normalizeText = (text = '') =>
  String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const OficinasPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const norm = normalizeText(value);
    if (!norm) return;

    // Si el usuario escribe directamente el nombre de una provincia (ej. "san jose", "heredia", "limon"),
    // cambiamos automáticamente la pestaña de provincia activa
    const foundProv = provincias.find(p => p !== 'Todas' && normalizeText(p).includes(norm));
    if (foundProv && selectedProvincia !== foundProv) {
      setSelectedProvincia(foundProv);
    }
  };

  const normQuery = normalizeText(searchQuery);
  const normProv = normalizeText(selectedProvincia);

  const matchSearch = (s) => {
    if (!normQuery) return true;
    return (
      normalizeText(s.nombre).includes(normQuery) ||
      normalizeText(s.direccion).includes(normQuery) ||
      normalizeText(s.provincia).includes(normQuery)
    );
  };

  // Coincidencias en la provincia actualmente seleccionada
  const filtered = sucursales.filter((s) => {
    const matchProv = selectedProvincia === 'Todas' || normalizeText(s.provincia) === normProv;
    return matchProv && matchSearch(s);
  });

  // Coincidencias en otras provincias si la provincia seleccionada no dio resultados
  const matchesInOtherProvinces = selectedProvincia !== 'Todas' && normQuery && filtered.length === 0
    ? sucursales.filter((s) => matchSearch(s))
    : [];

  const branchesToDisplay = filtered.length > 0 ? filtered : matchesInOtherProvinces;

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
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por nombre de sucursal, cantón o dirección..."
            className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              title="Borrar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
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

      {/* Cross-province suggestion alert */}
      {filtered.length === 0 && matchesInOtherProvinces.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <span>No hay sucursales en <strong>{selectedProvincia}</strong> para "<strong>{searchQuery}</strong>", pero encontramos <strong>{matchesInOtherProvinces.length}</strong> en otras provincias:</span>
          </div>
          <button
            onClick={() => setSelectedProvincia('Todas')}
            className="btn-primario text-xs py-1.5 px-3 self-start sm:self-auto whitespace-nowrap"
          >
            Ver en Todas las Provincias
          </button>
        </div>
      )}

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span>Mostrando {branchesToDisplay.length} sucursales autorizadas</span>
          <span className="text-verde-oscuro">● Todas con Ventanilla Ciudadana Activa</span>
        </div>

        {branchesToDisplay.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-azul-primario flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-azul-oscuro">No se encontraron sucursales</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              No hay sucursales que coincidan con "{searchQuery}" {selectedProvincia !== 'Todas' ? `en la provincia de ${selectedProvincia}` : ''}.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedProvincia('Todas'); }}
              className="btn-primario text-xs py-2 px-4 mx-auto"
            >
              Restablecer búsqueda y filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchesToDisplay.map((branch) => {
              return (
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
                      onClick={() => handleOpenAppointment(branch)}
                      className={`text-xs py-2 px-3 flex-1 justify-center flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-xs ${
                        isAuthenticated 
                          ? 'btn-primario' 
                          : 'bg-slate-100 hover:bg-azul-primario hover:text-white text-slate-700 border border-slate-200'
                      }`}
                      title={isAuthenticated ? "Agendar cita oficial en esta sucursal" : "Inicia sesión para agendar cita"}
                    >
                      {isAuthenticated ? (
                        <>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Agendar Cita</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Agendar Cita</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 ml-1 font-semibold">Login</span>
                        </>
                      )}
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
              );
            })}
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      <Modal
        isOpen={!!selectedBranchForAppointment}
        onClose={() => setSelectedBranchForAppointment(null)}
        title="Agendar Cita Oficial — Convenio VES / SIDGE"
        subtitle={selectedBranchForAppointment?.nombre}
      >
        {!isAuthenticated ? (
          <div className="py-6 px-2 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-azul-oscuro">
                Inicio de Sesión Requerido
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Por motivos de seguridad y validez legal en trámites consulares oficiales (Pasaportes biométricos, cédulas de residencia DIMEX y permisos de salida), es obligatorio contar con una sesión activa de ciudadano.
              </p>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-azul-oscuro flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-azul-primario shrink-0" />
              <span>Sucursal seleccionada: <strong>{selectedBranchForAppointment?.nombre}</strong></span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/login', { state: { from: '/oficinas' } })}
                className="btn-primario text-xs py-2.5 px-6 justify-center flex items-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión para Continuar</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/register', { state: { from: '/oficinas' } })}
                className="btn-neutro text-xs py-2.5 px-5 justify-center"
              >
                <span>Crear Cuenta Nueva</span>
              </button>
            </div>
          </div>
        ) : appointmentSuccess ? (
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
            {/* Authenticated user verification banner */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shadow-2xs">
                  {user?.avatar || (user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U')}
                </div>
                <div>
                  <p className="font-bold leading-tight">{user?.nombre || user?.correo}</p>
                  <p className="text-[11px] text-emerald-700">Sesión ciudadana verificada</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                Identidad Confirmada
              </span>
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

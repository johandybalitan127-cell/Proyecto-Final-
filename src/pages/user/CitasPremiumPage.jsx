import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { sucursalesService } from '../../services/sucursalesService';
import { citasService } from '../../services/citasService';
import { GoogleIcon } from '../../components/common/GoogleIcon';

const TRAMITES = [
  { value: 'retiro', label: 'Retiro de Paquetería', icon: 'package_2', desc: 'Recoge tu paquete sin esperar' },
  { value: 'envio', label: 'Envío de Paquetería', icon: 'local_shipping', desc: 'Envía con atención prioritaria' },
  { value: 'pasaporte', label: 'Trámite de Pasaporte VES', icon: 'badge', desc: 'Servicio VES con cita anticipada' },
  { value: 'certificacion', label: 'Certificaciones del Registro', icon: 'verified', desc: 'Documentos oficiales rápido' },
  { value: 'apartado', label: 'Apertura/Renovación Apartado', icon: 'mail', desc: 'Apertura o renovación de casilla' },
  { value: 'aduanas', label: 'Trámite Aduanal', icon: 'account_balance', desc: 'Gestión de paquetes en aduana' },
];

const HORARIOS = [
  '08:00 AM – 09:00 AM',
  '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '01:00 PM – 02:00 PM',
  '02:00 PM – 03:00 PM',
  '03:00 PM – 04:00 PM',
  '04:00 PM – 05:00 PM',
];

const ESTADO_COLORS = {
  Confirmada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelada: 'bg-red-100 text-red-700 border-red-200',
  Completada: 'bg-sky-100 text-sky-800 border-sky-200',
};

export const CitasPremiumPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ─── State ───────────────────────────────────────────────
  const [step, setStep] = useState(1); // 1=form 2=pago 3=éxito
  const [sucursales, setSucursales] = useState([]);
  const [misCitas, setMisCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [citaCreada, setCitaCreada] = useState(null);
  const [activeTab, setActiveTab] = useState('nueva'); // 'nueva' | 'mis-citas'

  // Form fields
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [tramite, setTramite] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notas, setNotas] = useState('');

  // Payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [formError, setFormError] = useState('');

  // ─── Load data ────────────────────────────────────────────
  useEffect(() => {
    sucursalesService.getAll().then(setSucursales).catch(() => {});
    loadMisCitas();
  }, []);

  const loadMisCitas = async () => {
    setLoadingCitas(true);
    try {
      const all = await citasService.getAll();
      const mias = user
        ? all.filter((c) => String(c.usuarioId) === String(user.id))
        : [];
      setMisCitas(mias.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)));
    } catch {
      setMisCitas([]);
    } finally {
      setLoadingCitas(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────
  const formatCard = (val) =>
    val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (val) =>
    val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  const today = new Date().toISOString().split('T')[0];

  const tramiteSeleccionado = TRAMITES.find((t) => t.value === tramite);

  // ─── Step 1 → 2 ───────────────────────────────────────────
  const handleNextStep = (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedSucursal || !tramite || !date || !time) {
      setFormError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Step 2 → submit ──────────────────────────────────────
  const handlePago = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      setFormError('Completa todos los datos de pago.');
      return;
    }
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 2200)); // simula procesamiento
      const cita = await citasService.create({
        usuarioId: user?.id || 'anonimo',
        usuario: user?.nombre || 'Ciudadano',
        correo: user?.correo || '',
        sucursal: selectedSucursal,
        tramite,
        tramiteLabel: tramiteSeleccionado?.label || tramite,
        fecha: date,
        hora: time,
        notas,
        monto: 5000,
      });
      setCitaCreada(cita);
      setStep(3);
      loadMisCitas();
    } catch {
      setFormError('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  // ─── Cancel cita ──────────────────────────────────────────
  const handleCancelar = async (id) => {
    if (!window.confirm('¿Deseas cancelar esta cita?')) return;
    await citasService.cancel(id);
    loadMisCitas();
  };

  // ─── PASO 3: Éxito ────────────────────────────────────────
  if (step === 3 && citaCreada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center animate-fadeIn border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-200">
            <GoogleIcon name="check_circle" size={44} className="text-emerald-600" filled />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            Cita Premium Confirmada
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tu espacio exclusivo ha sido reservado. Recibirás confirmación al correo registrado.
          </p>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white text-left space-y-3 mb-8 shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-xs uppercase font-semibold">Código de Cita</span>
              <span className="font-mono font-bold text-lg tracking-wider">{citaCreada.codigoCita}</span>
            </div>
            <hr className="border-white/20" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-300 text-xs block">Trámite</span>
                <span className="font-semibold">{citaCreada.tramiteLabel}</span>
              </div>
              <div>
                <span className="text-blue-300 text-xs block">Sucursal</span>
                <span className="font-semibold">{citaCreada.sucursal}</span>
              </div>
              <div>
                <span className="text-blue-300 text-xs block">Fecha</span>
                <span className="font-semibold">{citaCreada.fecha}</span>
              </div>
              <div>
                <span className="text-blue-300 text-xs block">Hora</span>
                <span className="font-semibold">{citaCreada.hora}</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-xs">Monto pagado</span>
              <span className="text-2xl font-extrabold">₡5,000</span>
            </div>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            🏷️ Al llegar a la sucursal, indica tu código <strong>{citaCreada.codigoCita}</strong> para acceso prioritario <strong>Fila Cero</strong>.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => { setStep(1); setActiveTab('mis-citas'); setCitaCreada(null); }}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Ver mis citas
            </button>
            <button
              onClick={() => navigate('/cuenta/perfil')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/30 text-sm"
            >
              Ir a mi perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN RENDER ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <GoogleIcon name="bolt" size={14} filled className="text-amber-600" />
            Servicio Exclusivo
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Citas <span className="text-blue-600">Premium</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Reserva tu atención prioritaria en sucursal. Evita filas, ahorra tiempo con nuestro servicio <strong>Fila Cero VIP</strong>.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 max-w-sm mx-auto">
          {[
            { key: 'nueva', label: 'Nueva Cita', icon: 'add_circle' },
            { key: 'mis-citas', label: 'Mis Citas', icon: 'event_note' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setStep(1); setFormError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <GoogleIcon name={tab.icon} size={16} filled={activeTab === tab.key} />
              {tab.label}
              {tab.key === 'mis-citas' && misCitas.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {misCitas.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════ TAB: MIS CITAS ══════════════ */}
        {activeTab === 'mis-citas' && (
          <div className="space-y-4">
            {loadingCitas ? (
              <div className="text-center py-16 text-gray-400">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Cargando tus citas...
              </div>
            ) : misCitas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <GoogleIcon name="event_busy" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No tienes citas programadas</p>
                <button
                  onClick={() => setActiveTab('nueva')}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition cursor-pointer"
                >
                  <GoogleIcon name="add" size={16} />
                  Agendar mi primera cita
                </button>
              </div>
            ) : (
              misCitas.map((cita) => (
                <div key={cita.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <GoogleIcon name="event" size={24} className="text-blue-600" filled />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{cita.tramiteLabel}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[cita.estado] || 'bg-gray-100 text-gray-700'}`}>
                        {cita.estado}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      📍 {cita.sucursal} &nbsp;·&nbsp; 📅 {cita.fecha} &nbsp;·&nbsp; 🕐 {cita.hora}
                    </p>
                    <p className="text-xs text-blue-600 font-mono mt-1">{cita.codigoCita}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-gray-700">₡{Number(cita.monto || 5000).toLocaleString()}</span>
                    {cita.estado === 'Confirmada' && (
                      <button
                        onClick={() => handleCancelar(cita.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════ TAB: NUEVA CITA ══════════════ */}
        {activeTab === 'nueva' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Columna izquierda: Beneficios ── */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                <div className="flex items-center gap-2 mb-5">
                  <GoogleIcon name="bolt" size={22} className="text-amber-400" filled />
                  <h3 className="font-bold text-lg">Beneficios VIP</h3>
                </div>
                <ul className="space-y-4 text-sm">
                  {[
                    { icon: 'skip_next', text: 'Atención sin filas – Fila Cero' },
                    { icon: 'speed', text: 'Procesamiento aduanal prioritario' },
                    { icon: 'schedule', text: 'Horario reservado exclusivo' },
                    { icon: 'local_shipping', text: 'Entrega acelerada garantizada' },
                    { icon: 'support_agent', text: 'Asesor dedicado en sucursal' },
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <GoogleIcon name={b.icon} size={15} className="text-blue-200" />
                      </div>
                      <span className="text-blue-50">{b.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <span className="text-blue-200 text-xs uppercase font-semibold block mb-1">Costo único</span>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold">₡5,000</span>
                    <span className="text-blue-300 text-sm mb-1">/ cita</span>
                  </div>
                </div>
              </div>

              {/* Progress steps */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Pasos</p>
                {[
                  { n: 1, label: 'Datos de la cita' },
                  { n: 2, label: 'Pago seguro' },
                  { n: 3, label: 'Confirmación' },
                ].map((s) => (
                  <div key={s.n} className={`flex items-center gap-3 py-2.5 ${s.n < 3 ? 'border-b border-gray-50' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      step > s.n ? 'bg-emerald-500 text-white' :
                      step === s.n ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {step > s.n ? <GoogleIcon name="check" size={14} /> : s.n}
                    </div>
                    <span className={`text-sm font-medium ${step === s.n ? 'text-blue-600' : step > s.n ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Columna derecha: Formulario ── */}
            <div className="lg:col-span-2">

              {/* ── STEP 1: Datos de la cita ── */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Datos de tu Cita</h2>

                  {/* Tipo de trámite */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Tipo de Trámite *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TRAMITES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setTramite(t.value)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                            tramite === t.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tramite === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <GoogleIcon name={t.icon} size={18} filled={tramite === t.value} />
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${tramite === t.value ? 'text-blue-700' : 'text-gray-800'}`}>{t.label}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sucursal */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <GoogleIcon name="location_on" size={15} className="text-blue-600" />
                      Sucursal *
                    </label>
                    <select
                      value={selectedSucursal}
                      onChange={(e) => setSelectedSucursal(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition text-sm"
                      required
                    >
                      <option value="">-- Elige una sucursal --</option>
                      {sucursales.map((s) => (
                        <option key={s.id} value={s.nombre}>{s.nombre} – {s.provincia}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha y hora */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <GoogleIcon name="calendar_today" size={15} className="text-blue-600" />
                        Fecha *
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={today}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <GoogleIcon name="schedule" size={15} className="text-blue-600" />
                        Horario *
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition text-sm"
                        required
                      >
                        <option value="">Seleccionar horario</option>
                        {HORARIOS.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <GoogleIcon name="sticky_note_2" size={15} className="text-blue-600" />
                      Notas adicionales (opcional)
                    </label>
                    <textarea
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      rows={3}
                      placeholder="Ej. Traigo 2 paquetes, número de guía CR12345..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition text-sm resize-none"
                    />
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <GoogleIcon name="error" size={16} className="text-red-500" />
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    Continuar al Pago
                    <GoogleIcon name="arrow_forward" size={18} />
                  </button>
                </form>
              )}

              {/* ── STEP 2: Pago ── */}
              {step === 2 && (
                <form onSubmit={handlePago} className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
                    >
                      <GoogleIcon name="arrow_back" size={16} className="text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Pago Seguro</h2>
                  </div>

                  {/* Resumen de cita */}
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2 text-sm">
                    <p className="font-semibold text-blue-800 text-xs uppercase tracking-wide mb-2">Resumen de tu cita</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-500">Trámite:</span> <span className="font-semibold text-gray-800">{tramiteSeleccionado?.label}</span></div>
                      <div><span className="text-gray-500">Sucursal:</span> <span className="font-semibold text-gray-800">{selectedSucursal}</span></div>
                      <div><span className="text-gray-500">Fecha:</span> <span className="font-semibold text-gray-800">{date}</span></div>
                      <div><span className="text-gray-500">Hora:</span> <span className="font-semibold text-gray-800">{time}</span></div>
                    </div>
                    <hr className="border-blue-100 my-1" />
                    <div className="flex justify-between items-center font-bold text-blue-800">
                      <span>Total a pagar</span>
                      <span className="text-lg">₡5,000</span>
                    </div>
                  </div>

                  {/* Número de tarjeta */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <GoogleIcon name="credit_card" size={15} className="text-blue-600" />
                      Número de Tarjeta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="4111 1111 1111 1111"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCard(e.target.value))}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition font-mono text-sm"
                        maxLength={19}
                        required
                      />
                      <GoogleIcon name="credit_card" size={18} className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Nombre en tarjeta */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition text-sm uppercase"
                      required
                    />
                  </div>

                  {/* Vencimiento y CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Vencimiento</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition font-mono text-sm"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">CVC</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 outline-none transition font-mono text-sm"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  {formError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <GoogleIcon name="error" size={16} />
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando pago...
                      </>
                    ) : (
                      <>
                        <GoogleIcon name="lock" size={16} filled />
                        Pagar ₡5,000 y Confirmar Cita
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <GoogleIcon name="shield" size={14} className="text-emerald-500" filled />
                    Pagos encriptados con SSL 256-bit · Transacción segura
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, Search, Printer, Bell, ShieldCheck, MapPin, Clock, 
  Download, CheckCircle2, AlertCircle, FileText, Share2, Workflow,
  Check, Truck, AlertTriangle, Building, RefreshCw, Lock
} from 'lucide-react';
import { enviosService } from '../../services/enviosService';
import { StepperTracking } from '../../components/common/StepperTracking';
import { StatusBadge } from '../../components/common/StatusBadge';
import { generateTrackingStages, GUIAS_DEMO, ESTADOS_RASTREO } from '../../utils/trackingUtils';
import { useAuth } from '../../hooks/useAuth';
import { decryptId, encryptId } from '../../utils/cryptoUtils';

export const RastreoInternoPage = () => {
  const { trackingNumber } = useParams(); // This will be the encrypted ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [inputGuia, setInputGuia] = useState('');
  const [currentEnvio, setCurrentEnvio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [alertSubscribed, setAlertSubscribed] = useState(false);
  const [emailAlert, setEmailAlert] = useState('');

  const searchTracking = async (guiaToSearch, isEncrypted = false) => {
    let clean = (guiaToSearch || inputGuia).trim();
    if (!clean) {
      setErrorMsg('Por favor ingresa un número de guía válido');
      return;
    }

    if (isEncrypted) {
      const decrypted = decryptId(clean);
      if (!decrypted) {
        setErrorMsg('El enlace de rastreo seguro es inválido o está corrupto.');
        return;
      }
      clean = decrypted.toUpperCase();
      setInputGuia(clean);
    } else {
      clean = clean.toUpperCase();
    }

    // Regex check (UPU standard 8-10 digits e.g. CR098421734CR or CR03927360CR)
    const isValidFormat = enviosService.validateTrackingNumber(clean);
    if (!isValidFormat) {
      setErrorMsg('Formato de guía no estándar. El código debe iniciar con CR o CP seguido de 8 a 10 dígitos y terminar en CR.');
    } else {
      setErrorMsg('');
    }

    setLoading(true);
    const found = await enviosService.getByIdOrGuia(clean);
    setLoading(false);

    if (found) {
      // Internal dashboard check: Ownership
      if (found.usuarioId !== user?.id && user?.rol !== 'admin') {
        setErrorMsg('🔒 Acceso denegado. Este paquete pertenece a otra cuenta.');
        setCurrentEnvio(null);
        return;
      }

      // Ensure stages are populated and aligned with current state
      const etapas = (found.etapas && found.etapas.length > 0)
        ? found.etapas
        : generateTrackingStages(found);

      setCurrentEnvio({
        ...found,
        etapas
      });
      setErrorMsg('');
    } else {
      setErrorMsg('El paquete no existe en el sistema interno.');
      setCurrentEnvio(null);
      // If not in DB, create dynamic shipment with realistic stages
    }
  };

  useEffect(() => {
    if (trackingNumber) {
      searchTracking(trackingNumber, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingNumber]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputGuia.trim()) {
      const encryptedUrl = encryptId(inputGuia.trim().toUpperCase());
      navigate(`/cuenta/rastreo/${encryptedUrl}`);
    }
  };

  // Live state switcher for immediate testing and demonstration
  const handleChangeStatus = (newEstado) => {
    if (!currentEnvio) return;
    const updated = {
      ...currentEnvio,
      estado: newEstado
    };
    updated.etapas = generateTrackingStages(updated);
    setCurrentEnvio(updated);
  };

  const handleSubscribeAlerts = (e) => {
    e.preventDefault();
    if (emailAlert) {
      setAlertSubscribed(true);
    }
  };

  const displayEtapas = currentEnvio?.etapas && currentEnvio.etapas.length > 0
    ? currentEnvio.etapas
    : generateTrackingStages(currentEnvio);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" /> 
          Rastreo Interno Seguro
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-sans">
          Mis Envíos
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Consulta el estado de tus envíos de manera privada. Los datos están cifrados y solo son accesibles para el propietario de la cuenta.
        </p>
      </div>

      {/* Search Bar + Quick Demos */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputGuia}
              onChange={(e) => setInputGuia(e.target.value)}
              placeholder="Número de guía oficial (ej. CR098421734CR o CR03927360CR)"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50 text-sm font-semibold text-gris-oscuro focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primario py-3.5 px-8 font-bold text-sm"
          >
            {loading ? 'Consultando...' : 'Consultar Estado'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Guides by State */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Guías de demostración con diferentes estados reales:
          </span>
          <div className="flex flex-wrap gap-2">
            {GUIAS_DEMO.map((demo) => {
              const isActive = currentEnvio?.guia === demo.guia;
              return (
                <button
                  key={demo.guia}
                  type="button"
                  onClick={() => {
                    setInputGuia(demo.guia);
                    navigate(`/cuenta/rastreo/${encryptId(demo.guia)}`);
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition shadow-2xs ${
                    isActive
                      ? 'border-azul-primario bg-sky-50 text-azul-oscuro font-bold ring-2 ring-sky-200'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 text-gray-700'
                  }`}
                  title={demo.descripcion}
                >
                  <StatusBadge status={demo.estado} size="xs" />
                  <span className="font-mono font-bold text-[11px]">#{demo.guia}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tracking Result Card */}
      {currentEnvio && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden print:border-none print:shadow-none space-y-6 p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Número de Guía Postal</span>
                <StatusBadge status={currentEnvio.estado} size="sm" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-azul-oscuro font-mono mt-1">
                #{currentEnvio.guia}
              </h2>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="btn-neutro text-xs py-2 px-3"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comprobante</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Enlace copiado al portapapeles');
                }}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-azul-primario hover:bg-gray-50"
                title="Compartir enlace"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Live State Simulator Toolbar */}
          <div className="bg-sky-50/70 border border-sky-200 p-3 sm:p-4 rounded-2xl space-y-2.5 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-azul-primario" />
                <span className="text-xs font-bold text-azul-oscuro">
                  Probar diferentes estados de seguimiento para esta guía:
                </span>
              </div>
              <span className="text-[11px] text-gray-500">
                Cambia el estado en vivo para verificar Stepper, Ícono y Tiempos
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {ESTADOS_RASTREO.map((est) => {
                const isSelected = currentEnvio.estado === est.id;
                return (
                  <button
                    key={est.id}
                    type="button"
                    onClick={() => handleChangeStatus(est.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-azul-primario text-white border-azul-primario shadow-sm ring-2 ring-sky-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-sky-100/50 hover:border-azul-primario'
                    }`}
                  >
                    <span>{est.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Horizontal */}
          <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200">
            <StepperTracking envio={currentEnvio} />
          </div>

          {/* Route & Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Servicio Contratado</span>
              <p className="font-bold text-azul-oscuro text-sm">{currentEnvio.servicio}</p>
              <p className="text-gray-500">Operador: Centro Logístico Zapote</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Origen y Destino</span>
              <p className="font-bold text-gris-oscuro text-sm">
                {currentEnvio.origen} → {currentEnvio.destino}
              </p>
              <p className="text-gray-500">Ruta: {currentEnvio.ruta || 'Distribución GAM'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Fecha de Admisión</span>
              <p className="font-bold text-gris-oscuro text-sm">{currentEnvio.fecha}</p>
              <p className="text-emerald-600 font-semibold">Trazabilidad Satelital Activa</p>
            </div>
          </div>

          {/* Detailed Timeline Table */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
              Historial Cronológico de Movimientos
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
              {displayEtapas.map((etapa, idx) => {
                const isAduanaAlert = etapa.alerta || (etapa.actual && currentEnvio.estado === 'En aduana');
                return (
                  <div key={idx} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        isAduanaAlert
                          ? 'bg-amber-500 ring-2 ring-amber-200 animate-pulse'
                          : etapa.completado
                          ? 'bg-emerald-600'
                          : 'bg-gray-300'
                      }`}>
                        {etapa.completado && !isAduanaAlert ? (
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        ) : isAduanaAlert ? (
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                        ) : null}
                      </div>
                      <div>
                        <p className={`font-bold ${isAduanaAlert ? 'text-amber-800' : 'text-gris-oscuro'}`}>
                          {etapa.nombre}
                        </p>
                        <p className="text-gray-500">{etapa.ubicacion}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className={`font-semibold ${isAduanaAlert ? 'text-amber-700 font-bold' : 'text-gray-700'}`}>
                        {etapa.hora}
                      </span>
                      <span className="block text-[10px] text-gray-400">Verificado por terminal</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscriptions & Alerts Panel */}
          <div className="pt-6 border-t border-gray-100 print:hidden bg-sky-50/60 p-6 rounded-2xl border border-sky-100 space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-azul-primario" />
              <h4 className="text-sm font-bold text-azul-oscuro">
                Suscripción de Alertas Digitales (Email / SMS)
              </h4>
            </div>
            <p className="text-xs text-gray-600">
              Recibe notificaciones automáticas gratuitas en cada cambio de estado de tu guía #{currentEnvio.guia}.
            </p>

            {alertSubscribed ? (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Suscripción exitosa! Te notificaremos a {emailAlert} en cada movimiento del paquete.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeAlerts} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico..."
                  value={emailAlert}
                  onChange={(e) => setEmailAlert(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-azul-primario"
                />
                <button type="submit" className="btn-primario text-xs py-2.5 px-5 font-bold">
                  Suscribirme a Alertas
                </button>
              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Zap, Home, Truck, Clock, ShieldCheck, CheckCircle2, ArrowRight, 
  MapPin, Phone, Sparkles, AlertCircle, Send, Check
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../common/Modal';

export const ExpressHomeDeliverySection = () => {
  const { addToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [guiaNumber, setGuiaNumber] = useState('CR098421734CR');
  const [address, setAddress] = useState('Condominio La Floresta, Casa 42B, Curridabat');
  const [contactPhone, setContactPhone] = useState('+506 8888-9999');
  const [selectedHorario, setSelectedHorario] = useState('mismo-dia');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activatedSuccess, setActivatedSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivateExpress = (e) => {
    e.preventDefault();
    if (!guiaNumber.trim()) {
      addToast('Por favor introduce tu número de guía o paquete.', 'error');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActivatedSuccess(true);
      addToast('¡Envío Express a Domicilio activado! Su paquete llegará en la ruta prioritaria.', 'success');
      setTimeout(() => {
        setIsModalOpen(false);
        setActivatedSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section id="envio-express-casa" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      
      {/* Banner Card Container with Premium Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-azul-oscuro via-slate-900 to-sky-950 text-white shadow-2xl border border-sky-500/20 p-6 sm:p-10 lg:p-12">
        
        {/* Glow & Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Servicio Prioritario Flash · Mismo Día o 24h</span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
                Envío a tu Casa Más Rápido por solo{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 underline decoration-amber-400/60 decoration-wavy decoration-2">
                  +₡2,000 extras
                </span>
              </h2>
              <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-xl">
                ¿No puedes esperar o no tienes tiempo de ir a la sucursal? Acelera cualquier paquete nacional o internacional y recíbelo directamente en la puerta de tu hogar u oficina con nuestro equipo de motorizados dedicados.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Mismo Día (GAM)</h4>
                  <p className="text-[11px] text-sky-200 mt-0.5">
                    Entregado hoy mismo si solicitas antes de las 11:30 a.m.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Puerta a Puerta</h4>
                  <p className="text-[11px] text-sky-200 mt-0.5">
                    Sin filas ni desplazamientos, directo a tus manos.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ruta Flash Motorizada</h4>
                  <p className="text-[11px] text-sky-200 mt-0.5">
                    Despacho preferencial desde Centro Postal Zapote.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Seguro & Notificación</h4>
                  <p className="text-[11px] text-sky-200 mt-0.5">
                    PIN seguro de entrega y aviso en vivo vía WhatsApp.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Upgrade Form & Pricing Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 text-slate-800 shadow-2xl border border-gray-100 space-y-5">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-azul-oscuro text-sm sm:text-base leading-tight">
                      Acelera Tu Paquete Ahora
                    </h3>
                    <p className="text-[11px] text-gray-500">Upgrade a Entrega Flash Domiciliar</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  +₡2,000 CRC
                </span>
              </div>

              <form onSubmit={handleActivateExpress} className="space-y-4">
                
                {/* Tracking code input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gris-oscuro">
                    Número de Guía o Código de Envío:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={guiaNumber}
                      onChange={(e) => setGuiaNumber(e.target.value)}
                      placeholder="Ej. CR098421734CR"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold text-azul-oscuro bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Válido
                    </span>
                  </div>
                </div>

                {/* Home Address input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gris-oscuro">
                    Dirección Exacta de Tu Casa / Oficina:
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Provincia, Cantón, señas exactas..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Delivery Time Options */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gris-oscuro">
                    Modalidad Express Deseada:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHorario('mismo-dia')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedHorario === 'mismo-dia'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight">Hoy Mismo</p>
                      <p className="text-[10px] text-gray-500 font-normal">Gran Área Metropolitana</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedHorario('24h')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedHorario === '24h'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-xs font-bold leading-tight">Próximas 24 Horas</p>
                      <p className="text-[10px] text-gray-500 font-normal">Cualquier zona del país</p>
                    </button>
                  </div>
                </div>

                {/* Pricing Summary Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Tarifa regular asignada al envío:</span>
                    <span className="font-semibold text-gray-700">₡2,500</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Suplemento Express a Casa (Flash):</span>
                    </span>
                    <span className="text-amber-700 text-sm font-extrabold">+₡2,000</span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-azul-oscuro">Total con Entrega Express:</span>
                    <span className="text-base font-extrabold text-azul-primario">₡4,500</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Zap className="w-4 h-4 text-amber-950 group-hover:scale-110 transition-transform" />
                  <span>Activar Entrega Express a Domicilio</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

              </form>

              <div className="text-center">
                <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Pago seguro con SINPE Móvil o Tarjeta de Débito/Crédito</span>
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Confirmation & Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmación de Entrega Express a Domicilio"
        subtitle={`Guía: ${guiaNumber}`}
      >
        {activatedSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-azul-oscuro">¡Entrega Flash Activada!</h3>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Hemos asignado prioridad urgente a tu envío <strong>{guiaNumber}</strong>. Será entregado en la dirección proporcionada:
            </p>
            <div className="p-3 bg-sky-50 rounded-xl text-xs font-semibold text-azul-oscuro border border-sky-100 max-w-sm mx-auto">
              📍 {address}
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              ✓ Suplemento de ₡2,000 registrado con éxito. Notificaciones activas vía WhatsApp.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Upgrade de Entrega Prioritaria (+₡2,000)</p>
                <p className="text-[11px] text-amber-800">
                  Tu paquete saldrá en la siguiente ruta motorizada directa a tu casa u oficina sin esperas.
                </p>
              </div>
            </div>

            <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/80 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Destinatario:</span>
                <span className="font-bold text-azul-oscuro">{user?.nombre || 'Cliente Registrado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guía de Envío:</span>
                <span className="font-mono font-bold text-azul-primario">{guiaNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dirección de Entrega:</span>
                <span className="font-semibold text-gray-700 text-right max-w-[200px] truncate">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tiempo de Entrega:</span>
                <span className="font-bold text-emerald-600">
                  {selectedHorario === 'mismo-dia' ? 'Hoy Mismo (Express GAM)' : 'Próximas 24 Horas'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                <span>Costo Adicional a Pagar:</span>
                <span className="text-amber-700 font-extrabold">₡2,000 CRC</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-neutro text-xs py-2.5 px-4"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs py-2.5 px-5 rounded-xl shadow-md flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Procesando pago...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Pagar ₡2,000 y Confirmar</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}
      </Modal>

    </section>
  );
};

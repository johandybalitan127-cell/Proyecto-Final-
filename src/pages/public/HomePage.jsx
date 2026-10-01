import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, Search, Truck, Globe, ShieldCheck, MapPin, Clock, 
  ExternalLink, Printer, Bell, CheckCircle2, ChevronRight, Navigation,
  Ticket, ArrowRight, MessageCircle, PhoneCall, Sparkles, Building2,
  Archive, Users, FileCheck, Layers, Calculator, Zap
} from 'lucide-react';
import { StepperTracking } from '../../components/common/StepperTracking';
import { ExchangeRateBadge } from '../../components/common/ExchangeRateBadge';
import { enviosService } from '../../services/enviosService';
import { encryptId } from '../../utils/cryptoUtils';
import { InternationalShippingSection } from '../../components/home/InternationalShippingSection';
import { ExpressHomeDeliverySection } from '../../components/home/ExpressHomeDeliverySection';
import { SucursalesMapLocator } from '../../components/public/SucursalesMapLocator';

export const HomePage = () => {
  const navigate = useNavigate();
  const [guideInput, setGuideInput] = useState('');
  const [carrier, setCarrier] = useState('EMS Courier Nacional');
  const [trackedEnvio, setTrackedEnvio] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const handleTrackSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setTrackingError('');
    if (!guideInput.trim()) {
      setTrackingError('Por favor ingresa un número de guía válido');
      return;
    }
    const encrypted = encryptId(guideInput.trim().toUpperCase());
    navigate(`/cuenta/rastreo/${encrypted}`);
  };

  return (
    <div className="space-y-12 lg:space-y-20 pb-12">
      
      {/* Mobile Top Status Banner (Anexo 2) */}
      <div className="md:hidden bg-sky-50 border-b border-sky-100 px-4 py-2 flex items-center justify-between text-[11px] text-azul-oscuro">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Red logística operando al 100% en todo el país · Hoy 08:30 am</span>
        </div>
      </div>

      {/* Official Promotional Banner - Campaña de Citas de Pasaportes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-sky-200/80 shadow-md hover:shadow-xl transition-all duration-300 bg-sky-400">
          <Link 
            to="/oficinas"
            className="block relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-sky-300 rounded-2xl sm:rounded-3xl"
            title="¿Necesitás pasaporte? Citas disponibles en Tibás y Pavas - Correos de Costa Rica"
          >
            <img 
              src="/images/banner-pasaportes.png" 
              alt="¿Necesitás Pasaporte? Citas disponibles en las sucursales de Tibás y Pavas - Correos de Costa Rica. ¡Agendá ya!" 
              className="w-full h-auto object-cover max-h-[220px] sm:max-h-[260px] md:max-h-[300px] transition-transform duration-500 group-hover:scale-[1.01]"
              loading="eager"
            />
            {/* Interactive Call to Action Tag */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 bg-azul-oscuro/90 hover:bg-azul-oscuro text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all transform group-hover:scale-105 backdrop-blur-xs">
              <span>Agendar Cita Oficial</span>
              <span className="text-base font-black">→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 lg:pt-12 pb-8 bg-gradient-to-b from-white via-sky-50/30 to-gris-claro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge & Exchange rate */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                  <Globe className="w-3.5 h-3.5 text-verde-principal" />
                  Red Logística Nacional e Internacional
                </span>
                <ExchangeRateBadge />
              </div>

              {/* H1 Title in two lines */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-azul-oscuro tracking-tight leading-[1.1] font-sans">
                Tus envíos, <br />
                <span className="text-azul-primario">
                  siempre cerca de ti
                </span>
              </h1>

              {/* Description paragraph */}
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                Consulta, rastrea y gestiona tus servicios postales de forma rápida, sencilla y segura en todo el territorio costarricense y más de 190 países en el mundo.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('tracking-card');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primario text-base py-3 px-6 shadow-md"
                >
                  <Package className="w-5 h-5" />
                  <span>Rastrear paquete</span>
                </button>

                <Link
                  to="/servicios"
                  className="btn-neutro text-base py-3 px-6"
                >
                  <span>Ver servicios</span>
                  <span>→</span>
                </Link>

                <Link
                  to="/cuenta/citas-premium"
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 px-6 py-3 rounded-xl text-base font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Zap className="w-5 h-5 text-amber-950" />
                  <span>Citas VIP (Fila Cero)</span>
                </Link>
              </div>

              {/* 3 Metrics in line (Horizontal scroll on mobile, grid on tablet & laptop) */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200/80">
                <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  <div className="bg-white/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-none border-gray-200 flex-shrink-0 min-w-[130px] sm:min-w-0">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-azul-oscuro font-sans">110+</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-500">Sucursales Activas</p>
                  </div>
                  <div className="bg-white/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-none border-gray-200 flex-shrink-0 min-w-[130px] sm:min-w-0">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-verde-principal font-sans">99.2%</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-500">Entregas a Tiempo</p>
                  </div>
                  <div className="bg-white/80 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-none border-gray-200 flex-shrink-0 min-w-[130px] sm:min-w-0">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-azul-primario font-sans">100%</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-500">Cantones del País</p>
                  </div>
                </div>
              </div>

              {/* Grid 2×2 de Accesos Directos (Anexo 2 - Mobile y Tablet) */}
              <div className="lg:hidden pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Accesos Rápidos Ciudadanos
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/cuenta/rastreo"
                    className="p-3 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-azul-primario transition flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-azul-primario flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-azul-oscuro leading-tight">Rastreo</p>
                      <p className="text-[10px] text-gray-500">Express Nacional</p>
                    </div>
                  </Link>

                  <Link
                    to="/servicios"
                    className="p-3 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-azul-primario transition flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-verde-principal" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-azul-oscuro leading-tight">Cotizar</p>
                      <p className="text-[10px] text-gray-500">Calculadora</p>
                    </div>
                  </Link>

                  <Link
                    to="/oficinas"
                    className="p-3 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-azul-primario transition flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-azul-oscuro leading-tight">Oficinas</p>
                      <p className="text-[10px] text-gray-500">110 Sucursales GPS</p>
                    </div>
                  </Link>

                  <Link
                    to="/oficinas"
                    className="p-3 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-azul-primario transition flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-azul-oscuro leading-tight">Pasaportes</p>
                      <p className="text-[10px] text-gray-500">Cita Oficial VES</p>
                    </div>
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Visual Image & Floating Card (5 cols) matching Anexo 1 & user photo */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3]">
                {/* Hero Real Photograph */}
                <img
                  src="/images/hero-correos.jpg"
                  alt="Edificio Central y Flota Oficial de Correos de Costa Rica"
                  className="w-full h-full object-cover"
                />

                {/* Top-Left Badge inside photo */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-gray-800 shadow-md border border-gray-200/80 backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-verde-principal"></span>
                    Operador Oficial de Costa Rica
                  </span>
                </div>

                {/* Subtle gradient overlay at bottom for readability */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none"></div>

                {/* Bottom Overlay Card inside image */}
                <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-lg border border-gray-100/90 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Ruta Nacional Express
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-azul-oscuro">
                      Gran Área Metropolitana
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-emerald-600">
                        Operación Normal
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Tránsito fluido
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom-Left Overlapping Badge (extending outside corner) */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 z-20 bg-azul-oscuro text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-sky-400/20 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Navigation className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">Cobertura Postal Total</p>
                  <p className="text-[10px] text-sky-200 leading-tight">De frontera a frontera</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Bloque "Rastrea tu envío en tiempo real" (Card blanca elevada) */}
      <section id="tracking-card" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-azul-primario">
                Rastreo Satelital Oficial
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
                Rastrea tu envío en tiempo real
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Transportista:</span>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="text-xs font-semibold text-gris-oscuro bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-azul-primario"
              >
                <option value="EMS Courier Nacional">EMS Courier Nacional</option>
                <option value="Pymexpress">Pymexpress</option>
                <option value="Box Correos Miami">Box Correos Miami</option>
                <option value="EMS Internacional">EMS Internacional</option>
              </select>
            </div>
          </div>

          {/* Form Input Bar */}
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={guideInput}
                onChange={(e) => setGuideInput(e.target.value)}
                placeholder="Ingresa número de guía (ej. CR098421734CR)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 bg-gray-50/50 text-sm font-semibold text-gris-oscuro focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading}
              className="btn-primario text-sm py-3.5 px-8 font-bold"
            >
              {trackingLoading ? 'Buscando...' : 'Rastrear'}
            </button>
          </form>

          {trackingError && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {trackingError}
            </p>
          )}

          {/* Tracking result preview removed for privacy. It now directly navigates to private dashboard */}

        </div>
      </section>

      {/* Sección "Servicios Postales y Logísticos" (Grid 3×2 de tarjetas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-azul-primario uppercase tracking-wider">
              Soluciones para Personas y Empresas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-azul-oscuro mt-1">
              Servicios Postales y Logísticos
            </h2>
          </div>

          <Link
            to="/servicios"
            className="text-xs sm:text-sm font-bold text-azul-primario hover:text-azul-oscuro hover:underline inline-flex items-center gap-1"
          >
            <span>Explorar catálogo completo de trámites</span>
            <span>→</span>
          </Link>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Envíos Nacionales */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-azul-primario/60 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-azul-primario flex items-center justify-center group-hover:bg-azul-primario group-hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-azul-oscuro">Envíos Nacionales</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mensajería EMS y paquetería estándar puerta a puerta con entrega de 24 a 48 horas en los 84 cantones.
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  Tiempos: 24 a 48h · Desde ₡2,350
                </span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>Entrega Express a Casa +₡2,000</span>
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
              <Link to="/servicios" className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Cotizar regular</span>
                <span>→</span>
              </Link>
              <a href="#envio-express-casa" className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center gap-1">
                <span>Acelerar (+₡2,000)</span>
                <span>⚡</span>
              </a>
            </div>
          </div>

          {/* Card 2: Envíos Internacionales */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-azul-primario/60 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-azul-oscuro">Envíos Internacionales</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Conexión directa con la red de la Unión Postal Universal (UPU) a más de 190 países con trazabilidad continua.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  Cobertura: 190 países · Red UPU
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6">
              <a href="#internacional" className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Ver cotizador mundial</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Card 3: Rastreo de Paquetes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-azul-primario/60 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-azul-oscuro">Rastreo de Paquetes</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Plataforma interactiva para verificar la posición exacta, aduanas y estado de entrega de cualquier código postal.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  Alertas SMS / Email en tiempo real
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6">
              <Link to="/cuenta/rastreo" className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Ir al rastreador seguro</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Apartados Postales */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-azul-primario/60 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Archive className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-azul-oscuro">Apartados Postales</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tu dirección fija, segura y confidencial en cualquiera de nuestras sucursales para recibir compras y documentos.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  Físicos y Digitales · Anual / Semestral
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6">
              <Link to="/servicios" className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Alquilar apartado</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 5: Servicios Empresariales */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-azul-primario/60 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-azul-oscuro">Servicios Empresariales</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Logística para e-commerce, Pymexpress, facturación electrónica mensual, API de envíos y recolección programada.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  Plataforma API · Tarifas por volumen
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6">
              <Link to="/servicios" className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Conocer Pymexpress</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 6: Ubicación de Oficinas */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-azul-primario/60 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-azul-oscuro">Ubicación de Oficinas</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Localiza las 110 sucursales, horarios de atención, ventanillas de pasaportes y citas digitales sin hacer filas.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  110 Sucursales en las 7 Provincias
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100 mt-6">
              <Link to="/oficinas" className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Buscar sucursales</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* Sección Entrega Express a Casa Más Rápido (+₡2,000 extras) */}
      <ExpressHomeDeliverySection />

      {/* Sección Oficial de Envíos Internacionales & Exportación UPU */}
      <InternationalShippingSection />

      {/* Sección "¿Dónde estamos?" (Geolocalización Oficial y Red de Sucursales) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <span className="text-xs font-bold text-azul-primario uppercase tracking-wider">
            Presencia Nacional Universal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-azul-oscuro mt-1">
            ¿Dónde estamos?
          </h2>
        </div>

        <SucursalesMapLocator />
      </section>

      {/* Banner Institucional Pasaportes / Cédulas VES (Fondo Azul Oscuro) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-azul-oscuro rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-verde-principal" />
              Convenio SIDGE Oficial
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              ¿Necesitas pasaporte o cédula de residencia?
            </h2>

            <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
              Agenda tu cita oficial en nuestras sucursales autorizadas de Correos de Costa Rica. Tramitación rápida, sin filas y con entrega garantizada.
            </p>

            <div className="pt-3">
              <Link
                to="/oficinas"
                className="btn-secundario text-sm sm:text-base py-3 px-6 shadow-md inline-flex items-center gap-2"
              >
                <FileCheck className="w-5 h-5" />
                <span>Agendar Cita en Línea</span>
              </Link>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border-8 border-white/5 pointer-events-none"></div>
          <div className="absolute right-20 -top-20 w-60 h-60 rounded-full border-8 border-white/5 pointer-events-none"></div>
        </div>
      </section>

      {/* Bloque Final de Dos Tarjetas (Pymexpress & Casillero Miami) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Pymexpress */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-2xs hover:shadow-subtle transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-verde-oscuro uppercase tracking-wider">
                Emprendedores y Mipymes
              </span>
              <h3 className="text-2xl font-bold text-azul-oscuro">
                Impulsa tu tienda virtual con Pymexpress
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Logística preferencial con recolección en tu taller, tarifas reducidas desde ₡1,950, trazabilidad para tus clientes y cobro contra entrega SINPE Móvil.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/servicios"
                className="text-sm font-bold text-azul-primario hover:underline inline-flex items-center gap-1.5"
              >
                <span>Conocer beneficios y requisitos</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Casillero Miami — Box Correos */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-2xs hover:shadow-subtle transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-azul-primario flex items-center justify-center">
                <Archive className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-azul-primario uppercase tracking-wider">
                Compras por Internet en EE.UU.
              </span>
              <h3 className="text-2xl font-bold text-azul-oscuro">
                Casillero Miami — Box Correos
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dirección física en Miami para tus compras en Amazon, eBay y tiendas globales, con gestión aduanal simplificada y entrega a tu domicilio o sucursal favorita.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => alert('¡Tu casillero virtual Box Correos Miami ha sido creado! Dirección asignada: 8200 NW 27th St, Suite 104, Miami FL 33122.')}
                className="btn-primario text-sm py-2.5 px-6"
              >
                <span>Crear casillero gratuito</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Special Section (Anexo 2): Canales de Ayuda Cívica */}
      <section className="md:hidden max-w-7xl mx-auto px-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
          <h4 className="text-xs font-bold text-azul-oscuro uppercase tracking-wider">
            Canales de Ayuda Cívica
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://wa.me/50622578888"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2 text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp CR</span>
            </a>
            <a
              href="tel:8002677367"
              className="p-3 rounded-xl bg-sky-50 text-azul-primario border border-sky-200 flex items-center justify-center gap-2 text-xs font-bold"
            >
              <PhoneCall className="w-4 h-4 text-azul-primario" />
              <span>Llamada 800</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

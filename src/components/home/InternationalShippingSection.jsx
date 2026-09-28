import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Plane, ShieldCheck, FileText, AlertCircle, ArrowRight, 
  CheckCircle2, Calculator, Scale, Clock, Send, Sparkles, Box,
  ExternalLink, HelpCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const InternationalShippingSection = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('ems'); // 'ems', 'exporta', 'encomienda', 'box'
  const [selectedDest, setSelectedDest] = useState('norteamerica');
  const [weightKg, setWeightKg] = useState('1');

  const destinations = {
    centroamerica: {
      nombre: 'América Central & Panamá',
      paises: 'Guatemala, El Salvador, Honduras, Nicaragua, Panamá',
      bandera: '🌎',
      tiempoEms: '2 a 4 días hábiles',
      tiempoPostal: '5 a 8 días hábiles',
      tarifaBaseEms: 18500, // 1 kg
      precioKgExtra: 4200,
      documentoAduana: 'Declaración Postal CN22'
    },
    norteamerica: {
      nombre: 'Estados Unidos & Canadá',
      paises: 'Todos los 50 estados de EE.UU. y provincias canadienses',
      bandera: '🇺🇸',
      tiempoEms: '3 a 5 días hábiles',
      tiempoPostal: '7 a 12 días hábiles',
      tarifaBaseEms: 22400,
      precioKgExtra: 5100,
      documentoAduana: 'Declaración Electrónica CN23 / Aduana CBP'
    },
    europa: {
      nombre: 'Europa & Reino Unido',
      paises: 'España, Alemania, Francia, Italia, Reino Unido, Suiza, Países Bajos',
      bandera: '🇪🇺',
      tiempoEms: '4 a 6 días hábiles',
      tiempoPostal: '10 a 15 días hábiles',
      tarifaBaseEms: 29800,
      precioKgExtra: 6800,
      documentoAduana: 'Declaración UPU CN23 + Código TARIC'
    },
    asia: {
      nombre: 'Asia & Oceanía',
      paises: 'Japón, Corea del Sur, China, Australia, Nueva Zelanda',
      bandera: '🌏',
      tiempoEms: '6 a 9 días hábiles',
      tiempoPostal: '12 a 20 días hábiles',
      tarifaBaseEms: 36500,
      precioKgExtra: 8200,
      documentoAduana: 'Declaración Aduanal Internacional CN23'
    },
    resto: {
      nombre: 'Resto del Mundo',
      paises: 'Sudamérica, África y Medio Oriente',
      bandera: '🌐',
      tiempoEms: '7 a 11 días hábiles',
      tiempoPostal: '15 a 25 días hábiles',
      tarifaBaseEms: 34200,
      precioKgExtra: 7500,
      documentoAduana: 'Declaración Oficial UPU CN23'
    }
  };

  const currentDest = destinations[selectedDest] || destinations.norteamerica;
  const numWeight = Math.max(0.5, parseFloat(weightKg) || 1);

  // Formula: base 1kg + (extra kg * rate)
  const calculatedCost = Math.round(
    numWeight <= 1
      ? currentDest.tarifaBaseEms * (numWeight <= 0.5 ? 0.75 : 1)
      : currentDest.tarifaBaseEms + (numWeight - 1) * currentDest.precioKgExtra
  );
  const calculatedUsd = (calculatedCost / 514.5).toFixed(2);

  const handleCreateGuide = () => {
    addToast(
      `Has iniciado el trámite para tu envío internacional a ${currentDest.nombre}. Acércate a cualquier sucursal con el formulario CN22/CN23.`,
      'info'
    );
  };

  const customsRequirements = [
    {
      titulo: 'Declaración de Aduana UPU (CN22 / CN23)',
      desc: 'Para paquetes que contengan mercadería, es obligatorio describir el contenido exacto, valor comercial declarado y el peso neto en el formulario oficial postal.',
      requisito: 'Obligatorio para todo envío con valor superior a $0 USD.'
    },
    {
      titulo: 'Factura Comercial o Proforma Adjunta',
      desc: 'Debe adjuntarse en el exterior del paquete en un sobre transparente para inspección aduanera en el país de destino.',
      requisito: '1 copia original y 2 copias legibles.'
    },
    {
      titulo: 'Mercancías Prohibidas o Reguladas',
      desc: 'Baterías de litio sueltas, aerosoles, líquidos inflamables, armas, drogas y alimentos perecederos sin certificado fitosanitario del MAG están terminantemente prohibidos por normativa aérea IATA y UPU.',
      requisito: 'Revisión obligatoria en ventanilla antes de admitir.'
    }
  ];

  return (
    <section id="internacional" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/80 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-azul-primario text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Red Postal Mundial — 192 Países UPU</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-azul-oscuro font-sans tracking-tight">
            Envíos Internacionales & Exportación
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Conectamos a Costa Rica con el mundo a través de la Unión Postal Universal. Trazabilidad satelital puerta a puerta, tarifas oficiales y despacho aduanal preferencial.
          </p>
        </div>

        {/* Global Stats Badges */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs text-center min-w-[110px]">
            <p className="text-2xl font-black text-azul-primario">192</p>
            <p className="text-[11px] font-semibold text-gray-500">Países Destino</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs text-center min-w-[110px]">
            <p className="text-2xl font-black text-emerald-600">3-5</p>
            <p className="text-[11px] font-semibold text-gray-500">Días Express</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs text-center min-w-[110px]">
            <p className="text-2xl font-black text-amber-600">100%</p>
            <p className="text-[11px] font-semibold text-gray-500">Seguimiento UPU</p>
          </div>
        </div>
      </div>

      {/* Service Modality Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Tab 1: EMS Internacional */}
        <button
          onClick={() => setActiveTab('ems')}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
            activeTab === 'ems'
              ? 'bg-azul-primario text-white border-azul-primario shadow-md ring-2 ring-sky-200'
              : 'bg-white hover:bg-sky-50/50 text-gray-700 border-gray-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeTab === 'ems' ? 'bg-white/20 text-white' : 'bg-sky-50 text-azul-primario'
            }`}>
              <Plane className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'ems' ? 'bg-white text-azul-primario' : 'bg-sky-100 text-azul-primario'
            }`}>
              Más Rápido
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm">EMS Internacional</h3>
            <p className={`text-xs mt-0.5 line-clamp-2 ${activeTab === 'ems' ? 'text-sky-100' : 'text-gray-500'}`}>
              Courier prioritario aéreo con entrega bajo firma y rastreo prioritario UPU.
            </p>
          </div>
        </button>

        {/* Tab 2: Exporta Fácil */}
        <button
          onClick={() => setActiveTab('exporta')}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
            activeTab === 'exporta'
              ? 'bg-azul-primario text-white border-azul-primario shadow-md ring-2 ring-sky-200'
              : 'bg-white hover:bg-emerald-50/50 text-gray-700 border-gray-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeTab === 'exporta' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'exporta' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              MiPymes & Artesanos
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Exporta Fácil CR</h3>
            <p className={`text-xs mt-0.5 line-clamp-2 ${activeTab === 'exporta' ? 'text-sky-100' : 'text-gray-500'}`}>
              Convenio con PROCOMER. Hasta 30 kg por guía con trámite aduanero simplificado.
            </p>
          </div>
        </button>

        {/* Tab 3: Encomienda Postal */}
        <button
          onClick={() => setActiveTab('encomienda')}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
            activeTab === 'encomienda'
              ? 'bg-azul-primario text-white border-azul-primario shadow-md ring-2 ring-sky-200'
              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeTab === 'encomienda' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              <Box className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'encomienda' ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-700'
            }`}>
              Económico
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Encomienda Postal</h3>
            <p className={`text-xs mt-0.5 line-clamp-2 ${activeTab === 'encomienda' ? 'text-sky-100' : 'text-gray-500'}`}>
              La opción más accesible para envíos personales, regalos familiares y documentos.
            </p>
          </div>
        </button>

        {/* Tab 4: Box Correos Miami */}
        <button
          onClick={() => setActiveTab('box')}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
            activeTab === 'box'
              ? 'bg-azul-primario text-white border-azul-primario shadow-md ring-2 ring-sky-200'
              : 'bg-white hover:bg-amber-50/50 text-gray-700 border-gray-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeTab === 'box' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
            }`}>
              <Globe className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'box' ? 'bg-white text-amber-900' : 'bg-amber-100 text-amber-800'
            }`}>
              Importación EE.UU.
            </span>
          </div>
          <div>
            <h3 className="font-bold text-sm">Casillero Box Miami</h3>
            <p className={`text-xs mt-0.5 line-clamp-2 ${activeTab === 'box' ? 'text-sky-100' : 'text-gray-500'}`}>
              Compra en Amazon o eBay en EE.UU. y recíbelo en la puerta de tu casa en Costa Rica.
            </p>
          </div>
        </button>

      </div>

      {/* Main Interactive Grid (Cotizador + Destino + Aduanas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive International Rate Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-azul-primario flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-azul-oscuro">
                  Cotizador de Exportación & Envíos al Exterior
                </h3>
                <p className="text-xs text-gray-500">Tarifas oficiales reguladas bajo marco UPU</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-100">
              Tarifas 2025/2026
            </span>
          </div>

          {/* Region Selector Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gris-oscuro uppercase tracking-wider">
              1. Selecciona la Región o País de Destino:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(destinations).map(([key, dest]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDest(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDest === key
                      ? 'border-azul-primario bg-sky-50/80 text-azul-oscuro shadow-xs ring-1 ring-azul-primario'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{dest.bandera}</span>
                    <span className="text-xs font-bold line-clamp-1">{dest.nombre}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{dest.paises}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weight and Details Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gris-oscuro flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-azul-primario" />
                <span>Peso del Envío (Kilogramos):</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.1"
                  max="30"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-azul-oscuro bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                />
                <span className="text-xs font-bold text-gray-500 uppercase">Kg</span>
              </div>
              <div className="flex gap-1.5 pt-1">
                {['0.5', '1', '2', '5', '10'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setWeightKg(preset)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                      weightKg === preset
                        ? 'bg-azul-primario text-white border-azul-primario'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {preset} kg
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gris-oscuro flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tiempo de Tránsito Estimado:</span>
              </label>
              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs">
                <p className="font-bold text-azul-oscuro">{currentDest.tiempoEms}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Vía aérea con prioridad postal UPU</p>
              </div>
            </div>
          </div>

          {/* Rate Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-azul-oscuro to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-200">
                Tarifa Estimada de Envío
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  ₡{calculatedCost.toLocaleString('es-CR')}
                </span>
                <span className="text-xs font-semibold text-sky-200">
                  (aprox. ${calculatedUsd} USD)
                </span>
              </div>
              <p className="text-[11px] text-sky-100">
                Destino: <strong>{currentDest.nombre}</strong> · Peso: {numWeight} kg
              </p>
            </div>

            <button
              onClick={handleCreateGuide}
              className="btn-secundario text-xs py-3 px-5 whitespace-nowrap justify-center flex items-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Preparar Envío</span>
            </button>
          </div>

          {/* Quick Info Footer */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <span>Requiere: <strong>{currentDest.documentoAduana}</strong></span>
            <span>Tipo de Cambio USD: ₡514.50</span>
          </div>

        </div>

        {/* Right: Export Requirements & Customs Guides (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Customs Check Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-azul-oscuro text-base">Requisitos de Aduana para Exportar</h3>
                <p className="text-xs text-gray-500">Normativa para despachos al exterior</p>
              </div>
            </div>

            <div className="space-y-3">
              {customsRequirements.map((req, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <h4 className="text-xs font-bold text-azul-oscuro">{req.titulo}</h4>
                  </div>
                  <p className="text-[11px] text-gray-600 pl-6 leading-relaxed">{req.desc}</p>
                  <p className="text-[10px] font-semibold text-azul-primario pl-6">✓ {req.requisito}</p>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                to="/ayuda"
                className="btn-neutro text-xs py-2 px-3 flex-1 justify-center flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-azul-primario" />
                <span>Preguntas Frecuentes UPU</span>
              </Link>
              <Link
                to="/servicios"
                className="btn-primario text-xs py-2 px-3 flex-1 justify-center flex items-center gap-1.5"
              >
                <span>Catálogo Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Promo Callout: Exporta Fácil con PROCOMER */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 to-azul-oscuro text-white space-y-3 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                Alianza PROCOMER & COMEX
              </span>
              <h4 className="text-lg font-extrabold text-white">¿Eres artesano o exportador tico?</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Con <strong>Exporta Fácil</strong> accedes a tarifas con descuento estatal, factura electrónica sin agente aduanero y soporte para que tu producto llegue a compradores de todo el mundo.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.procomer.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2 px-4 rounded-xl shadow-xs transition"
                >
                  <span>Conocer Programa Exporta Fácil</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            {/* Background circle decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border-4 border-white/10 pointer-events-none"></div>
          </div>

        </div>

      </div>

    </section>
  );
};

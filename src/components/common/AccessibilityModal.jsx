import React from 'react';
import { 
  X, Type, Contrast, Volume2, VolumeX, Eye, RotateCcw, 
  Check, Play, Square, Keyboard, Sparkles, ShieldCheck, Info
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const AccessibilityModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    highContrast,
    toggleHighContrast,
    colorblindMode,
    setColorblindMode,
    textScale,
    setTextScale,
    voiceReadingActive,
    toggleVoiceReading,
    enhancedFocus,
    toggleEnhancedFocus,
    isSpeaking,
    speak,
    stopSpeaking,
    readCurrentPage,
    resetAccessibility,
  } = useAccessibility();

  if (!isModalOpen) return null;

  const colorblindOptions = [
    { id: 'none', label: 'Estándar', desc: 'Sin filtro de color' },
    { id: 'deuteranopia', label: 'Deuteranopía', desc: 'Verde débil / Ceguera al verde' },
    { id: 'protanopia', label: 'Protanopía', desc: 'Rojo débil / Ceguera al rojo' },
    { id: 'tritanopia', label: 'Tritanopía', desc: 'Ceguera al azul / amarillo' },
    { id: 'achromatopsia', label: 'Acromatopsia', desc: 'Monocromático / Escala de grises' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-azul-oscuro text-white px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azul-primario text-white flex items-center justify-center text-xl font-bold border border-sky-400/40">
              ♿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="accessibility-title" className="text-base sm:text-lg font-bold">
                  Accesibilidad Universal
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-verde-principal text-white uppercase tracking-wider">
                  WCAG 2.1 AAA
                </span>
              </div>
              <p className="text-xs text-sky-200">
                Adaptaciones especializadas para ceguera, baja visión y daltonismo
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
            aria-label="Cerrar ventana de accesibilidad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-gris-oscuro">

          {/* SECCIÓN 1: PERSONAS CIEGAS / LECTOR DE PANTALLA */}
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-azul-primario" />
                <h3 className="text-sm font-bold text-azul-oscuro">
                  Para Personas Ciegas: Lector de Pantalla por Voz
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-azul-primario bg-white px-2.5 py-0.5 rounded-md border border-sky-200">
                Sintetizador en Español
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              No requieres software externo. Nuestro motor de voz lee en voz alta títulos, botones, formularios y contenido institucional de forma clara y accesible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Botón Leer página */}
              <button
                onClick={isSpeaking ? stopSpeaking : readCurrentPage}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                  isSpeaking
                    ? 'bg-rose-600 text-white shadow-md hover:bg-rose-700 animate-pulse'
                    : 'bg-azul-primario text-white shadow-sm hover:bg-azul-oscuro'
                }`}
                aria-label={isSpeaking ? 'Detener lectura en voz alta' : 'Leer toda la página actual en voz alta'}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>⏹ Detener Voz (Esc)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>🔊 Leer Página en Voz Alta (Alt+L)</span>
                  </>
                )}
              </button>

              {/* Toggle Lectura asistida al navegar */}
              <button
                onClick={toggleVoiceReading}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                  voiceReadingActive
                    ? 'bg-verde-principal text-white border-verde-oscuro shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                aria-pressed={voiceReadingActive}
                aria-label="Lectura automática por voz al enfocar con teclado o cursor"
              >
                <Sparkles className="w-4 h-4" />
                <span>{voiceReadingActive ? '✓ Voz al Enfocar: ACTIVA' : 'Activar Voz al Enfocar/Tocar'}</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN 2: PERSONAS DALTÓNICAS (MODOS DE DALTONISMO) */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-azul-primario" />
                <h3 className="text-sm font-bold text-gris-oscuro">
                  Para Personas Daltónicas: Modos de Color y Daltonismo
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-gray-500">
                Atajo: Alt + D
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ajusta matrices ópticas de color y activa la doble codificación (símbolos e iconos explícitos) para que ningún estado dependa únicamente del color.
            </p>

            {/* Selector de Modos de Daltonismo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {colorblindOptions.map((opt) => {
                const isSelected = colorblindMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setColorblindMode(opt.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-azul-primario text-white border-azul-primario shadow-sm ring-2 ring-sky-300'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-sky-50/50 hover:border-azul-primario/40'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <span className={`text-[10px] mt-1 block leading-tight ${isSelected ? 'text-sky-100' : 'text-gray-500'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Muestra de doble codificación visual */}
            <div className="p-3 rounded-lg bg-white border border-gray-200 mt-2">
              <span className="text-[11px] font-bold text-gray-500 block mb-2">
                Vista previa accesible con doble codificación:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="badge-verde">✓ Entregado</span>
                <span className="badge-azul">ℹ En Tránsito</span>
                <span className="badge-amarillo">▲ Pendiente</span>
                <span className="badge-rojo">✕ Retenido / Alerta</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: CONTRASTE Y FOCO DE TECLADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Alto Contraste Extremo */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-azul-primario" />
                <span className="text-xs font-bold text-gris-oscuro">Modo Alto Contraste</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Fondo negro absoluto (#000) y tipografía blanca de máxima luminancia.
              </p>
              <button
                onClick={toggleHighContrast}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  highContrast 
                    ? 'bg-zinc-900 text-amber-300 border-2 border-amber-300 shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
                aria-pressed={highContrast}
              >
                <span>{highContrast ? '✓ Alto Contraste ACTIVO' : 'Activar Alto Contraste (Alt+C)'}</span>
              </button>
            </div>

            {/* Foco de Teclado Resaltado */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-azul-primario" />
                <span className="text-xs font-bold text-gris-oscuro">Foco de Teclado Realzado</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Anillos de foco ambarinos de 4px para navegación visual sin ratón.
              </p>
              <button
                onClick={toggleEnhancedFocus}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  enhancedFocus 
                    ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
                aria-pressed={enhancedFocus}
              >
                <span>{enhancedFocus ? '✓ Foco Realzado ACTIVO' : 'Activar Foco Realzado'}</span>
              </button>
            </div>

          </div>

          {/* SECCIÓN 4: ESCALA DE TEXTO */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gris-oscuro">
              <Type className="w-4 h-4 text-azul-primario" />
              <span>Tamaño de Tipografía Institucional</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'normal', label: 'Normal (100%)', sample: 'A' },
                { id: 'large', label: 'Grande (115%)', sample: 'A+' },
                { id: 'xlarge', label: 'Extra (130%)', sample: 'A++' },
              ].map((scale) => (
                <button
                  key={scale.id}
                  onClick={() => setTextScale(scale.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition ${
                    textScale === scale.id
                      ? 'bg-azul-primario text-white border-azul-primario shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  aria-pressed={textScale === scale.id}
                >
                  <span className="text-base font-extrabold">{scale.sample}</span>
                  <span className="text-[10px]">{scale.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ATAJOS DE TECLADO RÁPIDOS */}
          <div className="p-3 bg-gray-100/80 rounded-xl text-[11px] text-gray-600 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-gris-oscuro flex items-center gap-1">
              <Keyboard className="w-3.5 h-3.5" /> Atajos de teclado:
            </span>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Alt + A (Menú)</span>
              <span className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Alt + L (Leer Voz)</span>
              <span className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Alt + D (Daltonismo)</span>
              <span className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Esc (Pausar Voz)</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-azul-primario font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer valores</span>
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn-primario text-xs py-2 px-5"
          >
            Guardar y Aplicar
          </button>
        </div>

      </div>
    </div>
  );
};

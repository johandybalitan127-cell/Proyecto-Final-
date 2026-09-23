import React from 'react';
import { X, Type, Contrast, Volume2, RotateCcw, Check } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const AccessibilityModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    highContrast,
    toggleHighContrast,
    textScale,
    setTextScale,
    screenReaderHelp,
    toggleScreenReaderHelp,
    resetAccessibility,
  } = useAccessibility();

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-azul-primario flex items-center justify-center font-bold text-xl">
              ♿
            </div>
            <div>
              <h2 id="accessibility-title" className="text-lg font-bold text-azul-oscuro">
                Accesibilidad Universal
              </h2>
              <p className="text-xs text-gray-500">Conforme a directrices WCAG 2.1 AA</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Cerrar ventana de accesibilidad"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4">
          
          {/* Text scale */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gris-oscuro">
              <Type className="w-4 h-4 text-azul-primario" />
              <span>Tamaño de Texto</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { id: 'normal', label: 'Normal (100%)', sample: 'A' },
                { id: 'large', label: 'Grande (115%)', sample: 'A+' },
                { id: 'xlarge', label: 'Extra (130%)', sample: 'A++' },
              ].map((scale) => (
                <button
                  key={scale.id}
                  onClick={() => setTextScale(scale.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    textScale === scale.id
                      ? 'bg-azul-primario text-white border-azul-primario shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base font-bold">{scale.sample}</span>
                  <span className="text-[10px]">{scale.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* High contrast */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-gray-200 text-azul-primario">
                <Contrast className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gris-oscuro">Modo Alto Contraste</p>
                <p className="text-xs text-gray-500">Mejora la legibilidad de textos y fondos</p>
              </div>
            </div>
            <button
              onClick={toggleHighContrast}
              role="switch"
              aria-checked={highContrast}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                highContrast ? 'bg-azul-primario' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Screen reader helper */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-gray-200 text-azul-primario">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gris-oscuro">Asistencia Sonora / ARIA</p>
                <p className="text-xs text-gray-500">Optimiza lectura de etiquetas y alertas</p>
              </div>
            </div>
            <button
              onClick={toggleScreenReaderHelp}
              role="switch"
              aria-checked={screenReaderHelp}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                screenReaderHelp ? 'bg-verde-principal' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  screenReaderHelp ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-azul-primario transition font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer valores</span>
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn-primario text-xs py-2 px-4"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Aplicar Cambios</span>
          </button>
        </div>

      </div>
    </div>
  );
};

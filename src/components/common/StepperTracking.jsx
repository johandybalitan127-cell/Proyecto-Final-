import React from 'react';
import { Check, Clock, PackageCheck, AlertTriangle, Building, Truck, Package } from 'lucide-react';
import { generateTrackingStages } from '../../utils/trackingUtils';

export const StepperTracking = ({ envio }) => {
  // Generate consistent stages aligned with current shipment status
  const etapas = (envio?.etapas && envio.etapas.length > 0)
    ? envio.etapas
    : generateTrackingStages(envio);

  const getProgressStyles = () => {
    const estado = envio?.estado;
    switch (estado) {
      case 'Entregado':
        return { width: 'calc(100% - 2rem)', color: 'bg-emerald-500' };
      case 'Disponible en sucursal':
      case 'Listo para retiro':
        return { width: '85%', color: 'bg-indigo-600' };
      case 'En aduana':
        return { width: '66%', color: 'bg-amber-500' };
      case 'En tránsito':
        return { width: '66%', color: 'bg-azul-primario' };
      case 'Procesando':
        return { width: '38%', color: 'bg-azul-primario' };
      case 'Recibida':
      case 'Admisión':
      default:
        return { width: '15%', color: 'bg-azul-primario' };
    }
  };

  const progress = getProgressStyles();

  return (
    <div className="w-full py-2 sm:py-4" role="region" aria-label="Línea de tiempo de rastreo">
      {/* Horizontal Steps Bar */}
      <div className="relative flex items-center justify-between" role="list">
        
        {/* Continuous background line */}
        <div className="absolute top-1/2 left-4 sm:left-6 right-4 sm:right-6 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>

        {/* Progress active bar */}
        <div
          className={`absolute top-1/2 left-4 sm:left-6 -translate-y-1/2 h-1 transition-all duration-500 z-0 ${progress.color}`}
          style={{ width: progress.width }}
        ></div>

        {etapas.map((etapa, idx) => {
          const isDone = etapa.completado;
          const isCurrent = etapa.actual || (etapa.completado && idx === etapas.findIndex(e => !e.completado) - 1);
          const isAduanaAlert = etapa.alerta || (isCurrent && envio?.estado === 'En aduana');

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center group" role="listitem">
              {/* Step Circle */}
              <div
                className={`w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-sm border-2 transition-all duration-300 ${
                  isDone && !isCurrent
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : isCurrent && isAduanaAlert
                    ? 'bg-amber-500 border-amber-600 text-white shadow-md ring-2 sm:ring-4 ring-amber-200 animate-pulse'
                    : isCurrent && (envio?.estado === 'Entregado')
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md ring-2 sm:ring-4 ring-emerald-200'
                    : isCurrent
                    ? 'bg-azul-primario border-azul-primario text-white shadow-md ring-2 sm:ring-4 ring-sky-100 animate-pulse'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
                title={`Paso ${etapa.paso}: ${etapa.nombre} (${isDone ? 'Completado' : isCurrent ? 'Paso actual' : 'Pendiente'})`}
              >
                {isDone && !isCurrent ? (
                  <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5]" aria-hidden="true" />
                ) : isCurrent && isAduanaAlert ? (
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5]" aria-hidden="true" />
                ) : isCurrent && (envio?.estado === 'Entregado') ? (
                  <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5]" aria-hidden="true" />
                ) : isCurrent ? (
                  <span className="text-white font-extrabold">{etapa.paso}</span>
                ) : (
                  <span className="font-semibold text-gray-400">{etapa.paso}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-1.5 sm:mt-2 text-center max-w-[70px] sm:max-w-[120px] md:max-w-[140px]">
                <p
                  className={`text-[10px] sm:text-xs md:text-sm font-bold leading-tight ${
                    isCurrent && isAduanaAlert
                      ? 'text-amber-800'
                      : isCurrent
                      ? 'text-azul-primario'
                      : isDone
                      ? 'text-gris-oscuro'
                      : 'text-gray-400'
                  }`}
                >
                  {etapa.nombre}
                </p>
                <p className="text-[9px] sm:text-[11px] text-gray-500 line-clamp-1 mt-0.5 hidden xs:block">
                  {etapa.ubicacion}
                </p>
                {etapa.hora && (
                  <span className={`text-[8px] sm:text-[10px] font-medium block mt-0.5 ${
                    isAduanaAlert ? 'text-amber-700 font-bold' : 'text-gray-400'
                  }`}>
                    {etapa.hora}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

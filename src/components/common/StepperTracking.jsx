import React from 'react';
import { Check, Clock, PackageCheck, AlertCircle } from 'lucide-react';

export const StepperTracking = ({ envio }) => {
  // Fallback default stages if not directly embedded in envio
  const etapas = envio?.etapas || [
    { paso: 1, nombre: 'Recibida', ubicacion: envio?.origen || 'Sucursal San José Central', hora: '08:30 a.m.', completado: true },
    { paso: 2, nombre: 'Procesado', ubicacion: 'Centro Postal Zapote', hora: '11:15 a.m.', completado: envio?.estado !== 'Recibida' },
    { paso: 3, nombre: 'En Tránsito', ubicacion: envio?.destino ? `Hacia ${envio.destino}` : 'Hacia Alajuela Centro', hora: '02:00 p.m.', completado: envio?.estado === 'En tránsito' || envio?.estado === 'Entregado', actual: envio?.estado === 'En tránsito' },
    { paso: 4, nombre: 'Entregado', ubicacion: 'Destino Final', hora: envio?.estado === 'Entregado' ? 'Entregado con éxito' : 'Pendiente', completado: envio?.estado === 'Entregado' },
  ];

  return (
    <div className="w-full py-2 sm:py-4">
      {/* Horizontal Steps Bar */}
      <div className="relative flex items-center justify-between">
        
        {/* Continuous background line */}
        <div className="absolute top-1/2 left-4 sm:left-6 right-4 sm:right-6 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>

        {/* Progress active bar */}
        <div
          className="absolute top-1/2 left-4 sm:left-6 -translate-y-1/2 h-1 bg-azul-primario transition-all duration-500 z-0"
          style={{
            width:
              envio?.estado === 'Entregado'
                ? 'calc(100% - 2rem)'
                : envio?.estado === 'En tránsito'
                ? '66%'
                : envio?.estado === 'Procesando'
                ? '33%'
                : '10%',
          }}
        ></div>

        {etapas.map((etapa, idx) => {
          const isDone = etapa.completado;
          const isCurrent = etapa.actual || (etapa.completado && idx === etapas.findIndex(e => !e.completado) - 1);

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center group">
              {/* Step Circle */}
              <div
                className={`w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-sm border-2 transition-all duration-300 ${
                  isDone && !isCurrent
                    ? 'bg-verde-principal border-verde-principal text-white shadow-sm'
                    : isCurrent
                    ? 'bg-azul-primario border-azul-primario text-white shadow-md ring-2 sm:ring-4 ring-sky-100 animate-pulse'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isDone && !isCurrent ? (
                  <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <span className="text-white font-extrabold">{etapa.paso}</span>
                ) : (
                  <span className="font-semibold text-gray-400">{etapa.paso}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-1.5 sm:mt-2 text-center max-w-[65px] sm:max-w-[110px] md:max-w-[130px]">
                <p
                  className={`text-[10px] sm:text-xs md:text-sm font-bold leading-tight ${
                    isCurrent
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
                  <span className="text-[8px] sm:text-[10px] font-medium text-gray-400 block mt-0.5">
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

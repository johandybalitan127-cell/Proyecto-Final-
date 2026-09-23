import React from 'react';
import { Package, MapPin, ExternalLink, Printer, Clock } from 'lucide-react';
import { StepperTracking } from '../common/StepperTracking';
import { Link } from 'react-router-dom';

export const TrackingCardBubble = ({ envio, onOpenMap = null }) => {
  if (!envio) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-4 my-2 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Número de Guía</span>
            <span className="badge-verde">● En Línea</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-azul-oscuro font-mono">
            #{envio.guia}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-azul-primario font-semibold border border-sky-100">
            {envio.servicio}
          </span>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-azul-primario hover:bg-gray-50"
            title="Imprimir comprobante"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stepper */}
      <StepperTracking envio={envio} />

      {/* Route & Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-gray-100">
        <div className="space-y-1">
          <span className="text-gray-400 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-azul-primario" /> Ruta Nacional Activa:
          </span>
          <p className="font-semibold text-gris-oscuro">
            {envio.ruta || `${envio.origen} → Centro Zapote → ${envio.destino}`}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-gray-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-verde-principal" /> Próxima actualización:
          </span>
          <p className="font-semibold text-gris-oscuro">
            Hoy 05:30 p.m. · Distribución Local
          </p>
        </div>
      </div>

      {/* Mini Mapa Preview & Actions */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="font-medium">Unidad GPS en ruta: GAM Central</span>
        </div>
        <Link
          to={`/rastreo/${envio.guia}`}
          className="text-xs font-semibold text-azul-primario hover:underline inline-flex items-center gap-1"
        >
          <span>Ver detalle completo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { InternationalShippingSection } from '../../components/home/InternationalShippingSection';
import { Globe, Plane, ShieldCheck, FileCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InternacionalPage = () => {
  return (
    <div className="py-8 sm:py-12 space-y-12">
      
      {/* Hero Banner for Dedicated Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-azul-oscuro via-slate-900 to-azul-primario rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-sky-200 border border-white/20">
              <Globe className="w-3.5 h-3.5 text-sky-300" />
              Cobertura Oficial Unión Postal Universal (UPU)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
              Servicios Postales & Envíos Internacionales
            </h1>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed max-w-2xl">
              Exporta tus productos, envía correspondencia diplomática y paquetes familiares hacia más de 190 países con la garantía soberana de Correos de Costa Rica.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#internacional"
                className="btn-secundario text-xs sm:text-sm py-2.5 px-5 shadow-md flex items-center gap-2"
              >
                <Plane className="w-4 h-4" />
                <span>Calcular Tarifa por País</span>
              </a>
              <Link
                to="/oficinas"
                className="btn-neutro text-xs sm:text-sm py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <span>Ver Sucursales con Admisión Internacional</span>
              </Link>
            </div>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border-8 border-white/5 pointer-events-none"></div>
          <div className="absolute right-32 -top-24 w-60 h-60 rounded-full border-8 border-white/5 pointer-events-none"></div>
        </div>
      </div>

      {/* Main International Section Component */}
      <InternationalShippingSection />

    </div>
  );
};

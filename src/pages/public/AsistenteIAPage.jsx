import React from 'react';
import { AssistantChatModal } from '../../components/assistant/AssistantChatModal';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';

export const AsistenteIAPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-azul-oscuro to-azul-primario rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-sans">
                Asistente Postal IA — Correos de Costa Rica
              </h1>
              <span className="badge-verde text-[10px]">OFICIAL</span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 mt-0.5">
              Respuestas inmediatas 24/7 sobre paquetería, trámites y sucursales en todo el territorio nacional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Modelo Conectado · API Institucional Activa</span>
        </div>
      </div>

      {/* Embedded Full-Page Chat */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <AssistantChatModal isFloating={false} />
      </div>

    </div>
  );
};

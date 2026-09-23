import React, { useState } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { AssistantChatModal } from '../assistant/AssistantChatModal';

export const FloatingAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Subtle tooltip / chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-azul-oscuro rounded-full shadow-lg border border-gray-200 text-xs font-semibold animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-verde-principal" />
          <span>¿Necesitas ayuda postal?</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-azul-primario text-white shadow-elevated hover:bg-azul-oscuro focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center relative group"
          aria-label="Abrir Asistente Postal IA"
          title="Asistente Postal IA (24/7)"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              <Bot className="w-7 h-7" />
              {/* Online pulse dot */}
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-verde-principal border-2 border-white rounded-full"></span>
            </>
          )}
        </button>
      </div>

      {/* Floating Modal Chat Window */}
      {isOpen && <AssistantChatModal onClose={() => setIsOpen(false)} isFloating={true} />}
    </>
  );
};

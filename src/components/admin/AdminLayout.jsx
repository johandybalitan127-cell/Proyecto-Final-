import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Lock, Cpu, Bot, Sparkles } from 'lucide-react';
import { AccessibilityModal } from '../common/AccessibilityModal';
import { AdminAiChatModal } from './AdminAiChatModal';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');

  const openCopilot = (query = '') => {
    setCopilotInitialQuery(query);
    setIsCopilotOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-amber-400 focus:text-black focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-black"
      >
        Saltar al contenido de administración
      </a>

      {/* Responsive Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <main id="admin-main-content" tabIndex="-1" role="main" className="flex-1 pb-10 outline-none">
          <Outlet context={{ 
            toggleSidebar: () => setSidebarOpen((prev) => !prev),
            openCopilot
          }} />
        </main>

        {/* Official UPU / Terminal Footer */}
        <footer className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>🔒 Sesión segura SSL 256-bit · Normativa UPU y Ley Postal Costarricense</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Cpu className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>Terminal: ZAP-04 · SIP-CR v5.0.0-PRO</span>
          </div>
        </footer>
      </div>

      {/* Botón Flotante Global del Copiloto IA de Administración */}
      <button
        type="button"
        onClick={() => openCopilot('')}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-azul-oscuro hover:bg-azul-primario text-white font-bold shadow-2xl border border-sky-400/40 hover:border-sky-300 transition-all duration-300 hover:scale-105 group cursor-pointer"
        title="Abrir Copiloto IA de Administración"
      >
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-verde-principal absolute -top-0.5 -right-0.5 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-verde-principal absolute -top-0.5 -right-0.5" />
          <Bot className="w-5 h-5 text-sky-200 group-hover:rotate-12 transition-transform" />
        </div>
        <span className="text-xs font-semibold tracking-wide">Copiloto IA Admin</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      </button>

      {/* Modal / Drawer del Copiloto IA de Administración */}
      <AdminAiChatModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        initialQuery={copilotInitialQuery}
      />

      {/* Accessibility Modal */}
      <AccessibilityModal />
    </div>
  );
};

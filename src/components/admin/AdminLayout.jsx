import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Lock, Cpu } from 'lucide-react';
import { AccessibilityModal } from '../common/AccessibilityModal';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <Outlet context={{ toggleSidebar: () => setSidebarOpen((prev) => !prev) }} />
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

      {/* Accessibility Modal */}
      <AccessibilityModal />
    </div>
  );
};

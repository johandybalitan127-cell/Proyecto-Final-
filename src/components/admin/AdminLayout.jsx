import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Lock, Cpu } from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7F8] font-sans antialiased text-gris-oscuro">
      {/* Responsive Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-10">
          <Outlet context={{ toggleSidebar: () => setSidebarOpen((prev) => !prev) }} />
        </main>

        {/* Official UPU / Terminal Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>🔒 Sesión segura SSL 256-bit · Normativa UPU y Ley Postal Costarricense</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
            <Cpu className="w-3.5 h-3.5 text-azul-primario flex-shrink-0" />
            <span>Terminal: ZAP-04 · SIP-CR v4.2.0-UCR</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

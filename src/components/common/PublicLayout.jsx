import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AccessibilityModal } from './AccessibilityModal';
import { FloatingAssistantButton } from './FloatingAssistantButton';
import { MobileBottomBar } from './MobileBottomBar';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gris-claro text-gris-oscuro selection:bg-azul-primario selection:text-white">
      {/* Skip to Main Content Link for Screen Readers and Keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-amber-400 focus:text-black focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-black"
      >
        Saltar al contenido principal (Skip to content)
      </a>

      {/* Top sticky navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main id="main-content" tabIndex="-1" role="main" className="flex-1 pb-16 md:pb-0 outline-none">
        <Outlet />
      </main>

      {/* 4-column institutional footer */}
      <Footer />

      {/* Persistent Floating Assistant AI button */}
      <FloatingAssistantButton />

      {/* Fixed bottom tab bar on mobile */}
      <MobileBottomBar />

      {/* Accessibility Settings Modal */}
      <AccessibilityModal />
    </div>
  );
};

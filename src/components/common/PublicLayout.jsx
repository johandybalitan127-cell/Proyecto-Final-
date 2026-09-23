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
      {/* Top sticky navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 pb-16 md:pb-0">
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

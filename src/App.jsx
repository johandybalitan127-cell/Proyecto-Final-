import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './components/common/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ServiciosPage } from './pages/public/ServiciosPage';
import { RastreoPage } from './pages/public/RastreoPage';
import { OficinasPage } from './pages/public/OficinasPage';
import { AsistenteIAPage } from './pages/public/AsistenteIAPage';
import { AyudaPage } from './pages/public/AyudaPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Authenticated User Pages
import { PerfilPage } from './pages/user/PerfilPage';
import { HistorialPage } from './pages/user/HistorialPage';
import { PaquetesGuardadosPage } from './pages/user/PaquetesGuardadosPage';
import { ConfiguracionUsuarioPage } from './pages/user/ConfiguracionUsuarioPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEnviosPage } from './pages/admin/AdminEnviosPage';
import { AdminUsuariosPage } from './pages/admin/AdminUsuariosPage';
import { AdminSucursalesPage } from './pages/admin/AdminSucursalesPage';
import { AdminServiciosTarifasPage } from './pages/admin/AdminServiciosTarifasPage';
import { AdminConsultasPage } from './pages/admin/AdminConsultasPage';
import { AdminAsistenteIAPage } from './pages/admin/AdminAsistenteIAPage';
import { AdminReportesPage } from './pages/admin/AdminReportesPage';
import { AdminConfiguracionPage } from './pages/admin/AdminConfiguracionPage';

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Public Routes with Navbar, Footer & Floating AI */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/servicios" element={<ServiciosPage />} />
                <Route path="/rastreo" element={<RastreoPage />} />
                <Route path="/rastreo/:trackingNumber" element={<RastreoPage />} />
                <Route path="/oficinas" element={<OficinasPage />} />
                <Route path="/asistente-ia" element={<AsistenteIAPage />} />
                <Route path="/ayuda" element={<AyudaPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated User Routes */}
                <Route
                  path="/cuenta/perfil"
                  element={
                    <ProtectedRoute>
                      <PerfilPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cuenta/historial"
                  element={
                    <ProtectedRoute>
                      <HistorialPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cuenta/paquetes-guardados"
                  element={
                    <ProtectedRoute>
                      <PaquetesGuardadosPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cuenta/configuracion"
                  element={
                    <ProtectedRoute>
                      <ConfiguracionUsuarioPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Routes with Fixed Sidebar and role=admin Guard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="envios" element={<AdminEnviosPage />} />
                <Route path="usuarios" element={<AdminUsuariosPage />} />
                <Route path="sucursales" element={<AdminSucursalesPage />} />
                <Route path="servicios-tarifas" element={<AdminServiciosTarifasPage />} />
                <Route path="consultas" element={<AdminConsultasPage />} />
                <Route path="asistente-ia" element={<AdminAsistenteIAPage />} />
                <Route path="reportes" element={<AdminReportesPage />} />
                <Route path="configuracion" element={<AdminConfiguracionPage />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;

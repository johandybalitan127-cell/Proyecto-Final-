import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, Cpu, HardDrive, Bell, Save, CheckCircle2, 
  Workflow, Contrast, Volume2, Globe, Database
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { StatCard } from '../../components/admin/StatCard';
import { useToast } from '../../context/ToastContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export const AdminConfiguracionPage = () => {
  const { addToast } = useToast();
  const { highContrast, toggleHighContrast, screenReaderHelp, toggleScreenReaderHelp } = useAccessibility();

  const [generalForm, setGeneralForm] = useState({
    nombreInstitucion: 'Correos de Costa Rica S.A.',
    idioma: 'Español (Costa Rica)',
    zonaHoraria: 'America/Costa_Rica (UTC-06:00)',
    moneda: 'Colón Costarricense (CRC - ₡)'
  });

  const [notifications, setNotifications] = useState({
    correo: true,
    sms: true,
    alertasInternas: true
  });

  const [security, setSecurity] = useState({
    twoFactorMandatory: true,
    autoLogout30Min: true
  });

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    addToast('Parámetros del sistema guardados exitosamente', 'success');
  };

  return (
    <div className="space-y-6">
      <AdminTopbar currentSection="Configuración del Sistema" />

      <div className="px-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-azul-oscuro">
            Configuración y Parámetros Globales del Sistema
          </h1>
          <p className="text-xs text-gray-500">
            Ajustes institucionales, roles y permisos, auditoría de integraciones activas y políticas WCAG 2.1.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Roles Configurados"
            value="3"
            delta="RBAC Activo"
            deltaType="neutral"
            icon={ShieldCheck}
            iconBg="bg-sky-100 text-azul-primario"
          />
          <StatCard
            label="Integraciones Activas"
            value="4"
            delta="Todas en línea"
            deltaType="positive"
            icon={Workflow}
            iconBg="bg-emerald-100 text-verde-principal"
          />
          <StatCard
            label="Autenticación 2FA"
            value="Activa"
            delta="SSL 256-bit"
            deltaType="positive"
            icon={Cpu}
            iconBg="bg-purple-100 text-purple-700"
          />
          <StatCard
            label="Último Respaldo"
            value="Hoy 03:00 a.m."
            delta="Automático UPU"
            deltaType="neutral"
            icon={HardDrive}
            iconBg="bg-amber-100 text-amber-700"
          />
        </div>

        {/* 2 Column Layout (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols ~ 70%) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Panel: Información General */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-azul-oscuro">Información General Institucional</h3>

              <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Nombre de la Institución:</label>
                    <input
                      type="text"
                      value={generalForm.nombreInstitucion}
                      onChange={(e) => setGeneralForm({ ...generalForm, nombreInstitucion: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Idioma Predeterminado:</label>
                    <input
                      type="text"
                      value={generalForm.idioma}
                      onChange={(e) => setGeneralForm({ ...generalForm, idioma: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Zona Horaria:</label>
                    <input
                      type="text"
                      value={generalForm.zonaHoraria}
                      onChange={(e) => setGeneralForm({ ...generalForm, zonaHoraria: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Moneda Oficial:</label>
                    <input
                      type="text"
                      value={generalForm.moneda}
                      onChange={(e) => setGeneralForm({ ...generalForm, moneda: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="btn-primario text-xs py-2 px-5">
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Panel: Notificaciones */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-azul-oscuro">Canales de Notificación Automatizada</h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border">
                  <div>
                    <span className="font-bold text-gris-oscuro block">Notificaciones por Correo Electrónico</span>
                    <span className="text-gray-500 text-[11px]">Envío automático de comprobantes UPU y guías de envío</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, correo: !notifications.correo })}
                    className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${notifications.correo ? 'bg-azul-primario' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${notifications.correo ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border">
                  <div>
                    <span className="font-bold text-gris-oscuro block">Alertas por Mensajería SMS Nacional</span>
                    <span className="text-gray-500 text-[11px]">Aviso en terminal de entrega y llegada a sucursal</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                    className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${notifications.sms ? 'bg-verde-principal' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${notifications.sms ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border">
                  <div>
                    <span className="font-bold text-gris-oscuro block">Alertas Internas en Tablero Operativo</span>
                    <span className="text-gray-500 text-[11px]">Notificación al detectar retención aduanal mayor a 72 horas</span>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, alertasInternas: !notifications.alertasInternas })}
                    className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${notifications.alertasInternas ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${notifications.alertasInternas ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Panel: Roles y Permisos (Tabla Matriz RBAC) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-azul-oscuro">Matriz de Roles y Permisos (RBAC)</h3>

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b">
                      <th className="py-2.5 px-3">Rol / Nivel</th>
                      <th className="py-2.5 px-3">Envíos</th>
                      <th className="py-2.5 px-3">Usuarios</th>
                      <th className="py-2.5 px-3">Reportes</th>
                      <th className="py-2.5 px-3">Configuración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11px]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-azul-oscuro">Administrador</td>
                      <td className="py-2.5 px-3"><span className="badge-verde text-[10px]">Total</span></td>
                      <td className="py-2.5 px-3"><span className="badge-verde text-[10px]">Total</span></td>
                      <td className="py-2.5 px-3"><span className="badge-verde text-[10px]">Total</span></td>
                      <td className="py-2.5 px-3"><span className="badge-verde text-[10px]">Total</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gray-700">Operador de Sucursal</td>
                      <td className="py-2.5 px-3"><span className="badge-azul text-[10px]">Editar</span></td>
                      <td className="py-2.5 px-3"><span className="badge-gris text-[10px]">Solo lectura</span></td>
                      <td className="py-2.5 px-3"><span className="badge-gris text-[10px]">Solo lectura</span></td>
                      <td className="py-2.5 px-3"><span className="badge-rojo text-[10px]">Sin acceso</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gray-700">Usuario Ciudadano</td>
                      <td className="py-2.5 px-3"><span className="badge-azul text-[10px]">Propio</span></td>
                      <td className="py-2.5 px-3"><span className="badge-azul text-[10px]">Propio</span></td>
                      <td className="py-2.5 px-3"><span className="badge-rojo text-[10px]">Sin acceso</span></td>
                      <td className="py-2.5 px-3"><span className="badge-rojo text-[10px]">Sin acceso</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Integraciones, Seguridad, Accesibilidad (4 cols ~ 30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Panel Integraciones */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Estado de Integraciones
              </h3>

              <div className="space-y-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-gray-50 border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-azul-primario" />
                    <span className="font-semibold text-gris-oscuro">JSON Server REST</span>
                  </div>
                  <span className="badge-verde text-[10px]">Conectado</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gris-oscuro">API Tipo de Cambio</span>
                  </div>
                  <span className="badge-verde text-[10px]">En vivo</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-gris-oscuro">N8N Workflows (2)</span>
                  </div>
                  <span className="badge-verde text-[10px]">Activo</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-gris-oscuro">Asistente Postal IA</span>
                  </div>
                  <span className="badge-verde text-[10px]">Online</span>
                </div>
              </div>
            </div>

            {/* Panel Seguridad */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Políticas de Seguridad
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-[11px]">2FA Obligatorio para Operadores</span>
                  <button
                    onClick={() => setSecurity({ ...security, twoFactorMandatory: !security.twoFactorMandatory })}
                    className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${security.twoFactorMandatory ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${security.twoFactorMandatory ? 'translate-x-4' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-[11px]">Cierre Automático (30 min)</span>
                  <button
                    onClick={() => setSecurity({ ...security, autoLogout30Min: !security.autoLogout30Min })}
                    className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${security.autoLogout30Min ? 'bg-azul-primario' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${security.autoLogout30Min ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Accesibilidad */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-azul-oscuro uppercase tracking-wider text-[11px]">
                Accesibilidad WCAG 2.1 AA
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                    <Contrast className="w-3.5 h-3.5" />
                    <span>Modo Alto Contraste</span>
                  </div>
                  <button
                    onClick={toggleHighContrast}
                    className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${highContrast ? 'bg-azul-primario' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${highContrast ? 'translate-x-4' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Lector de Pantalla ARIA</span>
                  </div>
                  <button
                    onClick={toggleScreenReaderHelp}
                    className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${screenReaderHelp ? 'bg-verde-principal' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${screenReaderHelp ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

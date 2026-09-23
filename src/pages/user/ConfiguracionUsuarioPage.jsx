import React, { useState } from 'react';
import { Settings, Bell, Lock, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ConfiguracionUsuarioPage = () => {
  const { addToast } = useToast();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    addToast('Preferencias de cuenta guardadas', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-azul-oscuro flex items-center gap-2">
          <Settings className="w-6 h-6 text-azul-primario" />
          <span>Configuración de Cuenta</span>
        </h1>
        <p className="text-xs text-gray-500">Administra tus notificaciones y niveles de seguridad</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Notificaciones */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-azul-oscuro uppercase tracking-wider">
            Notificaciones de Trazabilidad
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-azul-primario" />
              <div>
                <p className="text-xs font-bold text-gris-oscuro">Alertas por Mensajería SMS</p>
                <p className="text-[11px] text-gray-500">Notificación al cambiar a 'En Tránsito' y 'Entregado'</p>
              </div>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                smsAlerts ? 'bg-azul-primario' : 'bg-gray-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                smsAlerts ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-verde-principal" />
              <div>
                <p className="text-xs font-bold text-gris-oscuro">Resúmenes por Correo Electrónico</p>
                <p className="text-[11px] text-gray-500">Comprobantes y recibos digitales oficiales UPU</p>
              </div>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                emailAlerts ? 'bg-verde-principal' : 'bg-gray-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                emailAlerts ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Seguridad */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-sm font-bold text-azul-oscuro uppercase tracking-wider">
            Seguridad y Autenticación
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-gris-oscuro">Verificación en Dos Pasos (2FA)</p>
                <p className="text-[11px] text-gray-500">Código de seguridad al ingresar desde un dispositivo nuevo</p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                twoFactor ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                twoFactor ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={handleSave} className="btn-primario text-xs py-2 px-5">
            Guardar Preferencias
          </button>
        </div>

      </div>

    </div>
  );
};

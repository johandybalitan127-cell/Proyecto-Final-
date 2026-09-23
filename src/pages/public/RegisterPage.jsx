import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, Mail, Lock, Phone, ShieldCheck, Workflow, ArrowRight } from 'lucide-react';
import { usuariosService } from '../../services/usuariosService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: '',
    rol: 'Usuario'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await usuariosService.create(form);
      addToast('Cuenta registrada exitosamente. Webhook N8N ha despachado el correo de bienvenida.', 'success');
      await login(created.correo);
      navigate('/cuenta/perfil');
    } catch {
      addToast('Error al registrar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-verde-principal text-white flex items-center justify-center mx-auto shadow-md">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-azul-oscuro">Registro Ciudadano</h1>
          <p className="text-xs text-gray-500">Crea tu identidad digital para rastreo y casillero virtual</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gris-oscuro">Nombre Completo:</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Roberto Vargas Brenes"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gris-oscuro">Correo Electrónico:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="correo@ejemplo.cr"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gris-oscuro">Teléfono Móvil (Alertas SMS):</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+506 8888-0000"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gris-oscuro">Contraseña:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          {/* N8N Workflow 1 Note */}
          <div className="p-3 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 border border-emerald-200 flex items-start gap-2">
            <Workflow className="w-4 h-4 text-verde-oscuro flex-shrink-0 mt-0.5" />
            <span>Al registrarte, un webhook N8N valida tu identidad y te envía un correo oficial de bienvenida con tu número de cliente.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-secundario text-xs py-2.5 font-bold justify-center"
          >
            <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta Gratuita'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-azul-primario font-bold hover:underline">
            Ingresar aquí
          </Link>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { LogoCorreos } from '../../components/common/LogoCorreos';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const LoginPage = () => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const targetPath = location.state?.from || null;
  const isFromAppointment = targetPath === '/oficinas';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      addToast(`Bienvenido(a), ${res.user.nombre}`, 'success');
      if (targetPath) {
        navigate(targetPath);
      } else if (res.user.rol === 'admin' || res.user.rol === 'Administrador') {
        navigate('/admin');
      } else {
        navigate('/cuenta/perfil');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      addToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (role) => {
    const demoUser = loginAsDemo(role);
    addToast(`Sesión iniciada como: ${demoUser.nombre}`, 'info');
    if (targetPath) {
      navigate(targetPath);
    } else if (role === 'Administrador') {
      navigate('/admin');
    } else {
      navigate('/cuenta/perfil');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <LogoCorreos className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-azul-oscuro">Sucursal Virtual</h1>
          <p className="text-xs text-gray-500">Ingreso a la Plataforma Digital Ciudadana</p>
        </div>

        {/* Notice if redirected from Appointment booking */}
        {isFromAppointment && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 shadow-xs">
            <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-950">Inicio de Sesión Requerido</p>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Para agendar una cita oficial en la sucursal seleccionada, ingresa a tu cuenta ciudadana de Correos de Costa Rica.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gris-oscuro">Correo Electrónico:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correos.go.cr o m.rojas@gmail.com"
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
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primario text-xs py-2.5 font-bold justify-center"
          >
            <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-azul-primario font-bold hover:underline">
            Crear cuenta ciudadana
          </Link>
        </div>

      </div>
    </div>
  );
};

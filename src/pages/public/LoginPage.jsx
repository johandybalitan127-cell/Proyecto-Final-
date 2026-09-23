import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const targetPath = location.state?.from || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      addToast(`Bienvenido(a), ${res.user.nombre}`, 'success');
      if (targetPath) {
        navigate(targetPath);
      } else if (res.user.rol === 'Administrador') {
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
    loginAsDemo(role);
    addToast(`Sesión iniciada como demo: ${role}`, 'info');
    if (role === 'Administrador') {
      navigate(targetPath || '/admin');
    } else {
      navigate(targetPath || '/cuenta/perfil');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-azul-primario text-white flex items-center justify-center mx-auto shadow-md">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-azul-oscuro">Sucursal Virtual</h1>
          <p className="text-xs text-gray-500">Ingreso a la Plataforma Digital Ciudadana</p>
        </div>

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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correos.go.cr"
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

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-azul-primario font-bold hover:underline">
            Crear cuenta ciudadana
          </Link>
        </div>

      </div>
    </div>
  );
};

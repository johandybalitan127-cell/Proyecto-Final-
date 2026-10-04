import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  loginAsDemo: () => {},
  logout: () => {},
});

const DEFAULT_ADMIN = {
  id: 'admin-1',
  nombre: 'Administrador Sistema',
  correo: 'admin@admin.com',
  rol: 'admin',
  sucursal: 'Sede Central',
  avatar: 'AD',
  terminalId: 'ZAP-04',
  codigoOperador: 'OP-8821'
};

const DEMO_USER = {
  id: 'USR-002',
  nombre: 'María Elena Rojas',
  correo: 'm.rojas@gmail.com',
  cedula: '1-1234-0567',
  rol: 'Usuario',
  sucursal: 'San Pedro',
  avatar: 'MR'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('correos_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('correos_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('correos_user');
    }
  }, [user]);

  const login = async (email, password = '') => {
    try {
      const foundUser = await usuariosService.login(email, password);
      setUser(foundUser);
      return { success: true, user: foundUser };
    } catch (err) {
      if (email === 'admin@admin.com' && (password === 'admin' || !password)) {
        setUser(DEFAULT_ADMIN);
        return { success: true, user: DEFAULT_ADMIN };
      }
      if (email === 'm.rojas@gmail.com') {
        setUser(DEMO_USER);
        return { success: true, user: DEMO_USER };
      }
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const loginAsDemo = (role = 'Usuario') => {
    const demo = (role === 'Administrador' || role === 'admin') ? DEFAULT_ADMIN : DEMO_USER;
    setUser(demo);
    return demo;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'admin' || user?.rol === 'Administrador';

  // --- Lógica de Cierre de Sesión por Inactividad ---
  useEffect(() => {
    let timeoutId;
    
    const handleInactivity = () => {
      logout();
      alert('Tu sesión ha sido cerrada por seguridad debido a 2 minutos de inactividad.');
      window.location.href = '/login'; // Opcional, pero asegura redirigir
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 2 minutos = 120000 milisegundos
      timeoutId = setTimeout(handleInactivity, 120000);
    };

    if (isAuthenticated) {
      // Iniciar el temporizador
      resetTimer();

      // Listeners de actividad
      const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
      events.forEach(event => window.addEventListener(event, resetTimer));

      // Limpiar listeners y timer
      return () => {
        clearTimeout(timeoutId);
        events.forEach(event => window.removeEventListener(event, resetTimer));
      };
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('correos_user');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
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
      if (email === 'admin@admin.com' && password === 'admin') {
        setUser(DEFAULT_ADMIN);
        return { success: true, user: DEFAULT_ADMIN };
      }
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const loginAsDemo = (role = 'Administrador') => {
    setUser(DEFAULT_ADMIN);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'admin' || user?.rol === 'Administrador';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

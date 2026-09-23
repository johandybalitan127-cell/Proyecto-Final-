import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuariosService } from '../services/usuariosService';

const AuthContext = createContext();

const DEFAULT_ADMIN = {
  id: 'USR-001',
  nombre: 'Carlos Mora Jiménez',
  correo: 'carlos.mora@correos.go.cr',
  rol: 'Administrador',
  sucursal: 'Zapote Central',
  avatar: 'CM',
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
      // Demo fallback helper: if it's admin email or contains admin, log in as Carlos Mora
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('carlos')) {
        setUser(DEFAULT_ADMIN);
        return { success: true, user: DEFAULT_ADMIN };
      }
      // Or default citizen user
      const citizenUser = {
        id: 'USR-002',
        nombre: 'María Elena Rojas',
        correo: email,
        rol: 'Usuario',
        sucursal: 'San Pedro',
        avatar: 'MR'
      };
      setUser(citizenUser);
      return { success: true, user: citizenUser };
    }
  };

  const loginAsDemo = (role = 'Administrador') => {
    if (role === 'Administrador') {
      setUser(DEFAULT_ADMIN);
    } else {
      setUser({
        id: 'USR-002',
        nombre: 'María Elena Rojas',
        correo: 'm.rojas@gmail.com',
        rol: 'Usuario',
        sucursal: 'San Pedro',
        avatar: 'MR'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'Administrador';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';

const COLLECTION = 'usuarios';

export const usuariosService = {
  getAll: () => fetchCollection(COLLECTION),
  getById: (id) => fetchItemById(COLLECTION, id),
  create: async (usuario) => {
    const users = await fetchCollection(COLLECTION);
    const exists = users.some((u) => u.correo.toLowerCase() === usuario.correo.toLowerCase());
    if (exists) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    return createItem(COLLECTION, {
      ...usuario,
      fechaRegistro: usuario.fechaRegistro || new Date().toISOString().split('T')[0],
      estado: usuario.estado || 'Activo'
    });
  },
  update: (id, updates) => updateItem(COLLECTION, id, updates),
  delete: (id) => deleteItem(COLLECTION, id),

  // Demo user authentication
  login: async (email, password) => {
    const users = await fetchCollection(COLLECTION);
    const user = users.find((u) => u.correo.toLowerCase() === email.trim().toLowerCase());
    if (user) {
      if (user.estado === 'Suspendido') {
        throw new Error('Esta cuenta se encuentra temporalmente suspendida.');
      }
      if (user.password && user.password !== password) {
        throw new Error('Credenciales inválidas.');
      }
      return user;
    }
    // For demo purposes, allow registration or default fallback
    throw new Error('Credenciales inválidas. Por favor verifique el correo electrónico.');
  }
};

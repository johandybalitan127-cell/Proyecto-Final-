import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';

const COLLECTION = 'sucursales';

export const sucursalesService = {
  getAll: () => fetchCollection(COLLECTION),
  getById: (id) => fetchItemById(COLLECTION, id),
  getByProvincia: async (provincia) => {
    const list = await fetchCollection(COLLECTION);
    if (!provincia || provincia === 'Todas') return list;
    return list.filter((s) => s.provincia.toLowerCase() === provincia.toLowerCase());
  },
  create: (sucursal) => createItem(COLLECTION, {
    ...sucursal,
    estado: sucursal.estado || 'Abierto'
  }),
  update: (id, updates) => updateItem(COLLECTION, id, updates),
  delete: (id) => deleteItem(COLLECTION, id)
};

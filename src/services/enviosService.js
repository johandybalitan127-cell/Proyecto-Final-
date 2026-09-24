import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';

const COLLECTION = 'envios';

export const enviosService = {
  getAll: () => fetchCollection(COLLECTION),
  getByIdOrGuia: (idOrGuia) => fetchItemById(COLLECTION, idOrGuia),
  create: (envio) => createItem(COLLECTION, envio),
  update: (id, updates) => updateItem(COLLECTION, id, updates),
  delete: (id) => deleteItem(COLLECTION, id),

  // Search by tracking guide regex check (UPU standard 8-10 digits)
  validateTrackingNumber: (guia) => {
    if (!guia) return false;
    const clean = guia.trim().toUpperCase();
    const regex = /^(CR|CP)\d{8,10}CR$/;
    return regex.test(clean);
  }
};

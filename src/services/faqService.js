import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';

const COLLECTION = 'faq';

export const faqService = {
  getAll: () => fetchCollection(COLLECTION),
  getById: (id) => fetchItemById(COLLECTION, id),
  create: (item) => createItem(COLLECTION, {
    ...item,
    estado: item.estado || 'Publicada'
  }),
  update: (id, updates) => updateItem(COLLECTION, id, updates),
  delete: (id) => deleteItem(COLLECTION, id)
};

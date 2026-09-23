import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';

const COLLECTION = 'consultas';

export const consultasService = {
  getAll: () => fetchCollection(COLLECTION),
  getById: (id) => fetchItemById(COLLECTION, id),
  create: async (consulta) => {
    // Generate official ticket format PQ-2025-XXXX
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const newTicket = {
      ...consulta,
      ticket: consulta.ticket || `PQ-${year}-${randomTicketNum}`,
      fecha: consulta.fecha || new Date().toISOString().split('T')[0],
      estado: consulta.estado || 'Pendiente',
      prioridad: consulta.prioridad || 'Media',
      // Metadata representing N8N automatic categorization
      n8nProcessed: true,
      n8nDepartment: consulta.categoria === 'Aduanas' ? 'Unidad de Aforo Postal' :
                     consulta.categoria === 'Reclamos' ? 'Auditoría de Envíos y Seguros' :
                     consulta.categoria === 'Solicitudes' ? 'Atención Comercial Pymes' : 'Soporte Ciudadano'
    };
    return createItem(COLLECTION, newTicket);
  },
  update: (id, updates) => updateItem(COLLECTION, id, updates),
  delete: (id) => deleteItem(COLLECTION, id)
};

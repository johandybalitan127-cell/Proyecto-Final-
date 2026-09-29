import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';
import { n8nService } from './n8nService';

const COLLECTION = 'consultas';

export const consultasService = {
  getAll: () => fetchCollection(COLLECTION),
  getById: (id) => fetchItemById(COLLECTION, id),
  create: async (consulta) => {
    // Generate official ticket format PQ-YYYY-XXXX
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const newTicket = {
      ...consulta,
      ticket: consulta.ticket || `PQ-${year}-${randomTicketNum}`,
      fecha: consulta.fecha || new Date().toISOString().split('T')[0],
      estado: consulta.estado || 'Pendiente',
      prioridad: consulta.prioridad || 'Media',
      n8nProcessed: true,
      n8nDepartment: consulta.departamento || (consulta.categoria ? `Área de ${consulta.categoria}` : 'Soporte Ciudadano')
    };

    // Notificar al Webhook de N8N Cloud configurado
    try {
      const webhookUrl = n8nService.getWebhookUrl();
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTicket)
        }).catch((e) => console.warn('N8N Webhook notice:', e));
      }
    } catch {}

    return createItem(COLLECTION, newTicket);
  },
  update: (id, updates) => updateItem(COLLECTION, id, updates),
  delete: (id) => deleteItem(COLLECTION, id)
};

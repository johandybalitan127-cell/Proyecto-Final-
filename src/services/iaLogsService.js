import { fetchCollection, createItem } from './api';

const COLLECTION = 'ia_logs';

export const iaLogsService = {
  getAll: () => fetchCollection(COLLECTION),
  createLog: (log) => createItem(COLLECTION, {
    ...log,
    hora: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    confianza: log.confianza || 96.5,
    resultado: log.resultado || 'Resuelto'
  })
};

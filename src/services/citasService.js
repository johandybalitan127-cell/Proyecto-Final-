// Servicio de gestión de Citas Premium (Fila Cero)
// Usa json-server en puerto 3001 como backend

const API_URL = 'http://localhost:3001/citas';

export const citasService = {
  /**
   * Obtiene todas las citas premium registradas
   */
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('[citasService] Error obteniendo citas:', error.message);
      return [];
    }
  },

  /**
   * Obtiene una cita por ID
   */
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Cita ${id} no encontrada`);
    return await response.json();
  },

  /**
   * Crea una nueva cita premium
   */
  create: async (citaData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...citaData,
        estado: citaData.estado || 'Confirmada',
        fechaCreacion: new Date().toISOString(),
      }),
    });
    if (!response.ok) throw new Error('Error al crear cita premium');
    return await response.json();
  },

  /**
   * Actualiza una cita existente
   */
  update: async (id, citaData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(citaData),
    });
    if (!response.ok) throw new Error('Error al actualizar cita');
    return await response.json();
  },

  /**
   * Cancela una cita premium (cambia estado a "Cancelada")
   */
  cancel: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        estado: 'Cancelada',
        fechaCancelacion: new Date().toISOString()
      }),
    });
    if (!response.ok) throw new Error('Error al cancelar cita');
    return await response.json();
  },

  /**
   * Elimina una cita
   */
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar cita');
    return true;
  },
};

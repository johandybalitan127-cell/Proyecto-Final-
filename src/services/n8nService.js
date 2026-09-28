// Servicio de integración con Webhooks y AI Agent de N8N
const DEFAULT_N8N_WEBHOOK = 'https://johandyblitan.app.n8n.cloud/webhook/pqrs-ciudadana';

export const n8nService = {
  /**
   * Obtiene la URL configurada del Webhook de N8N
   */
  getWebhookUrl: () => {
    return localStorage.getItem('correos_n8n_webhook_url') || DEFAULT_N8N_WEBHOOK;
  },

  /**
   * Permite actualizar la URL del Webhook dinámicamente si el usuario cambia de instancia
   */
  setWebhookUrl: (url) => {
    if (url && url.trim()) {
      localStorage.setItem('correos_n8n_webhook_url', url.trim());
    } else {
      localStorage.removeItem('correos_n8n_webhook_url');
    }
  },

  /**
   * Envía un mensaje o consulta ciudadana al AI Agent en N8N
   * @param {Object} params
   * @param {string} params.message Texto de la consulta
   * @param {Object} [params.user] Información del usuario autenticado
   * @param {string} [params.categoria] Categoría sugerida
   * @param {string} [params.prioridad] Prioridad inicial
   */
  sendChatMessage: async ({ message, user = null, categoria = 'Consulta Chat IA', prioridad = 'Media' }) => {
    const webhookUrl = n8nService.getWebhookUrl();
    const cleanMessage = String(message || '').trim();

    const payload = {
      mensaje: cleanMessage,
      asunto: cleanMessage.length > 60 ? `${cleanMessage.substring(0, 60)}...` : cleanMessage,
      usuario: user?.nombre || 'Ciudadano Web',
      correo: user?.correo || 'usuario@correos.go.cr',
      telefono: user?.telefono || '+506 2202-2900',
      categoria: categoria,
      prioridad: prioridad,
      chatInput: cleanMessage,
      input: cleanMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { text: responseText };
      }

      if (!response.ok) {
        return {
          success: false,
          error: data?.message || `Error HTTP ${response.status}`,
          raw: data
        };
      }

      // Extraer el texto de respuesta del AI Agent o webhook
      const replyText = 
        data.respuestaOficial || 
        data.output || 
        data.respuesta || 
        data.response || 
        data.text || 
        data.content || 
        (data.mensaje && data.mensaje !== 'Error in workflow' ? data.mensaje : null) ||
        data.resumen ||
        null;

      return {
        success: true,
        replyText,
        departamento: data.departamento || data.n8nDepartment,
        prioridad: data.prioridad,
        sla: data.sla,
        ticket: data.ticket,
        sentimiento: data.sentimiento || data.analisisSentimiento,
        raw: data
      };
    } catch (err) {
      console.warn('Fallo de conexión con Webhook N8N:', err);
      return {
        success: false,
        error: err.message || 'Error de red con N8N Webhook'
      };
    }
  }
};

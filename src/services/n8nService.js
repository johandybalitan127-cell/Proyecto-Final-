// Servicio de integración con Webhooks y AI Agent de N8N
// Usamos el proxy de Vite (/n8n-webhook) para evitar errores CORS en el navegador.
// El proxy redirige: /n8n-webhook/* → http://localhost:5678/*
const DEFAULT_N8N_WEBHOOK = '/n8n-webhook/webhook/pqrs-ciudadana';
const DEFAULT_N8N_ADMIN_WEBHOOK = '/n8n-webhook/webhook/admin-ai-agent';

export const n8nService = {
  /**
   * Obtiene la URL configurada del Webhook de N8N
   */
  getWebhookUrl: () => {
    const saved = localStorage.getItem('correos_n8n_webhook_url');
    // Limpiar cualquier URL absoluta guardada (nube o localhost directo) y usar el proxy
    if (saved && (saved.includes('johandyblitan.app.n8n.cloud') || saved.includes('localhost:5678'))) {
      localStorage.setItem('correos_n8n_webhook_url', DEFAULT_N8N_WEBHOOK);
      return DEFAULT_N8N_WEBHOOK;
    }
    return saved || DEFAULT_N8N_WEBHOOK;
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
   * Obtiene la URL del Webhook del Admin AI Agent en N8N
   */
  getAdminWebhookUrl: () => {
    return localStorage.getItem('correos_n8n_admin_webhook_url') || DEFAULT_N8N_ADMIN_WEBHOOK;
  },

  /**
   * Guarda la URL del Webhook Admin configurada por el administrador
   */
  setAdminWebhookUrl: (url) => {
    if (url && url.trim()) {
      localStorage.setItem('correos_n8n_admin_webhook_url', url.trim());
    } else {
      localStorage.removeItem('correos_n8n_admin_webhook_url');
    }
  },

  /**
   * Envía un mensaje al Admin AI Agent en N8N (Webhook → Gemini/OpenAI AI Agent)
   */
  sendAdminChatMessage: async ({ message, user = null, currentBranch = '', currentPeriod = '30d', context = {} }) => {
    const webhookUrl = n8nService.getAdminWebhookUrl();
    const cleanMessage = String(message || '').trim();

    const payload = {
      chatInput: cleanMessage,
      input: cleanMessage,
      message: cleanMessage,
      usuario: user?.nombre || 'Administrador',
      correo: user?.correo || 'admin@correos.go.cr',
      rol: user?.rol || 'Administrador',
      sede: currentBranch,
      periodo: currentPeriod,
      timestamp: new Date().toISOString(),
      context: {
        totalEnvios: context.totalEnvios || 0,
        incidencias: context.incidencias || 0,
        totalUsuarios: context.totalUsuarios || 0,
        totalConsultas: context.totalConsultas || 0,
        ...context
      }
    };

    try {
      const controller = new AbortController();
      // 4s timeout: si n8n no responde de inmediato, caer al motor rápido directo
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const responseText = await response.text();
      let rawData = {};
      try { rawData = JSON.parse(responseText); } catch { rawData = { text: responseText }; }

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${rawData?.message || response.statusText}` };
      }

      const data = Array.isArray(rawData) ? (rawData[0]?.json || rawData[0] || {}) : rawData;

      const replyText =
        data.output || data.text || data.respuesta || data.response ||
        data.reply || data.content || data.message ||
        (typeof data === 'string' ? data : null) ||
        (responseText && !responseText.startsWith('{') ? responseText.trim() : null);

      if (!replyText || replyText === 'Workflow was started') {
        return { success: false, error: 'El AI Agent de N8N no retornó una respuesta de texto.' };
      }

      return { success: true, replyText, raw: rawData };

    } catch (err) {
      return { success: false, error: err.message || 'Error de conexión con N8N Admin AI Agent' };
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
      // Campos que el AI Agent de n8n puede leer como entrada
      message: cleanMessage,       // campo principal que lee el AI Agent
      chatInput: cleanMessage,     // alias alternativo
      input: cleanMessage,         // alias alternativo
      // Datos del contexto ciudadano
      mensaje: cleanMessage,
      asunto: cleanMessage.length > 60 ? `${cleanMessage.substring(0, 60)}...` : cleanMessage,
      usuario: user?.nombre || 'Ciudadano Web',
      correo: user?.correo || 'usuario@correos.go.cr',
      telefono: user?.telefono || '+506 2202-2900',
      categoria: categoria,
      prioridad: prioridad,
      timestamp: new Date().toISOString()
    };

    try {
      const controller = new AbortController();
      // 4s para responder rápido sin demoras
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const responseText = await response.text();
      let rawData = {};
      try {
        rawData = JSON.parse(responseText);
      } catch {
        rawData = { text: responseText };
      }

      if (!response.ok) {
        return {
          success: false,
          error: rawData?.message || `Error HTTP ${response.status}`,
          raw: rawData
        };
      }

      // Debug: ver exactamente qué devuelve n8n (visible en la consola del navegador)
      console.log('[n8nService][ciudadano] Respuesta cruda de N8N:', responseText.substring(0, 500));

      // Si N8N devuelve un array de items (ej: [{ output: '...' }])
      const data = Array.isArray(rawData) ? (rawData[0]?.json || rawData[0] || {}) : rawData;

      // Extraer el texto de respuesta del AI Agent o webhook
      const replyText =
        data.respuestaOficial ||
        data.respuestaAlCiudadano ||
        data.output ||
        data.respuesta ||
        data.response ||
        data.reply ||
        data.text ||
        data.content ||
        data.mensaje ||
        data.message ||
        data.resumen ||
        (typeof data === 'string' ? data : null) ||
        (responseText && responseText.trim() && !responseText.startsWith('{') ? responseText.trim() : null);

      if (!replyText || replyText === 'Workflow was started' || replyText === 'Error in workflow') {
        console.warn('[n8nService][ciudadano] N8N respondió pero sin texto útil. Claves recibidas:', Object.keys(data));
        return { success: false, error: 'N8N no retornó texto de respuesta. Revisa el nodo Respond to Webhook.' };
      }

      return {
        success: true,
        replyText,
        departamento: data.departamento || data.n8nDepartment,
        prioridad: data.prioridad,
        sla: data.sla,
        ticket: data.ticket,
        sentimiento: data.sentimiento || data.analisisSentimiento,
        raw: rawData
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

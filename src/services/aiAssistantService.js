import { sucursalesService } from './sucursalesService.js';
import { tarifasService } from './tarifasService.js';
import { serviciosService } from './serviciosService.js';
import { faqService } from './faqService.js';
import { iaLogsService } from './iaLogsService.js';
import { enviosService } from './enviosService.js';
import { n8nService } from './n8nService.js';

// Lista ordenada de modelos para reintento automático si uno está congestionado (503 / 429)
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash'];

/**
 * Llama a la API de DeepSeek a través del proxy local de Vite (/deepseek-api)
 */
async function callDeepSeekCitizen(apiKey, systemPrompt, rawQuery, historyContents) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...historyContents.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.parts?.[0]?.text || ''
    })),
    { role: 'user', content: rawQuery }
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  const response = await fetch('/deepseek-api/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
      max_tokens: 500
    }),
    signal: controller.signal
  });
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(`DeepSeek API error ${response.status}: ${errBody?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  if (data?.error) {
    throw new Error(`DeepSeek error: ${data.error.message || 'Error en servidor DeepSeek'}`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Respuesta vacía de DeepSeek.');
  return text;
}

/**
 * Llama a la API de Gemini con timeout de 8s por modelo
 */
async function callGemini(apiKey, contents) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const url = `/gemini-api/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }

      const errBody = await response.json().catch(() => ({}));
      lastError = new Error(`Gemini (${model}) ${response.status}: ${errBody?.error?.message || response.statusText}`);
      if (response.status === 503 || response.status === 429) {
        console.warn(`[aiAssistantService] ${model} con alta demanda (${response.status}), probando siguiente modelo...`);
        continue;
      }
      throw lastError;
    } catch (err) {
      lastError = err;
      if (err.name === 'AbortError' || (err.message && (err.message.includes('503') || err.message.includes('429')))) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('No se pudo obtener respuesta de ningún modelo de Gemini.');
}

export const aiAssistantService = {
  processMessage: async ({ message, user = null, history = [] }) => {
    const rawQuery = String(message || '').trim();
    if (!rawQuery) {
      return {
        text: 'Por favor, indícame tu consulta.',
        quickSuggestions: ['Sucursales', 'Cotizar envío', 'Rastrear paquete']
      };
    }

    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Cargar datos del sistema en paralelo
    const [sucursales, tarifas, servicios, faqs, envios] = await Promise.all([
      sucursalesService.getAll().catch(() => []),
      tarifasService.getAll().catch(() => []),
      serviciosService.getAll().catch(() => []),
      faqService.getAll().catch(() => []),
      enviosService.getAll().catch(() => []),
    ]);

    const systemPrompt = `Eres SIP-CR, el Asistente Postal Inteligente Oficial de Correos de Costa Rica.
Tu misión es brindar atención al cliente excepcional, rápida y precisa.

REGLAS ESTRICTAS:
1. Si el usuario saluda ("hola"), preséntate brevemente como SIP-CR y pregúntale cómo puedes ayudarle.
2. Mantén respuestas CORTAS, precisas y con formato markdown (emojis, negritas, viñetas).
3. NO respondas preguntas ajenas a Correos de Costa Rica (recetas, clima, política, etc.). Redirige amablemente.
4. NUNCA inventes información. Usa solo los datos provistos. Si no tienes el dato, dilo.
5. NO incluyas links rotos ni texto crudo de objetos JSON en tu respuesta.

BASE DE CONOCIMIENTO (datos reales del sistema):
- Sucursales: ${JSON.stringify(sucursales.slice(0, 8).map(s => ({ nombre: s.nombre, provincia: s.provincia, horario: s.horario })))}
- Servicios disponibles: ${JSON.stringify(servicios.map(s => s.nombre))}
- Tarifas básicas: ${JSON.stringify(tarifas.slice(0, 5).map(t => ({ servicio: t.servicio || t.nombre, precio: t.precio || t.tarifa })))}
- FAQs: ${JSON.stringify(faqs.slice(0, 3).map(f => ({ pregunta: f.pregunta, respuesta: f.respuesta })))}
- Envíos (para rastreo): ${JSON.stringify(envios.map(e => ({ guia: e.guia, estado: e.estado, ubicacion: e.ubicacion, remitente: e.remitente })))}`;

    const historyContents = history.slice(-4).map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Armar las carreras en paralelo
    const racers = [];

    // Gemini — PRIORIDAD #1
    if (geminiKey) {
      const geminiContents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Soy SIP-CR, listo para asistir a los ciudadanos de Correos de Costa Rica con información precisa y útil.' }] },
        ...historyContents,
        { role: 'user', parts: [{ text: rawQuery }] }
      ];

      racers.push(
        callGemini(geminiKey, geminiContents)
          .then(text => ({ text, badge: 'Gemini Flash · SIP-CR', engine: 'gemini' }))
      );
    }

    // N8N racer (paralelo)
    racers.push(
      n8nService.sendChatMessage({
        message: rawQuery,
        user,
        categoria: 'Consulta Chat IA',
        prioridad: 'Media'
      }).then(result => {
        if (result.success && result.replyText) {
          return { text: result.replyText, badge: 'N8N AI Agent · SIP-CR', engine: 'n8n', n8nMeta: result };
        }
        throw new Error('N8N sin respuesta');
      })
    );

    // DeepSeek — respaldo (500ms delay)
    if (deepseekKey) {
      racers.push(
        new Promise(resolve => setTimeout(resolve, 500))
          .then(() => callDeepSeekCitizen(deepseekKey, systemPrompt, rawQuery, historyContents))
          .then(text => ({ text, badge: 'DeepSeek V3 · SIP-CR', engine: 'deepseek' }))
      );
    }

    console.time('[aiAssistantService] AI race');

    try {
      const winner = await Promise.any(racers);
      console.timeEnd('[aiAssistantService] AI race');
      console.log(`[aiAssistantService] Ganador: ${winner.engine}`);

      iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: `consulta_${winner.engine}_ciudadano`,
        confianza: 100,
        resultado: `Respuesta procesada por ${winner.badge}`
      }).catch(() => {});

      const result = {
        text: winner.text,
        dataBadge: winner.badge,
        quickSuggestions: ['Rastrear envío', 'Horarios de sucursales', 'Cotizar tarifa EMS']
      };

      if (winner.engine === 'n8n' && winner.n8nMeta) {
        result.isN8n = true;
        result.n8nMeta = {
          departamento: winner.n8nMeta.departamento,
          prioridad: winner.n8nMeta.prioridad,
          ticket: winner.n8nMeta.ticket,
        };
      }

      return result;
    } catch (allFailed) {
      console.timeEnd('[aiAssistantService] AI race');
      console.error('[aiAssistantService] Todas las APIs fallaron:', allFailed.message);

      return {
        text: '⚠️ Los servicios de IA no están disponibles en este momento. Por favor intenta de nuevo en unos segundos o comunícate al **2202-2900**.',
        dataBadge: 'SIP-CR · Sin conexión',
        quickSuggestions: ['Reintentar consulta']
      };
    }
  }
};

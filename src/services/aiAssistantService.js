import { sucursalesService } from './sucursalesService.js';
import { tarifasService } from './tarifasService.js';
import { serviciosService } from './serviciosService.js';
import { faqService } from './faqService.js';
import { iaLogsService } from './iaLogsService.js';
import { enviosService } from './enviosService.js';
import { n8nService } from './n8nService.js';

// Lista ordenada de modelos para reintento automático si uno está congestionado (503 / 429)
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash'];

// ─── Detección rápida de saludos (respuesta instantánea, sin API) ───
const GREETING_PATTERNS = /^(hola|hey|buenos?\s*d[ií]as?|buenas?\s*(tardes?|noches?)?|saludos?|hi|hello|qué\s*tal|que\s*tal|buen[oa]?s?)[\s!?.]*$/i;

/**
 * Llama a la API de DeepSeek a través del proxy local de Vite (/deepseek-api)
 * Timeout agresivo de 3s
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
      max_tokens: 350
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
  * Llama a la API de Gemini con timeout de 4s por modelo
  */
async function callGemini(apiKey, contents) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

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

    // =========================================================
    // 🚀 RESPUESTA INSTANTÁNEA PARA SALUDOS (0ms, sin API)
    // =========================================================
    if (GREETING_PATTERNS.test(rawQuery)) {
      console.log('[aiAssistantService] Saludo detectado → respuesta instantánea');

      iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: 'saludo_instantaneo_ciudadano',
        confianza: 100,
        resultado: 'Respuesta instantánea de saludo'
      }).catch(() => {});

      return {
        text: `👋 **¡Hola${user?.nombre ? ` ${user.nombre}` : ''}! Bienvenido a Correos de Costa Rica.** Soy **SIP-CR**, tu asistente postal inteligente.\n\n¿En qué te puedo colaborar hoy?\n• 📦 **Rastrear un paquete**\n• 🏢 **Consultar sucursales y horarios**\n• 💰 **Cotizar tarifas y servicios (EMS, Box Correos)**\n• ⚡ **Agendar Cita Premium (Fila Cero)**`,
        dataBadge: 'SIP-CR · Instantáneo',
        quickSuggestions: ['Rastrear envío', 'Sucursales por provincia', 'Cotizar tarifa EMS']
      };
    }

    // =========================================================
    // 🏎️ CARRERA PARALELA: N8N vs DeepSeek vs Gemini
    // =========================================================
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
2. Mantén respuestas CORTAS, precisas y con formato markdown (emojis, negritas, viñetas). Máximo 120 palabras.
3. NO respondas preguntas ajenas a Correos de Costa Rica (recetas, clima, política, etc.). Redirige amablemente.
4. NUNCA inventes información. Usa solo los datos provistos. Si no tienes el dato, dilo.
5. NO incluyas links rotos ni texto crudo de objetos JSON en tu respuesta.

BASE DE CONOCIMIENTO (datos reales del sistema):
- Sucursales: ${JSON.stringify(sucursales.slice(0, 8).map(s => ({ nombre: s.nombre, provincia: s.provincia, horario: s.horario })))}
- Servicios disponibles: ${JSON.stringify(servicios.map(s => s.nombre))}
- Tarifas básicas: ${JSON.stringify(tarifas.slice(0, 5).map(t => ({ servicio: t.servicio || t.nombre, precio: t.precio || t.tarifa })))}
- FAQs: ${JSON.stringify(faqs.slice(0, 3).map(f => ({ pregunta: f.pregunta, respuesta: f.respuesta })))}
- Envíos (para rastreo): ${JSON.stringify(envios.map(e => ({ guia: e.guia, estado: e.estado, ubicacion: e.ubicacion, remitente: e.remitente })))}`;

    // Construir historial de conversación (últimos 4 turnos)
    const historyContents = history.slice(-4).map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Armar las carreras en paralelo
    const racers = [];

    // N8N racer
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

    // DeepSeek racer
    if (deepseekKey) {
      racers.push(
        callDeepSeekCitizen(deepseekKey, systemPrompt, rawQuery, historyContents)
          .then(text => ({ text, badge: 'DeepSeek V3 · SIP-CR', engine: 'deepseek' }))
      );
    }

    // Gemini racer (500ms delay para dar prioridad a los otros)
    if (geminiKey) {
      const geminiContents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Entendido. Soy SIP-CR, listo para asistir a los ciudadanos de Correos de Costa Rica con información precisa y útil.' }] },
        ...historyContents,
        { role: 'user', parts: [{ text: rawQuery }] }
      ];

      racers.push(
        new Promise(resolve => setTimeout(resolve, 500))
          .then(() => callGemini(geminiKey, geminiContents))
          .then(text => ({ text, badge: 'Gemini · SIP-CR', engine: 'gemini' }))
      );
    }

    console.time('[aiAssistantService] AI race');

    try {
      // Promise.any: el PRIMER motor que responda exitosamente gana
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

      // Agregar metadata de N8N si aplica
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
      console.warn('[aiAssistantService] Todas las APIs fallaron:', allFailed.message);
    }

    // =========================================================
    // Motor local de contingencia ciudadana
    // =========================================================
    const q = rawQuery.toLowerCase();
    let fallbackText = '';

    if (q.includes('hola') || q.includes('buenos') || q.includes('buenas') || q.includes('saludos')) {
      fallbackText = `👋 **¡Hola! Bienvenido a Correos de Costa Rica.** Soy **SIP-CR**, tu asistente postal.\n\n¿En qué te puedo colaborar hoy?\n• 📦 **Rastrear un paquete**\n• 🏢 **Consultar sucursales y horarios**\n• 💰 **Cotizar tarifas y servicios (EMS, Box Correos)**\n• ⚡ **Agendar Cita Premium (Fila Cero)**`;
    } else if (q.includes('sucursal') || q.includes('horario') || q.includes('donde') || q.includes('ubicacion')) {
      const destacadas = sucursales.slice(0, 4);
      fallbackText = `🏢 **Sucursales Principales de Correos de Costa Rica:**\n\n${destacadas.map(s => `• **${s.nombre}** (${s.provincia}):\n  📍 ${s.direccion}\n  ⏰ ${s.horario}`).join('\n\n')}\n\nPara ver las 110 sedes y mapa interactivo, visita la sección **Sucursales**.`;
    } else if (q.includes('precio') || q.includes('tarifa') || q.includes('costo') || q.includes('cotizar') || q.includes('ems')) {
      fallbackText = `💰 **Tarifas y Servicios Populares:**\n\n• **EMS Courier Nacional:** Entrega rápida en 24-48h hábiles en todo Costa Rica.\n• **Pymexpress:** Tarifas preferenciales para emprendedores y microempresas.\n• **Box Correos:** Tu casillero en Miami para compras por internet.\n• **Cita Premium:** ₡5.000 para atención inmediata sin filas en sucursal.\n\nPuedes usar nuestra calculadora interactiva en **Servicios y Tarifas**.`;
    } else if (q.includes('cita') || q.includes('premium') || q.includes('fila cero')) {
      fallbackText = `⚡ **Citas Premium — Fila Cero:**\n\n¡Evita esperas en ventanilla! Puedes agendar tu Cita Premium directamente desde tu panel de usuario por solo **₡5.000**.\n\nElige sucursal, fecha y trámite para recibir atención prioritaria e inmediata.`;
    } else {
      fallbackText = `👋 **SIP-CR — Asistente de Correos de Costa Rica:**\n\nRecibí tu consulta: *"_${rawQuery}_"*.\n\nPara una atención inmediata, te sugerimos utilizar las opciones rápidas:\n• **Rastreo:** Ingresa tu guía en el buscador de la página principal.\n• **Sucursales:** Encuentra tu sede más cercana en el menú.\n• **PQRS:** Radica una solicitud formal en la pestaña Ayuda.`;
    }

    return {
      text: fallbackText,
      dataBadge: 'SIP-CR Postal (En Vivo)',
      quickSuggestions: ['Sucursales por provincia', 'Tarifas de envío', 'Citas Premium']
    };
  }
};


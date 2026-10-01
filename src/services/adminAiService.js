import { enviosService } from './enviosService.js';
import { sucursalesService } from './sucursalesService.js';
import { usuariosService } from './usuariosService.js';
import { consultasService } from './consultasService.js';
import { citasService } from './citasService.js';
import { iaLogsService } from './iaLogsService.js';
import { getBranchDashboardData } from '../data/branchDashboardData.js';
import { n8nService } from './n8nService.js';

// Lista ordenada de modelos Gemini para reintento automático
const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash'];

/**
 * Llama a la API de DeepSeek a través del proxy local de Vite (/deepseek-api)
 */
async function callDeepSeek(apiKey, systemPrompt, rawQuery, historyContents) {
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
      temperature: 0.2,
      max_tokens: 600
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
 * Llama a la API de Gemini con AbortController de 8s
 */
async function callGemini(apiKey, systemPrompt, rawQuery, historyContents) {
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Entendido. Soy SIP-CR Admin, listo para analizar datos operativos de Correos de Costa Rica.' }] },
    ...historyContents,
    { role: 'user', parts: [{ text: rawQuery }] }
  ];

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
        console.warn(`[adminAiService] ${model} con alta demanda (${response.status}), probando siguiente modelo...`);
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

/**
 * Carrera paralela: Gemini (#1), N8N (paralelo) vs DeepSeek (respaldo)
 */
async function raceAiEngines(deepseekKey, geminiKey, systemPrompt, rawQuery, historyContents, n8nParams) {
  const racers = [];

  // Gemini — PRIORIDAD #1
  if (geminiKey) {
    racers.push(
      callGemini(geminiKey, systemPrompt, rawQuery, historyContents)
        .then(text => ({ text, badge: 'Gemini Flash · SIP-CR Admin', engine: 'gemini' }))
    );
  }

  // N8N racer (paralelo)
  if (n8nParams) {
    racers.push(
      n8nService.sendAdminChatMessage(n8nParams)
        .then(result => {
          if (result.success && result.replyText) {
            return { text: result.replyText, badge: 'N8N AI Agent · SIP-CR', engine: 'n8n' };
          }
          throw new Error('N8N sin respuesta');
        })
    );
  }

  // DeepSeek — respaldo (500ms delay)
  if (deepseekKey) {
    racers.push(
      new Promise(resolve => setTimeout(resolve, 500))
        .then(() => callDeepSeek(deepseekKey, systemPrompt, rawQuery, historyContents))
        .then(text => ({ text, badge: 'DeepSeek V3 · SIP-CR Admin', engine: 'deepseek' }))
    );
  }

  if (racers.length === 0) {
    throw new Error('No hay motores de IA configurados');
  }

  return Promise.any(racers);
}

export const adminAiService = {
  processAdminMessage: async ({ 
    message = '', 
    currentBranch = 'Sucursal Central San José', 
    currentPeriod = '30d', 
    user = null, 
    history = [] 
  }) => {
    const rawQuery = String(message || '').trim();
    if (!rawQuery) {
      return {
        text: 'Hola Administrador. Indícame qué métrica, sede, guía de envío o aspecto operativo deseas analizar.',
        quickSuggestions: ['Resumen operativo', 'Envíos con incidencias', 'Estado de usuarios']
      };
    }

    // Cargar datos completos del sistema administrativo
    const branchData = getBranchDashboardData(currentBranch, currentPeriod);
    const [envios, usuarios, consultas, citas] = await Promise.all([
      enviosService.getAll().catch(() => []),
      usuariosService.getAll().catch(() => []),
      consultasService.getAll().catch(() => []),
      citasService.getAll().catch(() => []),
    ]);

    const enviosDetalleSeguro = envios.map(e => ({
      guia: e.guia,
      remitente: e.remitente,
      estado: e.estado,
      ruta: `${e.origen} -> ${e.destino}`,
      servicio: e.servicio,
      etapaActual: e.etapas?.find(et => et.actual)?.nombre || e.estado
    }));

    const contextData = {
      totalEnvios: envios.length,
      incidencias: envios.filter(e => e.estado === 'En aduana' || e.estado === 'Retenido' || e.estado === 'Incidencias').length,
      aduanas: envios.filter(e => e.estado === 'En aduana' || e.estado === 'Aduanas').length,
      transito: envios.filter(e => e.estado === 'En tránsito').length,
      entregados: envios.filter(e => e.estado === 'Entregado').length,
      totalUsuarios: usuarios.length,
      totalConsultas: consultas.length,
      totalCitasPremium: citas.length,
      sede: currentBranch,
      periodo: currentPeriod,
      metricas: {
        registrados: branchData.stats.registrados.valor,
        transito: branchData.stats.transito.valor,
        entregados: branchData.stats.entregados.valor,
      },
      enviosDetalle: enviosDetalleSeguro,
    };

    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const systemPrompt = `Eres SIP-CR Admin, el Copiloto de Inteligencia Artificial Oficial del panel de administración de Correos de Costa Rica.
Tienes ACCESO TOTAL Y AUTORIZADO a la información operativa del sistema postal para ayudar al administrador a resolver dudas sobre paquetes, rutas, estados, sucursales y citas.

REGLAS DE SEGURIDAD Y PRIVACIDAD OBLIGATORIAS:
1. TIENES ACCESO COMPLETO Y DEBES dar toda la información de paquetes: número de guía, comercio o remitente comercial (ej. Óptica Visión, TeknoCR Store, Amazon, Farmacia Fischel, etc.), estado actual, origen, destino, servicio, fecha de admisión, repartidor asignado, ruta y etapas de entrega.
2. NUNCA REVELES DATOS PERSONALES PRIVADOS (PII): Queda terminantemente PROHIBIDO revelar nombres de personas físicas destinatarias particulares, números de cédula, correos electrónicos personales, teléfonos o contraseñas. Los comercios o remitentes empresariales SÍ pueden mencionarse.
3. LIMITADO AL PROYECTO: Tu dominio es todo lo que ocurre dentro de Correos de Costa Rica. Si te preguntan algo ajeno al proyecto, redirige amablemente.
4. NUNCA inventes información. Si no hay datos, dilo claramente.
5. Formato ejecutivo: Usa listas, negritas y emojis representativos (📦, 📍, 🚚, ✅, ⚠️).
6. Si te saludan, preséntate brevemente como SIP-CR Admin y muestra un resumen operativo rápido con los datos reales del sistema.

BASE DE DATOS OPERATIVA EN TIEMPO REAL:
- Sede Activa: ${currentBranch} | Período: ${currentPeriod}
- Métricas: Registrados=${contextData.metricas.registrados} | En tránsito=${contextData.metricas.transito} | Entregados=${contextData.metricas.entregados}
- Envíos Totales: ${envios.length} | Incidencias: ${contextData.incidencias} | Aduanas: ${contextData.aduanas}
- Usuarios: ${usuarios.length} | Consultas PQRS: ${consultas.length} | Citas Premium: ${citas.length}
- Inventario de Envíos: ${JSON.stringify(enviosDetalleSeguro)}`;

    const historyContents = history.slice(-4).map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    console.time('[adminAiService] AI race');

    try {
      const winner = await raceAiEngines(deepseekKey, geminiKey, systemPrompt, rawQuery, historyContents, {
        message: rawQuery,
        user,
        currentBranch,
        currentPeriod,
        context: contextData
      });

      console.timeEnd('[adminAiService] AI race');
      console.log(`[adminAiService] Ganador: ${winner.engine}`);

      iaLogsService.createLog({
        usuario: `${user?.nombre || 'Administrador'} (SIP-CR Admin)`,
        consulta: rawQuery,
        intencion: `consulta_${winner.engine}_admin`,
        confianza: 100,
        resultado: `Respuesta procesada por ${winner.badge}`
      }).catch(() => {});

      return {
        text: winner.text,
        dataBadge: winner.badge,
        quickSuggestions: ['Envíos con incidencias', 'Resumen operativo', 'Citas Premium']
      };
    } catch (allFailed) {
      console.timeEnd('[adminAiService] AI race');
      console.error('[adminAiService] Todas las APIs fallaron:', allFailed.message);

      return {
        text: '⚠️ Los servicios de IA no están disponibles en este momento. Por favor intenta de nuevo en unos segundos.',
        dataBadge: 'SIP-CR · Sin conexión',
        quickSuggestions: ['Reintentar consulta']
      };
    }
  }
};

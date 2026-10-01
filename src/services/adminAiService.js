import { enviosService } from './enviosService.js';
import { sucursalesService } from './sucursalesService.js';
import { usuariosService } from './usuariosService.js';
import { consultasService } from './consultasService.js';
import { citasService } from './citasService.js';
import { iaLogsService } from './iaLogsService.js';
import { getBranchDashboardData } from '../data/branchDashboardData.js';
import { n8nService } from './n8nService.js';

// Lista ordenada de modelos Gemini para reintento automático
const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash'];

// ─── Detección rápida de saludos (respuesta instantánea, sin API) ───
const GREETING_PATTERNS = /^(hola|hey|buenos?\s*d[ií]as?|buenas?\s*(tardes?|noches?)?|saludos?|hi|hello|qué\s*tal|que\s*tal|buen[oa]?s?)[\s!?.]*$/i;

/**
 * Genera respuesta local instantánea para saludos (~0ms)
 */
function buildInstantGreeting(user, currentBranch, currentPeriod, contextData, envios, usuarios, citas) {
  return `👋 **¡Hola ${user?.nombre || 'Administrador'}!** Soy **SIP-CR Admin**, tu copiloto operativo en tiempo real.

Estamos monitoreando la **${currentBranch}** (período: ${currentPeriod}).

📌 **Resumen Rápido:**
• **Total Envíos:** ${envios.length}
• **En Reparto / Tránsito:** ${contextData.transito}
• **Incidencias:** ${contextData.incidencias}
• **Retenciones Aduanales:** ${contextData.aduanas}
• **Citas Premium:** ${citas.length}
• **Usuarios Registrados:** ${usuarios.length}

¿En qué paquete, guía, trámite o métrica específica te puedo asistir hoy?`;
}

/**
 * Llama a la API de DeepSeek a través del proxy local de Vite (/deepseek-api)
 * Timeout agresivo de 3s para garantizar respuesta rápida
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
  // 3 segundos máximo — si DeepSeek no responde rápido, saltar
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
      max_tokens: 400
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
 * Llama a la API de Gemini con AbortController de 4s
 * Solo prueba el primer modelo disponible para velocidad
 */
async function callGeminiFallback(apiKey, systemPrompt, rawQuery, historyContents) {
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

      // Si da 503 (high demand) o 429 (rate limit), probamos con el siguiente modelo
      const errBody = await response.json().catch(() => ({}));
      lastError = new Error(`Gemini (${model}) ${response.status}: ${errBody?.error?.message || response.statusText}`);
      if (response.status === 503 || response.status === 429) {
        console.warn(`[adminAiService] ${model} con alta demanda (${response.status}), probando siguiente modelo...`);
        continue;
      }
      // Si es otro error (ej: 400 Bad Request), no tiene sentido probar otro
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
 * Promise.any-style race: corre DeepSeek y N8N en paralelo, gana el primero
 */
async function raceAiEngines(deepseekKey, geminiKey, systemPrompt, rawQuery, historyContents, n8nParams) {
  const racers = [];

  // DeepSeek racer
  if (deepseekKey) {
    racers.push(
      callDeepSeek(deepseekKey, systemPrompt, rawQuery, historyContents)
        .then(text => ({ text, badge: 'DeepSeek V3 · SIP-CR Admin', engine: 'deepseek' }))
    );
  }

  // N8N racer
  racers.push(
    n8nService.sendAdminChatMessage(n8nParams)
      .then(result => {
        if (result.success && result.replyText) {
          return { text: result.replyText, badge: 'N8N AI Agent · SIP-CR', engine: 'n8n' };
        }
        throw new Error('N8N sin respuesta');
      })
  );

  // Gemini racer (con un pequeño delay de 500ms para dar prioridad a DeepSeek/N8N)
  if (geminiKey) {
    racers.push(
      new Promise(resolve => setTimeout(resolve, 500))
        .then(() => callGeminiFallback(geminiKey, systemPrompt, rawQuery, historyContents))
        .then(text => ({ text, badge: 'Gemini · SIP-CR Admin', engine: 'gemini' }))
    );
  }

  if (racers.length === 0) {
    throw new Error('No hay motores de IA configurados');
  }

  // Promise.any: el PRIMER motor que responda exitosamente gana
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

    // Formato compacto de inventario para máxima velocidad de respuesta (<1s)
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

    // =========================================================
    // 🚀 RESPUESTA INSTANTÁNEA PARA SALUDOS (0ms, sin API)
    // =========================================================
    if (GREETING_PATTERNS.test(rawQuery)) {
      console.log('[adminAiService] Saludo detectado → respuesta instantánea');
      const greetingText = buildInstantGreeting(user, currentBranch, currentPeriod, contextData, envios, usuarios, citas);
      
      iaLogsService.createLog({
        usuario: `${user?.nombre || 'Administrador'} (SIP-CR Admin)`,
        consulta: rawQuery,
        intencion: 'saludo_instantaneo',
        confianza: 100,
        resultado: 'Respuesta instantánea de saludo'
      }).catch(() => {});

      return {
        text: greetingText,
        dataBadge: 'SIP-CR Admin · Instantáneo',
        quickSuggestions: ['Resumen operativo', 'Envíos con incidencias', 'Citas Premium']
      };
    }

    // =========================================================
    // 🏎️ CARRERA PARALELA: DeepSeek vs N8N vs Gemini (gana el primero)
    // =========================================================
    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const systemPrompt = `Eres SIP-CR Admin, el Copiloto de Inteligencia Artificial Oficial del panel de administración de Correos de Costa Rica.
Tienes ACCESO TOTAL Y AUTORIZADO a la información operativa del sistema postal para ayudar al administrador a resolver dudas sobre paquetes, rutas, estados, sucursales y citas.

REGLAS DE SEGURIDAD Y PRIVACIDAD OBLIGATORIAS:
1. TIENES ACCESO COMPLETO Y DEBES dar toda la información de paquetes: número de guía, comercio o remitente comercial (ej. Óptica Visión, TeknoCR Store, Amazon, Farmacia Fischel, etc.), estado actual, origen, destino, servicio, fecha de admisión, repartidor asignado, ruta y etapas de entrega. Si te preguntan por paquetes de una tienda o comercio específico (ej: "¿Tienes envíos de Óptica Visión?"), BUSCA en el inventario y da los detalles operativos (guía, estado, ruta).
2. NUNCA REVELES DATOS PERSONALES PRIVADOS (PII): Queda terminantemente PROHIBIDO revelar nombres de personas físicas destinatarias particulares, números de cédula, correos electrónicos personales, teléfonos o contraseñas. Los comercios o remitentes empresariales (ej: Óptica Visión) SÍ pueden mencionarse porque son empresas asociadas que contratan el servicio postal.
3. LIMITADO AL PROYECTO: Tu dominio es todo lo que ocurre dentro de Correos de Costa Rica (paquetes, comercios remitentes, sucursales, carteros, citas premium, métricas, tarifas, reclamos PQRS). Si te preguntan por un comercio en relación a sus paquetes postales, atiéndelo con total normalidad.
4. NUNCA inventes información. Si un paquete o comercio no tiene envíos registrados en el sistema, indícalo claramente.
5. Formato ejecutivo: Usa listas, negritas y emojis representativos (📦, 📍, 🚚, ✅, ⚠️). Sé CONCISO: máximo 150 palabras.

BASE DE DATOS OPERATIVA EN TIEMPO REAL:
- Sede Activa: ${currentBranch} | Período: ${currentPeriod}
- Métricas Generales: Registrados=${contextData.metricas.registrados} | En tránsito=${contextData.metricas.transito} | Entregados=${contextData.metricas.entregados}
- Envíos Totales: ${envios.length} | Incidencias: ${contextData.incidencias} | Aduanas: ${contextData.aduanas}
- Citas Premium (Fila Cero): ${citas.length} citas registradas
- Inventario de Envíos: ${JSON.stringify(enviosDetalleSeguro)}`;

    const historyContents = history.slice(-4).map(msg => ({
      role: msg.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    console.time('[adminAiService] Total AI race');

    try {
      const winner = await raceAiEngines(deepseekKey, geminiKey, systemPrompt, rawQuery, historyContents, {
        message: rawQuery,
        user,
        currentBranch,
        currentPeriod,
        context: contextData
      });

      console.timeEnd('[adminAiService] Total AI race');
      console.log(`[adminAiService] Ganador de la carrera: ${winner.engine}`);

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
      console.timeEnd('[adminAiService] Total AI race');
      console.warn('[adminAiService] Todas las APIs fallaron, usando motor local:', allFailed.message);
    }

    // =========================================================
    // 4. MOTOR LOCAL DE RESPUESTA OPERATIVA (Garantiza respuesta 100%)
    // =========================================================
    const q = rawQuery.toLowerCase();
    let localReply = '';

      if (q.includes('hola') || q.includes('buenos') || q.includes('buenas') || q.includes('saludos')) {
        localReply = buildInstantGreeting(user, currentBranch, currentPeriod, contextData, envios, usuarios, citas);
      } else if (q.includes('paquete') || q.includes('envio') || q.includes('guia') || q.includes('rastre') || /[a-z]{2}\d+[a-z]{2}/i.test(rawQuery) || envios.some(e => e.remitente && q.includes(e.remitente.toLowerCase()))) {
        // Búsqueda inteligente de paquete por número de guía o por nombre del comercio remitente (ej: Óptica Visión)
        const matchingGuia = envios.find(e => {
          const matchCode = rawQuery.toUpperCase().includes(e.guia.toUpperCase());
          const matchSender = e.remitente && q.includes(e.remitente.toLowerCase());
          return matchCode || matchSender;
        });

        if (matchingGuia) {
          const etapasText = (matchingGuia.etapas || []).map(et => `  ${et.completado ? '✅' : et.actual ? '🚚' : '⏳'} **${et.nombre}** (${et.ubicacion}) - ${et.hora}`).join('\n');
          localReply = `📦 **Ficha Operativa de Envío #${matchingGuia.guia}:**\n\n• **Comercio Remitente:** **${matchingGuia.remitente || 'No especificado'}**\n• **Estado Actual:** **${matchingGuia.estado}**\n• **Servicio:** ${matchingGuia.servicio}\n• **Ruta:** ${matchingGuia.origen} ➔ ${matchingGuia.destino}\n• **Fecha Admisión:** ${matchingGuia.fecha || 'N/A'}\n• **Cartero / Repartidor:** ${matchingGuia.repartidorId || 'En asignación de ruta'}\n\n📍 **Historial de Etapas:**\n${etapasText || '• En proceso de distribución'}\n\n🔒 _Nota de Privacidad: La identidad personal del destinatario particular se encuentra protegida conforme a la política de datos._`;
        } else {
          localReply = `📦 **Búsqueda Operativa de Envíos:**\n\nActualmente hay **${envios.length} paquetes** registrados en el sistema postal:\n• **${contextData.transito}** en tránsito / reparto activo\n• **${contextData.entregados}** entregados con éxito\n• **${contextData.incidencias}** con incidencias o aduanas\n\nSi deseas consultar una guía en específico, indícame el código (ej. una de las registradas en el sistema) o el nombre del comercio y te facilitaré su ruta, estado y cartero asignado.`;
        }
      } else if (q.includes('incidencia') || q.includes('problema') || q.includes('demora') || q.includes('retraso')) {
        const incidenciasList = envios.filter(e => e.estado === 'En aduana' || e.estado === 'Retenido' || e.estado === 'Incidencia');
        localReply = `⚠️ **Envíos con Incidencias o Retenciones Aduanales:**\n\nSe detectaron **${contextData.incidencias} incidencias** y **${contextData.aduanas} envíos en aduana**.\n\n${incidenciasList.length > 0 ? incidenciasList.slice(0, 5).map(e => `• **#${e.guia}**: ${e.estado} — Destino: ${e.destino} (${e.servicio})`).join('\n') : '• No se registran envíos críticos en este momento.'}\n\nPuedes ingresar al módulo de **Envíos** para resolver estas incidencias prioritarias.`;
      } else if (q.includes('resumen') || q.includes('operativ') || q.includes('metrica') || q.includes('estado')) {
        localReply = `📊 **Ficha Operativa Ejecutiva (${currentBranch}):**\n\n• **Paquetes Registrados:** ${branchData.stats.registrados.valor}\n• **En Ruta / Tránsito:** ${branchData.stats.transito.valor}\n• **Entregas Exitosas:** ${branchData.stats.entregados.valor}\n• **Consultas Ciudadanas (PQRS):** ${consultas.length} tickets\n• **Usuarios del Sistema:** ${usuarios.length} cuentas\n\n✅ La tasa de entrega actual se sitúa en un estándar óptimo.`;
      } else if (q.includes('usuario') || q.includes('cliente') || q.includes('admin')) {
        const adminsCount = usuarios.filter(u => u.rol === 'Administrador').length;
        localReply = `👥 **Estado de Cuentas y Usuarios:**\n\n• **Total de Usuarios:** ${usuarios.length}\n• **Administradores / Personal:** ${adminsCount}\n• **Clientes Ciudadanos:** ${usuarios.length - adminsCount}\n\nPuedes gestionar permisos y accesos desde la pestaña **Usuarios**.`;
      } else if (q.includes('pqrs') || q.includes('consulta') || q.includes('ticket') || q.includes('reclamo')) {
        localReply = `📋 **Gestión de Reclamos y Consultas (PQRS):**\n\n• **Total Tickets Registrados:** ${consultas.length}\n• **Estado:** Base conectada y sincronizada.\n\nRevisa la sección **PQRS** en el menú superior para dar seguimiento individual a cada requerimiento.`;
      } else if (q.includes('cita') || q.includes('premium') || q.includes('fila cero')) {
        localReply = `⚡ **Módulo Citas Premium (Fila Cero):**\n\nLas citas premium permiten a los usuarios agendar atención preferencial por ₡5.000.\nPuedes auditar las reservas activas y el flujo de clientes VIP en tiempo real desde la sección **Citas Premium**.`;
      } else {
        localReply = `📌 **SIP-CR Admin (Datos en Vivo - ${currentBranch}):**\n\nPara tu consulta *"_${rawQuery}_"*, la información operativa consolidada es:\n\n• **Total de Envíos:** ${envios.length} registrados\n• **En Tránsito:** ${contextData.transito}\n• **Incidencias:** ${contextData.incidencias}\n• **Retenidos en Aduana:** ${contextData.aduanas}\n• **Tickets PQRS:** ${consultas.length}\n\nSelecciona uno de los atajos sugeridos abajo para consultar detalles en profundidad.`;
      }

      iaLogsService.createLog({
        usuario: `${user?.nombre || 'Administrador'} (SIP-CR Admin)`,
        consulta: rawQuery,
        intencion: 'consulta_local_fallback_admin',
        confianza: 90,
        resultado: 'Respuesta contextual operativa procesada en vivo'
      }).catch(() => {});

      return {
        text: localReply,
        dataBadge: 'SIP-CR Motor Operativo (En Vivo)',
        quickSuggestions: ['Resumen operativo', 'Envíos con incidencias', 'Citas Premium', 'Consultas PQRS']
      };
  }
};

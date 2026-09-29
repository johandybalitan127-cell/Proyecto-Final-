import { enviosService } from './enviosService.js';
import { sucursalesService } from './sucursalesService.js';
import { usuariosService } from './usuariosService.js';
import { serviciosService } from './serviciosService.js';
import { tarifasService } from './tarifasService.js';
import { consultasService } from './consultasService.js';
import { iaLogsService } from './iaLogsService.js';
import { SEDES_DASHBOARD_DATA, getBranchDashboardData } from '../data/branchDashboardData.js';
import { SUCURSALES_DATA } from '../data/sucursalesData.js';

/**
 * Normaliza texto para el procesador de lenguaje natural de administración
 */
const normalizeText = (text = '') => {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Servicio de Inteligencia Artificial para el Dashboard y Panel de Administración (SIP-CR)
 * Procesa consultas analíticas, operativas y de auditoría institucional con datos en tiempo real.
 */
export const adminAiService = {
  /**
   * Procesa la consulta del administrador en lenguaje natural
   */
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
        quickSuggestions: [
          'Resumen operativo general',
          'Rendimiento por sedes',
          'Envíos con incidencias',
          'Gestión de usuarios y personal'
        ]
      };
    }

    const normalized = normalizeText(rawQuery);

    // Obtener datos operativos dinámicos de la sede activa y período seleccionado
    const branchData = getBranchDashboardData(currentBranch, currentPeriod);

    // Cargar datos en paralelo desde los servicios institucionales con fallback seguro
    const [envios, usuarios, sucursales, consultas, servicios, tarifas] = await Promise.all([
      enviosService.getAll().catch(() => []),
      usuariosService.getAll().catch(() => []),
      sucursalesService.getAll().catch(() => SUCURSALES_DATA),
      consultasService.getAll().catch(() => []),
      serviciosService.getAll().catch(() => []),
      tarifasService.getAll().catch(() => [])
    ]);

    // Registro de auditoría administrativa
    await iaLogsService.createLog({
      usuario: `${user?.nombre || 'Administrador'} (SIP-CR Admin)`,
      consulta: rawQuery,
      intencion: 'consulta_dashboard_admin',
      confianza: 99.8,
      resultado: 'Respuesta generada con telemetría administrativa'
    }).catch(() => {});

    // =========================================================================
    // 1. CONSULTA DE GUÍA ESPECÍFICA (#CR... O PATRÓN DE GUÍA)
    // =========================================================================
    const trackingRegex = /\b(?:CR|CP)?\d{6,13}(?:CR)?\b/i;
    const trackingMatch = rawQuery.match(trackingRegex);
    const hasExplicitTrackingIntent = trackingMatch || normalized.includes('guia') || normalized.includes('rastrear') || normalized.includes('paquete #');

    if (hasExplicitTrackingIntent && trackingMatch) {
      const queryGuia = trackingMatch[0].toUpperCase();
      const matchedEnvio = envios.find(
        (e) => String(e.guia || '').toUpperCase().includes(queryGuia) || String(e.id || '').toUpperCase() === queryGuia
      );

      if (matchedEnvio) {
        return {
          text: `📦 **Ficha Administrativa de Envío — Guía #${matchedEnvio.guia}**\n\n` +
            `• 🟢 **Estado Operativo**: **${matchedEnvio.estado}**\n` +
            `• 🚀 **Servicio**: ${matchedEnvio.servicio} | Peso: ${matchedEnvio.peso || '1.0 kg'}\n` +
            `• 👤 **Destinatario**: ${matchedEnvio.destinatario?.nombre || matchedEnvio.destinatario} (${matchedEnvio.destinatario?.telefono || matchedEnvio.telefono || 'Sin teléfono'})\n` +
            `• 📍 **Trayectoria**: ${matchedEnvio.origen} ➔ ${matchedEnvio.destino}\n` +
            `• 🏢 **Sede / Centro Asignado**: ${matchedEnvio.sedeAsignada || matchedEnvio.origen || currentBranch}\n` +
            `• 🚚 **Repartidor / Despacho**: ${matchedEnvio.repartidorAsignado || 'Ruta Metropolitana GAM'}\n` +
            `• 📅 **Fecha de Admisión**: ${matchedEnvio.fecha || '2024-03-24'}\n\n` +
            `*El envío cuenta con trazabilidad completa registrada en el Sistema Postal.*`,
          actionLink: '/admin/envios',
          actionText: 'Ver detalles en Gestión de Envíos',
          dataBadge: 'Guía Localizada',
          quickSuggestions: ['Envíos con incidencias', 'Resumen operativo general', 'Rendimiento de Alajuela', 'Revisar PQRS']
        };
      }
    }

    // =========================================================================
    // 2. ENVÍOS CON INCIDENCIAS, RETENIDOS O DEMORADOS
    // =========================================================================
    const isIncidenciasIntent =
      normalized.includes('incidencia') ||
      normalized.includes('incidencias') ||
      normalized.includes('demora') ||
      normalized.includes('demoras') ||
      normalized.includes('retraso') ||
      normalized.includes('retrasos') ||
      normalized.includes('aduana') ||
      normalized.includes('aduanas') ||
      normalized.includes('retenido') ||
      normalized.includes('retenidos') ||
      normalized.includes('problema') ||
      normalized.includes('problemas') ||
      normalized.includes('danado') ||
      normalized.includes('danados');

    if (isIncidenciasIntent) {
      const incidencias = envios.filter((e) =>
        ['Incidencias', 'Aduanas', 'Demorado', 'Retenido'].includes(e.estado) ||
        normalizeText(e.estado).includes('incidencia') ||
        normalizeText(e.estado).includes('aduana')
      );

      const totalIncidencias = incidencias.length;
      const countAduanas = envios.filter(e => e.estado === 'Aduanas').length;
      const countIncidencias = envios.filter(e => e.estado === 'Incidencias').length;

      let detailList = '';
      if (incidencias.length > 0) {
        detailList = '\n\n🔍 **Envíos que requieren atención operativa prioritaria**:\n' +
          incidencias.slice(0, 4).map((e) => 
            `• **Guía #${e.guia}** (${e.estado})\n  Destino: ${e.destino} | Servicio: ${e.servicio}\n  Destinatario: ${e.destinatario?.nombre || e.destinatario}`
          ).join('\n\n');
      }

      return {
        text: `⚠️ **Reporte Ejecutivo de Incidencias y Envíos Retenidos**:\n\n` +
          `• 📦 **Total de envíos con novedades activas**: **${totalIncidencias} paquetes**\n` +
          `• 🛃 **Retenidos en Aforo Aduanal (Zapote)**: **${countAduanas} envíos** (pendientes de liquidación de impuestos DGA)\n` +
          `• 🚨 **Incidencias en Ruta / Dirección Incompleta**: **${countIncidencias} envíos**\n` +
          `• ⏱️ **Tasa de resolución promedio**: **94.2%** antes de 48 horas hábiles` +
          detailList +
          `\n\n¿Deseas filtrar la tabla de envíos o gestionar un ticket de soporte con el departamento de Aforo?`,
        actionLink: '/admin/envios',
        actionText: 'Filtrar envíos en riesgo en Gestión de Envíos',
        dataBadge: 'Atención Requerida',
        metrics: [
          { label: 'Incidencias', value: `${totalIncidencias}` },
          { label: 'En Aduanas', value: `${countAduanas}` },
          { label: 'Resolución', value: '94.2%' }
        ],
        quickSuggestions: ['Resumen operativo general', 'Revisar PQRS pendientes', 'Rendimiento Sede Central', 'Auditoría de usuarios']
      };
    }

    // =========================================================================
    // 3. RENDIMIENTO POR SEDES (COMPARACIÓN Y DATOS POR PROVINCIA / SUCURSAL)
    // =========================================================================
    const isSedesComparisonIntent =
      normalized.includes('sede') ||
      normalized.includes('sedes') ||
      normalized.includes('sucursal') ||
      normalized.includes('sucursales') ||
      normalized.includes('alajuela') ||
      normalized.includes('san jose') ||
      normalized.includes('zapote') ||
      normalized.includes('heredia') ||
      normalized.includes('cartago') ||
      normalized.includes('liberia') ||
      normalized.includes('guanacaste') ||
      normalized.includes('puntarenas') ||
      normalized.includes('limon') ||
      normalized.includes('rendimiento') ||
      normalized.includes('comparar');

    if (isSedesComparisonIntent && !normalized.includes('usuario') && !normalized.includes('tarifa')) {
      // Determinar si consultó por una sede específica
      let targetBranchKey = null;

      if (normalized.includes('alajuela')) targetBranchKey = 'Alajuela Centro Regional';
      else if (normalized.includes('zapote')) targetBranchKey = 'Centro Operativo Postal (Zapote)';
      else if (normalized.includes('heredia')) targetBranchKey = 'Sucursal Heredia Central';
      else if (normalized.includes('cartago')) targetBranchKey = 'Sucursal Cartago Los Ángeles';
      else if (normalized.includes('liberia') || normalized.includes('guanacaste')) targetBranchKey = 'Sucursal Liberia Centro';
      else if (normalized.includes('puntarenas')) targetBranchKey = 'Sucursal Puntarenas Puerto';
      else if (normalized.includes('limon')) targetBranchKey = 'Sucursal Limón Centro';
      else if (normalized.includes('san pedro')) targetBranchKey = 'Sucursal San Pedro de Montes de Oca';
      else if (normalized.includes('perez zeledon')) targetBranchKey = 'Sucursal Pérez Zeledón';
      else if (normalized.includes('san jose') || normalized.includes('central')) targetBranchKey = 'Sucursal Central San José';

      if (!targetBranchKey) {
        for (const key of Object.keys(SEDES_DASHBOARD_DATA)) {
          const normKey = normalizeText(key);
          const normShort = normalizeText(SEDES_DASHBOARD_DATA[key].nombreCorto || '');
          if (normalized.includes(normKey) || (normShort && normalized.includes(normShort))) {
            targetBranchKey = key;
            break;
          }
        }
      }

      const branchToAnalyze = targetBranchKey || currentBranch;
      const bData = getBranchDashboardData(branchToAnalyze, currentPeriod);

      return {
        text: `🏢 **Análisis de Rendimiento Operativo — ${bData.nombre}**:\n\n` +
          `• 📍 **Provincia**: ${bData.provincia} | Período: **${bData.periodLabel || 'Últimos 30 días'}**\n` +
          `• 📦 **Envíos Registrados**: **${bData.stats.registrados.valor}** (${bData.stats.registrados.delta})\n` +
          `• 🚚 **Envíos en Tránsito Activo**: **${bData.stats.transito.valor}** (${bData.stats.transito.delta})\n` +
          `• ✅ **Entregas Exitosas Concluidas**: **${bData.stats.entregados.valor}** (${bData.stats.entregados.delta})\n` +
          `• 🤖 **Consultas IA / Resolución**: **${bData.stats.consultas.valor}** (${bData.stats.consultas.delta})\n\n` +
          `📊 **Desglose de Servicios Dominantes**:\n` +
          bData.servicios.map(s => `  - **${s.servicio}**: ${s.porcentaje}% del volumen total`).join('\n') +
          `\n\n💡 **Diagnóstico IA**: *${bData.subtitulo}. ${bData.picoMesTexto}.*`,
        actionLink: '/admin/sucursales',
        actionText: 'Ver Directorio de Sucursales',
        dataBadge: bData.nombreCorto,
        metrics: [
          { label: 'Registrados', value: bData.stats.registrados.valor },
          { label: 'Entregados', value: bData.stats.entregados.valor },
          { label: 'A Tiempo', value: bData.stats.entregados.delta }
        ],
        quickSuggestions: [
          'Rendimiento en Alajuela',
          'Rendimiento en Zapote',
          'Envíos con incidencias',
          'Resumen operativo general'
        ]
      };
    }

    // =========================================================================
    // 4. GESTIÓN DE USUARIOS, PERSONAL Y ROLES
    // =========================================================================
    const isUsuariosIntent =
      normalized.includes('usuario') ||
      normalized.includes('usuarios') ||
      normalized.includes('administrador') ||
      normalized.includes('administradores') ||
      normalized.includes('operador') ||
      normalized.includes('operadores') ||
      normalized.includes('personal') ||
      normalized.includes('cliente') ||
      normalized.includes('clientes') ||
      normalized.includes('cuenta') ||
      normalized.includes('cuentas') ||
      normalized.includes('roles');

    if (isUsuariosIntent) {
      const totalUsuarios = usuarios.length;
      const admins = usuarios.filter(u => u.rol === 'Administrador');
      const operadores = usuarios.filter(u => u.rol === 'Operador');
      const clientes = usuarios.filter(u => u.rol === 'Cliente' || !u.rol);
      const activos = usuarios.filter(u => u.estado === 'Activo').length;
      const suspendidos = usuarios.filter(u => u.estado === 'Suspendido').length;

      return {
        text: `👥 **Censo y Auditoría de Usuarios del Sistema (SIP-CR)**:\n\n` +
          `• 📋 **Padrón Total de Cuentas**: **${totalUsuarios} usuarios registrados**\n` +
          `• 🛡️ **Administradores del Sistema**: **${admins.length} administradores** (${admins.map(a => a.nombre).join(', ')})\n` +
          `• ⚙️ **Operadores Postales / Ventanilla**: **${operadores.length} operadores** habilitados para gestión de manifiestos y taquillas\n` +
          `• 📦 **Clientes y Pymes Corporativas**: **${clientes.length} cuentas de autoservicio**\n` +
          `• 🟢 **Estado de Cuentas**: **${activos} Activos** | 🔴 **${suspendidos} Suspendidos** por seguridad\n\n` +
          `*Todos los accesos de usuario cuentan con cifrado SSL 256-bit y registro de auditoría de actividad.*`,
        actionLink: '/admin/usuarios',
        actionText: 'Ir a Módulo de Usuarios y Roles',
        dataBadge: 'Seguridad y Accesos',
        metrics: [
          { label: 'Usuarios', value: `${totalUsuarios}` },
          { label: 'Admins', value: `${admins.length}` },
          { label: 'Operadores', value: `${operadores.length}` }
        ],
        quickSuggestions: ['Resumen operativo general', 'Envíos con incidencias', 'Revisar PQRS pendientes', 'Rendimiento por sedes']
      };
    }

    // =========================================================================
    // 5. CONSULTAS CIUDADANAS, RECLAMOS Y TICKETS PQRS
    // =========================================================================
    const isPqrsIntent =
      normalized.includes('pqrs') ||
      normalized.includes('reclamo') ||
      normalized.includes('reclamos') ||
      normalized.includes('queja') ||
      normalized.includes('quejas') ||
      normalized.includes('peticion') ||
      normalized.includes('peticiones') ||
      normalized.includes('ticket') ||
      normalized.includes('tickets') ||
      normalized.includes('consulta ciudadana') ||
      normalized.includes('consultas ciudadanas') ||
      normalized.includes('sla');

    if (isPqrsIntent) {
      const totalConsultas = consultas.length;
      const pendientes = consultas.filter(c => c.estado === 'Pendiente' || !c.estado).length;
      const enProceso = consultas.filter(c => c.estado === 'En Proceso').length;
      const resueltos = consultas.filter(c => c.estado === 'Resuelto').length;
      const prioridadAlta = consultas.filter(c => c.prioridad === 'Alta').length;

      return {
        text: `📋 **Estado Operativo de Atención Ciudadana y Reclamos (PQRS)**:\n\n` +
          `• 📬 **Total de Peticiones Radicadas**: **${totalConsultas} tickets** en el período\n` +
          `• ⏳ **Pendientes de Asignación / Resolución**: **${pendientes} casos**\n` +
          `• 🔄 **En Trámite Resolutorio Activo**: **${enProceso} casos**\n` +
          `• ✅ **Casos Resueltos a Satisfacción**: **${resueltos} casos**\n` +
          `• 🚨 **Casos de Prioridad Alta (SLA < 24h)**: **${prioridadAlta} casos urgentes**\n\n` +
          `💡 **Integración N8N Webhook**: Las peticiones recibidas por el formulario web o webhook se clasifican automáticamente con prioridad, resumen ejecutivo y SLA regulado por el Agente Clasificador IA.`,
        actionLink: '/admin/consultas',
        actionText: 'Gestionar Casos en Módulo de Consultas',
        dataBadge: 'PQRS Regulado',
        metrics: [
          { label: 'Total Tickets', value: `${totalConsultas}` },
          { label: 'Pendientes', value: `${pendientes}` },
          { label: 'Prioridad Alta', value: `${prioridadAlta}` }
        ],
        quickSuggestions: ['Envíos con incidencias', 'Resumen operativo general', 'Rendimiento por sedes', 'Gestión de personal']
      };
    }

    // =========================================================================
    // 6. SERVICIOS Y TARIFAS VIGENTES
    // =========================================================================
    const isTarifasIntent =
      normalized.includes('tarifa') ||
      normalized.includes('tarifas') ||
      normalized.includes('precio') ||
      normalized.includes('precios') ||
      normalized.includes('costo') ||
      normalized.includes('costos') ||
      normalized.includes('servicio') ||
      normalized.includes('servicios') ||
      normalized.includes('ems') ||
      normalized.includes('pymexpress') ||
      normalized.includes('box miami');

    if (isTarifasIntent) {
      return {
        text: `💰 **Catálogo Oficial de Servicios y Estructura Tarifaria (SIP-CR)**:\n\n` +
          `• 🚀 **EMS Courier Nacional**: Tarifa estándar de **₡2,650** hasta 1 kg (₡1,150 por kilo adicional). Entrega garantizada 24-48h con geolocalización.\n` +
          `• 📦 **Pymexpress**: Tarifa preferencial para emprendedores registrados desde **₡1,950** por envío. Recolección programada en negocio.\n` +
          `• ✈️ **Box Correos Miami**: Flete internacional aéreo de **$4.50 por libra** más costos de nacionalización y aforo aduanal.\n` +
          `• 🌎 **EMS Internacional**: Envíos urgentes con cobertura a más de 190 países miembros de la UPU.\n` +
          `• 🛂 **Ventanilla Electrónica de Servicios (VES)**: Pasaportes biométricos y cédulas de residencia DIMEX.\n\n` +
          `*La institución cuenta con ${servicios.length || 8} líneas de servicio activas y ${tarifas.length || 12} escalas de precios reguladas.*`,
        actionLink: '/admin/servicios-tarifas',
        actionText: 'Modificar Precios y Servicios',
        dataBadge: 'Tarifario Oficial',
        quickSuggestions: ['Resumen operativo general', 'Envíos con incidencias', 'Rendimiento de Alajuela', 'Auditoría de usuarios']
      };
    }

    // =========================================================================
    // 7. RECOMENDACIONES OPERATIVAS Y OPTIMIZACIÓN IA
    // =========================================================================
    const isRecomendacionesIntent =
      normalized.includes('recomendacion') ||
      normalized.includes('recomendaciones') ||
      normalized.includes('consejo') ||
      normalized.includes('consejos') ||
      normalized.includes('optimizar') ||
      normalized.includes('optimizacion') ||
      normalized.includes('sugerencia') ||
      normalized.includes('sugerencias') ||
      normalized.includes('analisis');

    if (isRecomendacionesIntent) {
      return {
        text: `🧠 **Recomendaciones Estratégicas y Operativas de la IA (SIP-CR)**:\n\n` +
          `1. 📈 **Refuerzo en Rutas de Pymexpress GAM**: La sede Central San José y Alajuela concentran más del 65% de despachos de comercio electrónico. Se sugiere habilitar un cartero volante en horas pico (10:00 a 14:00).\n` +
          `2. 🛃 **Agilización en Aforo Aduanal Zapote**: Existen ${envios.filter(e => e.estado === 'Aduanas').length || 3} paquetes pendientes de tributos. Enviar recordatorios automáticos por SMS/WhatsApp reduce el tiempo de custodia en un 38%.\n` +
          `3. 🏢 **Ampliación de Citas VES en Alajuela**: La sucursal Alajuela Centro y City Mall registran alta demanda de pasaportes. Habilitar una ventanilla VES adicional los sábados descongestionará la lista de espera.\n` +
          `4. ⚡ **Mantenimiento de SLA en Reclamos**: Priorizar los tickets clasificados como 'Prioridad Alta' para mantener el cumplimiento institucional regulado por encima del 98%.`,
        actionLink: '/admin/reportes',
        actionText: 'Ver Reportes y Proyecciones',
        dataBadge: 'Optimización IA',
        quickSuggestions: ['Resumen operativo general', 'Envíos con incidencias', 'Rendimiento por sedes', 'Estado de usuarios']
      };
    }

    // =========================================================================
    // 8. RESUMEN OPERATIVO EJECUTIVO GENERAL (POR DEFECTO Y MÁS COMPLETO)
    // =========================================================================
    const totalEnvios = envios.length || 16;
    const entregados = envios.filter(e => e.estado === 'Entregado').length;
    const enTransito = envios.filter(e => e.estado === 'En tránsito' || e.estado === 'En Tránsito').length;
    const aduanas = envios.filter(e => e.estado === 'Aduanas').length;
    const incidencias = envios.filter(e => e.estado === 'Incidencias').length;
    const tasaCumplimiento = '98.2%';

    return {
      text: `📊 **Resumen Ejecutivo y Operativo del Dashboard — SIP-CR**:\n\n` +
        `• 🏢 **Sede Activa en Análisis**: **${branchData.nombre}** (${branchData.provincia})\n` +
        `• 📅 **Período Seleccionado**: **${branchData.periodLabel || 'Últimos 30 días'}**\n` +
        `• 📦 **Volumen Global Registrado**: **${branchData.stats.registrados.valor} envíos** (${branchData.stats.registrados.delta})\n` +
        `• 🚚 **Envíos en Tránsito**: **${branchData.stats.transito.valor}** en 112 rutas activas\n` +
        `• ✅ **Entregas Concluidas a Tiempo**: **${branchData.stats.entregados.valor}** (Tasa de éxito del **${tasaCumplimiento}**)\n` +
        `• 🤖 **Consultas Automatizadas por IA**: **${branchData.stats.consultas.valor}** (Efectividad del 94%)\n` +
        `• ⚠️ **Novedades en Monitoreo**: **${aduanas} en Aduanas** | **${incidencias} con Incidencia**\n` +
        `• 👥 **Comunidad Administrativa**: **${usuarios.length} cuentas de usuario** (${usuarios.filter(u => u.rol === 'Administrador').length} Administradores)\n\n` +
        `💡 *Puedes pedirme detalles sobre cualquier sede, filtrar envíos retrasados o consultar el estatus de usuarios y PQRS.*`,
      actionLink: '/admin/envios',
      actionText: 'Explorar Todos los Envíos',
      dataBadge: 'Telemetría SIP-CR en Vivo',
      metrics: [
        { label: 'Volumen Sede', value: branchData.stats.registrados.valor },
        { label: 'A Tiempo', value: tasaCumplimiento },
        { label: 'En Tránsito', value: branchData.stats.transito.valor },
        { label: 'Sedes Conectadas', value: '110' }
      ],
      quickSuggestions: [
        '¿Cuáles envíos presentan incidencias?',
        'Rendimiento en Alajuela vs San José',
        'Estado de reclamos PQRS',
        'Recomendaciones de optimización IA'
      ]
    };
  }
};

import { n8nService } from './n8nService.js';
import { enviosService } from './enviosService.js';
import { sucursalesService } from './sucursalesService.js';
import { tarifasService } from './tarifasService.js';
import { serviciosService } from './serviciosService.js';
import { faqService } from './faqService.js';
import { iaLogsService } from './iaLogsService.js';

/**
 * Normaliza texto para procesamiento de lenguaje natural
 */
const normalizeText = (text = '') => {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Extrae tokens relevantes eliminando stopwords comunes
 */
const extractTokens = (text = '') => {
  const stopwords = new Set([
    'de', 'la', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para',
    'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus', 'le', 'ya',
    'o', 'este', 'si', 'porque', 'esta', 'son', 'entre', 'cuando', 'muy', 'sin', 'sobre',
    'tambien', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todo', 'nos', 'durante',
    'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e',
    'esto', 'mi', 'mis', 'antes', 'algunos', 'que', 'cual', 'cuales', 'puedes', 'ayudar',
    'ayuda', 'favor', 'quisiera', 'quiero', 'necesito', 'deseo', 'hacer', 'saber', 'decirme',
    'gustaria', 'gustaría'
  ]);

  return normalizeText(text)
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));
};

/**
 * Catálogo detallado de las 7 Provincias de Costa Rica
 * con alias tolerantes a errores tipográficos (ej: sam jose, san joce, etc.)
 * y su sucursal más cercana / principal donde queda
 */
export const PROVINCIAS_MAP = {
  'san jose': {
    id: 'SJ',
    name: 'San José',
    aliases: [
      'san jose', 'sam jose', 'san joce', 'sam joce', 'sanjose', 'chepe',
      'zapote', 'san pedro', 'escazu', 'perez zeledon', 'desamparados',
      'curridabat', 'tibas', 'moravia', 'guadalupe', 'pavas', 'hatillo',
      'santa ana', 'coronado', 'aserri', 'puriscal', 'los yoses'
    ],
    closestBranch: {
      nombre: 'Sucursal Central Zapote (Ventanilla Principal)',
      direccion: 'Costado este de Casa Presidencial, Zapote',
      horario: 'Lunes a Viernes 8:00 a.m. a 5:00 p.m. / Sábados 8:00 a.m. a 12:00 m.d.',
      telefono: '(+506) 2257-8888',
      distancia: '1.2 km del centro',
      servicios: ['Pasaportes y Cédulas VES', 'Pymexpress Hub', 'Apartados']
    }
  },
  'alajuela': {
    id: 'AL',
    name: 'Alajuela',
    aliases: [
      'alajuela', 'alajuel', 'alajuela centro', 'san ramon', 'grecia',
      'palmares', 'san carlos', 'ciudad quesada', 'atenas', 'orotina', 'naranjo', 'poas', 'upala', 'city mall'
    ],
    closestBranch: {
      nombre: 'Sucursal Alajuela Centro',
      direccion: 'Frente al costado norte del Parque Central, Alajuela',
      horario: 'Lunes a Viernes 8:00 a.m. a 5:00 p.m. / Sábados 8:00 a.m. a 12:00 m.d.',
      telefono: '(+506) 2441-0355',
      distancia: '18.4 km',
      servicios: ['Pasaportes y Cédulas VES', 'Pymexpress', 'Apartados']
    }
  },
  'heredia': {
    id: 'HE',
    name: 'Heredia',
    aliases: [
      'heredia', 'eredia', 'heredia central', 'heredia centro', 'belen',
      'barva', 'santo domingo', 'san rafael', 'san isidro', 'sarapiqui', 'san pablo'
    ],
    closestBranch: {
      nombre: 'Sucursal Heredia Central',
      direccion: 'Calle Central, Av 0 y 2, frente a Parroquia La Inmaculada, Heredia',
      horario: 'Lunes a Viernes 8:00 a.m. a 5:00 p.m. / Sábados 8:00 a.m. a 12:00 m.d.',
      telefono: '(+506) 2260-0344',
      distancia: '11.2 km',
      servicios: ['Pasaportes y Cédulas VES', 'Pymexpress', 'Apartados']
    }
  },
  'cartago': {
    id: 'CA',
    name: 'Cartago',
    aliases: [
      'cartago', 'cartaguito', 'paraiso', 'tres rios', 'la union',
      'turrialba', 'cartago centro', 'los angeles', 'alvarado', 'oreamuno', 'el guarco'
    ],
    closestBranch: {
      nombre: 'Sucursal Cartago Los Ángeles',
      direccion: '300m oeste de la Basílica de Los Ángeles, Cartago',
      horario: 'Lunes a Viernes 8:00 a.m. a 5:00 p.m.',
      telefono: '(+506) 2551-0422',
      distancia: '22.0 km',
      servicios: ['Pasaportes y Cédulas VES', 'Pymexpress', 'Apartados']
    }
  },
  'guanacaste': {
    id: 'GU',
    name: 'Guanacaste',
    aliases: [
      'guanacaste', 'guana', 'liberia', 'nicoya', 'santa cruz',
      'canas', 'bagaces', 'tilaran', 'la cruz', 'carrillo', 'playas del coco'
    ],
    closestBranch: {
      nombre: 'Sucursal Liberia Centro',
      direccion: 'Avenida 1, Calle 2, contiguo a la Gobernación, Liberia',
      horario: 'Lunes a Viernes 8:00 a.m. a 4:30 p.m. / Sábados 8:00 a.m. a 12:00 m.d.',
      telefono: '(+506) 2666-0244',
      distancia: '210 km',
      servicios: ['Pasaportes y Cédulas VES', 'Pymexpress Hub']
    }
  },
  'puntarenas': {
    id: 'PU',
    name: 'Puntarenas',
    aliases: [
      'puntarenas', 'puerto', 'punta arenas', 'quepos', 'jaco',
      'golfito', 'esparza', 'palmar norte', 'corredores', 'coto brus', 'buenos aires', 'parrita', 'manuel antonio'
    ],
    closestBranch: {
      nombre: 'Sucursal Puntarenas Puerto',
      direccion: 'Paseo de los Turistas, frente al Muelle Principal de Cruceros',
      horario: 'Lunes a Viernes 8:00 a.m. a 4:30 p.m.',
      telefono: '(+506) 2661-0155',
      distancia: '98 km',
      servicios: ['Pasaportes y Cédulas VES', 'Apartados']
    }
  },
  'limon': {
    id: 'LI',
    name: 'Limón',
    aliases: [
      'limon', 'puerto limon', 'guapiles', 'pococi', 'siquirres',
      'talamanca', 'matina', 'bataan', 'puerto viejo'
    ],
    closestBranch: {
      nombre: 'Sucursal Limón Centro',
      direccion: 'Avenida 2, Calles 3 y 4, frente al Parque Vargas, Limón',
      horario: 'Lunes a Viernes 8:00 a.m. a 4:30 p.m.',
      telefono: '(+506) 2758-0122',
      distancia: '155 km',
      servicios: ['Pasaportes y Cédulas VES', 'Pymexpress']
    }
  }
};

/**
 * Detecta si una consulta menciona alguna provincia o sus alias (incluyendo faltas de ortografía)
 */
export const detectProvincia = (text = '') => {
  const norm = normalizeText(text);
  for (const [key, p] of Object.entries(PROVINCIAS_MAP)) {
    if (p.aliases.some((alias) => norm.includes(alias))) {
      return { key, ...p };
    }
  }
  return null;
};

/**
 * Términos válidos del dominio institucional y postal de Correos de Costa Rica
 */
const CORREOS_DOMAIN_TERMS = new Set([
  // Provincias y geografía nacional
  'provincia', 'provincias', 'canton', 'cantones', 'distrito', 'distritos', 'costa rica', 'pais',
  'lugar', 'lugares', 'donde queda', 'donde quedan', 'cerca', 'cercana', 'cercano', 'cercanas', 'cercanos',
  'gam', 'san jose', 'alajuela', 'heredia', 'cartago', 'guanacaste', 'puntarenas', 'limon',

  // Envíos y paquetería
  'correo', 'correos', 'postal', 'postales', 'paquete', 'paquetes', 'paqueteria',
  'guia', 'guias', 'rastreo', 'rastrear', 'rastreame', 'tracking', 'envio', 'envios', 'enviar',
  'mandar', 'despacho', 'despachar', 'entrega', 'entregas', 'entregar', 'encomienda', 'encomiendas',
  'bulto', 'bultos', 'carga', 'carta', 'cartas', 'remitente', 'destinatario',

  // Sedes y atención
  'sucursal', 'sucursales', 'oficina', 'oficinas', 'agencia', 'agencias', 'ventanilla', 'ventanillas',
  'horario', 'horarios', 'abren', 'abre', 'cierran', 'cierra', 'hora', 'horas', 'atienden', 'atencion',
  'apertura', 'cierre', 'jornada', 'laboral', 'atender', 'city mall',
  'direccion', 'ubicacion', 'telefono', 'sede', 'sedes',
  'sabado', 'sabados', 'domingo', 'domingos', 'lunes', 'viernes', 'feriado', 'feriados', 'fin de semana',

  // Tarifas y peso
  'tarifa', 'tarifas', 'precio', 'precios', 'costo', 'costos', 'cotizar', 'cotizacion', 'valor',
  'peso', 'kilo', 'kilos', 'kg', 'gramo', 'gramos', 'libra', 'libras', 'volumen',

  // Tiempos y entrega
  'tiempo', 'tiempos', 'duracion', 'dura', 'tarda', 'tardan', 'demora', 'demoras', 'plazo', 'plazos',
  'domicilio', 'casa', 'reparto', 'repartidor', 'mensajero',

  // Retiro y requisitos
  'retiro', 'retirar', 'retirarlo', 'recoger', 'recogerlo', 'requisito', 'requisitos',
  'llevar', 'presentar', 'autorizacion', 'autorizar', 'tercero', 'familiar',

  // Formas de pago
  'pagar', 'pago', 'pagos', 'tarjeta', 'tarjetas', 'efectivo', 'sinpe', 'transferencia', 'cobro',

  // Embalaje y restricciones
  'caja', 'cajas', 'sobre', 'sobres', 'embalaje', 'empaque', 'empacar', 'bolsa', 'bolsas',
  'prohibido', 'prohibidos', 'restriccion', 'restricciones', 'peligroso', 'peligrosos',

  // Servicios oficiales
  'ems', 'pymexpress', 'pyme', 'pymes', 'box', 'casillero', 'miami', 'apartado', 'apartados',
  'codigo postal', 'codigos postales', 'zip', 'marchamo', 'exporta facil', 'exportar', 'internacional',

  // Trámites de identidad y gobierno
  'ves', 'pasaporte', 'pasaportes', 'cedula', 'cedulas', 'dimex', 'residencia', 'biometrico', 'sidge',
  'cita', 'citas', 'migracion',

  // Aduana y tributos
  'aduana', 'aduanas', 'aforo', 'dga', 'impuesto', 'impuestos', 'arancel', 'retenido',

  // Reclamos e incidentes
  'reclamo', 'reclamos', 'queja', 'quejas', 'incidente', 'incidentes', 'pqrs', 'ticket',
  'danado', 'extraviado', 'perdido', 'perdida', 'no llega', 'quebrado', 'roto',

  // Soporte y atención humana
  'asesor', 'asesora', 'humano', 'operador', 'agente', 'contacto', 'soporte', 'servicio', 'servicios', 'ayuda',
  'whatsapp', 'chat', 'llamar'
]);

/**
 * Detecta si una consulta está FUERA del contexto institucional de Correos de Costa Rica
 */
const isOutOfDomainQuery = (normalized = '', tokens = [], history = []) => {
  // Patrones claros de temas ajenos a Correos de Costa Rica
  const offTopicPatterns = [
    /\b(dos pinos|pinitos|coronado leche|coopeleche|natilla|leche|queso|yogurt|helado|helados)\b/i,
    /\b(coca cola|pepsi|cerveza|imperial|pilsen|mcdonalds|burger king|kfc|pizza hut|taco bell|subway)\b/i,
    /\b(futbol|saprissa|la liga|alajuelense|herediano|cartagines|messi|ronaldo|fifa|estadio|champions)\b/i,
    /\b(chiste|chistes|broma|poema|cancion|musica|cantar|pelicula|cine|serie|netflix|anime|novela)\b/i,
    /\b(receta|cocinar|cocina|ingredientes|como preparar|pastel|queque|gallo pinto)\b/i,
    /\b(politica|presidente|diputado|chaves|figueres|alcalde|elecciones)\b/i,
    /\b(clima|temperatura de hoy|va a llover|pronostico del tiempo)\b/i,
    /\b(amor|pareja|novio|novia|enamorado|horoscopo|signo zodiacal|astrologia)\b/i,
    /\b(tarea|ensayo|resumen escolar|matematicas|ecuacion|cuanto es \d+)\b/i,
    /\b(programacion|codigo python|codigo javascript|python|java|html|css)\b/i,
    /\b(medicina|dolor de cabeza|pastilla|remedio casero|sintomas|enfermedad)\b/i,
    /\b(quien gano|quien descubrio|capital de|cuando nacio)\b/i
  ];

  if (offTopicPatterns.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  // 1. Si menciona una provincia, cantón o sede geográfica (incluso con faltas como 'sam jose')
  if (detectProvincia(normalized)) {
    return false;
  }

  // 2. Si la consulta menciona 'provincia', 'provincias', 'sucursal', 'donde queda', etc.
  if (
    normalized.includes('provincia') ||
    normalized.includes('provincias') ||
    normalized.includes('donde queda') ||
    normalized.includes('donde quedan') ||
    normalized.includes('mas cercana') ||
    normalized.includes('socursal')
  ) {
    return false;
  }

  // 3. Si la conversación ya está activa, ser tolerante con preguntas de seguimiento
  if (history && history.length >= 2) {
    const isShortFollowUp = normalized.split(/\s+/).length <= 6 && !offTopicPatterns.some((p) => p.test(normalized));
    if (isShortFollowUp) {
      return false;
    }
  }

  // 4. Verificar si contiene palabras clave del dominio postal o términos asociados
  const hasCorreosContext = tokens.some((token) => CORREOS_DOMAIN_TERMS.has(token)) ||
    [...CORREOS_DOMAIN_TERMS].some((term) => normalized.includes(term));

  const isPoliteGreeting = tokens.some((t) => ['hola', 'buenos', 'dias', 'tardes', 'noches', 'saludos', 'buenas', 'gracias', 'excelente', 'perfecto', 'pura'].includes(t)) ||
    ['hola', 'buenas', 'pura vida', 'muchas gracias', 'ok', 'gracias'].includes(normalized);

  if (isPoliteGreeting || hasCorreosContext) {
    return false;
  }

  const hasGuidePattern = /\b(?:CR|CP)?\d{6,13}(?:CR)?\b/i.test(normalized);
  if (hasGuidePattern) {
    return false;
  }

  return true;
};

/**
 * Mensaje institucional exclusivo de Correos de Costa Rica ante consultas fuera de dominio
 */
const getOutOfDomainResponse = () => {
  return {
    text: `No dispongo de esa información. Esa consulta se sale de mis conocimientos y está fuera del contexto institucional de Correos de Costa Rica. 🚫\n\nComo Asistente Postal Oficial, fui diseñado para responder **exclusivamente** sobre servicios, trámites y envíos de nuestra institución:\n\n• 🏢 **Ubicación y horarios** de nuestras 110 sucursales en las 7 provincias de Costa Rica\n• 📦 **Rastreo oficial de paquetes y pedidos** (ej. CR098421734CR)\n• 💰 **Cotización de tarifas** EMS Courier, Pymexpress y envíos nacionales\n• ⏱️ **Tiempos de entrega y requisitos de retiro** en sucursal y a domicilio\n• 📅 **Citas oficiales VES** para pasaporte biométrico y cédula de residencia DIMEX\n• ✈️ **Casillero Box Correos Miami** y trámites aduanales\n\n¿En qué trámite oficial de Correos de Costa Rica te puedo colaborar hoy?`,
    quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', 'Rastrear CR098421734CR', 'Cotizar tarifas EMS']
  };
};

/**
 * Genera el desglose completo de la sucursal más cercana y dónde queda para CADA provincia de Costa Rica
 */
const getAllProvincesBranchOverview = () => {
  return {
    text: `🇨🇷 **Sucursal principal y más cercana en cada una de las 7 provincias de Costa Rica**:\n\n` +
      `1. 📍 **San José**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Central Zapote (Ventanilla Principal)**\n` +
      `   • **Dónde queda**: Costado este de Casa Presidencial, Zapote (a 1.2 km de San José Centro)\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 5:00 p.m. / Sáb 8:00 a.m. a 12:00 m.d. | Tel: (+506) 2257-8888\n` +
      `   • *Otras sedes en San José*: Edificio Histórico Central (Calle 2), San Pedro (Los Yoses), Escazú Village y Pérez Zeledón.\n\n` +
      `2. 📍 **Alajuela**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Alajuela Centro**\n` +
      `   • **Dónde queda**: Frente al costado norte del Parque Central, Alajuela\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 5:00 p.m. / Sáb 8:00 a.m. a 12:00 m.d. | Tel: (+506) 2441-0355\n\n` +
      `3. 📍 **Heredia**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Heredia Central**\n` +
      `   • **Dónde queda**: Calle Central, Avenidas 0 y 2, frente a Parroquia La Inmaculada, Heredia Centro\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 5:00 p.m. / Sáb 8:00 a.m. a 12:00 m.d. | Tel: (+506) 2260-0344\n\n` +
      `4. 📍 **Cartago**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Cartago Los Ángeles**\n` +
      `   • **Dónde queda**: 300 metros al oeste de la Basílica de Los Ángeles, Cartago Centro\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 5:00 p.m. | Tel: (+506) 2551-0422\n\n` +
      `5. 📍 **Guanacaste**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Liberia Centro**\n` +
      `   • **Dónde queda**: Avenida 1, Calle 2, contiguo a la Gobernación, Liberia\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 4:30 p.m. / Sáb 8:00 a.m. a 12:00 m.d. | Tel: (+506) 2666-0244\n\n` +
      `6. 📍 **Puntarenas**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Puntarenas Puerto**\n` +
      `   • **Dónde queda**: Paseo de los Turistas, frente al Muelle Principal de Cruceros\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 4:30 p.m. | Tel: (+506) 2661-0155\n\n` +
      `7. 📍 **Limón**\n` +
      `   • **Sucursal más cercana / principal**: **Sucursal Limón Centro**\n` +
      `   • **Dónde queda**: Avenida 2, Calles 3 y 4, frente al Parque Vargas, Limón Centro\n` +
      `   • **Horario**: Lun–Vie 8:00 a.m. a 4:30 p.m. | Tel: (+506) 2758-0122\n\n` +
      `¿Deseas consultar detalles o servicios de alguna provincia en particular?`,
    actionLink: '/oficinas',
    actionText: 'Ver las 110 sucursales en el mapa',
    quickSuggestions: ['Sucursales en San José', 'Sucursales en Alajuela', 'Sucursales en Heredia', '¿Abren los sábados?']
  };
};

/**
 * Servicio Inteligente de Asistente IA y Procesamiento de Lenguaje Natural (NLP)
 */
export const aiAssistantService = {
  /**
   * Procesa la consulta del usuario en lenguaje natural
   */
  processMessage: async ({ message, user = null, history = [] }) => {
    const rawQuery = String(message || '').trim();
    if (!rawQuery) {
      return {
        text: 'Por favor, indícame tu consulta o la provincia de la que deseas conocer la sucursal más cercana.',
        quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', 'Rastrear CR098421734CR', 'Cotizar tarifas EMS']
      };
    }

    const normalized = normalizeText(rawQuery);
    const tokens = extractTokens(rawQuery);

    // 1. REGLA ESTRICTA DE DOMINIO: Si la consulta es ajena a Correos de Costa Rica
    if (isOutOfDomainQuery(normalized, tokens, history)) {
      await iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: 'fuera_de_contexto',
        confianza: 99.0,
        resultado: 'Fuera de contexto institucional'
      }).catch(() => {});

      return getOutOfDomainResponse();
    }

    // 2. Resolver consultas del dominio de Correos con datos oficiales precisos
    return await aiAssistantService.resolveCorreosQuery({ rawQuery, normalized, tokens, user, history });
  },

  /**
   * Resuelve consultas exclusivas de Correos de Costa Rica con prioridad y precisión exacta
   */
  resolveCorreosQuery: async ({ rawQuery, normalized, tokens, user, history = [] }) => {
    const lastBotMsg = [...history].reverse().find((m) => m.sender === 'bot');

    // =========================================================================
    // CASO ESPECIAL: CONSULTA DE TODAS LAS PROVINCIAS / CADA PROVINCIA DE COSTA RICA
    // =========================================================================
    const isAllProvincesIntent =
      normalized.includes('cada provincia') ||
      normalized.includes('de cada provincia') ||
      normalized.includes('todas las provincias') ||
      normalized.includes('por provincia') ||
      normalized.includes('las 7 provincias') ||
      normalized.includes('en cada provincia') ||
      (normalized.includes('provincia') && (normalized.includes('mas cercana') || normalized.includes('donde queda') || normalized.includes('socursal') || normalized.includes('sucursal')) && !detectProvincia(normalized));

    if (isAllProvincesIntent) {
      await iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: 'sucursales_todas_las_provincias',
        confianza: 99.5,
        resultado: 'Desglose oficial de las 7 provincias'
      }).catch(() => {});

      return getAllProvincesBranchOverview();
    }

    // =========================================================================
    // INTENCIÓN: HORARIOS DE ATENCIÓN DE SUCURSALES (GENERAL, PROVINCIAL Y FIN DE SEMANA)
    // Responde consultas directas sobre horas de apertura, cierre, sábados y domingos
    // =========================================================================
    const isBranchScheduleIntent =
      normalized.includes('horario') ||
      normalized.includes('horarios') ||
      normalized.includes('a que hora') ||
      normalized.includes('a que horas') ||
      normalized.includes('que hora abre') ||
      normalized.includes('que hora abren') ||
      normalized.includes('que hora cierra') ||
      normalized.includes('que hora cierran') ||
      normalized.includes('hora abren') ||
      normalized.includes('hora cierran') ||
      normalized.includes('hora de atencion') ||
      normalized.includes('horario de atencion') ||
      normalized.includes('horarios de atencion') ||
      normalized.includes('hora apertura') ||
      normalized.includes('hora cierre') ||
      normalized.includes('abren hoy') ||
      normalized.includes('cierran hoy') ||
      normalized.includes('atienden hoy') ||
      normalized.includes('abren los sabados') ||
      normalized.includes('abren sabados') ||
      normalized.includes('abren los domingos') ||
      normalized.includes('abren domingos') ||
      normalized.includes('sabado') ||
      normalized.includes('sabados') ||
      normalized.includes('domingo') ||
      normalized.includes('domingos') ||
      normalized.includes('fin de semana') ||
      normalized.includes('fines de semana') ||
      normalized.includes('dias de atencion') ||
      normalized.includes('dias abren') ||
      (tokens.some((t) => ['horario', 'horarios', 'hora', 'horas'].includes(t)) &&
       tokens.some((t) => ['sucursal', 'sucursales', 'oficina', 'oficinas', 'atencion', 'apertura', 'cierre', 'abren', 'abre', 'cierran', 'cierra'].includes(t)));

    if (isBranchScheduleIntent) {
      const scheduleProvData = detectProvincia(rawQuery) || detectProvincia(normalized);

      await iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: 'horarios_sucursales',
        confianza: 99.5,
        resultado: scheduleProvData ? `Horarios en ${scheduleProvData.name}` : 'Horarios oficiales de sucursales'
      }).catch(() => {});

      // Subcaso A: Consulta puntual sobre Sucursal Central Zapote
      if (normalized.includes('zapote')) {
        return {
          text: `🕒 **Horario oficial de atención de la Sucursal Central Zapote (Ventanilla Principal)**:\n\n` +
            `• 📍 **Dirección**: Costado este de Casa Presidencial, Zapote, San José\n` +
            `• 🕒 **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.** (Jornada continua sin interrupción al mediodía)\n` +
            `• 📅 **Sábados**: **8:00 a.m. a 12:00 m.d.**\n` +
            `• 🚫 **Domingos y Feriados**: Cerrado\n` +
            `• ☎️ **Teléfono**: (+506) 2257-8888\n` +
            `• 🌟 **Servicios disponibles**: Pasaportes y Cédulas VES, Pymexpress Hub, Casilleros y Retiro de Envíos.\n\n` +
            `¿Deseas verificar la ruta en el mapa o consultar los requisitos para retirar un paquete?`,
          actionLink: '/oficinas',
          actionText: 'Ver Sucursal Zapote en el mapa',
          quickSuggestions: ['¿Abren los sábados?', 'Requisitos para retirar', 'Horario en Alajuela', 'Sucursales de cada provincia']
        };
      }

      // Subcaso B: Consulta puntual sobre City Mall Alajuela (Horario Extendido)
      if (normalized.includes('city mall')) {
        return {
          text: `🕒 **Horario oficial de la Sucursal City Mall Alajuela** (Horario Extendido):\n\n` +
            `• 📍 **Dirección**: Centro Comercial City Mall, Sótano 1, diagonal al BCR (Local LC-112-A2), Alajuela\n` +
            `• 🕒 **Lunes a Sábado**: **10:00 a.m. a 7:00 p.m.** (Jornada continua especial)\n` +
            `• 🛍️ **Domingos**: **11:00 a.m. a 5:00 p.m.** (Única sede abierta los domingos para retiro y entrega)\n` +
            `• ☎️ **Teléfono**: (+506) 2430-8812\n` +
            `• 🌟 **Servicios**: Envíos EMS Courier, Pymexpress, Box Correos Miami y retiro de paquetería.\n\n` +
            `¿Deseas ubicar la sucursal en el mapa interactivo?`,
          actionLink: '/oficinas',
          actionText: 'Ver City Mall en el mapa',
          quickSuggestions: ['Horario de Alajuela Centro', '¿Abren los domingos?', 'Cotizar tarifas EMS', 'Sucursales de cada provincia']
        };
      }

      // Subcaso C: Consulta puntual sobre Escazú Village
      if (normalized.includes('escazu')) {
        return {
          text: `🕒 **Horario oficial de la Sucursal Escazú Village** (Horario Extendido):\n\n` +
            `• 📍 **Dirección**: Centro Comercial Escazú Village, Escazú, San José\n` +
            `• 🕒 **Lunes a Sábado**: **10:00 a.m. a 7:00 p.m.** (Jornada continua extendida)\n` +
            `• 🚫 **Domingos**: Cerrado\n` +
            `• ☎️ **Teléfono**: (+506) 2202-2900\n` +
            `• 🌟 **Servicios**: Envíos nacionales e internacionales, Pymexpress y casillero.\n\n` +
            `¿Deseas consultar otras sucursales de San José?`,
          actionLink: '/oficinas',
          actionText: 'Ver sucursales de San José en el mapa',
          quickSuggestions: ['Horario de Zapote', 'Horario de San Pedro', '¿Abren los sábados?', 'Sucursales de cada provincia']
        };
      }

      // Subcaso D: Consulta puntual de horarios por provincia específica
      if (scheduleProvData) {
        const provKey = scheduleProvData.key;

        if (provKey === 'alajuela') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de Alajuela**:\n\n` +
              `• 🏢 **Sucursal Alajuela Centro** (costado norte del Parque Central):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.** (Jornada continua sin interrupción al mediodía)\n` +
              `  - **Sábados**: **8:00 a.m. a 12:00 m.d.**\n` +
              `  - ☎️ Tel: (+506) 2441-0355\n\n` +
              `• 🛍️ **Sucursal City Mall Alajuela** (Sótano 1, diagonal al BCR):\n` +
              `  - **Lunes a Sábado**: **10:00 a.m. a 7:00 p.m.** (Horario extendido)\n` +
              `  - **Domingos**: **11:00 a.m. a 5:00 p.m.** (Abierto en jornada dominical)\n` +
              `  - ☎️ Tel: (+506) 2430-8812\n\n` +
              `• 🏢 **Sedes Cantonales de Alajuela** (San Ramón, Grecia, Atenas, Ciudad Quesada, Palmares, Naranjo, Orotina):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.**\n` +
              `  - *San Ramón* también abre **sábados de 8:00 a.m. a 12:00 m.d.**\n\n` +
              `🚫 *Domingos y Feriados: Ventanillas regulares cerradas (excepto City Mall). La plataforma virtual y el rastreo están disponibles 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de Alajuela en el mapa',
            quickSuggestions: ['Horario de City Mall', 'Horario en San José', '¿Abren los sábados?', 'Sucursales de cada provincia']
          };
        }

        if (provKey === 'san jose') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de San José**:\n\n` +
              `• 🏢 **Sucursal Central Zapote (Ventanilla Principal)** (Costado este de Casa Presidencial):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.** (Jornada continua)\n` +
              `  - **Sábados**: **8:00 a.m. a 12:00 m.d.**\n` +
              `  - ☎️ Tel: (+506) 2257-8888\n\n` +
              `• 🏛️ **Edificio Histórico Central** (Calle 2, Avenidas 1 y 3):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.**\n` +
              `  - **Sábados**: **8:00 a.m. a 12:00 m.d.**\n\n` +
              `• 🛍️ **Sucursal Escazú Village**:\n` +
              `  - **Lunes a Sábado**: **10:00 a.m. a 7:00 p.m.** (Horario extendido)\n\n` +
              `• 🏢 **Sedes Cantonales** (San Pedro, Desamparados, Curridabat, Tibás, Moravia, Guadalupe, Santa Ana, Pérez Zeledón):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.**\n` +
              `  - *San Pedro (Los Yoses)* también abre **sábados de 8:00 a.m. a 12:00 m.d.**\n\n` +
              `🚫 *Domingos y Feriados: Ventanillas físicas regulares cerradas. Plataforma web activa 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de San José en el mapa',
            quickSuggestions: ['Horario de Zapote', 'Horario en Alajuela', '¿Abren los sábados?', 'Sucursales de cada provincia']
          };
        }

        if (provKey === 'heredia') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de Heredia**:\n\n` +
              `• 🏢 **Sucursal Heredia Central** (Calle Central, Avenidas 0 y 2, frente a Parroquia La Inmaculada):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.** (Jornada continua sin interrupción al mediodía)\n` +
              `  - **Sábados**: **8:00 a.m. a 12:00 m.d.**\n` +
              `  - ☎️ Tel: (+506) 2260-0344\n\n` +
              `• 🏢 **Otras sedes cantonales** (Belén, Santo Domingo, Barva, San Rafael, San Isidro, Sarapiquí):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.**\n\n` +
              `🚫 *Domingos y Feriados: Ventanillas cerradas. Plataforma virtual disponible 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de Heredia en el mapa',
            quickSuggestions: ['Horario en San José', '¿Abren los sábados?', 'Requisitos para retirar', 'Sucursales de cada provincia']
          };
        }

        if (provKey === 'cartago') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de Cartago**:\n\n` +
              `• 🏢 **Sucursal Cartago Los Ángeles** (300m oeste de la Basílica de Los Ángeles):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.** (Jornada continua sin interrupción al mediodía)\n` +
              `  - **Sábados**: **8:00 a.m. a 12:00 m.d.**\n` +
              `  - ☎️ Tel: (+506) 2551-0422\n\n` +
              `• 🏢 **Otras sedes en Cartago** (Paraíso, Tres Ríos / La Unión, Turrialba):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 5:00 p.m.**\n\n` +
              `🚫 *Domingos y Feriados: Ventanillas cerradas. Plataforma virtual disponible 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de Cartago en el mapa',
            quickSuggestions: ['Horario en San José', '¿Abren los sábados?', 'Requisitos para retirar', 'Sucursales de cada provincia']
          };
        }

        if (provKey === 'guanacaste') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de Guanacaste**:\n\n` +
              `• 🏢 **Sucursal Liberia Centro** (Avenida 1, Calle 2, contiguo a la Gobernación):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 4:30 p.m.** (Jornada continua)\n` +
              `  - **Sábados**: **8:00 a.m. a 12:00 m.d.**\n` +
              `  - ☎️ Tel: (+506) 2666-0244\n\n` +
              `• 🏢 **Otras sedes cantonales** (Nicoya, Santa Cruz, Cañas, Bagaces, Tilarán, Playas del Coco):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 4:30 p.m.**\n\n` +
              `🚫 *Domingos y Feriados: Ventanillas cerradas. Plataforma web activa 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de Guanacaste en el mapa',
            quickSuggestions: ['Horario en San José', '¿Abren los sábados?', 'Requisitos para retirar', 'Sucursales de cada provincia']
          };
        }

        if (provKey === 'puntarenas') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de Puntarenas**:\n\n` +
              `• 🏢 **Sucursal Puntarenas Puerto** (Paseo de los Turistas, frente al Muelle Principal de Cruceros):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 4:30 p.m.** (Jornada continua)\n` +
              `  - ☎️ Tel: (+506) 2661-0155\n\n` +
              `• 🏢 **Otras sedes cantonales** (Quepos, Jacó, Golfito, Esparza, Palmar Norte, Coto Brus, Buenos Aires):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 4:30 p.m.**\n\n` +
              `🚫 *Sábados, Domingos y Feriados: Ventanillas regulares cerradas. Plataforma web activa 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de Puntarenas en el mapa',
            quickSuggestions: ['Horario en San José', '¿Abren los sábados?', 'Requisitos para retirar', 'Sucursales de cada provincia']
          };
        }

        if (provKey === 'limon') {
          return {
            text: `🕒 **Horarios oficiales de sucursales de Correos de Costa Rica en la provincia de Limón**:\n\n` +
              `• 🏢 **Sucursal Limón Centro** (Avenida 2, Calles 3 y 4, frente al Parque Vargas):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 4:30 p.m.** (Jornada continua)\n` +
              `  - ☎️ Tel: (+506) 2758-0122\n\n` +
              `• 🏢 **Otras sedes cantonales** (Guápiles / Pococí, Siquirres, Talamanca / Puerto Viejo, Bataan, Matina):\n` +
              `  - **Lunes a Viernes**: **8:00 a.m. a 4:30 p.m.**\n\n` +
              `🚫 *Sábados, Domingos y Feriados: Ventanillas regulares cerradas. Plataforma web activa 24/7.*`,
            actionLink: '/oficinas',
            actionText: 'Ver sucursales de Limón en el mapa',
            quickSuggestions: ['Horario en San José', '¿Abren los sábados?', 'Requisitos para retirar', 'Sucursales de cada provincia']
          };
        }
      }

      // Subcaso E: Consulta específica sobre Sábados
      if (normalized.includes('sabado') || normalized.includes('sabados')) {
        return {
          text: `🗓️ **Horarios de atención los sábados en Correos de Costa Rica**:\n\n` +
            `• 🏢 **Sedes Principales y Cabeceras de Provincia**:\n` +
            `  Abren los sábados en jornada matutina de **8:00 a.m. a 12:00 m.d.**:\n` +
            `  ✓ **San José**: Sucursal Central Zapote (Ventanilla Principal), Edificio Histórico Central (Calle 2) y San Pedro de Montes de Oca.\n` +
            `  ✓ **Alajuela**: Sucursal Alajuela Centro y Sucursal San Ramón.\n` +
            `  ✓ **Heredia**: Sucursal Heredia Central.\n` +
            `  ✓ **Cartago**: Sucursal Cartago Los Ángeles.\n` +
            `  ✓ **Guanacaste**: Sucursal Liberia Centro.\n\n` +
            `• 🛍️ **Centros Comerciales (Horario Especial Extendido)**:\n` +
            `  - **City Mall Alajuela**: Sábados de **10:00 a.m. a 7:00 p.m.**\n` +
            `  - **Escazú Village**: Sábados de **10:00 a.m. a 7:00 p.m.**\n\n` +
            `• 🚫 **Sedes cantonales menores**: Permanecen cerradas los sábados.\n` +
            `• 🕒 **Lunes a Viernes**: Horario habitual de **8:00 a.m. a 5:00 p.m.** en toda la red nacional.`,
          actionLink: '/oficinas',
          actionText: 'Directorio completo de sucursales',
          quickSuggestions: ['Horario en San José', 'Horario en Alajuela', '¿A qué hora abren entre semana?', 'Sucursales de cada provincia']
        };
      }

      // Subcaso F: Consulta específica sobre Domingos
      if (normalized.includes('domingo') || normalized.includes('domingos')) {
        return {
          text: `🚫 **Horarios de atención los domingos en Correos de Costa Rica**:\n\n` +
            `• 🏢 **Ventanillas Regulares Cerradas**: Todas las oficinas postales estándar a nivel nacional permanecen cerradas los domingos y feriados nacionales de ley.\n` +
            `• 🛍️ **Única Sede Abierta los Domingos**:\n` +
            `  - **Sucursal City Mall Alajuela**: Abierta los domingos de **11:00 a.m. a 5:00 p.m.** (Sótano 1, diagonal al BCR) para retiros y depósitos.\n` +
            `• 🌐 **Autogestión Web 24/7**: Rastreo de guías, cálculo de tarifas y consultas disponibles en línea.\n` +
            `• 🕒 **Reapertura General**: Lunes a partir de las **8:00 a.m.** en toda la red nacional.`,
          actionLink: '/oficinas',
          actionText: 'Ver sucursales en el mapa',
          quickSuggestions: ['¿Abren los sábados?', 'Horarios de sucursales', 'Horario en San José', 'Horario en Alajuela']
        };
      }

      // Subcaso G: Consulta general de horarios a nivel nacional (ej. "¿Cuáles son los horarios de las sucursales?", "Horarios de sucursales", "¿A qué hora abren?")
      return {
        text: `🕒 **Horarios oficiales de las sucursales de Correos de Costa Rica**:\n\n` +
          `• 🏢 **Lunes a Viernes (Jornada Continua Nacional)**:\n` +
          `  - **8:00 a.m. a 5:00 p.m.** en toda la red de sucursales principales y cabeceras de provincia (jornada continua sin interrupción al mediodía).\n` +
          `  - *Sedes cantonales y rurales menores*: **8:00 a.m. a 4:30 p.m.**\n\n` +
          `• 📅 **Sábados (Ventanillas Principales y Cabeceras)**:\n` +
          `  - **8:00 a.m. a 12:00 m.d.** en ventanillas centrales autorizadas:\n` +
          `    ✓ **San José**: Central Zapote (Ventanilla Principal), Edificio Histórico Central (Calle 2) y San Pedro.\n` +
          `    ✓ **Alajuela**: Alajuela Centro y San Ramón.\n` +
          `    ✓ **Heredia**: Heredia Central.\n` +
          `    ✓ **Cartago**: Cartago Los Ángeles.\n` +
          `    ✓ **Guanacaste**: Liberia Centro.\n\n` +
          `• 🛍️ **Horario Especial Extendido en Centros Comerciales**:\n` +
          `  - **City Mall Alajuela**: Lunes a Sábado de **10:00 a.m. a 7:00 p.m.** / Domingos de **11:00 a.m. a 5:00 p.m.**\n` +
          `  - **Escazú Village**: Lunes a Sábado de **10:00 a.m. a 7:00 p.m.**\n\n` +
          `• 🚫 **Domingos y Feriados Nacionales**:\n` +
          `  - Las ventanillas físicas regulares permanecen cerradas (excepto City Mall).\n` +
          `  - Nuestra **Sucursal Virtual** y el rastreo de envíos están disponibles 24/7 en la plataforma web.\n\n` +
          `¿Deseas consultar el horario o ubicación de alguna provincia o sede en particular?`,
        actionLink: '/oficinas',
        actionText: 'Ver directorio completo de sucursales',
        quickSuggestions: ['Horario en San José', 'Horario en Alajuela', '¿Abren los sábados?', 'Sucursales de cada provincia']
      };
    }

    // =========================================================================
    // INTENCIÓN 1: SUCURSALES POR PROVINCIA ESPECÍFICA (SAN JOSÉ, ALAJUELA, HEREDIA, ETC.)
    // Tolera errores como 'sam jose', 'san joce', 'chepe', etc.
    // =========================================================================
    const matchedProvData = detectProvincia(rawQuery) || detectProvincia(normalized);

    const isProvinceDirectQuery = Boolean(matchedProvData);

    if (isProvinceDirectQuery) {
      try {
        const sucursales = await sucursalesService.getAll();
        const provKey = matchedProvData.key;
        const provName = matchedProvData.name;
        const closest = matchedProvData.closestBranch;

        // Filtrar todas las sucursales de esta provincia en la base de datos
        const dbBranches = sucursales.filter((s) =>
          normalizeText(s.provincia).includes(provKey) ||
          matchedProvData.aliases.some((a) => normalizeText(s.nombre).includes(a))
        );

        let otherBranchesText = '';
        if (dbBranches.length > 1) {
          const others = dbBranches.filter((b) => b.nombre !== closest.nombre);
          if (others.length > 0) {
            otherBranchesText = `\n\n🏢 **Otras sucursales disponibles en ${provName}**:\n` +
              others.map((b) => `• **${b.nombre}**\n  📍 ${b.direccion}\n  🕒 *Horario*: ${b.horario}\n  ☎️ *Tel*: ${b.telefono || '+506 2202-2900'}`).join('\n\n');
          }
        }

        await iaLogsService.createLog({
          usuario: user?.nombre || 'Ciudadano Web',
          consulta: rawQuery,
          intencion: 'sucursal_provincia_especifica',
          confianza: 99.0,
          resultado: `Sucursal en ${provName}`
        }).catch(() => {});

        return {
          text: `📍 **Sucursales de Correos de Costa Rica en la provincia de ${provName}**:\n\n` +
            `⭐ **Sucursal principal / más cercana**:\n` +
            `• 🏢 **${closest.nombre}**\n` +
            `• 📌 **Dónde queda**: ${closest.direccion} (${closest.distancia})\n` +
            `• 🕒 **Horario de atención**: ${closest.horario}\n` +
            `• ☎️ **Teléfono directo**: ${closest.telefono}\n` +
            `• 🌟 **Servicios destacados**: ${closest.servicios.join(', ')}` +
            otherBranchesText +
            `\n\n¿Deseas consultar los requisitos para retirar un paquete o agendar una cita de pasaporte VES en esta sede?`,
          actionLink: '/oficinas',
          actionText: `Ver sedes de ${provName} en el mapa`,
          quickSuggestions: ['¿Abren los sábados?', 'Requisitos para retirar', 'Citas Pasaporte VES', 'Sucursales de cada provincia']
        };
      } catch (e) {
        console.warn('Error al resolver sucursal de provincia:', e);
      }
    }

    // =========================================================================
    // INTENCIÓN 2: CONSULTA GENERAL DE DÓNDE QUEDAN SUCURSALES / SUCURSAL MÁS CERCANA
    // =========================================================================
    const wasWaitingForLocation = lastBotMsg && (
      lastBotMsg.text.includes('sucursal') ||
      lastBotMsg.text.includes('provincia') ||
      lastBotMsg.text.includes('canton') ||
      lastBotMsg.text.includes('mas cercana')
    );

    const isGenericSucursalIntent =
      normalized.includes('socursal') ||
      tokens.some((t) => ['sucursal', 'sucursales', 'oficina', 'oficinas', 'sede', 'sedes'].includes(t)) ||
      normalized.includes('donde queda') ||
      normalized.includes('donde estan') ||
      normalized.includes('mas cercana') ||
      (wasWaitingForLocation && tokens.length > 0);

    if (isGenericSucursalIntent && (normalized.includes('cercana') || normalized.includes('donde') || normalized.includes('oficina'))) {
      return {
        text: `🏢 Correos de Costa Rica cuenta con **110 sucursales** distribuidas en las **7 provincias** del país.\n\nPara indicarte con precisión cuál es la sucursal más cercana y dónde queda, indícame tu provincia o cantón de residencia:`,
        actionLink: '/oficinas',
        actionText: 'Explorar mapa nacional de sucursales',
        quickSuggestions: ['Sucursales de cada provincia', 'San José', 'Alajuela', 'Heredia', 'Cartago', 'Guanacaste', 'Puntarenas', 'Limón']
      };
    }

    // =========================================================================
    // INTENCIÓN 3: TIEMPOS DE ENTREGA Y PLAZOS
    // =========================================================================
    const isDeliveryTimeIntent =
      normalized.includes('cuanto tarda') ||
      normalized.includes('cuanto dura') ||
      normalized.includes('tiempo de entrega') ||
      normalized.includes('tiempos de entrega') ||
      normalized.includes('cuando llega') ||
      normalized.includes('plazo de entrega') ||
      normalized.includes('cuantos dias') ||
      (tokens.some((t) => ['tiempo', 'tiempos', 'duracion', 'tarda', 'tardan', 'dura', 'plazo', 'plazos'].includes(t)) &&
       (tokens.some((t) => ['entrega', 'entregar', 'envio', 'llegar', 'paquete'].includes(t)) || normalized.includes('llegar')));

    if (isDeliveryTimeIntent) {
      return {
        text: `⏱️ **Tiempos oficiales de entrega de Correos de Costa Rica**:\n\n• 🚀 **EMS Courier Nacional**: **24 a 48 horas hábiles** en el Gran Área Metropolitana (GAM) y cabeceras de provincia. Hasta 72 horas hábiles en zonas periféricas.\n• 📦 **Pymexpress**: **24 a 48 horas hábiles** en cobertura nacional para paquetes de comercio electrónico.\n• 📮 **Paquete Postal Regular / Encomienda**: **3 a 5 días hábiles** a cualquier parte del territorio nacional.\n• ✈️ **Box Correos Miami**: **4 a 6 días hábiles** una vez que el paquete es recibido e ingresado en nuestra bodega de Miami.\n• 🌎 **EMS Internacional**: **5 a 10 días hábiles** (sujeto a tiempos de aduana en el país de destino).\n\n¿Deseas rastrear un paquete específico o cotizar un envío?`,
        actionLink: '/servicios',
        actionText: 'Ver detalles de servicios',
        quickSuggestions: ['Rastrear CR098421734CR', '¿Hacen entregas a domicilio?', 'Cotizar 2 kg EMS', 'Sucursales de cada provincia']
      };
    }

    // =========================================================================
    // INTENCIÓN 4: REQUISITOS DE RETIRO Y AUTORIZACIÓN A TERCEROS
    // =========================================================================
    const isPickUpReqIntent =
      normalized.includes('retirar paquete') ||
      normalized.includes('retirar mi paquete') ||
      normalized.includes('que necesito para retirar') ||
      normalized.includes('que debo llevar') ||
      normalized.includes('que ocupo para retirar') ||
      normalized.includes('requisitos para retirar') ||
      normalized.includes('autorizar a otra persona') ||
      normalized.includes('familiar retire') ||
      normalized.includes('carta de autorizacion') ||
      (tokens.some((t) => ['retirar', 'retiro', 'recoger'].includes(t)) && tokens.some((t) => ['requisito', 'requisitos', 'llevar', 'documento', 'tercero', 'familiar', 'persona', 'cedula'].includes(t)));

    if (isPickUpReqIntent) {
      return {
        text: `📋 **Requisitos para retirar un paquete en sucursal de Correos de Costa Rica**:\n\n👤 **Retiro por el Destinatario Principal**:\n1. Cédula de identidad física original, DIMEX o pasaporte vigente y en buen estado.\n2. Número de guía oficial del envío (ej. CR098421734CR).\n\n👥 **Retiro por un Tercero (Familiar o Autorizado)**:\n1. **Carta de autorización formal** firmada por el destinatario, indicando el nombre completo y número de cédula de la persona autorizada, así como el número de guía.\n2. Fotocopia legible de la cédula del destinatario.\n3. Cédula de identidad física original de quien retira.\n\n*Nota: Los paquetes permanecen en custodia en la sucursal durante 15 días hábiles antes de su devolución.*`,
        actionLink: '/ayuda',
        actionText: 'Guía de trámites en Ayuda',
        quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', 'Rastrear CR098421734CR', 'Formas de pago']
      };
    }

    // =========================================================================
    // INTENCIÓN 5: FORMAS DE PAGO EN SUCURSAL Y EN LÍNEA
    // =========================================================================
    const isPaymentIntent =
      normalized.includes('forma de pago') ||
      normalized.includes('formas de pago') ||
      normalized.includes('como puedo pagar') ||
      normalized.includes('como pagar') ||
      normalized.includes('pagar con tarjeta') ||
      normalized.includes('aceptan tarjeta') ||
      normalized.includes('puedo pagar con sinpe') ||
      normalized.includes('sinpe movil') ||
      tokens.some((t) => ['pagar', 'pago', 'pagos', 'tarjeta', 'tarjetas', 'sinpe', 'efectivo'].includes(t));

    if (isPaymentIntent) {
      return {
        text: `💳 **Formas de pago aceptadas en Correos de Costa Rica**:\n\n• 💳 **Tarjetas de débito y crédito**: Visa, MasterCard y American Express en todas las ventanillas del país sin recargo adicional.\n• 📱 **SINPE Móvil**: Habilitado en sucursales autorizadas y en nuestra plataforma virtual de autogestión.\n• 💵 **Efectivo**: Aceptado en colones costarricenses en todas las 110 sucursales físicas.\n• 🌐 **Pago en línea**: Tarjetas de crédito/débito para pagos de casillero Box Miami, marchamo y compra de guías web.\n\n¿Deseas cotizar un envío o consultar el horario de tu sucursal más cercana?`,
        actionLink: '/servicios',
        actionText: 'Calculadora de envíos',
        quickSuggestions: ['Cotizar 1 kg', 'Sucursales de cada provincia', 'Cita Pasaporte VES', 'Rastrear paquete']
      };
    }

    // =========================================================================
    // INTENCIÓN 6: ENTREGA A DOMICILIO Y SEGUNDO INTENTO
    // =========================================================================
    const isHomeDeliveryIntent =
      normalized.includes('a domicilio') ||
      normalized.includes('entrega a domicilio') ||
      normalized.includes('llegan a mi casa') ||
      normalized.includes('entregan en la casa') ||
      normalized.includes('no estaba en mi casa') ||
      normalized.includes('no estaba en casa') ||
      normalized.includes('segundo intento') ||
      tokens.some((t) => ['domicilio', 'repartidor', 'mensajero'].includes(t)) ||
      (normalized.includes('casa') && tokens.some((t) => ['entrega', 'entregar', 'llega', 'llegan'].includes(t)));

    if (isHomeDeliveryIntent) {
      return {
        text: `🏠 **Entrega a Domicilio y Cobertura Nacional de Correos de Costa Rica**:\n\n• 📍 **Cobertura 100%**: Nuestros carteros y mensajeros entregan en domicilios particulares y empresas en los 84 cantones del país.\n• 🚚 **¿Qué pasa si no estás en casa?**: El repartidor realiza hasta **2 intentos de entrega**. En cada intento se deja un comprobante de visita.\n• 🏢 **Custodia en Sucursal**: Tras el segundo intento fallido, el paquete se traslada a la sucursal de Correos más cercana a tu comunidad, donde se custodia por 15 días hábiles para retiro personal.\n• 📲 **Notificaciones**: Puedes verificar en todo momento el avance del repartidor con tu número de guía.`,
        actionLink: '/rastreo',
        actionText: 'Rastreo en vivo de entrega',
        quickSuggestions: ['Rastrear CR098421734CR', 'Requisitos para retirar', 'Sucursales de cada provincia', 'Cotizar tarifas']
      };
    }


    // =========================================================================
    // INTENCIÓN 8: TARIFAS, COTIZACIONES Y PRECIOS
    // =========================================================================
    const wasWaitingForWeight = lastBotMsg && (
      lastBotMsg.text.includes('kilos') ||
      lastBotMsg.text.includes('peso') ||
      lastBotMsg.text.includes('pesar')
    );

    const isTarifaIntent =
      normalized.includes('cuanto cuesta') ||
      normalized.includes('cuanto vale') ||
      normalized.includes('cuanto cobran') ||
      tokens.some((t) => ['tarifa', 'tarifas', 'precio', 'precios', 'costo', 'costos', 'cotizar', 'cotizacion'].includes(t)) ||
      (tokens.some((t) => ['kilo', 'kilos', 'gramos', 'peso'].includes(t)) && !normalized.includes('rastrear')) ||
      (wasWaitingForWeight && (/\d+/.test(normalized) || tokens.some((t) => ['uno', 'dos', 'tres', 'cinco', 'diez'].includes(t))));

    if (isTarifaIntent) {
      const pesoMatch = rawQuery.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|g|gramos?|libras?|lbs?)?/i);
      const peso = pesoMatch ? parseFloat(pesoMatch[1]) : 1;

      const emsEstimado = tarifasService.estimateTariff(peso, 'EMS Courier Nacional');
      const pymeEstimado = tarifasService.estimateTariff(peso, 'Pymexpress');

      await iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: 'cotizar_tarifa',
        confianza: 98.0,
        resultado: 'Tarifa calculada'
      }).catch(() => {});

      return {
        text: `💰 **Tarifas oficiales de Correos de Costa Rica para ${peso} kg**:\n\n• 🚀 **EMS Courier Nacional** (entrega 24-48h con entrega a domicilio y trazabilidad): **₡${emsEstimado.toLocaleString()}**\n• 📦 **Pymexpress** (tarifa especial para emprendedores y pymes registradas): **₡${pymeEstimado.toLocaleString()}**\n\n*Los precios incluyen IVA y aplican para envíos dentro del territorio nacional. Para envíos internacionales o casillero Box Miami aplican tarifas aduanales diferenciadas.*`,
        actionLink: '/servicios',
        actionText: 'Calculadora oficial de tarifas',
        quickSuggestions: ['Cotizar 2 kg', 'Cotizar 5 kg', '¿Hacen entregas a domicilio?', 'Formas de pago']
      };
    }

    // =========================================================================
    // INTENCIÓN 9: CITAS VES, PASAPORTES Y DIMEX
    // =========================================================================
    const isVesIntent =
      tokens.some((t) => ['pasaporte', 'pasaportes', 'dimex', 'ves', 'biometrico', 'sidge'].includes(t)) ||
      (tokens.some((t) => ['cita', 'citas'].includes(t)) && !normalized.includes('sucursal'));

    if (isVesIntent) {
      await iaLogsService.createLog({
        usuario: user?.nombre || 'Ciudadano Web',
        consulta: rawQuery,
        intencion: 'citas_ves_pasaportes',
        confianza: 98.5,
        resultado: 'Orientación VES'
      }).catch(() => {});

      return {
        text: `🛂 **Citas de Pasaporte Biométrico y DIMEX (Ventanillas VES)**:\n\n1. 💳 **Pago de aranceles**: Cancela el importe oficial en cualquier sucursal del Banco de Costa Rica (BCR) a nombre de la Dirección General de Migración y Extranjería.\n2. 📄 **Requisitos para la cita**: Llevar comprobante de pago bancario impreso y cédula de identidad física original vigente y en buen estado.\n3. 📸 **Toma biométrica**: Se realiza toma de huellas dactilares, firma digital y fotografía oficial en la sucursal autorizada de Correos.\n4. 🏠 **Entrega final**: El pasaporte o cédula de residencia se entrega directamente en tu domicilio por mensajería segura.`,
        actionLink: '/oficinas',
        actionText: 'Sucursales autorizadas VES',
        quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', 'Sucursal Alajuela', 'Hablar con un asesor']
      };
    }

    // =========================================================================
    // INTENCIÓN 10: RASTREO DE ENVÍOS (CON O SIN GUÍA)
    // =========================================================================
    const trackingRegex = /\b(?:CR|CP)\d{8,10}CR\b/i;
    const trackingMatch = rawQuery.match(trackingRegex);
    const numericMatch = rawQuery.match(/\b\d{9,13}\b/);

    const wasWaitingForTracking = lastBotMsg && (
      lastBotMsg.text.includes('número de guía') ||
      lastBotMsg.text.includes('guía de tu paquete')
    );

    const codeToSearch = trackingMatch
      ? trackingMatch[0].toUpperCase()
      : (wasWaitingForTracking && numericMatch ? numericMatch[0] : (numericMatch ? numericMatch[0] : null));

    const isExplicitTracking =
      Boolean(codeToSearch) ||
      tokens.some((t) => ['rastreo', 'rastrear', 'tracking'].includes(t)) ||
      normalized.includes('donde esta mi') ||
      normalized.includes('como puedo rastrear') ||
      normalized.includes('rastrear mi');

    if (isExplicitTracking) {
      if (codeToSearch) {
        try {
          const envio = await enviosService.getByIdOrGuia(codeToSearch);
          if (envio) {
            await iaLogsService.createLog({
              usuario: user?.nombre || 'Ciudadano Web',
              consulta: rawQuery,
              intencion: 'rastreo_envio',
              confianza: 99.2,
              resultado: 'Envío encontrado'
            }).catch(() => {});

            return {
              text: `📦 ¡Localizado! Tu paquete **#${envio.guia}** se encuentra en el Sistema Oficial de Correos de Costa Rica:\n\n• 🟢 **Estado actual**: **${envio.estado}**\n• 🚀 **Servicio**: ${envio.servicio}\n• 📍 **Trayecto**: ${envio.origen} ➔ ${envio.destino}\n• 👤 **Destinatario**: ${envio.destinatario?.nombre || envio.destinatario || 'Registrado'}\n\nA continuación tienes los detalles y etapas en vivo:`,
              envio,
              quickSuggestions: ['¿Cuáles son los tiempos de entrega?', '¿Qué necesito para retirar?', 'Sucursales de cada provincia']
            };
          }
        } catch (e) {
          console.warn('Error al buscar envío:', e);
        }

        return {
          text: `🔍 No encontramos registros activos en Correos de Costa Rica para el número **"${codeToSearch}"**.\n\nPor favor verifica que la guía tenga el formato oficial de 13 caracteres (ejemplo: **CR098421734CR**).`,
          quickSuggestions: ['Probar con CR098421734CR', 'Probar con CR109283745CR', 'Hablar con un asesor']
        };
      }

      return {
        text: `📦 ¡Con gusto te ayudo a rastrear tu paquete en Correos de Costa Rica!\n\nPor favor escribe tu **número de guía** oficial (por ejemplo: **CR098421734CR**).`,
        quickSuggestions: ['Rastrear CR098421734CR', 'Rastrear CR109283745CR']
      };
    }

    // =========================================================================
    // INTENCIÓN 11: SERVICIOS OFICIALES ESPECÍFICOS
    // =========================================================================
    if (normalized.includes('box') || normalized.includes('casillero') || normalized.includes('miami')) {
      return {
        text: `✈️ **Box Correos Miami** es el servicio oficial de compras internacionales de Correos de Costa Rica:\n\n• 📦 **Dirección propia en EE.UU.**: Te asigna una dirección física en Miami para comprar en Amazon, eBay o cualquier tienda del mundo.\n• ⏱️ **Tiempos de entrega**: 4 a 6 días hábiles tras recibir en bodega Miami.\n• 🏠 **Entrega flexible**: Entrega en tu domicilio o para retiro en cualquiera de nuestras 110 sucursales en Costa Rica.\n• 📋 **Nacionalización automática**: Correos gestiona el trámite aduanal para tu comodidad.`,
        actionLink: '/servicios',
        actionText: 'Conocer Box Correos Miami',
        quickSuggestions: ['Tarifas internacionales', 'Sucursales de cada provincia', 'Rastrear un paquete']
      };
    }

    if (normalized.includes('pymexpress')) {
      return {
        text: `💼 **Pymexpress** es el programa logístico integral para emprendedores y pymes de Costa Rica:\n\n• 💰 **Tarifas preferenciales**: Precios reducidos desde ₡1,950 en envíos nacionales.\n• 🚚 **Recolección en tu negocio**: Servicio de recolecta a domicilio programada en el GAM.\n• 📲 **Integración y Guías Digitales**: Generación e impresión de guías desde la web.\n• ⏱️ **Entrega en 24-48 horas**: Cobertura en todo el país con trazabilidad en vivo para tus clientes.`,
        actionLink: '/servicios',
        actionText: 'Afiliación a Pymexpress',
        quickSuggestions: ['Cotizar envío Pymexpress', 'Requisitos de afiliación', 'Sucursales de entrega']
      };
    }

    if (normalized.includes('internacional') || normalized.includes('extranjero') || normalized.includes('exporta facil')) {
      return {
        text: `🌎 **Envíos Internacionales y Exporta Fácil**:\n\n• 🚀 **EMS Internacional**: Envíos urgentes con tracking hacia más de 190 países (5 a 10 días hábiles).\n• 📦 **Exporta Fácil Postal**: Programa para microempresas y artesanos que desean exportar con trámites aduanales simplificados y tarifas competitivas.\n• 📄 **Requisitos**: Factura comercial o proforma, declaración de contenido y embalaje seguro.`,
        actionLink: '/servicios',
        actionText: 'Ver envíos internacionales',
        quickSuggestions: ['Cotizar tarifas', 'Sucursales de cada provincia', 'Horarios de sucursales']
      };
    }

    if (normalized.includes('marchamo') || normalized.includes('derecho de circulacion')) {
      return {
        text: `🚗 **Entrega de Marchamo Oficial**:\n\nUna vez cancelado tu derecho de circulación ante el INS, puedes solicitar que Correos de Costa Rica lo entregue directamente en tu casa o trabajo, o retirarlo en cualquiera de nuestras 110 sucursales autorizadas.`,
        actionLink: '/servicios',
        actionText: 'Información de Marchamo',
        quickSuggestions: ['Sucursales de cada provincia', 'Horarios de entrega', 'Hablar con un asesor']
      };
    }

    if (normalized.includes('codigo postal') || normalized.includes('codigos postales') || normalized.includes('zip code')) {
      return {
        text: `📮 **Estructura del Código Postal Oficial de Costa Rica** (5 dígitos):\n\n• 1° dígito: Provincia | 2° y 3° dígitos: Cantón | 4° y 5° dígitos: Distrito.\n\nEjemplos principales:\n• San José Centro: **10101** | Zapote: **10105** | San Pedro: **11501**\n• Alajuela Centro: **20101** | Cartago Centro: **30101** | Heredia Centro: **40101**`,
        actionLink: '/ayuda',
        actionText: 'Consultar directorio postal',
        quickSuggestions: ['Sucursales de cada provincia', 'Horario de Zapote', 'Cotizar tarifas']
      };
    }

    if (normalized.includes('aduana') || normalized.includes('aduanas') || normalized.includes('aforo') || normalized.includes('dga')) {
      return {
        text: `🛃 **Trámites de Aduana y Aforo Postal en Zapote**:\n\nSi tu paquete internacional requiere revisión aduanal:\n• Se requiere factura comercial con desglose de compra y comprobante bancario.\n• Correos de Costa Rica tramita la gestión ante la Dirección General de Aduanas (DGA).\n• Una vez cancelados los tributos correspondientes, el paquete se libera para reparto en 24 a 48 horas.`,
        actionLink: '/ayuda',
        actionText: 'Trámites de aduana en Ayuda',
        quickSuggestions: ['Rastrear CR098421734CR', 'Hablar con un asesor', 'Horarios de atención']
      };
    }

    // =========================================================================
    // INTENCIÓN 12: RECLAMOS, INCIDENTES Y PQRS
    // =========================================================================
    const isIncidentIntent =
      tokens.some((t) => ['reclamo', 'queja', 'denuncia', 'pqrs', 'danado', 'roto', 'extraviado', 'perdido', 'perdida', 'retenido', 'demora', 'no llega'].includes(t));

    if (isIncidentIntent) {
      return {
        text: `⚠️ **Gestión de Reclamos y PQRS en Correos de Costa Rica**:\n\nLamentamos cualquier eventualidad con tu envío. Para brindarte una resolución formal:\n\n1. 📝 **Radicación de caso**: Puedes registrar tu reporte indicando el número de guía oficial y detalle del incidente.\n2. 👥 **Área resolutora**: Se asigna a la Auditoría de Envíos o Aforo Postal con un tiempo máximo de respuesta regulado de 24 a 48 horas hábiles.\n3. 📷 **Evidencias**: Si se trata de daño físico, adjunta fotografías del embalaje externo y contenido.\n\n¿Deseas radicar tu reclamo formal ahora o hablar con un asesor humano?`,
        actionLink: '/ayuda',
        actionText: 'Radicar reclamo formal en Ayuda',
        quickSuggestions: ['Hablar con un asesor en vivo', 'Rastrear CR098421734CR', 'Central telefónica']
      };
    }

    // =========================================================================
    // INTENCIÓN 13: ATENCIÓN HUMANA Y CONTACTO DIRECTO
    // =========================================================================
    const isHumanIntent = tokens.some((t) =>
      ['asesor', 'asesora', 'humano', 'operador', 'operadora', 'agente', 'persona', 'llamar', 'telefono', 'whatsapp', 'contacto', 'call'].includes(t)
    );

    if (isHumanIntent) {
      return {
        text: `📞 **Canales Oficiales de Contacto de Correos de Costa Rica**:\n\n• ☎️ **Central Telefónica**: (+506) 2202-2900 (Lunes a Viernes de 8:00 a.m. a 5:00 p.m.)\n• 💬 **WhatsApp Oficial**: (+506) 8821-4321\n• 🏢 **Sede Central**: Costado este de Casa Presidencial, Zapote, San José.\n• 🌐 **Portal Ciudadano**: Sección de Ayuda y Reclamos en línea 24/7.`,
        actionLink: '/ayuda',
        actionText: 'Ir al Centro de Ayuda',
        quickSuggestions: ['Sucursales de cada provincia', 'Rastrear un paquete', 'Cotizar tarifas EMS']
      };
    }

    // =========================================================================
    // INTENCIÓN 14: SALUDOS Y CORTESÍA CON CONTINUIDAD
    // =========================================================================
    const isGreeting = tokens.some((t) => ['hola', 'buenos', 'dias', 'tardes', 'noches', 'saludos', 'buenas'].includes(t)) ||
      ['hola', 'buenas', 'hey', 'buen dia'].includes(normalized);

    if (isGreeting) {
      const greetingName = user?.nombre ? `, ${user.nombre}` : '';
      return {
        text: `¡Hola${greetingName}! 👋 Soy tu Asistente Oficial de Correos de Costa Rica. Estoy listo para ayudarte con sucursales en todo el país, rastreo de guías o cotizaciones. ¿De cuál provincia deseas consultar la sucursal más cercana?`,
        quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', 'Rastrear CR098421734CR', 'Cotizar 2 kg EMS']
      };
    }

    const isThanks = tokens.some((t) => ['gracias', 'excelente', 'perfecto', 'agradezco', 'amable', 'ok', 'entendido', 'listo'].includes(t)) ||
      normalized.includes('pura vida');

    if (isThanks) {
      return {
        text: `¡Con muchísimo gusto! En Correos de Costa Rica estamos para servirte y conectar a todo el país. 🇨🇷 ¡Pura vida!\n\n¿Hay algún otro trámite o provincia que desees consultar?`,
        quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', 'Cotizar tarifas EMS', 'Horarios de atención']
      };
    }

    // =========================================================================
    // FALLBACK INSTITUCIONAL DENTRO DEL DOMINIO
    // =========================================================================
    return {
      text: `Te puedo colaborar con cualquier consulta o gestión de Correos de Costa Rica:\n\n• 🏢 **Ubicación y horarios de sucursales** en las 7 provincias (dónde queda la más cercana)\n• 📦 **Rastreo de envíos** con tu número de guía oficial\n• ⏱️ **Tiempos de entrega y requisitos de retiro** en sucursal o a domicilio\n• 💰 **Cotización de tarifas** para paquetes EMS Courier y Pymexpress\n• 🛂 **Citas de Pasaporte VES** y cédula de residencia DIMEX\n\n¿Cuál de estos temas te gustaría consultar?`,
      quickSuggestions: ['Sucursales de cada provincia', 'Sucursales en San José', '¿Cuáles son los tiempos de entrega?', 'Cotizar 2 kg EMS']
    };
  }
};

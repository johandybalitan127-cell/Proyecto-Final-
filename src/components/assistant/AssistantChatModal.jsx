import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, RefreshCw, Volume2, Download, User, CheckCircle2, 
  HelpCircle, Headphones, Lock, ShieldCheck, MapPin, Calendar, Clock,
  FileCheck, Calculator, Sparkles, ExternalLink
} from 'lucide-react';
import { enviosService } from '../../services/enviosService';
import { iaLogsService } from '../../services/iaLogsService';
import { n8nService } from '../../services/n8nService';
import { useAuth } from '../../hooks/useAuth';
import { TrackingCardBubble } from './TrackingCardBubble';
import initialDb from '../../data/initialDb.json';

// Detector inteligente de consultas fuera de contexto institucional de Correos de Costa Rica
const isOutOfDomainQuery = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // Excepciones donde la consulta sí tiene relación con servicios postales
  const postalKeywords = [
    'correo', 'correos', 'postal', 'paquete', 'guia', 'rastreo', 'rastrear', 'tracking',
    'sucursal', 'oficina', 'zapote', 'horario', 'tarifa', 'precio', 'cotizar', 'peso',
    'kilo', 'gramo', 'envio', 'enviar', 'mandar', 'ves', 'pasaporte', 'cedula', 'dimex',
    'cita', 'citas', 'migracion', 'box', 'miami', 'casillero', 'aduana', 'aduanas',
    'impuesto', 'aforo', 'dga', 'retenido', 'pymexpress', 'ems', 'apartado', 'apartados',
    'codigo postal', 'zip', 'asesor', 'reclamo', 'queja', 'pqrs', 'desviar', 'tiempo'
  ];

  const hasPostalContext = postalKeywords.some(pk => lower.includes(pk));

  // Patrones claros de temas ajenos a Correos de Costa Rica (marcas comerciales, comidas, deportes, entretenimiento, etc.)
  const offTopicPatterns = [
    /\b(dos pinos|pinitos|coronado|coopeleche|natilla|leche|queso|yogurt|helado|helados)\b/i,
    /\b(coca cola|pepsi|cerveza|imperial|pilsen|mcdonalds|burger king|kfc|pizza hut|taco bell|subway)\b/i,
    /\b(futbol|saprissa|la liga|alajuelense|herediano|cartagines|messi|ronaldo|champions|concacaf|estadio|fifa)\b/i,
    /\b(chiste|chistes|broma|poema|cancion|musica|cantar|pelicula|cine|serie|netflix|anime|novela)\b/i,
    /\b(receta|cocinar|cocina|ingredientes|como preparar|pastel|queque|gallo pinto)\b/i,
    /\b(politica|presidente|diputado|chaves|figueres|alcalde|elecciones)\b/i,
    /\b(clima|temperatura de hoy|va a llover|pronostico)\b/i,
    /\b(amor|pareja|novio|novia|enamorado|horoscopo|signo zodiacal|astrologia)\b/i,
    /\b(tarea|ensayo|resumen|matematicas|ecuacion|cuanto es \d+)\b/i,
    /\b(programacion|codigo python|codigo javascript|python|java|c\+\+|html|css)\b/i,
    /\b(medicina|dolor de cabeza|pastilla|remedio|sintomas|enfermedad)\b/i,
    /\b(quien gano|quien descubrio|capital de|cuando nacio|que significa la palabra)\b/i
  ];

  // Si coincide con patrones ajenos explícitos
  if (offTopicPatterns.some(p => p.test(lower))) {
    return true;
  }

  // Preguntas de definición general "qué es X" o "quién es X" sin términos postales
  if (/^(que es|quien es|que son|para que sirve|definicion de)\s+/i.test(lower) && !hasPostalContext) {
    return true;
  }

  return false;
};

export const AssistantChatModal = ({ onClose, isFloating = false }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente Postal Oficial de Correos de Costa Rica. Estoy conectado a la red nacional para ayudarte con el rastreo de envíos, cotización de tarifas, horarios de 110 sucursales y citas de pasaporte VES.',
      time: 'Ahora'
    },
    {
      id: 2,
      sender: 'bot',
      text: '¿Tienes una guía que deseas rastrear? Puedes escribir por ejemplo: "Rastrear CR098421734CR" o preguntarme sobre cualquier trámite.',
      time: 'Ahora',
      quickSuggestions: ['Rastrear CR098421734CR', 'Horario de Zapote', 'Cita de Pasaporte VES', 'Tarifas Pymexpress']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (userText = inputValue) => {
    const query = userText.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 0. Detección proactiva de preguntas fuera de contexto (marcas ajenas, temas no postales, etc.)
    if (isOutOfDomainQuery(query)) {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Esa consulta se sale de mis conocimientos y está fuera de contexto. 🚫\n\nComo Asistente Postal Oficial de Correos de Costa Rica, fui diseñado para responder exclusivamente sobre trámites, envíos y servicios de nuestra institución:\n\n• 📦 Rastreo oficial de paquetes y guías (ej. CR098421734CR)\n• 🏢 Horarios y ubicación de nuestras 110 sucursales en todo el país\n• 📅 Citas oficiales VES de Pasaporte Biométrico y DIMEX\n• 💰 Cotización de tarifas EMS, Pymexpress y envíos a domicilio\n• ✈️ Casillero Box Correos Miami y trámites de aduana\n• 📝 Radicación formal de reclamos e incidencias (PQRS)\n\n¿En qué trámite de Correos de Costa Rica te puedo colaborar hoy?`,
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
          quickSuggestions: ['Rastrear CR098421734CR', 'Horario de Zapote', 'Citas Pasaporte VES', 'Hablar con un asesor']
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);

        iaLogsService.createLog({
          usuario: user?.nombre || 'Ciudadano Web',
          consulta: query,
          intencion: 'fuera_de_contexto',
          confianza: 99.9,
          resultado: 'Fuera de contexto'
        }).catch(() => {});
      }, 500);
      return;
    }

    // 1. Invocar en tiempo real el AI Agent en N8N Cloud
    try {
      const n8nResult = await n8nService.sendChatMessage({
        message: query,
        user
      });

      if (n8nResult.success && n8nResult.replyText) {
        const botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: n8nResult.replyText,
          isN8n: true,
          n8nMeta: {
            departamento: n8nResult.departamento,
            prioridad: n8nResult.prioridad,
            ticket: n8nResult.ticket,
            sla: n8nResult.sla,
            sentimiento: n8nResult.sentimiento
          },
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
          quickSuggestions: ['Rastrear CR098421734CR', 'Horario de Zapote', 'Cita de Pasaporte VES']
        };

        setMessages((prev) => [...prev, botResponse]);

        iaLogsService.createLog({
          usuario: user?.nombre || 'Ciudadano Web',
          consulta: query,
          intencion: n8nResult.departamento || 'n8n_cloud_ai_agent',
          confianza: 99.8,
          resultado: 'Resuelto por N8N AI Agent'
        }).catch(() => {});

        setIsTyping(false);
        return;
      }
    } catch (n8nErr) {
      console.warn('Webhook N8N no disponible, activando motor postal local:', n8nErr);
    }

    // 2. Motor de contingencia postal inteligente (si N8N no responde o está en configuración)
    setTimeout(async () => {
      try {
        let botResponse = {};
        const lower = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // 1. Tracking guide extraction
        const guideMatch = query.match(/CR\d{9}CR/i) || query.match(/CP\d{9}CR/i);

        if (guideMatch || (lower.includes('rastrear') && (guideMatch || query.match(/\d{4,}/)))) {
          const targetGuide = guideMatch ? guideMatch[0].toUpperCase() : 'CR098421734CR';
          let foundEnvio = null;
          try {
            foundEnvio = await enviosService.getByIdOrGuia(targetGuide);
          } catch (e) {
            console.warn('Could not fetch envio:', e);
          }

          if (foundEnvio) {
            botResponse = {
              id: Date.now() + 1,
              sender: 'bot',
              text: `He localizado tu envío en el Sistema Integral Postal. Se encuentra actualmente en estado: "${foundEnvio.estado}". Aquí tienes el detalle en tiempo real:`,
              envio: foundEnvio,
              time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
              quickSuggestions: ['Horario de entrega', 'Desviar a casillero', 'Hablar con un asesor']
            };
          } else {
            botResponse = {
              id: Date.now() + 1,
              sender: 'bot',
              text: `No encontré registro exacto para la guía "${targetGuide}". Por favor verifica que el código tenga 13 caracteres (ejemplo: CR098421734CR). Puedes probar con la guía de demostración: CR098421734CR.`,
              time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
              quickSuggestions: ['Rastrear CR098421734CR', 'Hablar con un asesor']
            };
          }

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'rastreo_envio',
            confianza: 99.2,
            resultado: foundEnvio ? 'Resuelto' : 'No encontrado'
          }).catch(() => {});

        // 2. Asesor en vivo / Atención humana / Contacto / Teléfono / WhatsApp
        } else if (
          lower.includes('asesor') || 
          lower.includes('humano') || 
          lower.includes('en vivo') || 
          lower.includes('operador') || 
          lower.includes('agente') || 
          lower.includes('persona') ||
          lower.includes('chatear con alguien') ||
          lower.includes('telefono') ||
          lower.includes('whatsapp') ||
          lower.includes('llamar') ||
          lower.includes('contacto') ||
          lower.includes('atencion al cliente')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `¡Con gusto te comunico con nuestro equipo de atención humana! 🎧\n\n• Canal Digital en Vivo: Te hemos conectado a la cola prioritaria con el Asesor Carlos Mora (Zapote). Tiempo estimado de respuesta: menos de 1 minuto.\n• Central Telefónica Institucional: (+506) 2202-2900 (Lunes a Viernes de 8:00 a.m. a 5:00 p.m.).\n• WhatsApp Oficial: (+506) 8821-4321.\n• Centro de Operaciones Postal: Zapote, costado Oeste de Casa Presidencial.`,
            actionLink: '/oficinas',
            actionText: 'Ver Sedes y Líneas de Atención',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Horario de Zapote', 'Abrir un reclamo formal', 'Rastrear un paquete']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'transferencia_asesor',
            confianza: 98.9,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 3. Reclamos / Incidentes / PQRS / Paquete Dañado o Extraviado
        } else if (
          lower.includes('reclamo') || 
          lower.includes('queja') || 
          lower.includes('denuncia') || 
          lower.includes('incidente') || 
          lower.includes('dano') || 
          lower.includes('danado') || 
          lower.includes('roto') || 
          lower.includes('extraviado') || 
          lower.includes('perdido') || 
          lower.includes('pqrs') ||
          lower.includes('necesito mas ayuda') ||
          lower.includes('no llega')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Lamentamos el inconveniente con tu envío. Para abrir un reporte o reclamo formal (PQRS):\n\n1. Formulario Digital Oficial: Ingresa a nuestra sección de Ayuda y elige la categoría "Reclamo" o "Incidente".\n2. Requisitos: Ten a mano tu número de guía oficial (ej. CR098421734CR), fotografías del empaque o contenido y tu cédula de identidad.\n3. Resolución: Se te asignará un ticket institucional (ej. PQ-2026-0145) con un plazo máximo de respuesta de 24 a 48 horas hábiles.`,
            actionLink: '/ayuda',
            actionText: 'Radicar Reclamo Formal en Ayuda',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Hablar con un asesor en vivo', 'Rastrear CR098421734CR', 'Preguntas frecuentes']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'reclamo_pqrs',
            confianza: 97.8,
            resultado: 'Escalado'
          }).catch(() => {});

        // 4. Desvío de envíos / Casillero / Cambio de entrega
        } else if (
          lower.includes('desviar') || 
          lower.includes('desvio') || 
          lower.includes('cambiar direccion') || 
          lower.includes('cambio de entrega') || 
          lower.includes('retener en sucursal') || 
          lower.includes('cambiar sucursal') ||
          lower.includes('desviar a casillero')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Puedes solicitar el desvío o retención de tu paquete hacia cualquiera de nuestras 110 sucursales o casilleros inteligentes:\n\n• Requisito: El paquete debe estar en estado "Recibido" o "En Centro de Clasificación" antes de su salida a ruta final de entrega.\n• Procedimiento: Puedes solicitar el cambio en línea desde el detalle de tu paquete o indicárselo a un asesor en ventanilla virtual con tu número de guía y documento de identidad.`,
            actionLink: '/oficinas',
            actionText: 'Ver 110 Sucursales Disponibles',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Hablar con un asesor en vivo', 'Rastrear CR098421734CR', 'Horario de Zapote']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'desvio_envio',
            confianza: 96.5,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 5. Códigos Postales
        } else if (
          lower.includes('codigo postal') || 
          lower.includes('codigos postales') || 
          lower.includes('cp ') || 
          lower.includes('zip')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `El Código Postal oficial en Costa Rica consta de 5 dígitos (1° dígito: Provincia, 2° y 3°: Cantón, 4° y 5°: Distrito):\n\n• San José Centro: 10101 | Zapote: 10105 | San Pedro: 11501 | Escazú: 10201\n• Alajuela Centro: 20101 | San Ramón: 20201\n• Cartago Centro: 30101 | Paraíso: 30201\n• Heredia Centro: 40101 | Flores: 40801\n• Liberia: 50101 | Puntarenas: 60101 | Limón: 70101\n\nPuedes consultar el buscador y mapa de distritos en nuestra plataforma.`,
            actionLink: '/ayuda',
            actionText: 'Consultar Directorio Postal',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Horario de Zapote', 'Sucursales San José', 'Tarifas EMS']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'codigo_postal',
            confianza: 98.4,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 6. Consultas de Sucursal específica por nombre (Zapote, San Pedro, Alajuela, Cartago, etc.)
        } else if (
          initialDb.sucursales && initialDb.sucursales.some(s => {
            const cleanName = s.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const cleanProv = s.provincia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return cleanName.split(' ').some(w => w.length > 4 && lower.includes(w)) || lower.includes(cleanProv);
          })
        ) {
          const matchedSuc = initialDb.sucursales.find(s => {
            const cleanName = s.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const cleanProv = s.provincia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return cleanName.split(' ').some(w => w.length > 4 && lower.includes(w)) || lower.includes(cleanProv);
          }) || initialDb.sucursales[0];

          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `📍 ${matchedSuc.nombre} (${matchedSuc.provincia}):\n\n• Dirección: ${matchedSuc.direccion}\n• Horario de atención: ${matchedSuc.horario}\n• Teléfono directo: ${matchedSuc.telefono}\n• Servicios especiales: ${matchedSuc.serviciosEspeciales ? matchedSuc.serviciosEspeciales.join(', ') : 'Ventanilla General, Pasaportes VES'}\n• Estado actual: ${matchedSuc.estado}`,
            actionLink: '/oficinas',
            actionText: 'Ver Sucursal en el Mapa Nacional',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Cita de Pasaporte VES', 'Tarifas Pymexpress', 'Hablar con un asesor']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'consulta_sucursal_especifica',
            confianza: 98.0,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 7. Horarios y Sucursales en general
        } else if (
          lower.includes('horario') || 
          lower.includes('hora') || 
          lower.includes('sucursal') || 
          lower.includes('sucursales') || 
          lower.includes('oficina') || 
          lower.includes('oficinas') || 
          lower.includes('abren') || 
          lower.includes('cierran')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Nuestra red cuenta con 110 sucursales en todo el país:\n\n• Horario General: Lunes a Viernes de 8:00 a.m. a 5:00 p.m. de forma continua.\n• Sucursales Principales (Zapote Central, San Pedro, Alajuela, Heredia): Abiertas también Sábados de 8:00 a.m. a 12:00 m.d. con ventanillas activas de Pasaportes VES y Apartados Box.\n• Sede Principal Zapote: Costado Oeste de Casa Presidencial, San José.`,
            actionLink: '/oficinas',
            actionText: 'Ver Horarios de las 110 Sucursales',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Horario de Zapote', 'Sucursal San Pedro', 'Cita de Pasaporte VES']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'consulta_horario_general',
            confianza: 97.4,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 8. Pasaporte, Cédula de Residencia y Citas VES
        } else if (
          lower.includes('pasaporte') || 
          lower.includes('cedula') || 
          lower.includes('ves') || 
          lower.includes('cita') || 
          lower.includes('citas') || 
          lower.includes('migracion') || 
          lower.includes('sidge')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Para citas oficiales de Pasaporte o Cédula de Residencia mediante la Ventanilla Electrónica de Servicios (VES - SIDGE):\n\n1. Pago oficial: Cancela el arancel oficial en el Banco de Costa Rica (BCR) a nombre de la Dirección General de Migración y Extranjería.\n2. Requisitos: Presentar comprobante de pago bancario, cédula vigente y en buen estado (en caso de menores de edad, deben presentarse ambos padres con certificación de nacimiento).\n3. Agendar Cita: Elige la sucursal autorizada más conveniente entre las 110 sedes del país para la toma de datos biométricos.`,
            actionLink: '/oficinas',
            actionText: 'Agendar Cita en Sucursales VES',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Horarios de atención', 'Sucursal Central Zapote', 'Hablar con un asesor']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'cita_ves',
            confianza: 98.5,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 9. Tarifas, Precios y Pymexpress
        } else if (
          lower.includes('tarifa') || 
          lower.includes('costo') || 
          lower.includes('precio') || 
          lower.includes('cuanto cuesta') || 
          lower.includes('cotizar') || 
          lower.includes('cotizacion') || 
          lower.includes('kilo') || 
          lower.includes('peso') || 
          lower.includes('pymexpress')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Tarifas oficiales vigentes para paquetería:\n\n• EMS Courier Nacional (Entrega 24-48h con trazabilidad):\n  - 0 a 1 kg: ₡2,350\n  - 1 a 2 kg: ₡3,400\n  - 2 a 5 kg: ₡5,200\n• Pymexpress (Tarifa preferencial MiPyme con recolección en GAM):\n  - 0 a 1 kg: ₡1,950\n  - 1 a 2 kg: ₡2,750\n• Paquete Postal Regular: Desde ₡1,400 (48-72h)\n• EMS Internacional: Desde ₡14,500 hacia más de 190 países.`,
            actionLink: '/servicios',
            actionText: 'Abrir Calculadora de Tarifas en Línea',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Rastrear CR098421734CR', 'Afiliación Pymexpress', 'Box Correos Miami']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'cotizar_tarifa',
            confianza: 98.1,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 10. Box Correos Miami / Casillero / Compras por Internet
        } else if (
          lower.includes('box') || 
          lower.includes('miami') || 
          lower.includes('casillero') || 
          lower.includes('compras por internet') || 
          lower.includes('amazon') || 
          lower.includes('shein')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Box Correos es nuestro casillero internacional oficial en Miami, Estados Unidos:\n\n• Tarifa: Desde $4.50 por libra más aranceles aduaneros.\n• Afiliación: 100% gratuita y te asigna dirección física en Miami al instante.\n• Tiempos: De 4 a 6 días hábiles una vez recibido en nuestra bodega de Miami.\n• Entrega: Directo a tu domicilio o para retiro en cualquiera de las 110 sucursales del país.`,
            actionLink: '/servicios',
            actionText: 'Conocer más de Box Correos Miami',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Tarifas de envío', 'Rastrear un paquete', 'Hablar con un asesor']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'box_correos',
            confianza: 97.2,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 11. Aduanas / Impuestos / Paquete Retenido
        } else if (
          lower.includes('aduana') || 
          lower.includes('aduanas') || 
          lower.includes('impuesto') || 
          lower.includes('impuestos') || 
          lower.includes('retenido') || 
          lower.includes('aforo') || 
          lower.includes('factura comercial')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Información sobre paquetes en trámite o aforo aduanal:\n\n• Si tu envío internacional está en revisión aduanal, se requiere remitir factura comercial con detalle de artículos y comprobante bancario de pago.\n• Correos de Costa Rica actúa como intermediario oficial ante la Dirección General de Aduanas (DGA).\n• Una vez cancelados los tributos correspondientes, el paquete se libera para distribución nacional en 24 a 48 horas.`,
            actionLink: '/ayuda',
            actionText: 'Gestión de Trámites Aduaneros',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Hablar con un asesor en vivo', 'Rastrear CR098421734CR']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'aduanas_tramite',
            confianza: 96.8,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 12. Tiempos de entrega / Plazos
        } else if (
          lower.includes('tiempo') || 
          lower.includes('tarda') || 
          lower.includes('demora') || 
          lower.includes('plazo') || 
          lower.includes('cuando llega')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `Tiempos de entrega oficiales de Correos de Costa Rica:\n\n• EMS Courier Nacional (GAM): 24 horas hábiles.\n• EMS Courier Nacional (Rural): 24 a 48 horas hábiles.\n• Paquete Postal Regular: 48 a 72 horas hábiles.\n• Box Correos Miami: 4 a 6 días hábiles tras recibirlo en bodega Miami.\n• EMS Internacional al exterior: 3 a 7 días hábiles según el país de destino.`,
            actionLink: '/cuenta/rastreo',
            actionText: 'Rastrear mi paquete ahora',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Rastrear CR098421734CR', 'Tarifas EMS', 'Hablar con un asesor']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'tiempos_entrega',
            confianza: 97.5,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 13. Saludos
        } else if (
          lower.includes('hola') || 
          lower.includes('buenos dias') || 
          lower.includes('buenas tardes') || 
          lower.includes('buenas noches') || 
          lower.includes('saludos') || 
          lower === 'buenas' || 
          lower === 'hey'
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `¡Hola! Con mucho gusto te asisto. 👋 Soy el Asistente Postal Oficial de Correos de Costa Rica. Estoy en línea 24/7 para ayudarte con trámites postales.\n\n¿En qué te puedo colaborar hoy? Puedes consultarme sobre el rastreo de un paquete, horarios de sucursales, citas de pasaporte VES, cotización de tarifas o solicitar hablar con un asesor en vivo.`,
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Rastrear CR098421734CR', 'Horario de Zapote', 'Cita de Pasaporte VES', 'Quiero hablar con un asesor en vivo']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'saludo',
            confianza: 99.5,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 14. Agradecimientos / Pura vida
        } else if (
          lower.includes('gracias') || 
          lower.includes('pura vida') || 
          lower.includes('excelente') || 
          lower.includes('muchas gracias') || 
          lower.includes('perfecto')
        ) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `¡Con muchísimo gusto! En Correos de Costa Rica estamos para servirte y conectar a todo el país. Si tienes otra consulta o necesitas ayuda con algún trámite, cuenta conmigo. ¡Pura vida! 🇨🇷`,
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
            quickSuggestions: ['Rastrear otro paquete', 'Horarios de sucursales', 'Tarifas']
          };

          iaLogsService.createLog({
            usuario: 'Ciudadano Web',
            consulta: query,
            intencion: 'agradecimiento',
            confianza: 99.0,
            resultado: 'Resuelto'
          }).catch(() => {});

        // 15. Búsqueda inteligente en base de datos de preguntas frecuentes (FAQ)
        } else {
          const matchingFaq = initialDb.faq && initialDb.faq.find(f => {
            const fPregunta = f.pregunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const keywords = lower.split(' ').filter(w => w.length > 3);
            return keywords.some(k => fPregunta.includes(k));
          });

          if (matchingFaq) {
            botResponse = {
              id: Date.now() + 1,
              sender: 'bot',
              text: `Sobre tu consulta (${matchingFaq.categoria}):\n\n${matchingFaq.respuesta}`,
              time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
              quickSuggestions: ['Hablar con un asesor en vivo', 'Ver sucursales', 'Rastrear un paquete']
            };

            iaLogsService.createLog({
              usuario: 'Ciudadano Web',
              consulta: query,
              intencion: 'faq_match',
              confianza: 94.5,
              resultado: 'Resuelto'
            }).catch(() => {});
          } else {
            botResponse = {
              id: Date.now() + 1,
              sender: 'bot',
              text: `Esa consulta se sale de mis conocimientos y está fuera de contexto. 🚫\n\nComo Asistente Postal Oficial de Correos de Costa Rica, fui diseñado para responder exclusivamente sobre trámites, envíos y servicios de nuestra institución:\n\n• 📦 Rastreo de paquetes y guías (ej. CR098421734CR)\n• 🏢 Horarios y ubicación de nuestras 110 sucursales en todo el país\n• 📅 Citas oficiales de pasaporte y cédulas VES\n• 💰 Tarifas de envíos Pymexpress, EMS y entregas a domicilio\n• ✈️ Casillero Box Correos Miami y gestión aduanal\n\n¿En qué trámite de Correos de Costa Rica te puedo colaborar hoy? Si necesitas un trámite especial, también puedes hablar con un asesor humano en vivo:`,
              time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
              quickSuggestions: ['Quiero hablar con un asesor en vivo', 'Rastrear CR098421734CR', 'Horario de Zapote', 'Tarifas Pymexpress', 'Cita Pasaporte VES']
            };

            iaLogsService.createLog({
              usuario: user?.nombre || 'Ciudadano Web',
              consulta: query,
              intencion: 'fuera_de_contexto',
              confianza: 95.0,
              resultado: 'Fuera de contexto'
            }).catch(() => {});
          }
        }

        setMessages((prev) => [...prev, botResponse]);
      } catch (err) {
        console.error('Error generating assistant response:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'Disculpa, ocurrió una intermitencia al procesar tu solicitud. Por favor intenta de nuevo.',
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 600);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Conversación reiniciada. ¿En qué trámite postal te puedo asistir ahora?',
        time: 'Ahora'
      }
    ]);
  };

  const handleAudio = () => {
    if ('speechSynthesis' in window) {
      const lastMsg = [...messages].reverse().find(m => m.sender === 'bot');
      if (lastMsg) {
        const utterance = new SpeechSynthesisUtterance(lastMsg.text);
        utterance.lang = 'es-CR';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleDownload = () => {
    const textLog = messages.map(m => `[${m.time}] ${m.sender === 'bot' ? 'Asistente IA' : 'Usuario'}: ${m.text}`).join('\n\n');
    const blob = new Blob([textLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-correos-cr-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const content = (
    <div className={`bg-white flex flex-col md:flex-row overflow-hidden shadow-2xl border border-gray-200 ${
      isFloating 
        ? 'w-[94vw] max-w-4xl h-[85vh] max-h-[720px] rounded-2xl fixed bottom-24 right-4 sm:right-6 z-50' 
        : 'w-full rounded-2xl min-h-[720px]'
    }`}>
      
      {/* Main Chat Column (Left ~2/3) */}
      <div className="flex-1 flex flex-col h-full bg-gris-claro border-r border-gray-200">
        
        {/* Chat Header */}
        <div className="bg-azul-oscuro text-white px-5 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azul-primario flex items-center justify-center text-white border border-sky-400/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">Asistente Postal IA — OFICIAL</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-verde-principal text-white uppercase tracking-wider">
                  En Línea
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Modelo Neuronal Conectado · SINPE/SUTEL Compatible
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleAudio}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
              title="Escuchar respuesta en voz alta"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
              title="Descargar historial de chat"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
              title="Reiniciar chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-red-500 transition ml-1"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status ticker */}
        <div className="bg-sky-50 px-4 py-2 border-b border-sky-100 flex items-center justify-between text-xs text-azul-oscuro">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-azul-oscuro">Conectado a N8N Cloud:</span>
            <a 
              href="https://johandyblitan.app.n8n.cloud/webhook/pqrs-ciudadana" 
              target="_blank" 
              rel="noreferrer"
              className="font-mono text-[10px] text-azul-primario hover:underline bg-white px-2 py-0.5 rounded border border-sky-200 flex items-center gap-1 shadow-2xs"
              title="Webhook de N8N en la nube activo"
            >
              <span>johandyblitan.app.n8n.cloud</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <span className="hidden sm:inline text-[11px] text-gray-500 font-medium">
            AI Agent UPU Activo 24/7
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-azul-oscuro text-white'
                    : 'bg-azul-primario text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-azul-primario text-white rounded-tr-none'
                      : 'bg-white text-gris-oscuro rounded-tl-none border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* N8N AI Agent Badge & Metadata */}
                  {msg.isN8n && msg.n8nMeta && (
                    <div className="mt-2.5 pt-2 border-t border-sky-200/50 text-[10px] space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 font-semibold text-azul-oscuro">
                        <span className="bg-sky-100 text-azul-primario px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <span>🤖</span>
                          <span>AI Agent N8N Cloud</span>
                        </span>
                        {msg.n8nMeta.departamento && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
                            {msg.n8nMeta.departamento}
                          </span>
                        )}
                        {msg.n8nMeta.prioridad && (
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            msg.n8nMeta.prioridad === 'Alta' 
                              ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            Prioridad: {msg.n8nMeta.prioridad}
                          </span>
                        )}
                      </div>
                      {msg.n8nMeta.sla && (
                        <p className="text-[10px] text-gray-500 italic">
                          Plazo de resolución: {msg.n8nMeta.sla}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Embedded Tracking Card if available */}
                  {msg.envio && (
                    <div className="mt-3">
                      <TrackingCardBubble envio={msg.envio} />
                    </div>
                  )}

                  {/* Action link */}
                  {msg.actionLink && (
                    <a
                      href={msg.actionLink}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-azul-primario font-semibold text-xs border border-sky-200 hover:bg-sky-100 transition"
                    >
                      <span>{msg.actionText || 'Ver trámite'}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>

                {/* Quick suggestions */}
                {msg.quickSuggestions && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.quickSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] font-medium px-2.5 py-1 bg-white text-azul-primario rounded-full border border-sky-200 hover:bg-sky-50 hover:border-azul-primario transition shadow-2xs"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-gray-400 block px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-azul-primario text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-azul-primario animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-azul-primario animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-azul-primario animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick action buttons row (Section 8 of prompt) */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSend('¿Cómo abro un reclamo o reporte de incidente?')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-azul-primario" />
            <span>❓ Necesito más ayuda</span>
          </button>
          <button
            onClick={() => handleSend('Quiero hablar con un asesor en vivo')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-azul-primario hover:bg-sky-100 transition flex items-center gap-1"
          >
            <Headphones className="w-3.5 h-3.5 text-azul-primario" />
            <span>👤 Hablar con un asesor en vivo</span>
          </button>
          <button
            onClick={() => handleSend('¿Cómo desviar mi envío a un casillero o sucursal?')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>🔒 Desviar a casillero</span>
          </button>
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu consulta aquí (ej. ¿Cuál es el horario de Zapote?)…"
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gris-oscuro focus:outline-none focus:ring-2 focus:ring-azul-primario focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="btn-primario py-2.5 px-4 rounded-xl text-xs sm:text-sm disabled:opacity-40"
          >
            <span>Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Right Column: Capacidades & Autoservicio (~1/3) */}
      <div className="hidden lg:flex w-80 bg-white flex-col p-5 space-y-6 overflow-y-auto">
        
        {/* Panel 1: Capacidades del Asistente */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-azul-primario" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
              Capacidades del Asistente
            </h3>
          </div>
          <p className="text-[11px] text-gray-500">IA Generativa Institucional con datos oficiales</p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gris-oscuro">Mock API JSON Server Enlazada</p>
                <p className="text-[11px] text-gray-500">Rastreo sincronizado de guías CR en vivo</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gris-oscuro">Gestión de Citas VES</p>
                <p className="text-[11px] text-gray-500">Pasaportes y cédulas en 110 sucursales</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <Calculator className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gris-oscuro">Tarifador Pymexpress</p>
                <p className="text-[11px] text-gray-500">Cálculo de envíos nacionales e internacionales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Atención Ciudadana */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 space-y-3">
          <h4 className="text-xs font-bold text-azul-oscuro">Atención Ciudadana</h4>
          <p className="text-[11px] text-gray-600">3 asesores en línea en el Centro de Operaciones Zapote</p>
          
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-azul-primario text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">AL</div>
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">JB</div>
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">CM</div>
          </div>

          <button
            onClick={() => handleSend('Solicito hablar con un asesor humano en vivo por favor')}
            className="w-full btn-neutro text-xs py-2 justify-center"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>🎧 Solicitar Asesor Humano</span>
          </button>
        </div>

        {/* Panel 3: Herramientas en Autoservicio */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Herramientas en Autoservicio
          </h4>
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleSend('¿Cuáles son los códigos postales de Costa Rica?')}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-between"
            >
              <span>Buscador de Códigos Postales</span>
              <span className="text-gray-400">→</span>
            </button>
            <button
              onClick={() => handleSend('¿Cuáles son los horarios de las 110 sucursales?')}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-between"
            >
              <span>Horarios de 110 Sucursales</span>
              <span className="text-gray-400">→</span>
            </button>
            <button
              onClick={() => handleSend('Quiero agendar cita para pasaporte VES')}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-between"
            >
              <span>Agendar Cita Pasaporte VES</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );

  if (isFloating) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-2 sm:p-6 bg-black/30 backdrop-blur-xs animate-fadeIn">
        {content}
      </div>
    );
  }

  return content;
};

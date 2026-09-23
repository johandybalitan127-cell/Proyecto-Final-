import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, RefreshCw, Volume2, Download, User, CheckCircle2, 
  HelpCircle, Headphones, Lock, ShieldCheck, MapPin, Calendar, Clock,
  FileCheck, Calculator, Sparkles
} from 'lucide-react';
import { enviosService } from '../../services/enviosService';
import { iaLogsService } from '../../services/iaLogsService';
import { TrackingCardBubble } from './TrackingCardBubble';

export const AssistantChatModal = ({ onClose, isFloating = false }) => {
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

    // Natural Language Processing Simulator
    setTimeout(async () => {
      let botResponse = {};
      const lower = query.toLowerCase();

      // Tracking guide extraction
      const guideMatch = query.match(/CR\d{9}CR/i) || query.match(/CP\d{9}CR/i);

      if (guideMatch || lower.includes('rastrear') || lower.includes('donde esta mi paquete') || lower.includes('guia')) {
        const targetGuide = guideMatch ? guideMatch[0].toUpperCase() : 'CR098421734CR';
        const foundEnvio = await enviosService.getByIdOrGuia(targetGuide);

        if (foundEnvio) {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `He localizado tu envío en el Sistema Integral Postal. Se encuentra actualmente en estado: "${foundEnvio.estado}". Aquí tienes el detalle en tiempo real:`,
            envio: foundEnvio,
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
          };
        } else {
          botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            text: `No encontré registro exacto para la guía "${targetGuide}". Por favor verifica que tenga el formato oficial (ej. CR098421734CR). También puedes probar con la guía de prueba CR098421734CR.`,
            time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
          };
        }

        // Register in NLP logs
        iaLogsService.createLog({
          usuario: 'Ciudadano Web',
          consulta: query,
          intencion: 'rastreo_envio',
          confianza: 98.6,
          resultado: 'Resuelto'
        });

      } else if (lower.includes('horario') || lower.includes('zapote') || lower.includes('sucursal')) {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'La Sucursal Central de Zapote (Ventanilla Principal) atiende de Lunes a Viernes de 8:00 a.m. a 5:00 p.m. y Sábados de 8:00 a.m. a 12:00 m.d. Cuenta con ventanilla activa de Pasaportes VES y Casilleros Box.',
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
        };
        iaLogsService.createLog({
          usuario: 'Ciudadano Web',
          consulta: query,
          intencion: 'consulta_horario',
          confianza: 97.4,
          resultado: 'Resuelto'
        });

      } else if (lower.includes('pasaporte') || lower.includes('cedula') || lower.includes('ves') || lower.includes('cita')) {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Para citas oficiales de Pasaporte y Cédula de Residencia (Convenio VES - SIDGE), puedes agendar tu espacio en cualquiera de nuestras 110 sucursales autorizadas. Requieres tu comprobante de pago bancario y cédula vigente.',
          actionLink: '/oficinas',
          actionText: 'Agendar Cita en Sucursales Autorizadas',
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
        };
        iaLogsService.createLog({
          usuario: 'Ciudadano Web',
          consulta: query,
          intencion: 'cita_ves',
          confianza: 98.1,
          resultado: 'Resuelto'
        });

      } else if (lower.includes('tarifa') || lower.includes('costo') || lower.includes('pymexpress') || lower.includes('precio')) {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Las tarifas de EMS Courier Nacional inician en ₡2,350 para paquetes de 0 a 1 kg. Para emprendedores inscritos en Pymexpress, la tarifa preferencial es de ₡1,950 con recolección incluida en la GAM.',
          actionLink: '/servicios',
          actionText: 'Ver Calculadora de Tarifas',
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
        };
        iaLogsService.createLog({
          usuario: 'Ciudadano Web',
          consulta: query,
          intencion: 'cotizar_tarifa',
          confianza: 96.2,
          resultado: 'Resuelto'
        });

      } else {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: `Entiendo tu consulta sobre "${query}". Puedes rastrear cualquier paquete introduciendo el número de guía (ej. CR098421734CR), cotizar envíos o solicitar la derivación con un asesor humano en ventanilla.`,
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
        };
        iaLogsService.createLog({
          usuario: 'Ciudadano Web',
          consulta: query,
          intencion: 'informacion_general',
          confianza: 92.0,
          resultado: 'Resuelto'
        });
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
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
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Agente en línea · ⚡ Inmediato · ⇄ API Institucional activa</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-gray-500 font-medium">
            Atención ciudadana 24/7
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
                  <p>{msg.text}</p>

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

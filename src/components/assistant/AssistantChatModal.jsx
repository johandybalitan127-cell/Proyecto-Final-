import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, X, RefreshCw, Volume2, Download, User, CheckCircle2,
  HelpCircle, Headphones, Lock, Calendar, Calculator, Sparkles, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { aiAssistantService } from '../../services/aiAssistantService';
import { n8nService } from '../../services/n8nService';
import { TrackingCardBubble } from './TrackingCardBubble';

export const AssistantChatModal = ({ onClose, isFloating = false }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! Soy tu Asistente Postal Oficial de Correos de Costa Rica. Estoy conectado a la red nacional para ayudarte con rastreo en vivo, consultas de sucursales, cotizaciones y trámites.',
      time: 'Ahora'
    },
    {
      id: 2,
      sender: 'bot',
      text: 'Puedes escribirme de forma natural. Por ejemplo: "¿Dónde está mi paquete CR098421734CR?", "¿A qué hora abre la sucursal de Zapote?" o "¿Cuánto cuesta enviar 2 kg?".',
      time: 'Ahora',
      quickSuggestions: ['Rastrear CR098421734CR', 'Horario de Zapote', 'Cotizar 2 kg EMS', 'Cita Pasaporte VES']
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
    if (!query || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Procesa con Lenguaje Natural y datos dinámicos (N8N o NLP institucional)
      const response = await aiAssistantService.processMessage({ message: query, user, history: messages });

      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        envio: response.envio || null,
        actionLink: response.actionLink || null,
        actionText: response.actionText || null,
        isN8n: Boolean(response.isN8n),
        n8nMeta: response.n8nMeta || null,
        quickSuggestions: response.quickSuggestions || null,
        time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error('Error al procesar consulta:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Disculpa, ocurrió un inconveniente temporal al consultar los servicios. Por favor intenta de nuevo en unos momentos.',
          time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Conversación reiniciada. ¿En qué trámite postal te puedo asistir ahora?',
        time: 'Ahora',
        quickSuggestions: ['Rastrear CR098421734CR', 'Horarios de sucursales', 'Cotizar tarifas']
      }
    ]);
  };

  const handleAudio = () => {
    if ('speechSynthesis' in window) {
      const lastBotMsg = [...messages].reverse().find((m) => m.sender === 'bot');
      if (lastBotMsg) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastBotMsg.text);
        utterance.lang = 'es-CR';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleDownload = () => {
    const textLog = messages
      .map((m) => `[${m.time}] ${m.sender === 'bot' ? 'Asistente IA' : 'Usuario'}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([textLog], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-correos-cr-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <div
      className={`bg-white flex flex-col md:flex-row overflow-hidden shadow-2xl border border-gray-200 ${
        isFloating
          ? 'w-[94vw] max-w-4xl h-[85vh] max-h-[720px] rounded-2xl fixed bottom-24 right-4 sm:right-6 z-50'
          : 'w-full rounded-2xl min-h-[720px]'
      }`}
    >
      {/* Columna Principal del Chat */}
      <div className="flex-1 flex flex-col h-full bg-gris-claro border-r border-gray-200">
        
        {/* Cabecera del Chat */}
        <div className="bg-azul-oscuro text-white px-5 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azul-primario flex items-center justify-center text-white border border-sky-400/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">Asistente Postal IA</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-verde-principal text-white uppercase tracking-wider">
                  En Línea
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                Lenguaje Natural · Red Postal Conectada en Tiempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleAudio}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
              title="Escuchar última respuesta en voz alta"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
              title="Descargar historial de conversación"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition"
              title="Reiniciar conversación"
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

        {/* Ticker de Estado de Conexión */}
        <div className="bg-sky-50 px-4 py-2 border-b border-sky-100 flex items-center justify-between text-xs text-azul-oscuro">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold">Webhook N8N:</span>
            <span className="font-mono text-[10px] text-azul-primario bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold shadow-2xs">
              localhost:5678/webhook/pqrs-ciudadana
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-gray-500 font-medium">
            Conectado en Vivo
          </span>
        </div>

        {/* Cuerpo de Mensajes */}
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

                  {/* Metadatos N8N si provienen de webhook */}
                  {msg.isN8n && msg.n8nMeta && (
                    <div className="mt-2.5 pt-2 border-t border-sky-200/50 text-[10px] space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 font-semibold text-azul-oscuro">
                        <span className="bg-sky-100 text-azul-primario px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <span>🤖</span>
                          <span>AI Agent N8N</span>
                        </span>
                        {msg.n8nMeta.departamento && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
                            {msg.n8nMeta.departamento}
                          </span>
                        )}
                        {msg.n8nMeta.prioridad && (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                            Prioridad: {msg.n8nMeta.prioridad}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tarjeta interactiva de seguimiento si hay datos de envío */}
                  {msg.envio && (
                    <div className="mt-3">
                      <TrackingCardBubble envio={msg.envio} />
                    </div>
                  )}

                  {/* Enlace de acción dinámico */}
                  {msg.actionLink && (
                    <a
                      href={msg.actionLink}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-azul-primario font-semibold text-xs border border-sky-200 hover:bg-sky-100 transition"
                    >
                      <span>{msg.actionText || 'Ver trámite'}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>

                {/* Sugerencias contextuales rápidas */}
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

        {/* Botones de Acción Rápida */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSend('¿Cómo abro un reclamo formal?')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-azul-primario" />
            <span>Ayuda y Reclamos</span>
          </button>
          <button
            onClick={() => handleSend('Quiero hablar con un asesor')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-sky-50 text-azul-primario hover:bg-sky-100 transition flex items-center gap-1"
          >
            <Headphones className="w-3.5 h-3.5 text-azul-primario" />
            <span>Hablar con un asesor</span>
          </button>
          <button
            onClick={() => handleSend('¿Cuáles son los horarios de las sucursales?')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Horarios de Sucursales</span>
          </button>
        </div>

        {/* Barra de Entrada de Texto */}
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
            placeholder="Escribe tu consulta en lenguaje natural (ej. ¿A qué hora abre Zapote?)…"
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gris-oscuro focus:outline-none focus:ring-2 focus:ring-azul-primario focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="btn-primario py-2.5 px-4 rounded-xl text-xs sm:text-sm disabled:opacity-40"
          >
            <span>Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Columna Derecha: Capacidades y Autoservicio Dinámico */}
      <div className="hidden lg:flex w-80 bg-white flex-col p-5 space-y-6 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-azul-primario" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-azul-oscuro">
              Capacidades Inteligentes
            </h3>
          </div>
          <p className="text-[11px] text-gray-500">
            Procesamiento en lenguaje natural sincronizado con la base de datos nacional
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gris-oscuro">Rastreo de Envíos en Vivo</p>
                <p className="text-[11px] text-gray-500">Consulta en tiempo real con números de guía CR</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gris-oscuro">Red de Sucursales y Citas</p>
                <p className="text-[11px] text-gray-500">Horarios, teléfonos y trámites VES oficiales</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5">
              <Calculator className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gris-oscuro">Cotizador Dinámico</p>
                <p className="text-[11px] text-gray-500">Cálculo de tarifas EMS y Pymexpress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Soporte */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 space-y-3">
          <h4 className="text-xs font-bold text-azul-oscuro">Atención Ciudadana</h4>
          <p className="text-[11px] text-gray-600">
            Canales institucionales de soporte y atención humana
          </p>
          <button
            onClick={() => handleSend('Quiero hablar con un asesor')}
            className="w-full btn-neutro text-xs py-2 justify-center"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Solicitar Contacto Humano</span>
          </button>
        </div>

        {/* Enlaces Rápidos de Autoservicio */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Consultas Frecuentes
          </h4>
          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleSend('¿Cuáles son los horarios de las sucursales?')}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-between"
            >
              <span>Horarios de Sucursales</span>
              <span className="text-gray-400">→</span>
            </button>
            <button
              onClick={() => handleSend('¿Cuánto cuesta un envío de 1 kilo?')}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-between"
            >
              <span>Cotizar Paquete 1 Kg</span>
              <span className="text-gray-400">→</span>
            </button>
            <button
              onClick={() => handleSend('¿Cómo agendar una cita para pasaporte VES?')}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-between"
            >
              <span>Citas de Pasaporte VES</span>
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

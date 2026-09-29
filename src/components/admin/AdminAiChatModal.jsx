import React, { useState, useEffect, useRef } from 'react';
import { adminAiService } from '../../services/adminAiService';
import { Link } from 'react-router-dom';
import { GoogleIcon } from '../common/GoogleIcon';
import { formatAiTextWithGoogleFonts } from '../common/aiTextFormatter';

export const AdminAiChatModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  currentBranch = 'Sucursal Central San José',
  currentPeriod = '30d',
  initialQuery = ''
}) => {
  const periodLabel = typeof currentPeriod === 'object' ? currentPeriod.label : currentPeriod;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `👋 **¡Bienvenido al Copiloto Ejecutivo Postal IA (SIP-CR)!**\n\nEstoy conectado en tiempo real a la telemetría operativa de **${currentBranch}** (${periodLabel}). Puedo asistirte en la toma de decisiones, análisis de rendimiento, detección de incidencias o gestión de personal y reclamos.`,
      time: 'Ahora',
      metrics: [
        { label: 'Sedes Conectadas', value: '110' },
        { label: 'Tasa a Tiempo', value: '98.2%' },
        { label: 'IA Resueltas', value: '94%' }
      ],
      quickSuggestions: [
        'Resumen operativo general',
        '¿Cuáles envíos presentan incidencias?',
        'Rendimiento en Alajuela vs San José',
        'Estado de reclamos PQRS'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSend(initialQuery);
    }
  }, [isOpen, initialQuery]);

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
      const response = await adminAiService.processAdminMessage({
        message: query,
        currentBranch,
        currentPeriod,
        history: messages
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        actionLink: response.actionLink || null,
        actionText: response.actionText || null,
        dataBadge: response.dataBadge || null,
        metrics: response.metrics || null,
        quickSuggestions: response.quickSuggestions || null,
        time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error al procesar consulta en Admin AI:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Disculpa, ocurrió un error temporal al consultar los registros del servidor. Por favor intenta de nuevo en unos instantes.',
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
        id: Date.now(),
        sender: 'bot',
        text: `Conversación reiniciada. ¿Qué métrica o aspecto operativo de **${currentBranch}** deseas auditar ahora?`,
        time: 'Ahora',
        quickSuggestions: [
          'Resumen operativo general',
          'Envíos con incidencias',
          'Rendimiento por sedes',
          'Gestión de personal'
        ]
      }
    ]);
  };

  const handleAudio = () => {
    if ('speechSynthesis' in window) {
      const lastBotMsg = [...messages].reverse().find((m) => m.sender === 'bot');
      if (lastBotMsg) {
        window.speechSynthesis.cancel();
        const cleanText = lastBotMsg.text.replace(/[*#_`•]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-CR';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleDownload = () => {
    const textLog = messages
      .map((m) => `[${m.time}] ${m.sender === 'bot' ? 'Copiloto Admin IA' : 'Administrador'}:\n${m.text}`)
      .join('\n\n----------------------------------------\n\n');
    const blob = new Blob([textLog], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-copiloto-admin-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl h-[90vh] max-h-[780px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gris-oscuro"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-ai-modal-title"
      >
        {/* Cabecera Oficial Institucional con Google Fonts Icons */}
        <div className="bg-azul-oscuro text-white px-5 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azul-primario flex items-center justify-center text-white border border-sky-400/30 shadow-xs">
              <GoogleIcon name="smart_toy" size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="admin-ai-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>Copiloto Ejecutivo Postal IA</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-verde-principal text-white uppercase tracking-wider">
                    SIP-CR PRO
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-sky-200 flex items-center gap-1.5">
                <GoogleIcon name="sensors" size={14} className="text-sky-300 animate-pulse" />
                <span>Telemetría en tiempo real: <strong className="text-white">{currentBranch}</strong></span>
              </p>
            </div>
          </div>

          {/* Controles de Cabecera con Iconos de Google Fonts */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleAudio}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition cursor-pointer"
              title="Escuchar última respuesta en voz alta"
            >
              <GoogleIcon name="volume_up" size={20} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition cursor-pointer"
              title="Descargar registro de auditoría"
            >
              <GoogleIcon name="download" size={20} />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-azul-primario transition cursor-pointer"
              title="Reiniciar conversación"
            >
              <GoogleIcon name="refresh" size={20} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-rose-600 transition ml-1 cursor-pointer"
              title="Cerrar copiloto"
            >
              <GoogleIcon name="close" size={22} />
            </button>
          </div>
        </div>

        {/* Ticker de Estado y Contexto de la Sede */}
        <div className="bg-sky-50/80 px-4 py-2 border-b border-sky-100 flex items-center justify-between text-xs text-azul-oscuro">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">Base de Datos Conectada:</span>
            <span className="font-semibold text-[11px] text-azul-primario bg-white px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
              {currentBranch}
            </span>
            <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
              Período: {periodLabel}
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <GoogleIcon name="check_circle" size={13} filled className="text-emerald-600" />
            Sincronizado en Vivo
          </span>
        </div>

        {/* Atajos Rápidos de Gestión con Iconos de Google Fonts (Sin emojis) */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-hide">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1">
            <GoogleIcon name="bolt" size={14} className="text-amber-500" filled /> Atajos:
          </span>
          <button
            type="button"
            onClick={() => handleSend('Resumen operativo general')}
            className="px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-azul-oscuro border border-gray-200 hover:border-sky-300 font-medium transition whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
          >
            <GoogleIcon name="bar_chart" size={15} className="text-azul-primario" />
            <span>Resumen Ejecutivo</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('¿Cuáles envíos presentan incidencias o demoras?')}
            className="px-2.5 py-1 rounded-lg bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium transition whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
          >
            <GoogleIcon name="warning" size={15} className="text-rose-600" filled />
            <span>Incidencias</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('Rendimiento de la Sede Alajuela')}
            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-azul-primario border border-sky-200 font-medium transition whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
          >
            <GoogleIcon name="domain" size={15} className="text-azul-primario" />
            <span>Sede Alajuela</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('Auditoría de usuarios y personal')}
            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium transition whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
          >
            <GoogleIcon name="group" size={15} className="text-purple-600" />
            <span>Usuarios</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('Estado de reclamos y tickets PQRS')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium transition whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
          >
            <GoogleIcon name="assignment" size={15} className="text-amber-600" />
            <span>PQRS</span>
          </button>
          <button
            type="button"
            onClick={() => handleSend('Recomendaciones de optimización IA')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition whitespace-nowrap cursor-pointer inline-flex items-center gap-1"
          >
            <GoogleIcon name="psychology" size={15} className="text-emerald-700" />
            <span>Optimización IA</span>
          </button>
        </div>

        {/* Flujo de Conversación (Fondo Gris Claro Oficial con Iconos y Tipografía Google) */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-gris-claro text-xs sm:text-sm">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-azul-primario text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <GoogleIcon name="smart_toy" size={18} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-xs space-y-2.5 leading-relaxed ${
                    isBot
                      ? 'bg-white text-gris-oscuro rounded-tl-none border border-gray-200'
                      : 'bg-azul-primario text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  {/* Badge de telemetría / origen con Google Icon */}
                  {isBot && msg.dataBadge && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 text-azul-primario border border-sky-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <GoogleIcon name="memory" size={13} className="text-azul-primario" />
                      <span>{msg.dataBadge}</span>
                    </div>
                  )}

                  {/* Cuerpo del mensaje procesado con Google Fonts (Emojis e Iconografía Vectorial) */}
                  <div className="space-y-1">
                    {formatAiTextWithGoogleFonts(msg.text, { isUser: !isBot })}
                  </div>

                  {/* Mini-Stat Cards en tonos claros institucionales */}
                  {isBot && msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                      {msg.metrics.map((m, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-sky-50/70 border border-sky-100 text-center">
                          <div className="text-[10px] text-gray-500 font-semibold">{m.label}</div>
                          <div className="text-sm font-bold text-azul-oscuro">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botón de acción hacia el módulo administrativo */}
                  {isBot && msg.actionLink && (
                    <div className="pt-2">
                      <Link
                        to={msg.actionLink}
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-azul-primario hover:bg-azul-oscuro text-white font-semibold text-xs transition shadow-xs group"
                      >
                        <span>{msg.actionText || 'Ver en el panel'}</span>
                        <GoogleIcon name="arrow_forward" size={15} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  )}

                  {/* Sugerencias Rápidas */}
                  {isBot && msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                      {msg.quickSuggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-azul-primario border border-gray-200 hover:border-sky-300 font-medium transition cursor-pointer inline-flex items-center gap-1 group"
                        >
                          <GoogleIcon name="search" size={12} className="text-gray-400 group-hover:text-azul-primario transition-colors" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] ${isBot ? 'text-gray-400' : 'text-sky-100'} text-right mt-1`}>
                    {msg.time}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-azul-oscuro text-white flex items-center justify-center shrink-0 mb-0.5 shadow-2xs">
                    <GoogleIcon name="person" size={18} className="text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-azul-primario text-white flex items-center justify-center shrink-0">
                <GoogleIcon name="smart_toy" size={18} className="text-white" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-gray-500 text-xs flex items-center gap-2 shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-azul-primario animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-azul-primario animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-azul-primario animate-bounce [animation-delay:0.4s]" />
                <span className="text-gray-500 text-xs ml-1">Consultando base de datos institucional...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Barra de Entrada (Blanco con Borde Institucional y Botón Google Fonts) */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregunta sobre envíos, sedes, personal, PQRS o escribe una guía..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gris-oscuro placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-azul-primario focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 bg-azul-primario hover:bg-azul-oscuro disabled:opacity-40 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <GoogleIcon name="send" size={16} className="text-white" />
              <span className="hidden sm:inline text-xs">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

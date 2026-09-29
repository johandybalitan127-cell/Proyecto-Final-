import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, X, RefreshCw, Volume2, Download, User, CheckCircle2, 
  Sparkles, ExternalLink, ArrowRight, Activity, Cpu, ShieldAlert,
  BarChart3, Package, Users, MapPin, Clock, MessageSquare, Tag, Zap, ChevronRight
} from 'lucide-react';
import { adminAiService } from '../../services/adminAiService';
import { Link } from 'react-router-dom';

export const AdminAiChatModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  currentBranch = 'Sucursal Central San José',
  currentPeriod = '30d',
  initialQuery = ''
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `👋 **¡Bienvenido al Copiloto Ejecutivo Postal IA (SIP-CR)!**\n\nEstoy conectado en tiempo real a la telemetría operativa de **${currentBranch}** (${typeof currentPeriod === 'object' ? currentPeriod.label : currentPeriod}). Puedo asistirte en la toma de decisiones, análisis de rendimiento, detección de incidencias o gestión de personal y reclamos.`,
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

  // Si se abre con una consulta inicial predeterminada
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
          text: 'Disculpa, ocurrió un error temporal al consultar los registros del servidor. Por favor intenta de nuevo.',
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
        // Quitar caracteres markdown para audio limpio
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl h-[90vh] max-h-[800px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-ai-modal-title"
      >
        {/* Header Ejecutivo */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md border border-sky-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="admin-ai-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>Copiloto Ejecutivo Postal IA</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold tracking-wider uppercase">
                    SIP-CR Pro
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-sky-400 animate-pulse" />
                <span>Telemetría en tiempo real: <span className="text-slate-200 font-semibold">{currentBranch}</span></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleAudio}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Escuchar última respuesta"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Descargar registro de auditoría"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Reiniciar conversación"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition ml-1"
              title="Cerrar copiloto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Topics Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-hide">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Atajos:
          </span>
          <button
            type="button"
            onClick={() => handleSend('Resumen operativo general')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer border border-slate-700/50"
          >
            📊 Resumen Ejecutivo
          </button>
          <button
            type="button"
            onClick={() => handleSend('¿Cuáles envíos presentan incidencias o demoras?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 transition whitespace-nowrap cursor-pointer border border-slate-700/50"
          >
            ⚠️ Incidencias
          </button>
          <button
            type="button"
            onClick={() => handleSend('Rendimiento de la Sede Alajuela')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-950/60 text-slate-300 hover:text-sky-300 transition whitespace-nowrap cursor-pointer border border-slate-700/50"
          >
            🏢 Sede Alajuela
          </button>
          <button
            type="button"
            onClick={() => handleSend('Auditoría de usuarios y personal')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer border border-slate-700/50"
          >
            👥 Usuarios
          </button>
          <button
            type="button"
            onClick={() => handleSend('Estado de reclamos y tickets PQRS')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 transition whitespace-nowrap cursor-pointer border border-slate-700/50"
          >
            📋 PQRS
          </button>
          <button
            type="button"
            onClick={() => handleSend('Recomendaciones de optimización IA')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-950/60 text-slate-300 hover:text-purple-300 transition whitespace-nowrap cursor-pointer border border-slate-700/50"
          >
            🧠 Optimización IA
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-900/90 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm space-y-2.5 leading-relaxed ${
                    isBot
                      ? 'bg-slate-800/90 border border-slate-700/70 text-slate-200'
                      : 'bg-gradient-to-r from-sky-600 to-azul-primario text-white ml-auto'
                  }`}
                >
                  {/* Badge de fuente si aplica */}
                  {isBot && msg.dataBadge && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Cpu className="w-3 h-3" />
                      <span>{msg.dataBadge}</span>
                    </div>
                  )}

                  {/* Cuerpo del mensaje formateado */}
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text}
                  </div>

                  {/* Mini-Stat Cards si la respuesta incluye métricas */}
                  {isBot && msg.metrics && msg.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/60">
                      {msg.metrics.map((m, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50 text-center">
                          <div className="text-[10px] text-slate-400 font-semibold">{m.label}</div>
                          <div className="text-sm font-bold text-sky-400">{m.value}</div>
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
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition shadow-sm group"
                      >
                        <span>{msg.actionText || 'Ver en el panel'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  )}

                  {/* Sugerencias Rápidas */}
                  {isBot && msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/40 flex flex-wrap gap-1.5">
                      {msg.quickSuggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-sky-950 hover:text-sky-300 text-slate-400 border border-slate-700 transition cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] ${isBot ? 'text-slate-500' : 'text-sky-200'} text-right mt-1`}>
                    {msg.time}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center text-white shrink-0 mb-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/70 text-slate-300 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-slate-400 text-xs ml-1">Consultando base de datos institucional...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
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
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-azul-primario hover:from-sky-500 hover:to-azul-oscuro disabled:opacity-40 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

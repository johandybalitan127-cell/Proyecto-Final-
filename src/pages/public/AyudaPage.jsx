import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Search, MessageSquare, ChevronDown, CheckCircle2, 
  Send, ShieldAlert, Sparkles, Workflow, ArrowRight, Phone, Mail, Clock
} from 'lucide-react';
import { faqService } from '../../services/faqService';
import { consultasService } from '../../services/consultasService';
import { useToast } from '../../context/ToastContext';

export const AyudaPage = () => {
  const { addToast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  // PQRS form state
  const [pqrsForm, setPqrsForm] = useState({
    usuario: '',
    correo: '',
    asunto: '',
    categoria: 'Reclamos',
    mensaje: '',
    prioridad: 'Media'
  });
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await faqService.getAll();
      setFaqs(data);
    };
    loadFaqs();
  }, []);

  const categories = ['Todas', 'Rastreo', 'Trámites VES', 'Pymexpress', 'Casilleros', 'Envíos', 'PQRS'];

  const filteredFaqs = faqs.filter((f) => {
    const matchCat = activeCategory === 'Todas' || f.categoria.toLowerCase() === activeCategory.toLowerCase();
    const matchQuery = !searchQuery || 
      f.pregunta.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.respuesta.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handlePqrsSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await consultasService.create(pqrsForm);
      setSubmittedTicket(created);
      addToast(`Ticket oficial ${created.ticket} registrado con éxito`, 'success');
      setPqrsForm({ usuario: '', correo: '', asunto: '', categoria: 'Reclamos', mensaje: '', prioridad: 'Media' });
    } catch {
      addToast('Error al registrar ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-azul-primario uppercase tracking-wider">
          Atención al Ciudadano y Soporte Postal
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-azul-oscuro font-sans tracking-tight">
          Centro de Ayuda y Gestión PQRS
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Respuestas a dudas comunes, normativas de envío y canal oficial de radicación de peticiones, quejas y reclamos con clasificación automatizada.
        </p>
      </div>

      {/* FAQ Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué deseas consultar? (ej. requisitos para pasaporte, aduanas, extravío)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-azul-primario text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2 Column Layout: Left FAQs / Right PQRS Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Accordion FAQs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-azul-oscuro flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-azul-primario" />
            <span>Preguntas Frecuentes ({filteredFaqs.length})</span>
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm text-gris-oscuro flex items-center justify-between gap-4 hover:text-azul-primario transition"
                  >
                    <span className="flex-1">{faq.pregunta}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      <p>{faq.respuesta}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                        <span className="badge-azul text-[10px]">{faq.categoria}</span>
                        <span>Normativa Postal Oficial CR</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Formulario PQRS & N8N Flow Documentation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-md space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-verde-oscuro uppercase tracking-wider">
                Ventanilla Única Ciudadana
              </span>
              <h2 className="text-xl font-bold text-azul-oscuro">
                Formulario PQRS Oficial
              </h2>
              <p className="text-xs text-gray-500">
                Peticiones, Quejas, Reclamos y Sugerencias con resolución vinculante UPU.
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-900">¡Ticket Radicado con Éxito!</h3>
                  <p className="text-xs font-mono font-bold text-azul-oscuro mt-1 text-base">
                    #{submittedTicket.ticket}
                  </p>
                  <p className="text-xs text-emerald-800 mt-2">
                    Clasificado automáticamente por <strong>N8N Workflow</strong> hacia: <strong>{submittedTicket.n8nDepartment}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="btn-neutro text-xs py-2 px-4"
                >
                  Radicar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handlePqrsSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gris-oscuro">Nombre y Apellidos:</label>
                  <input
                    type="text"
                    required
                    value={pqrsForm.usuario}
                    onChange={(e) => setPqrsForm({ ...pqrsForm, usuario: e.target.value })}
                    placeholder="Ej. Andrés Fallas Solano"
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gris-oscuro">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    value={pqrsForm.correo}
                    onChange={(e) => setPqrsForm({ ...pqrsForm, correo: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gris-oscuro">Categoría:</label>
                    <select
                      value={pqrsForm.categoria}
                      onChange={(e) => setPqrsForm({ ...pqrsForm, categoria: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                    >
                      <option value="Reclamos">Reclamos</option>
                      <option value="Aduanas">Aduanas</option>
                      <option value="Solicitudes">Solicitudes</option>
                      <option value="Información">Información</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gris-oscuro">Prioridad:</label>
                    <select
                      value={pqrsForm.prioridad}
                      onChange={(e) => setPqrsForm({ ...pqrsForm, prioridad: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gris-oscuro">Asunto de la Gestión:</label>
                  <input
                    type="text"
                    required
                    value={pqrsForm.asunto}
                    onChange={(e) => setPqrsForm({ ...pqrsForm, asunto: e.target.value })}
                    placeholder="Ej. Demora en paquete #CR098421734CR"
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gris-oscuro">Detalle del Reclamo / Petición:</label>
                  <textarea
                    required
                    rows="3"
                    value={pqrsForm.mensaje}
                    onChange={(e) => setPqrsForm({ ...pqrsForm, mensaje: e.target.value })}
                    placeholder="Describe los hechos y número de envío si aplica..."
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primario text-xs py-2.5 w-full justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Enviando...' : 'Radicar Petición Oficial'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Panel Flujo N8N Activo (Exigido en prompt) */}
          <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs space-y-3">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-azul-primario" />
              <h3 className="font-bold text-azul-oscuro">Automatización con N8N Activa</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Al enviar tu formulario PQRS, un webhook en <strong>N8N</strong> activa un modelo NLP que clasifica la urgencia y remite la gestión automáticamente al departamento correspondiente (Aduanas, Reclamos o Soporte Ciudadano) con acuse de recibo inmediato.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

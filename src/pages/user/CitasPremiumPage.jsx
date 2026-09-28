import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CreditCard, Zap, CheckCircle2, Building2, FileText, ShieldCheck } from 'lucide-react';
import { sucursalesService } from '../../services/sucursalesService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const CitasPremiumPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [tramite, setTramite] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSucursales = async () => {
      const all = await sucursalesService.getAll();
      setSucursales(all);
    };
    fetchSucursales();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSucursal || !tramite || !date || !time || !cardNumber) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      toast.success('¡Cita VIP programada con éxito! Tendrás prioridad absoluta.');
      
      setTimeout(() => {
        navigate('/cuenta/perfil');
      }, 4000);
    }, 2500);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">¡Pago Exitoso!</h2>
        <p className="text-gray-600 mb-8">
          Tu espacio exclusivo ha sido confirmado para el <strong>{date}</strong> a las <strong>{time}</strong> en la sucursal seleccionada. 
          Al llegar, indica que tienes un <strong>Trámite VIP (Fila Cero)</strong>.
        </p>
        <button 
          onClick={() => navigate('/cuenta/perfil')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition"
        >
          Ir a Mi Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-4 h-4" />
          Servicio Exclusivo
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Trámite VIP / Fila Cero</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Paga por una atención prioritaria garantizada en sucursal. Evita las filas y optimiza tu tiempo con nuestro servicio empresarial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              Beneficios Premium
            </h3>
            <ul className="space-y-4 text-sm text-blue-50">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
                <span>Atención sin filas en sucursal</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
                <span>Procesamiento aduanal prioritario</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0" />
                <span>Entrega acelerada (24h garantizadas)</span>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="block text-blue-200 text-xs uppercase font-semibold mb-1">Costo del servicio</span>
              <span className="text-3xl font-extrabold">₡4,500</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 space-y-6">
            {/* Sucursal Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Selecciona la sucursal
              </label>
              <select 
                value={selectedSucursal}
                onChange={(e) => setSelectedSucursal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition"
                required
              >
                <option value="">-- Elige una sucursal --</option>
                {sucursales.map(s => (
                  <option key={s.id} value={s.nombre}>
                    {s.nombre} - {s.provincia}
                  </option>
                ))}
              </select>
            </div>

            {/* Trámite Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Tipo de Trámite
              </label>
              <select 
                value={tramite}
                onChange={(e) => setTramite(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition"
                required
              >
                <option value="">-- ¿Qué trámite realizarás? --</option>
                <option value="retiro">Retiro de Paquetería</option>
                <option value="envio">Envío de Paquetería</option>
                <option value="pasaporte">Trámite de Pasaporte VES</option>
                <option value="certificacion">Certificaciones del Registro</option>
                <option value="apartado">Apertura/Renovación de Apartado</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Fecha de la Cita
                </label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Hora Preferida
                </label>
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition"
                  required
                >
                  <option value="">Seleccionar horario</option>
                  <option value="08:00 AM">08:00 AM - 09:00 AM</option>
                  <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="01:00 PM">01:00 PM - 02:00 PM</option>
                  <option value="03:00 PM">03:00 PM - 04:00 PM</option>
                </select>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Payment Details */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Datos de Pago Seguros
              </label>
              
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Número de Tarjeta (ej. 4111 1111 1111 1111)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition font-mono"
                  required
                  maxLength="19"
                />
                <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text"
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition font-mono"
                  required
                />
                <input 
                  type="text"
                  placeholder="CVC"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none transition font-mono"
                  required
                  maxLength="4"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando Pago...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Pagar ₡5,000 y Confirmar Cita
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              Pagos encriptados con AES-256 bits
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Truck, Globe, ShoppingBag, Archive, Package, FileCheck, Calculator, 
  CheckCircle2, ArrowRight, ShieldCheck, DollarSign, Layers
} from 'lucide-react';
import { serviciosService } from '../../services/serviciosService';
import { tarifasService } from '../../services/tarifasService';
import { exchangeRateService } from '../../services/exchangeRateService';

export const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [filterType, setFilterType] = useState('Todos');
  const [weightKg, setWeightKg] = useState('1.5');
  const [selectedServiceType, setSelectedServiceType] = useState('EMS Courier Nacional');
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [usdRate, setUsdRate] = useState(514.50);

  useEffect(() => {
    const loadData = async () => {
      const s = await serviciosService.getAll();
      const t = await tarifasService.getAll();
      const rates = await exchangeRateService.getRates();
      setServicios(s);
      setTarifas(t);
      if (rates?.promedio) setUsdRate(rates.promedio);
    };
    loadData();
  }, []);

  useEffect(() => {
    const cost = tarifasService.estimateTariff(weightKg, selectedServiceType);
    setCalculatedCost(cost);
  }, [weightKg, selectedServiceType]);

  const categories = ['Todos', 'Nacional', 'Internacional', 'Comercio Electrónico', 'Casillero'];

  const filteredServicios = servicios.filter(s => {
    if (filterType === 'Todos') return true;
    return s.tipo.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-azul-primario uppercase tracking-wider">
          Portafolio Postal Institucional
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-azul-oscuro font-sans tracking-tight">
          Catálogo Oficial de Servicios
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Soluciones de logística, paquetería y ventanilla electrónica para ciudadanos, pymes y grandes organizaciones en todo el territorio nacional e internacional.
        </p>
      </div>

      {/* Interactive Tariff Calculator Bar */}
      <div className="bg-gradient-to-r from-azul-oscuro to-azul-primario rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Calculadora Oficial de Tarifas Postales</h2>
                <p className="text-xs text-sky-100">Cálculo estimativo según peso volumétrico y destino</p>
              </div>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20">
              Tipo de cambio USD: ₡{usdRate.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-sky-200">Tipo de Servicio:</label>
              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="w-full bg-white text-gris-oscuro rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
              >
                <option value="EMS Courier Nacional">EMS Courier Nacional</option>
                <option value="Pymexpress (Tarifa MiPyme)">Pymexpress (Tarifa MiPyme)</option>
                <option value="Paquete Regular Postal">Paquete Regular Postal</option>
                <option value="EMS Internacional (América Central)">EMS Internacional</option>
                <option value="Casillero Box Correos Miami">Casillero Box Correos Miami</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-sky-200">Peso Estimado (Kilogramos):</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-white text-gris-oscuro rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="bg-white/10 rounded-xl p-3 flex flex-col justify-center items-center text-center border border-white/20">
              <span className="text-[11px] font-bold text-sky-200 uppercase">Tarifa Estimada</span>
              <p className="text-2xl font-extrabold text-white">
                ₡{calculatedCost.toLocaleString('es-CR')}
              </p>
              <span className="text-[10px] text-emerald-300 font-medium">
                ≈ ${(calculatedCost / usdRate).toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === cat
                ? 'bg-azul-primario text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-azul-primario'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicios.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl border border-gray-200 p-6 shadow-2xs hover:shadow-subtle transition-all duration-300 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="badge-azul text-[11px] font-semibold">{srv.tipo}</span>
                <span className="badge-verde text-[11px]">{srv.estado}</span>
              </div>

              <h3 className="text-xl font-bold text-azul-oscuro">{srv.nombre}</h3>

              <p className="text-xs text-gray-600 leading-relaxed">
                {srv.descripcion}
              </p>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tiempo de entrega:</span>
                  <span className="font-bold text-gris-oscuro">{srv.plazo || '24 a 48h'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tarifa base:</span>
                  <span className="font-bold text-azul-primario">{srv.precioBase || 'Consultar'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedServiceType(srv.nombre);
                  window.scrollTo({ top: 220, behavior: 'smooth' });
                }}
                className="btn-primario text-xs py-2 px-4 w-full"
              >
                <span>Cotizar este servicio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

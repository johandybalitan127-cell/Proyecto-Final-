import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';
import { exchangeRateService } from '../../services/exchangeRateService';

export const ExchangeRateBadge = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRates = async () => {
    setLoading(true);
    const data = await exchangeRateService.getRates();
    setRates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRates();
  }, []);

  if (!rates) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-2xs text-xs">
      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
        $
      </div>
      <div className="flex items-center gap-1.5 font-medium text-gris-oscuro">
        <span>USD:</span>
        <span className="font-bold text-azul-oscuro">₡{rates.venta || 516.45}</span>
        <span className="text-[10px] text-gray-400 font-normal hidden sm:inline">(Venta)</span>
      </div>
      <button
        onClick={loadRates}
        disabled={loading}
        className="text-gray-400 hover:text-azul-primario transition p-0.5"
        title="Actualizar tipo de cambio (API externa)"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

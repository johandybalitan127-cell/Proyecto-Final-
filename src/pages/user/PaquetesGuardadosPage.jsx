import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Package, ExternalLink, Trash2, Plus } from 'lucide-react';
import { enviosService } from '../../services/enviosService';
import { useToast } from '../../context/ToastContext';

export const PaquetesGuardadosPage = () => {
  const { addToast } = useToast();
  const [savedGuides, setSavedGuides] = useState(['CR098421734CR', 'CR109283745CR', 'CR874512963CR']);
  const [envios, setEnvios] = useState([]);
  const [newGuideInput, setNewGuideInput] = useState('');

  useEffect(() => {
    const load = async () => {
      const all = await enviosService.getAll();
      setEnvios(all.filter((e) => savedGuides.includes(e.guia)));
    };
    load();
  }, [savedGuides]);

  const handleAddGuide = async (e) => {
    e.preventDefault();
    const clean = newGuideInput.trim().toUpperCase();
    if (!clean) return;

    if (savedGuides.includes(clean)) {
      addToast('Esta guía ya se encuentra en tus guardados', 'warning');
      return;
    }

    setSavedGuides([...savedGuides, clean]);
    setNewGuideInput('');
    addToast(`Guía #${clean} anclada con éxito`, 'success');
  };

  const handleRemove = (guia) => {
    setSavedGuides(savedGuides.filter((g) => g !== guia));
    addToast(`Guía #${guia} removida de guardados`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-azul-oscuro flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-azul-primario" />
            <span>Paquetes Guardados</span>
          </h1>
          <p className="text-xs text-gray-500">Acceso directo a tus envíos prioritarios con monitoreo activo</p>
        </div>

        <form onSubmit={handleAddGuide} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Anclar nueva guía..."
            value={newGuideInput}
            onChange={(e) => setNewGuideInput(e.target.value)}
            className="px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-azul-primario font-mono uppercase"
          />
          <button type="submit" className="btn-primario text-xs py-2 px-3">
            <Plus className="w-3.5 h-3.5" />
            <span>Anclar</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {envios.map((envio) => (
          <div key={envio.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-azul-oscuro text-base">#{envio.guia}</span>
                <span className="badge-verde text-[10px]">{envio.estado}</span>
              </div>
              <p className="text-xs text-gray-600 font-semibold">{envio.servicio}</p>
              <p className="text-[11px] text-gray-500">{envio.origen} → {envio.destino}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link to={`/rastreo/${envio.guia}`} className="text-xs font-bold text-azul-primario hover:underline inline-flex items-center gap-1">
                <span>Rastrear ahora</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => handleRemove(envio.guia)}
                className="text-gray-400 hover:text-red-500 transition p-1"
                title="Quitar de guardados"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

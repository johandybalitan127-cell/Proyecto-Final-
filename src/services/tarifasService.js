import { fetchCollection, fetchItemById, createItem, updateItem, deleteItem } from './api';

const COLLECTION = 'tarifas';

export const tarifasService = {
  getAll: () => fetchCollection(COLLECTION),
  getById: (id) => fetchItemById(COLLECTION, id),
  create: (tarifa) => createItem(COLLECTION, {
    ...tarifa,
    costo: Number(tarifa.costo) || 0
  }),
  update: (id, updates) => updateItem(COLLECTION, id, {
    ...updates,
    ...(updates.costo !== undefined ? { costo: Number(updates.costo) } : {})
  }),
  delete: (id) => deleteItem(COLLECTION, id),

  // Calculate estimated tariff by weight and type
  estimateTariff: (pesoKg, tipoEnvio = 'EMS Courier Nacional') => {
    const peso = parseFloat(pesoKg);
    if (isNaN(peso) || peso <= 0) return 0;

    if (tipoEnvio.includes('Pymexpress')) {
      if (peso <= 1) return 1950;
      if (peso <= 2) return 2750;
      return 2750 + Math.ceil(peso - 2) * 850;
    }

    if (tipoEnvio.includes('Internacional')) {
      if (peso <= 0.5) return 14500;
      if (peso <= 1) return 21000;
      return 21000 + Math.ceil(peso - 1) * 6000;
    }

    if (tipoEnvio.includes('Casillero') || tipoEnvio.includes('Box')) {
      const libras = peso * 2.20462;
      return Math.round(libras * 2350);
    }

    // Default: EMS Courier Nacional
    if (peso <= 1) return 2350;
    if (peso <= 2) return 3400;
    if (peso <= 5) return 5200;
    if (peso <= 10) return 8500;
    return 8500 + Math.ceil(peso - 10) * 1100;
  }
};

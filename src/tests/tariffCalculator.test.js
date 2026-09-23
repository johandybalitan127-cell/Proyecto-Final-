import { describe, it, expect } from 'vitest';
import { tarifasService } from '../services/tarifasService';

describe('Cálculo y Estimación de Tarifas Postales', () => {
  it('debe calcular correctamente la tarifa base para EMS Courier Nacional de 1kg', () => {
    const costo = tarifasService.estimateTariff(1, 'EMS Courier Nacional');
    expect(costo).toBe(2350);
  });

  it('debe calcular tarifa preferencial Pymexpress para mipymes (1kg)', () => {
    const costo = tarifasService.estimateTariff(1, 'Pymexpress');
    expect(costo).toBe(1950);
  });

  it('debe calcular tarifa escalonada para envíos de 2kg y 5kg', () => {
    const costo2kg = tarifasService.estimateTariff(2, 'EMS Courier Nacional');
    expect(costo2kg).toBe(3400);

    const costo5kg = tarifasService.estimateTariff(5, 'EMS Courier Nacional');
    expect(costo5kg).toBe(5200);
  });

  it('debe calcular tarifa internacional UPU base de 500g', () => {
    const costoInt = tarifasService.estimateTariff(0.5, 'EMS Internacional');
    expect(costoInt).toBe(14500);
  });

  it('debe retornar 0 para pesos negativos o valores no numéricos', () => {
    expect(tarifasService.estimateTariff(-5)).toBe(0);
    expect(tarifasService.estimateTariff('abc')).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { enviosService } from '../services/enviosService';

describe('Lógica de Validación de Guías Postales (UPU)', () => {
  it('debe validar guías nacionales oficiales tipo CR098421734CR', () => {
    expect(enviosService.validateTrackingNumber('CR098421734CR')).toBe(true);
    expect(enviosService.validateTrackingNumber('cr098421734cr')).toBe(true);
  });

  it('debe validar guías de encomienda y paquetes tipo CP123456789CR', () => {
    expect(enviosService.validateTrackingNumber('CP123456789CR')).toBe(true);
  });

  it('debe rechazar guías con longitud inválida o caracteres no permitidos', () => {
    expect(enviosService.validateTrackingNumber('CR123CR')).toBe(false);
    expect(enviosService.validateTrackingNumber('123456789')).toBe(false);
    expect(enviosService.validateTrackingNumber('US123456789CR')).toBe(false);
    expect(enviosService.validateTrackingNumber('')).toBe(false);
    expect(enviosService.validateTrackingNumber(null)).toBe(false);
  });
});

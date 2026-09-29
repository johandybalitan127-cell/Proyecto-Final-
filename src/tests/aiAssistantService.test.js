import { describe, it, expect } from 'vitest';
import { aiAssistantService } from '../services/aiAssistantService';

describe('aiAssistantService - Sucursales por provincia y tolerancia a errores tipográficos', () => {
  it('responde correctamente a consulta con error tipográfico "me gustaria saber de la provincia de sam jose"', async () => {
    const res = await aiAssistantService.processMessage({ message: 'me gustaria saber de la provincia de sam jose' });
    expect(res.text).toContain('San José');
    expect(res.text).toContain('Sucursal Central Zapote');
    expect(res.text).toContain('Costado este de Casa Presidencial');
    expect(res.quickSuggestions).toBeDefined();
  });

  it('responde correctamente a consulta sobre cada provincia de Costa Rica y dónde queda la más cercana', async () => {
    const res = await aiAssistantService.processMessage({ message: 'haz que me pueda decir de cada provincia de costa rica cual es la socursal mas cercana donde queda' });
    expect(res.text).toContain('San José');
    expect(res.text).toContain('Alajuela');
    expect(res.text).toContain('Heredia');
    expect(res.text).toContain('Cartago');
    expect(res.text).toContain('Guanacaste');
    expect(res.text).toContain('Puntarenas');
    expect(res.text).toContain('Limón');
    expect(res.text).toContain('Dónde queda');
  });

  it('responde correctamente a consulta de sucursales en Alajuela', async () => {
    const res = await aiAssistantService.processMessage({ message: '¿Dónde queda la sucursal de Alajuela?' });
    expect(res.text).toContain('Alajuela');
    expect(res.text).toContain('Parque Central');
  });

  it('responde correctamente a consulta de sucursales en Heredia', async () => {
    const res = await aiAssistantService.processMessage({ message: 'Heredia' });
    expect(res.text).toContain('Heredia');
    expect(res.text).toContain('Parroquia La Inmaculada');
  });

  it('responde correctamente a consulta de sucursales en Cartago', async () => {
    const res = await aiAssistantService.processMessage({ message: 'Cartago' });
    expect(res.text).toContain('Cartago');
    expect(res.text).toContain('Basílica de Los Ángeles');
  });

  it('responde correctamente a consulta de sucursales en Guanacaste (Liberia)', async () => {
    const res = await aiAssistantService.processMessage({ message: 'Guanacaste' });
    expect(res.text).toContain('Guanacaste');
    expect(res.text).toContain('Liberia');
  });

  it('responde correctamente a consulta de sucursales en Puntarenas', async () => {
    const res = await aiAssistantService.processMessage({ message: 'Puntarenas' });
    expect(res.text).toContain('Puntarenas');
    expect(res.text).toContain('Paseo de los Turistas');
  });

  it('responde correctamente a consulta de sucursales en Limón', async () => {
    const res = await aiAssistantService.processMessage({ message: 'Limón' });
    expect(res.text).toContain('Limón');
    expect(res.text).toContain('Parque Vargas');
  });

  it('responde a consulta genérica sobre sucursal más cercana solicitando la provincia', async () => {
    const res = await aiAssistantService.processMessage({ message: '¿Cuál es la sucursal más cercana y dónde queda?' });
    expect(res.text).toContain('110 sucursales');
    expect(res.text).toContain('7 provincias');
    expect(res.quickSuggestions).toContain('San José');
  });

  it('responde correctamente a consulta sobre tiempos de entrega', async () => {
    const res = await aiAssistantService.processMessage({ message: '¿Cuáles son los tiempos de entrega?' });
    expect(res.text).toContain('Tiempos oficiales de entrega');
    expect(res.text).toContain('EMS Courier Nacional');
  });

  it('responde correctamente a consulta de tarifas por peso', async () => {
    const res = await aiAssistantService.processMessage({ message: '¿Cuánto cuesta enviar un paquete de 2 kilos?' });
    expect(res.text).toContain('2 kg');
    expect(res.text).toContain('EMS Courier');
  });

  it('responde correctamente a rastreo de guía válido', async () => {
    const res = await aiAssistantService.processMessage({ message: 'Rastrear CR098421734CR' });
    expect(res.text).toContain('CR098421734CR');
    expect(res.envio).toBeDefined();
  });

  it('rechaza cortésmente preguntas ajenas a Correos (Dos Pinos, recetas, fútbol)', async () => {
    const res = await aiAssistantService.processMessage({ message: '¿Qué es la Dos Pinos?' });
    expect(res.text).toContain('No dispongo de esa información');
    expect(res.text).toContain('Esa consulta se sale de mis conocimientos y está fuera del contexto institucional de Correos de Costa Rica. 🚫');
  });
});

import { describe, it, expect } from 'vitest';
import { adminAiService } from '../services/adminAiService';

describe('adminAiService - Copiloto de Inteligencia Artificial para el Dashboard Admin', () => {
  it('responde con resumen ejecutivo general del dashboard y métricas en vivo', async () => {
    const res = await adminAiService.processAdminMessage({
      message: 'Resumen operativo general',
      currentBranch: 'Sucursal Central San José',
      currentPeriod: '30d'
    });

    expect(res.text).toContain('Resumen Ejecutivo y Operativo del Dashboard');
    expect(res.text).toContain('Sucursal Central San José');
    expect(res.text).toContain('Volumen Global Registrado');
    expect(res.text).toContain('Envíos en Tránsito');
    expect(res.text).toContain('Entregas Concluidas a Tiempo');
    expect(res.actionLink).toBe('/admin/envios');
    expect(res.metrics).toBeDefined();
    expect(res.metrics.length).toBeGreaterThan(0);
    expect(res.quickSuggestions).toBeDefined();
  });

  it('detecta y reporta envíos con incidencias, retenidos en aduanas y demoras', async () => {
    const res = await adminAiService.processAdminMessage({
      message: '¿Cuáles envíos presentan incidencias o demoras?',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('Reporte Ejecutivo de Incidencias');
    expect(res.text).toContain('Aforo Aduanal');
    expect(res.actionLink).toBe('/admin/envios');
    expect(res.actionText).toContain('Gestión de Envíos');
    expect(res.dataBadge).toContain('Atención Requerida');
  });

  it('proporciona análisis de rendimiento operativo para la sede de Alajuela', async () => {
    const res = await adminAiService.processAdminMessage({
      message: '¿Cuál es el rendimiento de la sede de Alajuela?',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('Alajuela Centro Regional');
    expect(res.text).toContain('**Provincia**: Alajuela');
    expect(res.text).toContain('Envíos Registrados');
    expect(res.text).toContain('Entregas Exitosas');
    expect(res.actionLink).toBe('/admin/sucursales');
  });

  it('realiza auditoría de usuarios, personal y roles administrativos', async () => {
    const res = await adminAiService.processAdminMessage({
      message: 'Auditoría de usuarios y personal',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('Censo y Auditoría de Usuarios');
    expect(res.text).toContain('Administradores del Sistema');
    expect(res.text).toContain('Operadores Postales');
    expect(res.text).toContain('Activos');
    expect(res.actionLink).toBe('/admin/usuarios');
  });

  it('informa sobre tickets PQRS, peticiones ciudadanas y casos de prioridad alta', async () => {
    const res = await adminAiService.processAdminMessage({
      message: '¿Cuántos reclamos y tickets PQRS están pendientes?',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('Atención Ciudadana y Reclamos (PQRS)');
    expect(res.text).toContain('Total de Peticiones Radicadas');
    expect(res.text).toContain('Prioridad Alta');
    expect(res.actionLink).toBe('/admin/consultas');
  });

  it('desglosa tarifas oficiales de EMS Courier y Pymexpress', async () => {
    const res = await adminAiService.processAdminMessage({
      message: '¿Cuáles son las tarifas y servicios oficiales?',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('Catálogo Oficial de Servicios y Estructura Tarifaria');
    expect(res.text).toContain('EMS Courier Nacional');
    expect(res.text).toContain('Pymexpress');
    expect(res.actionLink).toBe('/admin/servicios-tarifas');
  });

  it('proporciona recomendaciones operativas y estratégicas de optimización', async () => {
    const res = await adminAiService.processAdminMessage({
      message: 'Recomendaciones de optimización IA',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('Recomendaciones Estratégicas y Operativas de la IA');
    expect(res.text).toContain('Pymexpress GAM');
    expect(res.text).toContain('Aforo Aduanal');
    expect(res.actionLink).toBe('/admin/reportes');
  });

  it('localiza la ficha de una guía específica para administradores', async () => {
    const res = await adminAiService.processAdminMessage({
      message: 'Ficha de la guía CR098421734CR',
      currentBranch: 'Sucursal Central San José'
    });

    expect(res.text).toContain('CR098421734CR');
    expect(res.text).toContain('Estado Operativo');
    expect(res.text).toContain('Destinatario');
    expect(res.actionLink).toBe('/admin/envios');
  });
});

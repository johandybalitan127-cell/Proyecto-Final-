import { describe, it, expect } from 'vitest';
import { SEDES_DASHBOARD_DATA, getBranchDashboardData } from '../data/branchDashboardData';

describe('branchDashboardData - Métricas y porcentajes diferenciados por sede', () => {
  it('contiene las 9 sedes operativas registradas', () => {
    const sedes = Object.keys(SEDES_DASHBOARD_DATA);
    expect(sedes).toHaveLength(9);
    expect(sedes).toContain('Sucursal Central San José');
    expect(sedes).toContain('Centro Operativo Postal (Zapote)');
    expect(sedes).toContain('Alajuela Centro Regional');
    expect(sedes).toContain('Sucursal Heredia Central');
    expect(sedes).toContain('Sucursal Cartago Los Ángeles');
    expect(sedes).toContain('Sucursal Liberia Centro');
    expect(sedes).toContain('Sucursal Puntarenas Puerto');
    expect(sedes).toContain('Sucursal Limón Centro');
    expect(sedes).toContain('Aduana Postal Santamaría');
  });

  it('cada sede tiene porcentajes de estado de envíos que suman 100%', () => {
    Object.entries(SEDES_DASHBOARD_DATA).forEach(([sedeKey, data]) => {
      const sumEstados = data.estados.reduce((acc, curr) => acc + curr.value, 0);
      expect(sumEstados, `Suma de estados en ${sedeKey}`).toBe(100);
    });
  });

  it('cada sede tiene porcentajes de tipo de servicio que suman 100%', () => {
    Object.entries(SEDES_DASHBOARD_DATA).forEach(([sedeKey, data]) => {
      const sumServicios = data.servicios.reduce((acc, curr) => acc + curr.porcentaje, 0);
      expect(sumServicios, `Suma de servicios en ${sedeKey}`).toBe(100);
    });
  });

  it('los porcentajes de entrega a tiempo y estados son diferentes entre sedes', () => {
    const sj = SEDES_DASHBOARD_DATA['Sucursal Central San José'];
    const zapote = SEDES_DASHBOARD_DATA['Centro Operativo Postal (Zapote)'];
    const heredia = SEDES_DASHBOARD_DATA['Sucursal Heredia Central'];
    const aduana = SEDES_DASHBOARD_DATA['Aduana Postal Santamaría'];
    const limon = SEDES_DASHBOARD_DATA['Sucursal Limón Centro'];

    // Porcentaje de envíos entregados (donut)
    const sjEntregado = sj.estados.find(e => e.name === 'Entregado').value;
    const zapoteEntregado = zapote.estados.find(e => e.name === 'Entregado').value;
    const herediaEntregado = heredia.estados.find(e => e.name === 'Entregado').value;
    const aduanaEntregado = aduana.estados.find(e => e.name === 'Entregado').value;

    expect(sjEntregado).toBe(75);
    expect(zapoteEntregado).toBe(68);
    expect(herediaEntregado).toBe(81);
    expect(aduanaEntregado).toBe(48);

    // Porcentajes de Pymexpress diferentes
    const sjPyme = sj.servicios.find(s => s.servicio === 'Pymexpress').porcentaje;
    const zapotePyme = zapote.servicios.find(s => s.servicio === 'Pymexpress').porcentaje;
    const herediaPyme = heredia.servicios.find(s => s.servicio === 'Pymexpress').porcentaje;
    const limonPyme = limon.servicios.find(s => s.servicio === 'Pymexpress').porcentaje;

    expect(sjPyme).toBe(40);
    expect(zapotePyme).toBe(35);
    expect(herediaPyme).toBe(48);
    expect(limonPyme).toBe(22);

    // Métricas delta y a tiempo diferentes
    expect(sj.stats.entregados.delta).not.toBe(heredia.stats.entregados.delta);
    expect(zapote.stats.registrados.valor).not.toBe(sj.stats.registrados.valor);
  });

  it('getBranchDashboardData retorna la sede correspondiente o fallback a Central San José', () => {
    const dataHeredia = getBranchDashboardData('Sucursal Heredia Central');
    expect(dataHeredia.nombreCorto).toBe('Heredia Central');

    const fallback = getBranchDashboardData('Sede Inexistente');
    expect(fallback.nombreCorto).toBe('Central San José');
  });
});

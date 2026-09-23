import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepperTracking } from '../components/common/StepperTracking';

describe('Componente StepperTracking (4 etapas)', () => {
  const mockEnvio = {
    guia: 'CR098421734CR',
    estado: 'En tránsito',
    origen: 'San José Central',
    destino: 'Alajuela Centro',
    etapas: [
      { paso: 1, nombre: 'Recibida', ubicacion: 'Sucursal San José', hora: '08:30 a.m.', completado: true },
      { paso: 2, nombre: 'Procesado', ubicacion: 'Centro Zapote', hora: '11:15 a.m.', completado: true },
      { paso: 3, nombre: 'En Tránsito', ubicacion: 'Hacia Alajuela', hora: '02:00 p.m.', completado: true, actual: true },
      { paso: 4, nombre: 'Entregado', ubicacion: 'Destino Final', hora: 'Pendiente', completado: false },
    ]
  };

  it('debe renderizar las 4 etapas del flujo postal', () => {
    render(<StepperTracking envio={mockEnvio} />);

    expect(screen.getByText('Recibida')).toBeInTheDocument();
    expect(screen.getByText('Procesado')).toBeInTheDocument();
    expect(screen.getByText('En Tránsito')).toBeInTheDocument();
    expect(screen.getByText('Entregado')).toBeInTheDocument();
  });

  it('debe mostrar las ubicaciones de cada etapa', () => {
    render(<StepperTracking envio={mockEnvio} />);

    expect(screen.getByText('Sucursal San José')).toBeInTheDocument();
    expect(screen.getByText('Centro Zapote')).toBeInTheDocument();
    expect(screen.getByText('Hacia Alajuela')).toBeInTheDocument();
  });
});

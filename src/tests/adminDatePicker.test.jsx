import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminTopbar } from '../components/admin/AdminTopbar';

describe('AdminTopbar - Date Picker interactivo (Últimos 30 días)', () => {
  it('renderiza el botón con "Últimos 30 días" por defecto cuando showDatePicker=true', () => {
    render(<AdminTopbar showDatePicker={true} />);
    const btn = screen.getByRole('button', { name: /seleccionar período de fechas/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Últimos 30 días');
  });

  it('no muestra el date picker si showDatePicker=false', () => {
    render(<AdminTopbar showDatePicker={false} />);
    const btn = screen.queryByRole('button', { name: /seleccionar período de fechas/i });
    expect(btn).toBeNull();
  });

  it('abre el menú desplegable al hacer clic y muestra las opciones de período', () => {
    render(<AdminTopbar showDatePicker={true} />);
    const btn = screen.getByRole('button', { name: /seleccionar período de fechas/i });
    
    // Al inicio el menú está cerrado
    expect(screen.queryByText('Período de Análisis')).toBeNull();

    // Hacemos clic
    fireEvent.click(btn);

    // Debe mostrar el menú y las opciones
    expect(screen.getByText('Período de Análisis')).toBeInTheDocument();
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Últimos 7 días')).toBeInTheDocument();
    expect(screen.getAllByText('Últimos 30 días').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Último trimestre')).toBeInTheDocument();
    expect(screen.getByText('Año actual (2024)')).toBeInTheDocument();
  });

  it('llama a onPeriodChange al seleccionar una opción y actualiza la selección', () => {
    const onPeriodChangeMock = vi.fn();
    render(
      <AdminTopbar 
        showDatePicker={true} 
        selectedPeriod="30d" 
        onPeriodChange={onPeriodChangeMock} 
      />
    );

    const btn = screen.getByRole('button', { name: /seleccionar período de fechas/i });
    fireEvent.click(btn);

    // Seleccionamos "Últimos 7 días"
    const opcion7d = screen.getByRole('menuitem', { name: /últimos 7 días/i });
    fireEvent.click(opcion7d);

    expect(onPeriodChangeMock).toHaveBeenCalledWith('7d');
  });

  it('muestra la etiqueta correspondiente cuando se le pasa selectedPeriod controlado', () => {
    const { rerender } = render(
      <AdminTopbar showDatePicker={true} selectedPeriod="hoy" />
    );
    expect(screen.getByText('Hoy')).toBeInTheDocument();

    rerender(<AdminTopbar showDatePicker={true} selectedPeriod="7d" />);
    expect(screen.getByText('Últimos 7 días')).toBeInTheDocument();

    rerender(<AdminTopbar showDatePicker={true} selectedPeriod="90d" />);
    expect(screen.getByText('Último trimestre')).toBeInTheDocument();

    rerender(<AdminTopbar showDatePicker={true} selectedPeriod="ano" />);
    expect(screen.getByText('Año actual (2024)')).toBeInTheDocument();
  });
});

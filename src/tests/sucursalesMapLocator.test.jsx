import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SucursalesMapLocator } from '../components/public/SucursalesMapLocator';

// Mock Leaflet para entorno JSDOM
vi.mock('leaflet', () => {
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    panTo: vi.fn().mockReturnThis(),
    flyTo: vi.fn().mockReturnThis(),
    fitBounds: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis()
  };
  const layerGroupMock = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis()
  };
  return {
    default: {
      map: vi.fn(() => mapMock),
      tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      control: { zoom: vi.fn(() => ({ addTo: vi.fn() })) },
      layerGroup: vi.fn(() => layerGroupMock),
      divIcon: vi.fn(() => ({})),
      marker: vi.fn(() => ({ on: vi.fn() })),
      latLngBounds: vi.fn(() => ({
        extend: vi.fn(),
        isValid: vi.fn(() => true)
      }))
    }
  };
});

describe('SucursalesMapLocator - Localizador Geográfico Oficial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la barra de búsqueda y botones oficiales', () => {
    render(<SucursalesMapLocator />);

    expect(screen.getByPlaceholderText('Buscar sucursal, código o dirección')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerca de mí/i })).toBeInTheDocument();
  });

  it('muestra todas las pestañas de provincias con Alajuela seleccionada por defecto', () => {
    render(<SucursalesMapLocator />);

    const provincias = ['Todas', 'San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];
    provincias.forEach((prov) => {
      expect(screen.getAllByRole('button', { name: prov })[0]).toBeInTheDocument();
    });

    // Muestra 19 sucursales en Alajuela
    expect(screen.getByText('19 sucursales en Alajuela')).toBeInTheDocument();
  });

  it('renderiza las sucursales exactas de Alajuela (Aguas Zarcas, Alajuela, Atenas, City Mall)', () => {
    render(<SucursalesMapLocator />);

    expect(screen.getAllByText('Sucursal Aguas Zarcas').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Aguas Zarcas centro, diagonal a la oficina del ICE/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sucursal Alajuela')).toBeInTheDocument();
    expect(screen.getByText('Sucursal Atenas')).toBeInTheDocument();
    expect(screen.getByText('Sucursal City Mall')).toBeInTheDocument();
  });

  it('muestra el distintivo "Sucursal en el directorio"', () => {
    render(<SucursalesMapLocator />);

    expect(screen.getByText('Sucursal en el directorio')).toBeInTheDocument();
  });

  it('permite filtrar por otra provincia (ej. San José o Cartago)', () => {
    render(<SucursalesMapLocator />);

    const btnSanJose = screen.getAllByRole('button', { name: 'San José' })[0];
    fireEvent.click(btnSanJose);

    expect(screen.getByText(/sucursales en San José/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sucursal Central Zapote/i).length).toBeGreaterThanOrEqual(1);
  });

  it('filtra sucursales por texto de búsqueda', () => {
    render(<SucursalesMapLocator />);

    const input = screen.getByPlaceholderText('Buscar sucursal, código o dirección');
    fireEvent.change(input, { target: { value: 'City Mall' } });

    expect(screen.getByText('Sucursal City Mall')).toBeInTheDocument();
    expect(screen.queryByText('Sucursal Atenas')).toBeNull();
  });
});


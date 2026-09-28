/**
 * trackingUtils.js
 * Generador dinámico de etapas y estados de rastreo conforme a la normativa postal UPU.
 * Permite que los envíos reflejen fielmente estados como:
 * - 'Recibida' / 'Admisión'
 * - 'Procesando' / 'En clasificación'
 * - 'En aduana' / 'Retención fiscal'
 * - 'En tránsito' / 'En ruta de reparto'
 * - 'Disponible en sucursal'
 * - 'Entregado'
 */

export const ESTADOS_RASTREO = [
  { id: 'Recibida', label: 'Recibida / Admisión', badge: 'Recibida', icon: 'Package' },
  { id: 'Procesando', label: 'En Procesamiento', badge: 'Procesando', icon: 'Clock' },
  { id: 'En aduana', label: 'En Aduana (Aforo Fiscal)', badge: 'En aduana', icon: 'AlertTriangle' },
  { id: 'En tránsito', label: 'En Tránsito / Reparto', badge: 'En tránsito', icon: 'Truck' },
  { id: 'Disponible en sucursal', label: 'Listo para Retiro', badge: 'Disponible en sucursal', icon: 'Building' },
  { id: 'Entregado', label: 'Entregado', badge: 'Entregado', icon: 'CheckCircle2' }
];

export const GUIAS_DEMO = [
  { guia: 'CR098421734CR', estado: 'En tránsito', descripcion: 'EMS Courier en ruta hacia Alajuela' },
  { guia: 'CR109283745CR', estado: 'Entregado', descripcion: 'Pymexpress entregado en Escazú' },
  { guia: 'CR874512963CR', estado: 'En aduana', descripcion: 'Box Correos en aforo fiscal aduanero' },
  { guia: 'CR321654987CR', estado: 'Procesando', descripcion: 'Paquete en clasificación Zapote' },
  { guia: 'CR554129873CR', estado: 'Disponible en sucursal', descripcion: 'Listo para retiro en ventanilla' }
];

export function generateTrackingStages(envio) {
  const estado = envio?.estado || 'En tránsito';
  const origen = envio?.origen || 'San José Central';
  const destino = envio?.destino || 'GAM Costa Rica';

  switch (estado) {
    case 'Recibida':
    case 'Admisión':
      return [
        { paso: 1, nombre: 'Admisión / Recibida', ubicacion: `Sucursal ${origen}`, hora: '08:30 a.m.', completado: true, actual: true },
        { paso: 2, nombre: 'Procesamiento Postal', ubicacion: 'Centro de Clasificación Zapote', hora: 'Pendiente de traslado', completado: false },
        { paso: 3, nombre: 'En Tránsito', ubicacion: `Ruta interurbana hacia ${destino}`, hora: 'En espera', completado: false },
        { paso: 4, nombre: 'Entrega Final', ubicacion: destino, hora: 'Estimado 2-3 días hábiles', completado: false }
      ];

    case 'Procesando':
    case 'En clasificación':
      return [
        { paso: 1, nombre: 'Admisión / Recibida', ubicacion: `Sucursal ${origen}`, hora: '08:30 a.m.', completado: true },
        { paso: 2, nombre: 'En Clasificación Postal', ubicacion: 'Centro Logístico Automatizado Zapote', hora: '11:15 a.m.', completado: true, actual: true },
        { paso: 3, nombre: 'En Tránsito', ubicacion: `Consolidación hacia ${destino}`, hora: 'Programado hoy 03:00 p.m.', completado: false },
        { paso: 4, nombre: 'Entrega Final', ubicacion: destino, hora: 'Estimado mañana', completado: false }
      ];

    case 'En aduana':
    case 'Retenido en aduana':
    case 'Aforo fiscal':
      return [
        { paso: 1, nombre: 'Recepción Internacional', ubicacion: origen.includes('Miami') ? origen : 'Gateway Postal Santamaría', hora: '10 de mayo, 09:00 a.m.', completado: true },
        { paso: 2, nombre: 'Manifiesto y Arribo', ubicacion: 'Terminal Aérea de Carga SJO', hora: '11 de mayo, 02:30 p.m.', completado: true },
        { paso: 3, nombre: 'En Aduana (Aforo Fiscal)', ubicacion: 'Aduana Postal Santamaría - Revisión Técnica y Tasación', hora: 'En trámite de inspección', completado: true, actual: true, alerta: true },
        { paso: 4, nombre: 'Entrega Tras Desalmacenaje', ubicacion: destino, hora: 'Pendiente liberación aduanera', completado: false }
      ];

    case 'Disponible en sucursal':
    case 'Listo para retiro':
      return [
        { paso: 1, nombre: 'Admisión / Recibida', ubicacion: origen, hora: '08:00 a.m.', completado: true },
        { paso: 2, nombre: 'Procesado en Hub', ubicacion: 'Centro de Distribución Zapote', hora: '11:00 a.m.', completado: true },
        { paso: 3, nombre: 'Arribo a Sucursal Destino', ubicacion: `Sucursal ${destino}`, hora: '01:30 p.m.', completado: true },
        { paso: 4, nombre: 'Disponible para Retiro', ubicacion: `Ventanilla Postal ${destino}`, hora: 'Listo para retiro con documento de identidad', completado: true, actual: true }
      ];

    case 'Entregado':
      return [
        { paso: 1, nombre: 'Admisión / Recibida', ubicacion: origen, hora: '08:30 a.m.', completado: true },
        { paso: 2, nombre: 'Procesado en Hub', ubicacion: 'Centro Postal Zapote', hora: '11:15 a.m.', completado: true },
        { paso: 3, nombre: 'En Ruta de Reparto', ubicacion: `Unidad de Entrega ${destino}`, hora: '02:00 p.m.', completado: true },
        { paso: 4, nombre: 'Entregado con Éxito', ubicacion: destino, hora: 'Entregado y firmado conforme', completado: true, actual: true }
      ];

    case 'En tránsito':
    default:
      return [
        { paso: 1, nombre: 'Admisión / Recibida', ubicacion: origen, hora: '08:30 a.m.', completado: true },
        { paso: 2, nombre: 'Procesado en Hub', ubicacion: 'Centro Postal Zapote', hora: '11:15 a.m.', completado: true },
        { paso: 3, nombre: 'En Tránsito / Reparto', ubicacion: `Camión de ruta hacia ${destino}`, hora: '02:00 p.m.', completado: true, actual: true },
        { paso: 4, nombre: 'Entrega Final', ubicacion: destino, hora: 'Estimada hoy antes de 5:30 p.m.', completado: false }
      ];
  }
}

import React from 'react';
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, Truck, 
  Package, ShieldAlert, Check, X, AlertCircle, Info, RefreshCw
} from 'lucide-react';

/**
 * Accessible Status Badge conforming to WCAG 2.1 Success Criterion 1.4.1 (Use of Color).
 * Guarantees that states like "Aprobado", "Rechazado", "Entregado", "Pendiente" are
 * ALWAYS distinguished with distinct icons and explicit text, never with color alone.
 */
export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  if (!status) return null;

  const s = String(status).trim();
  const lower = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let config = {
    icon: CheckCircle2,
    bg: 'bg-emerald-100 text-emerald-950 border-emerald-400',
    prefix: '✓',
    text: s,
    ariaLabel: `Estado: ${s}`
  };

  // 1. Aprobado / Entregado / Resuelto / Activo / Abierto / Conectado / Verificado
  if (
    lower.includes('aprobado') || 
    lower.includes('entregado') || 
    lower.includes('resuelto') || 
    lower.includes('activo') || 
    lower.includes('abierto') || 
    lower.includes('conectado') || 
    lower.includes('online') ||
    lower.includes('verificado') ||
    lower.includes('exito') ||
    lower.includes('publicada')
  ) {
    config = {
      icon: CheckCircle2,
      bg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold',
      prefix: '✓',
      text: s,
      ariaLabel: `Estado Aprobado / Activo: ${s}`
    };
  }
  // 2. Rechazado / Cancelado / Inactivo / Suspendido / Cerrado / Retenido / Daño / Incidente
  else if (
    lower.includes('rechazado') || 
    lower.includes('cancelado') || 
    lower.includes('inactivo') || 
    lower.includes('suspendido') || 
    lower.includes('cerrado') || 
    lower.includes('retenido') || 
    lower.includes('sin acceso') ||
    lower.includes('error') ||
    lower.includes('dano') ||
    lower.includes('incidente') ||
    lower.includes('alta') // Prioridad alta / alerta
  ) {
    config = {
      icon: XCircle,
      bg: 'bg-rose-100 text-rose-950 border-rose-400 font-bold',
      prefix: '✕',
      text: s,
      ariaLabel: `Estado Rechazado / Alerta: ${s}`
    };
  }
  // 3. En tránsito / En ruta / En camino
  else if (
    lower.includes('transito') || 
    lower.includes('ruta') || 
    lower.includes('camino')
  ) {
    config = {
      icon: Truck,
      bg: 'bg-sky-100 text-sky-950 border-sky-400 font-bold',
      prefix: '➜',
      text: s,
      ariaLabel: `Estado En Tránsito: ${s}`
    };
  }
  // 4. Pendiente / En proceso / Procesando / En aduana / En revisión
  else if (
    lower.includes('pendiente') || 
    lower.includes('proceso') || 
    lower.includes('procesando') || 
    lower.includes('aduana') || 
    lower.includes('revision') ||
    lower.includes('espera') ||
    lower.includes('recibida')
  ) {
    config = {
      icon: AlertTriangle,
      bg: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
      prefix: '▲',
      text: s,
      ariaLabel: `Estado Pendiente / En Proceso: ${s}`
    };
  }
  // 5. Default / Información general
  else {
    config = {
      icon: Info,
      bg: 'bg-gray-100 text-gray-900 border-gray-300 font-bold',
      prefix: 'ℹ',
      text: s,
      ariaLabel: `Estado: ${s}`
    };
  }

  const IconComponent = config.icon;
  const isMini = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] leading-tight transition-all shadow-2xs ${config.bg} ${className}`}
      role="status"
      aria-label={config.ariaLabel}
    >
      <IconComponent 
        className={`${isMini ? 'w-3 h-3' : 'w-3.5 h-3.5'} flex-shrink-0 stroke-[2.2]`} 
        aria-hidden="true" 
      />
      <span className="font-bold tracking-tight">
        {config.text}
      </span>
    </span>
  );
};

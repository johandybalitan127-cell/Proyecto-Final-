import React from 'react';

/**
 * Componente GoogleIcon para renderizar iconos oficiales de Google Fonts (Material Symbols)
 * Permite reemplazar emojis e iconos tradicionales por la tipografía de iconos de Google.
 */
export const GoogleIcon = ({
  name,
  className = '',
  variant = 'rounded', // 'rounded' | 'outlined'
  filled = false,
  size,
  style = {},
  ariaLabel
}) => {
  if (!name) return null;

  const fontClass = variant === 'outlined' ? 'material-symbols-outlined' : 'material-symbols-rounded';

  const inlineStyles = {
    fontVariationSettings: filled
      ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
    ...style
  };

  return (
    <span
      className={`${fontClass} select-none inline-flex items-center justify-center shrink-0 align-middle ${className}`}
      style={inlineStyles}
      aria-hidden={ariaLabel ? undefined : 'true'}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {name}
    </span>
  );
};

export default GoogleIcon;

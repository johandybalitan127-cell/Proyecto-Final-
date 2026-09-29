import React from 'react';
import { GoogleIcon } from './GoogleIcon';

// Mapeo exhaustivo de emojis frecuentes a Iconos de Google Fonts (Material Symbols)
export const EMOJI_TO_GOOGLE_ICON_MAP = {
  '👋': { name: 'waving_hand', className: 'text-amber-500', filled: true },
  '📊': { name: 'bar_chart', className: 'text-azul-primario', filled: false },
  '⚠️': { name: 'warning', className: 'text-amber-500', filled: true },
  '🏢': { name: 'domain', className: 'text-azul-oscuro', filled: false },
  '👥': { name: 'group', className: 'text-indigo-600', filled: false },
  '📋': { name: 'assignment', className: 'text-azul-primario', filled: false },
  '📑': { name: 'description', className: 'text-azul-primario', filled: false },
  '🧠': { name: 'psychology', className: 'text-pink-600', filled: false },
  '⚡': { name: 'bolt', className: 'text-amber-500', filled: true },
  '📦': { name: 'inventory_2', className: 'text-azul-primario', filled: false },
  '💰': { name: 'payments', className: 'text-emerald-600', filled: false },
  '⏱️': { name: 'schedule', className: 'text-sky-600', filled: false },
  '⏱': { name: 'schedule', className: 'text-sky-600', filled: false },
  '🕒': { name: 'schedule', className: 'text-gray-500', filled: false },
  '📅': { name: 'calendar_today', className: 'text-azul-primario', filled: false },
  '✈️': { name: 'flight', className: 'text-sky-600', filled: false },
  '✈': { name: 'flight', className: 'text-sky-600', filled: false },
  '🚫': { name: 'block', className: 'text-rose-600', filled: true },
  '💡': { name: 'lightbulb', className: 'text-amber-500', filled: true },
  '✅': { name: 'check_circle', className: 'text-emerald-600', filled: true },
  '❌': { name: 'cancel', className: 'text-rose-600', filled: true },
  '🔍': { name: 'search', className: 'text-azul-primario', filled: false },
  '📍': { name: 'location_on', className: 'text-rose-500', filled: true },
  '🎯': { name: 'ads_click', className: 'text-azul-primario', filled: false },
  '🚀': { name: 'rocket_launch', className: 'text-azul-primario', filled: true },
  '💬': { name: 'chat', className: 'text-azul-primario', filled: false },
  '🤖': { name: 'smart_toy', className: 'text-azul-primario', filled: false },
  '🔔': { name: 'notifications', className: 'text-amber-500', filled: true },
  '✨': { name: 'auto_awesome', className: 'text-amber-400', filled: true },
  '🔒': { name: 'lock', className: 'text-azul-oscuro', filled: false }
};

// Expresión regular que detecta los emojis soportados
const EMOJI_REGEX = new RegExp(
  Object.keys(EMOJI_TO_GOOGLE_ICON_MAP)
    .sort((a, b) => b.length - a.length)
    .map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'g'
);

/**
 * Reemplaza emojis y formato Markdown en un texto por nodos React enriquecidos
 * con tipografía e iconos de Google Fonts.
 */
export const formatAiTextWithGoogleFonts = (text, options = {}) => {
  if (!text) return null;
  const { isUser = false, baseTextColor = '' } = options;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Si la línea está vacía, renderizar espaciador
    if (!line.trim()) {
      return <div key={`empty-${lineIdx}`} className="h-2" />;
    }

    // Procesar Markdown y emojis dentro de la línea
    const parsedSegments = parseLineContent(line, isUser);

    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');

    return (
      <div
        key={`line-${lineIdx}`}
        className={`leading-relaxed ${isBullet ? 'pl-2 flex items-start gap-1.5' : ''} ${baseTextColor}`}
      >
        {isBullet && (
          <span className="w-1.5 h-1.5 rounded-full bg-azul-primario shrink-0 mt-2 mr-1" />
        )}
        <div className="flex-1">
          {parsedSegments}
        </div>
      </div>
    );
  });
};

/**
 * Parsea el contenido de una línea (Markdown negritas y emojis a GoogleIcon)
 */
function parseLineContent(lineText, isUser) {
  // Limpiar viñeta inicial si existe porque se renderiza por separado
  let cleanLine = lineText;
  if (cleanLine.trim().startsWith('•')) {
    cleanLine = cleanLine.trim().replace(/^•\s*/, '');
  } else if (cleanLine.trim().startsWith('-')) {
    cleanLine = cleanLine.trim().replace(/^-\s*/, '');
  }

  // Separar primero por negritas **texto**
  const boldParts = cleanLine.split(/(\*\*.*?\*\*)/g);

  return boldParts.map((part, pIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong
          key={`b-${pIdx}`}
          className={`font-bold ${isUser ? 'text-white' : 'text-azul-oscuro'}`}
        >
          {replaceEmojisWithGoogleIcons(boldText, isUser)}
        </strong>
      );
    }
    return (
      <React.Fragment key={`t-${pIdx}`}>
        {replaceEmojisWithGoogleIcons(part, isUser)}
      </React.Fragment>
    );
  });
}

/**
 * Reemplaza emojis individuales por componentes GoogleIcon
 */
function replaceEmojisWithGoogleIcons(str, isUser) {
  if (!str) return str;

  const parts = [];
  let lastIdx = 0;
  let match;
  
  // Reiniciar índice regex
  EMOJI_REGEX.lastIndex = 0;

  while ((match = EMOJI_REGEX.exec(str)) !== null) {
    // Texto antes del emoji
    if (match.index > lastIdx) {
      parts.push(str.substring(lastIdx, match.index));
    }

    const emojiChar = match[0];
    const iconConfig = EMOJI_TO_GOOGLE_ICON_MAP[emojiChar];

    if (iconConfig) {
      parts.push(
        <GoogleIcon
          key={`emoji-${match.index}`}
          name={iconConfig.name}
          className={`${isUser ? 'text-white' : iconConfig.className} inline-flex mx-1 text-[17px] align-text-bottom`}
          filled={iconConfig.filled}
          size={18}
          ariaLabel={iconConfig.name}
        />
      );
    } else {
      parts.push(emojiChar);
    }

    lastIdx = match.index + emojiChar.length;
  }

  // Texto restante después del último emoji
  if (lastIdx < str.length) {
    parts.push(str.substring(lastIdx));
  }

  return parts.length > 0 ? parts : str;
}

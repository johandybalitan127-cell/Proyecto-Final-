import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // 1. High Contrast
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('correos_high_contrast') === 'true';
  });

  // 2. Colorblind Mode (Daltonismo): 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia'
  const [colorblindMode, setColorblindMode] = useState(() => {
    return localStorage.getItem('correos_colorblind_mode') || 'none';
  });

  // 3. Text Scale: 'normal' | 'large' | 'xlarge'
  const [textScale, setTextScale] = useState(() => {
    return localStorage.getItem('correos_text_scale') || 'normal';
  });

  // 4. Voice Reading (Lectura de Voz en vivo para personas ciegas)
  const [voiceReadingActive, setVoiceReadingActive] = useState(() => {
    return localStorage.getItem('correos_voice_reading') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 5. Enhanced Focus (Foco de ultra-alto contraste para teclado)
  const [enhancedFocus, setEnhancedFocus] = useState(() => {
    return localStorage.getItem('correos_enhanced_focus') !== 'false'; // default on
  });

  // 6. Screen Reader Help (ARIA helpers)
  const [screenReaderHelp, setScreenReaderHelp] = useState(() => {
    return localStorage.getItem('correos_screen_reader_help') === 'true';
  });

  // 7. Modal Visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 8. Live ARIA Announcements for external screen readers
  const [announcement, setAnnouncement] = useState('');
  const lastSpokenRef = useRef('');

  // Speech synthesis helper
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('SpeechSynthesis cancel error:', e);
      }
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try selecting an optimal Spanish voice
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  }, []);

  // Announce to both screen readers (via ARIA live region) and optionally speak it
  const announce = useCallback((message, speakIt = false) => {
    setAnnouncement(message);
    if (speakIt || voiceReadingActive) {
      speak(message);
    }
    // Clear announcement after 5s so it can be re-triggered
    setTimeout(() => setAnnouncement(''), 5000);
  }, [speak, voiceReadingActive]);

  // Read entire main page content aloud
  const readCurrentPage = useCallback(() => {
    const mainEl = document.querySelector('main') || document.body;
    // Collect titles and paragraphs
    const elements = mainEl.querySelectorAll('h1, h2, h3, p');
    const texts = Array.from(elements)
      .map(el => el.innerText.trim())
      .filter(t => t.length > 0 && !t.includes('©'));

    const fullText = texts.slice(0, 15).join('. ');
    if (fullText) {
      announce('Iniciando lectura de la página en voz alta', false);
      speak(`Leyendo página actual: ${fullText}`);
    } else {
      speak('No se encontró contenido principal para leer en esta pantalla.');
    }
  }, [announce, speak]);

  // Sync state to HTML DOM classes and localStorage
  useEffect(() => {
    const root = document.documentElement;

    // 1. High contrast class
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('correos_high_contrast', highContrast);

    // 2. Colorblind Mode classes
    root.classList.remove(
      'colorblind-deuteranopia',
      'colorblind-protanopia',
      'colorblind-tritanopia',
      'colorblind-achromatopsia'
    );
    if (colorblindMode && colorblindMode !== 'none') {
      root.classList.add(`colorblind-${colorblindMode}`);
    }
    localStorage.setItem('correos_colorblind_mode', colorblindMode);

    // 3. Text scaling
    root.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    root.classList.add(`text-scale-${textScale}`);
    localStorage.setItem('correos_text_scale', textScale);

    // 4. Enhanced focus
    if (enhancedFocus) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
    localStorage.setItem('correos_enhanced_focus', enhancedFocus);

    // 5. Voice Reading state
    localStorage.setItem('correos_voice_reading', voiceReadingActive);
    localStorage.setItem('correos_screen_reader_help', screenReaderHelp);
  }, [highContrast, colorblindMode, textScale, enhancedFocus, voiceReadingActive, screenReaderHelp]);

  // Global Keyboard Shortcuts (WCAG 2.1 Standard Keyboard Access)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + A: Open Accessibility Modal
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsModalOpen(prev => !prev);
        announce('Menú de accesibilidad activado', true);
      }
      // Alt + L: Read current page / Toggle voice
      else if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        if (isSpeaking) {
          stopSpeaking();
          announce('Lectura de voz pausada', true);
        } else {
          readCurrentPage();
        }
      }
      // Alt + S or Escape while speaking: Stop speech
      else if ((e.altKey && (e.key === 's' || e.key === 'S')) || (e.key === 'Escape' && isSpeaking)) {
        stopSpeaking();
      }
      // Alt + C: Toggle High Contrast
      else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setHighContrast(prev => {
          const next = !prev;
          announce(next ? 'Modo de alto contraste activado' : 'Modo de alto contraste desactivado', true);
          return next;
        });
      }
      // Alt + D: Cycle Colorblind Mode
      else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        cycleColorblindMode();
      }
      // Alt + T: Cycle Text Size (Normal -> Grande -> Extra Grande)
      else if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        cycleTextScale();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpeaking, stopSpeaking, readCurrentPage, announce]);

  // Auto Voice Reading on Focus / Hover for Blind users when voice reading is active
  useEffect(() => {
    if (!voiceReadingActive) return;

    const handleFocusOrHover = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, h1, h2, h3, [role="button"], [data-speech]');
      if (!interactive) return;

      let textToRead = 
        interactive.getAttribute('aria-label') || 
        interactive.getAttribute('title') || 
        interactive.innerText || 
        interactive.getAttribute('placeholder') || 
        '';

      textToRead = textToRead.trim();
      if (textToRead && textToRead !== lastSpokenRef.current && textToRead.length < 200) {
        lastSpokenRef.current = textToRead;
        const role = interactive.getAttribute('role') || interactive.tagName.toLowerCase();
        let prefix = '';
        if (role === 'button' || interactive.tagName === 'BUTTON') prefix = 'Botón: ';
        else if (interactive.tagName === 'A') prefix = 'Enlace: ';
        else if (role.startsWith('h') || interactive.tagName.match(/^H[1-6]$/)) prefix = 'Encabezado: ';
        
        speak(`${prefix}${textToRead}`);
      }
    };

    document.addEventListener('focusin', handleFocusOrHover);
    return () => document.removeEventListener('focusin', handleFocusOrHover);
  }, [voiceReadingActive, speak]);

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      announce(next ? 'Alto contraste activado' : 'Alto contraste desactivado', true);
      return next;
    });
  };

  const cycleColorblindMode = () => {
    setColorblindMode(prev => {
      const modes = ['none', 'deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia'];
      const nextIdx = (modes.indexOf(prev) + 1) % modes.length;
      const next = modes[nextIdx];
      
      const labels = {
        none: 'Modo de visión estándar sin filtro',
        deuteranopia: 'Filtro para Deuteranopía activado. Optimizado para ceguera al color verde',
        protanopia: 'Filtro para Protanopía activado. Optimizado para ceguera al color rojo',
        tritanopia: 'Filtro para Tritanopía activado. Optimizado para ceguera al color azul',
        achromatopsia: 'Modo Acromatopsia activado. Escala monocromática pura de alto contraste'
      };
      announce(labels[next] || next, true);
      return next;
    });
  };

  const cycleTextScale = () => {
    setTextScale(prev => {
      if (prev === 'normal') {
        announce('Tamaño de texto grande', true);
        return 'large';
      }
      if (prev === 'large') {
        announce('Tamaño de texto extra grande', true);
        return 'xlarge';
      }
      announce('Tamaño de texto normal', true);
      return 'normal';
    });
  };

  const toggleVoiceReading = () => {
    setVoiceReadingActive(prev => {
      const next = !prev;
      if (next) {
        speak('Lectura asistida por voz activada. Los elementos que enfoques con el teclado o el cursor serán leídos automáticamente. Presiona Alt más L para escuchar la página entera.');
      } else {
        stopSpeaking();
        announce('Lectura asistida por voz desactivada', false);
      }
      return next;
    });
  };

  const toggleScreenReaderHelp = () => setScreenReaderHelp(prev => !prev);
  const toggleEnhancedFocus = () => setEnhancedFocus(prev => !prev);

  const resetAccessibility = () => {
    setHighContrast(false);
    setColorblindMode('none');
    setTextScale('normal');
    setVoiceReadingActive(false);
    setEnhancedFocus(true);
    setScreenReaderHelp(false);
    stopSpeaking();
    announce('Ajustes de accesibilidad restablecidos a valores por defecto', true);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        colorblindMode,
        setColorblindMode,
        cycleColorblindMode,
        textScale,
        setTextScale,
        cycleTextScale,
        voiceReadingActive,
        toggleVoiceReading,
        enhancedFocus,
        toggleEnhancedFocus,
        screenReaderHelp,
        toggleScreenReaderHelp,
        isModalOpen,
        setIsModalOpen,
        resetAccessibility,
        speak,
        stopSpeaking,
        isSpeaking,
        readCurrentPage,
        announce,
      }}
    >
      {/* Invisible live region for screen readers (NVDA, JAWS, VoiceOver) */}
      <div
        id="accessible-announcer"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  return context || {
    highContrast: false,
    colorblindMode: 'none',
    textScale: 'normal',
    voiceReadingActive: false,
    enhancedFocus: true,
    screenReaderHelp: false,
    isModalOpen: false,
    isSpeaking: false,
    toggleHighContrast: () => {},
    setColorblindMode: () => {},
    cycleColorblindMode: () => {},
    setTextScale: () => {},
    cycleTextScale: () => {},
    toggleVoiceReading: () => {},
    toggleEnhancedFocus: () => {},
    toggleScreenReaderHelp: () => {},
    setIsModalOpen: () => {},
    resetAccessibility: () => {},
    speak: () => {},
    stopSpeaking: () => {},
    readCurrentPage: () => {},
    announce: () => {},
  };
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('correos_high_contrast') === 'true';
  });

  const [textScale, setTextScale] = useState(() => {
    return localStorage.getItem('correos_text_scale') || 'normal'; // normal | large | xlarge
  });

  const [screenReaderHelp, setScreenReaderHelp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Apply high contrast class
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('correos_high_contrast', highContrast);

    // Apply text scale
    root.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    root.classList.add(`text-scale-${textScale}`);
    localStorage.setItem('correos_text_scale', textScale);
  }, [highContrast, textScale]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  const cycleTextScale = () => {
    setTextScale((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  const toggleScreenReaderHelp = () => setScreenReaderHelp((prev) => !prev);

  const resetAccessibility = () => {
    setHighContrast(false);
    setTextScale('normal');
    setScreenReaderHelp(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        textScale,
        setTextScale,
        cycleTextScale,
        screenReaderHelp,
        toggleScreenReaderHelp,
        isModalOpen,
        setIsModalOpen,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);

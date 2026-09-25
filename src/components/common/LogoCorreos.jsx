import React from 'react';

export const LogoCorreos = ({ className = "h-8" }) => (
  <svg viewBox="0 0 380 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Minimalist modern interpretation of the Correos de Costa Rica logo */}
    {/* Red/Blue geometric wing/envelope */}
    <path d="M15 25 L45 50 L75 25 L75 75 L15 75 Z" fill="#002b7f" />
    <path d="M15 25 L45 50 L75 25 Z" fill="#ce1126" />
    
    {/* Text 'CORREOS' */}
    <text x="95" y="62" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="42" fill="#002b7f" letterSpacing="-1.5">
      CORREOS
    </text>
    
    {/* Text 'de Costa Rica' */}
    <text x="295" y="62" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="16" fill="#ce1126">
      de Costa Rica
    </text>
  </svg>
);

import React from 'react';

export const LogoCorreos = ({ className = "h-8", alt = "Correos de Costa Rica" }) => (
  <>
    <img
      src="/images/logo-correos-hd.png"
      alt={alt}
      className={`${className} object-contain transition-transform duration-200 group-hover:scale-[1.02] dark:hidden`}
      loading="eager"
    />
    <img
      src="/images/logo-dark.png"
      alt={alt}
      className={`${className} object-contain transition-transform duration-200 group-hover:scale-[1.02] hidden dark:block`}
      loading="eager"
    />
  </>
);


import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Phone, Mail, Clock, ShieldCheck, Globe, Share2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto text-gris-oscuro">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Correos de CR & Propuesta Académica */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/correos-logo.png"
                alt="Correos de Costa Rica"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://www.stickercr.com/wp-content/uploads/2024/08/Logo-version-b-1.png';
                }}
              />
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Propuesta de modernización y rediseño de la infraestructura pública postal y logística de Costa Rica con altos estándares de usabilidad, transparencia y accesibilidad universal.
            </p>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Propuesta Académica Universitaria
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Escuela de Informática y Diseño Digital · UCR · Estudiantes: Alex Aguilar & Johandy Balitan
            </p>
          </div>

          {/* Column 2: Sobre Correos */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-azul-oscuro uppercase tracking-wider">
              Sobre Correos
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <Link to="/ayuda" className="hover:text-azul-primario transition-colors">
                  Nuestra Institución
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="hover:text-azul-primario transition-colors">
                  Memoria y Sostenibilidad
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="hover:text-azul-primario transition-colors">
                  Filatelia Nacional y Museo
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-azul-primario transition-colors">
                  Pymexpress y Alianzas Comerciales
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="hover:text-azul-primario transition-colors">
                  Portal de Transparencia Ciudadana
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacto y Sucursales */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-azul-oscuro uppercase tracking-wider">
              Contacto y Sucursales
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
                <span>Edificio Central, Calle 2, Av. 1 y 3, San José, Costa Rica</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-azul-primario flex-shrink-0" />
                <span>Central: (+506) 2257-8888</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-azul-primario flex-shrink-0" />
                <a href="mailto:servicioalcliente@correos.go.cr" className="hover:underline text-azul-primario">
                  servicioalcliente@correos.go.cr
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-azul-primario flex-shrink-0 mt-0.5" />
                <span>Lun–Vie 8:00 a.m.–5:00 p.m. / Sáb 8:00 a.m.–12:00 p.m.</span>
              </div>
            </div>
          </div>

          {/* Column 4: Canales y Soporte */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-azul-oscuro uppercase tracking-wider">
              Canales y Soporte
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <Link to="/ayuda" className="hover:text-azul-primario transition-colors">
                  Preguntas Frecuentes (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="hover:text-azul-primario transition-colors">
                  Calculadora de Tarifas y Envíos
                </Link>
              </li>
              <li>
                <Link to="/oficinas" className="hover:text-azul-primario transition-colors">
                  Consulta de Códigos Postales
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="hover:text-azul-primario transition-colors">
                  Términos y Condiciones del Servicio
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-500 block mb-2">Canales Oficiales:</span>
              <div className="flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook Oficial" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-azul-primario hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram Oficial" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-rose-600 hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X Twitter Oficial" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <Link to="/asistente-ia" aria-label="Asistente Postal IA" className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-azul-primario hover:bg-azul-primario hover:text-white transition">
                  <Globe className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center md:text-left">
          <p>
            © 2025 Correos de Costa Rica S.A. Todos los derechos reservados. Proyecto de Rediseño de Experiencia de Usuario.
          </p>
          <div className="flex items-center gap-4 text-gray-600">
            <Link to="/ayuda" className="hover:text-azul-primario transition">Privacidad de Datos</Link>
            <span>·</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-azul-primario transition">
              Accesibilidad Web (W3C AA)
            </button>
            <span>·</span>
            <Link to="/servicios" className="hover:text-azul-primario transition">Mapa del Sitio</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

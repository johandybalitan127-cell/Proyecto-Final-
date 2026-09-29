/**
 * Estadísticas y métricas operativas diferenciadas por cada sede y centro de distribución
 * de Correos de Costa Rica en el Sistema Integral Postal (SIP-CR)
 */
export const SEDES_DASHBOARD_DATA = {
  'Sucursal Central San José': {
    nombre: 'Sucursal Central San José',
    nombreCorto: 'Central San José',
    provincia: 'San José',
    subtitulo: 'Centro neurálgico de admisión, casilleros y trámites VES del área metropolitana',
    stats: {
      registrados: { valor: '14,820', delta: '+12.4%', deltaType: 'positive' },
      transito: { valor: '3,415', delta: '112 rutas', deltaType: 'neutral' },
      entregados: { valor: '11,180', delta: '98.2% a tiempo', deltaType: 'positive' },
      consultas: { valor: '1,290', delta: '94% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 75, color: '#78BE20' },
      { name: 'En tránsito', value: 20, color: '#0066A1' },
      { name: 'Aduanas', value: 3, color: '#F59E0B' },
      { name: 'Incidencias', value: 2, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Pymexpress', porcentaje: 40, color: '#78BE20' },
      { servicio: 'EMS Internacional', porcentaje: 28, color: '#0066A1' },
      { servicio: 'Paquete Postal', porcentaje: 22, color: '#004B78' },
      { servicio: 'Box Miami / API', porcentaje: 10, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Junio con 15,420 guías',
    enviosPorMes: [
      { mes: 'Ene', envios: 10200 },
      { mes: 'Feb', envios: 11450 },
      { mes: 'Mar', envios: 12800 },
      { mes: 'Abr', envios: 13600 },
      { mes: 'May', envios: 14200 },
      { mes: 'Jun', envios: 15420 },
      { mes: 'Jul', envios: 14100 },
      { mes: 'Ago', envios: 13900 },
      { mes: 'Set', envios: 14500 },
      { mes: 'Oct', envios: 14820 },
      { mes: 'Nov', envios: 15100 },
      { mes: 'Dic', envios: 15300 }
    ],
    actividadReciente: [
      { time: 'Hace 3 minutos', text: 'Ventanilla rápida Central San José atendió trámite VES pasaporte', color: 'bg-azul-primario' },
      { time: 'Hace 11 minutos', text: 'Guía #CR098421734CR asignada a cartero de ruta San José Centro', color: 'bg-verde-principal' },
      { time: 'Hace 24 minutos', text: 'Despacho de lote Pymexpress GAM hacia Centro Zapote', color: 'bg-amber-500' },
      { time: 'Hace 40 minutos', text: 'Cierre de manifiesto de apartados postales histórico', color: 'bg-purple-600' }
    ]
  },

  'Centro Operativo Postal (Zapote)': {
    nombre: 'Centro Operativo Postal (Zapote)',
    nombreCorto: 'Zapote Operativo',
    provincia: 'San José',
    subtitulo: 'Hub central de clasificación automatizada, aforo aduanal y distribución nacional',
    stats: {
      registrados: { valor: '18,940', delta: '+15.8%', deltaType: 'positive' },
      transito: { valor: '4,620', delta: '156 rutas', deltaType: 'neutral' },
      entregados: { valor: '13,850', delta: '97.6% a tiempo', deltaType: 'positive' },
      consultas: { valor: '1,840', delta: '96% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 68, color: '#78BE20' },
      { name: 'En tránsito', value: 24, color: '#0066A1' },
      { name: 'Aduanas', value: 6, color: '#F59E0B' },
      { name: 'Incidencias', value: 2, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Pymexpress', porcentaje: 35, color: '#78BE20' },
      { servicio: 'EMS Internacional', porcentaje: 32, color: '#0066A1' },
      { servicio: 'Paquete Postal', porcentaje: 18, color: '#004B78' },
      { servicio: 'Box Miami / API', porcentaje: 15, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Julio con 19,810 guías procesadas',
    enviosPorMes: [
      { mes: 'Ene', envios: 13500 },
      { mes: 'Feb', envios: 14800 },
      { mes: 'Mar', envios: 16100 },
      { mes: 'Abr', envios: 16900 },
      { mes: 'May', envios: 17800 },
      { mes: 'Jun', envios: 18900 },
      { mes: 'Jul', envios: 19810 },
      { mes: 'Ago', envios: 18400 },
      { mes: 'Set', envios: 18100 },
      { mes: 'Oct', envios: 18940 },
      { mes: 'Nov', envios: 19400 },
      { mes: 'Dic', envios: 19950 }
    ],
    actividadReciente: [
      { time: 'Hace 2 minutos', text: 'Banda clasificadora automática Zapote procesó 450 paquetes EMS', color: 'bg-azul-primario' },
      { time: 'Hace 8 minutos', text: 'Liberación de carga aduanal contenedor Miami #CR-8821', color: 'bg-verde-principal' },
      { time: 'Hace 19 minutos', text: 'Salida de camión troncal ruta Zapote → Guanacaste/Liberia', color: 'bg-amber-500' },
      { time: 'Hace 35 minutos', text: 'Sincronización de trazabilidad N8N con 120 guías de comercio electrónico', color: 'bg-purple-600' }
    ]
  },

  'Alajuela Centro Regional': {
    nombre: 'Alajuela Centro Regional',
    nombreCorto: 'Alajuela Regional',
    provincia: 'Alajuela',
    subtitulo: 'Hub regional de conexión aeroportuaria, exportaciones y zona occidental del GAM',
    stats: {
      registrados: { valor: '9,450', delta: '+9.1%', deltaType: 'positive' },
      transito: { valor: '2,180', delta: '78 rutas', deltaType: 'neutral' },
      entregados: { valor: '7,120', delta: '96.8% a tiempo', deltaType: 'positive' },
      consultas: { valor: '890', delta: '92% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 72, color: '#78BE20' },
      { name: 'En tránsito', value: 21, color: '#0066A1' },
      { name: 'Aduanas', value: 5, color: '#F59E0B' },
      { name: 'Incidencias', value: 2, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Pymexpress', porcentaje: 42, color: '#78BE20' },
      { servicio: 'EMS Internacional', porcentaje: 26, color: '#0066A1' },
      { servicio: 'Paquete Postal', porcentaje: 20, color: '#004B78' },
      { servicio: 'Box Miami / API', porcentaje: 12, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Mayo con 10,210 guías',
    enviosPorMes: [
      { mes: 'Ene', envios: 6800 },
      { mes: 'Feb', envios: 7400 },
      { mes: 'Mar', envios: 8100 },
      { mes: 'Abr', envios: 8600 },
      { mes: 'May', envios: 10210 },
      { mes: 'Jun', envios: 9800 },
      { mes: 'Jul', envios: 9100 },
      { mes: 'Ago', envios: 8900 },
      { mes: 'Set', envios: 9200 },
      { mes: 'Oct', envios: 9450 },
      { mes: 'Nov', envios: 9700 },
      { mes: 'Dic', envios: 9900 }
    ],
    actividadReciente: [
      { time: 'Hace 5 minutos', text: 'Arribo de puente logístico Aeropuerto Santamaría → Alajuela Centro', color: 'bg-azul-primario' },
      { time: 'Hace 14 minutos', text: 'Despacho de 85 guías hacia San Ramón, Grecia y Palmares', color: 'bg-verde-principal' },
      { time: 'Hace 29 minutos', text: 'Afiliación express Pymexpress a cooperativa de café local', color: 'bg-amber-500' },
      { time: 'Hace 48 minutos', text: 'Entrega confirmada de insumos médicos en Hospital de Alajuela', color: 'bg-purple-600' }
    ]
  },

  'Sucursal Heredia Central': {
    nombre: 'Sucursal Heredia Central',
    nombreCorto: 'Heredia Central',
    provincia: 'Heredia',
    subtitulo: 'Sede de alta eficiencia urbana, zonas francas y distribución universitaria',
    stats: {
      registrados: { valor: '8,120', delta: '+11.3%', deltaType: 'positive' },
      transito: { valor: '1,540', delta: '58 rutas', deltaType: 'neutral' },
      entregados: { valor: '6,450', delta: '99.1% a tiempo', deltaType: 'positive' },
      consultas: { valor: '760', delta: '95% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 81, color: '#78BE20' },
      { name: 'En tránsito', value: 16, color: '#0066A1' },
      { name: 'Aduanas', value: 2, color: '#F59E0B' },
      { name: 'Incidencias', value: 1, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Pymexpress', porcentaje: 48, color: '#78BE20' },
      { servicio: 'EMS Internacional', porcentaje: 24, color: '#0066A1' },
      { servicio: 'Paquete Postal', porcentaje: 19, color: '#004B78' },
      { servicio: 'Box Miami / API', porcentaje: 9, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Octubre con 8,120 guías',
    enviosPorMes: [
      { mes: 'Ene', envios: 5600 },
      { mes: 'Feb', envios: 6100 },
      { mes: 'Mar', envios: 6800 },
      { mes: 'Abr', envios: 7200 },
      { mes: 'May', envios: 7500 },
      { mes: 'Jun', envios: 7900 },
      { mes: 'Jul', envios: 7400 },
      { mes: 'Ago', envios: 7300 },
      { mes: 'Set', envios: 7800 },
      { mes: 'Oct', envios: 8120 },
      { mes: 'Nov', envios: 8300 },
      { mes: 'Dic', envios: 8500 }
    ],
    actividadReciente: [
      { time: 'Hace 6 minutos', text: 'Reparto completado en Parque Empresarial Zona Franca América', color: 'bg-verde-principal' },
      { time: 'Hace 18 minutos', text: 'Recepción de correspondencia oficial Universidad Nacional (UNA)', color: 'bg-azul-primario' },
      { time: 'Hace 32 minutos', text: '35 pasaportes biométricos VES entregados a domicilio en Heredia', color: 'bg-amber-500' },
      { time: 'Hace 52 minutos', text: 'Apertura de turno vespertino en ventanilla rápida La Inmaculada', color: 'bg-purple-600' }
    ]
  },

  'Sucursal Cartago Los Ángeles': {
    nombre: 'Sucursal Cartago Los Ángeles',
    nombreCorto: 'Cartago Los Ángeles',
    provincia: 'Cartago',
    subtitulo: 'Atención ciudadana, agro-logística y paquetería de la Vieja Metrópoli',
    stats: {
      registrados: { valor: '6,840', delta: '+7.5%', deltaType: 'positive' },
      transito: { valor: '1,420', delta: '52 rutas', deltaType: 'neutral' },
      entregados: { valor: '5,280', delta: '97.5% a tiempo', deltaType: 'positive' },
      consultas: { valor: '620', delta: '89% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 77, color: '#78BE20' },
      { name: 'En tránsito', value: 19, color: '#0066A1' },
      { name: 'Aduanas', value: 2, color: '#F59E0B' },
      { name: 'Incidencias', value: 2, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Pymexpress', porcentaje: 44, color: '#78BE20' },
      { servicio: 'EMS Internacional', porcentaje: 20, color: '#0066A1' },
      { servicio: 'Paquete Postal', porcentaje: 28, color: '#004B78' },
      { servicio: 'Box Miami / API', porcentaje: 8, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Agosto con 7,320 guías',
    enviosPorMes: [
      { mes: 'Ene', envios: 4900 },
      { mes: 'Feb', envios: 5300 },
      { mes: 'Mar', envios: 5900 },
      { mes: 'Abr', envios: 6200 },
      { mes: 'May', envios: 6500 },
      { mes: 'Jun', envios: 6800 },
      { mes: 'Jul', envios: 6900 },
      { mes: 'Ago', envios: 7320 },
      { mes: 'Set', envios: 6600 },
      { mes: 'Oct', envios: 6840 },
      { mes: 'Nov', envios: 7000 },
      { mes: 'Dic', envios: 7200 }
    ],
    actividadReciente: [
      { time: 'Hace 9 minutos', text: 'Ruta Cartago → Turrialba despachada con 110 paquetes nacionales', color: 'bg-azul-primario' },
      { time: 'Hace 22 minutos', text: 'Entrega masiva en Instituto Tecnológico de Costa Rica (TEC)', color: 'bg-verde-principal' },
      { time: 'Hace 41 minutos', text: 'Reclamo #PQ-2026-4412 atendido en ventanilla Los Ángeles', color: 'bg-amber-500' },
      { time: 'Hace 58 minutos', text: 'Cierre de arqueo de recaudación marchamo vehicular INS', color: 'bg-purple-600' }
    ]
  },

  'Sucursal Liberia Centro': {
    nombre: 'Sucursal Liberia Centro',
    nombreCorto: 'Liberia Guanacaste',
    provincia: 'Guanacaste',
    subtitulo: 'Cabecera regional del Pacífico Norte, turismo internacional y zona de bajura',
    stats: {
      registrados: { valor: '4,320', delta: '+14.2%', deltaType: 'positive' },
      transito: { valor: '1,120', delta: '44 rutas', deltaType: 'neutral' },
      entregados: { valor: '3,110', delta: '95.2% a tiempo', deltaType: 'positive' },
      consultas: { valor: '430', delta: '89% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 70, color: '#78BE20' },
      { name: 'En tránsito', value: 25, color: '#0066A1' },
      { name: 'Aduanas', value: 2, color: '#F59E0B' },
      { name: 'Incidencias', value: 3, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'EMS Internacional', porcentaje: 36, color: '#0066A1' },
      { servicio: 'Pymexpress', porcentaje: 28, color: '#78BE20' },
      { servicio: 'Paquete Postal', porcentaje: 26, color: '#004B78' },
      { servicio: 'Box Miami / API', porcentaje: 10, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Enero con 4,890 guías (Temporada Turística)',
    enviosPorMes: [
      { mes: 'Ene', envios: 4890 },
      { mes: 'Feb', envios: 4600 },
      { mes: 'Mar', envios: 4400 },
      { mes: 'Abr', envios: 4100 },
      { mes: 'May', envios: 3800 },
      { mes: 'Jun', envios: 3900 },
      { mes: 'Jul', envios: 4200 },
      { mes: 'Ago', envios: 3700 },
      { mes: 'Set', envios: 3600 },
      { mes: 'Oct', envios: 4320 },
      { mes: 'Nov', envios: 4500 },
      { mes: 'Dic', envios: 4750 }
    ],
    actividadReciente: [
      { time: 'Hace 7 minutos', text: 'Despacho de paquetería turística hacia Papagayo y Tamarindo', color: 'bg-azul-primario' },
      { time: 'Hace 25 minutos', text: 'Recepción de valija postal desde Aeropuerto Daniel Oduber', color: 'bg-verde-principal' },
      { time: 'Hace 44 minutos', text: 'Entrega de pasaporte internacional en Sucursal Santa Cruz', color: 'bg-amber-500' },
      { time: 'Hace 60 minutos', text: 'Coordinación de enlace terrestre Liberia ↔ Nicoya', color: 'bg-purple-600' }
    ]
  },

  'Sucursal Puntarenas Puerto': {
    nombre: 'Sucursal Puntarenas Puerto',
    nombreCorto: 'Puntarenas Puerto',
    provincia: 'Puntarenas',
    subtitulo: 'Polo logístico de la costa pacífica, península de Nicoya y zona sur',
    stats: {
      registrados: { valor: '3,890', delta: '+6.8%', deltaType: 'positive' },
      transito: { valor: '980', delta: '38 rutas', deltaType: 'neutral' },
      entregados: { valor: '2,820', delta: '94.8% a tiempo', deltaType: 'positive' },
      consultas: { valor: '390', delta: '87% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 69, color: '#78BE20' },
      { name: 'En tránsito', value: 26, color: '#0066A1' },
      { name: 'Aduanas', value: 2, color: '#F59E0B' },
      { name: 'Incidencias', value: 3, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Paquete Postal', porcentaje: 38, color: '#004B78' },
      { servicio: 'EMS Internacional', porcentaje: 30, color: '#0066A1' },
      { servicio: 'Pymexpress', porcentaje: 25, color: '#78BE20' },
      { servicio: 'Box Miami / API', porcentaje: 7, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Marzo con 4,210 guías',
    enviosPorMes: [
      { mes: 'Ene', envios: 3700 },
      { mes: 'Feb', envios: 3900 },
      { mes: 'Mar', envios: 4210 },
      { mes: 'Abr', envios: 3800 },
      { mes: 'May', envios: 3500 },
      { mes: 'Jun', envios: 3600 },
      { mes: 'Jul', envios: 3750 },
      { mes: 'Ago', envios: 3400 },
      { mes: 'Set', envios: 3500 },
      { mes: 'Oct', envios: 3890 },
      { mes: 'Nov', envios: 4000 },
      { mes: 'Dic', envios: 4150 }
    ],
    actividadReciente: [
      { time: 'Hace 10 minutos', text: 'Embarque de bultos postales hacia Paquera vía Ferry Tambor', color: 'bg-azul-primario' },
      { time: 'Hace 30 minutos', text: 'Reparto en el Paseo de los Turistas y comercio local del Puerto', color: 'bg-verde-principal' },
      { time: 'Hace 49 minutos', text: 'Ruta Jacó ↔ Quepos reportó 100% de entregas al mediodía', color: 'bg-amber-500' },
      { time: 'Hace 65 minutos', text: 'Recepción de encomiendas agrícolas desde Esparza', color: 'bg-purple-600' }
    ]
  },

  'Sucursal Limón Centro': {
    nombre: 'Sucursal Limón Centro',
    nombreCorto: 'Limón Centro',
    provincia: 'Limón',
    subtitulo: 'Hub logístico del Caribe, terminal de Moín y exportaciones agroindustriales',
    stats: {
      registrados: { valor: '4,750', delta: '+10.5%', deltaType: 'positive' },
      transito: { valor: '1,280', delta: '42 rutas', deltaType: 'neutral' },
      entregados: { valor: '3,360', delta: '93.9% a tiempo', deltaType: 'positive' },
      consultas: { valor: '510', delta: '86% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 67, color: '#78BE20' },
      { name: 'En tránsito', value: 27, color: '#0066A1' },
      { name: 'Aduanas', value: 3, color: '#F59E0B' },
      { name: 'Incidencias', value: 3, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'Paquete Postal', porcentaje: 36, color: '#004B78' },
      { servicio: 'EMS Internacional', porcentaje: 34, color: '#0066A1' },
      { servicio: 'Pymexpress', porcentaje: 22, color: '#78BE20' },
      { servicio: 'Box Miami / API', porcentaje: 8, color: '#F59E0B' }
    ],
    picoMesTexto: 'Pico máximo registrado en Septiembre con 5,100 guías (Carnavales/Puerto)',
    enviosPorMes: [
      { mes: 'Ene', envios: 3800 },
      { mes: 'Feb', envios: 4100 },
      { mes: 'Mar', envios: 4300 },
      { mes: 'Abr', envios: 4400 },
      { mes: 'May', envios: 4600 },
      { mes: 'Jun', envios: 4700 },
      { mes: 'Jul', envios: 4550 },
      { mes: 'Ago', envios: 4650 },
      { mes: 'Set', envios: 5100 },
      { mes: 'Oct', envios: 4750 },
      { mes: 'Nov', envios: 4900 },
      { mes: 'Dic', envios: 5050 }
    ],
    actividadReciente: [
      { time: 'Hace 8 minutos', text: 'Despacho de valija aduanal Terminal de Contenedores Moín (TCM)', color: 'bg-azul-primario' },
      { time: 'Hace 21 minutos', text: 'Conexión fluvial hacia Barra del Tortuguero y Parismina', color: 'bg-verde-principal' },
      { time: 'Hace 38 minutos', text: 'Reparto completado en Parque Vargas y centro comercial Limón', color: 'bg-amber-500' },
      { time: 'Hace 55 minutos', text: 'Ingreso de remesa de guías desde Guápiles y Pococí', color: 'bg-purple-600' }
    ]
  },

  'Aduana Postal Santamaría': {
    nombre: 'Aduana Postal Santamaría',
    nombreCorto: 'Aduana Santamaría',
    provincia: 'Alajuela',
    subtitulo: 'Centro de control fiscal, aforo de carga aérea internacional y courier express',
    stats: {
      registrados: { valor: '12,600', delta: '+18.7%', deltaType: 'positive' },
      transito: { valor: '2,940', delta: '86 rutas', deltaType: 'neutral' },
      entregados: { valor: '8,920', delta: '96.1% a tiempo', deltaType: 'positive' },
      consultas: { valor: '2,150', delta: '92% IA resueltas', deltaType: 'positive' }
    },
    estados: [
      { name: 'Entregado', value: 48, color: '#78BE20' },
      { name: 'Aduanas', value: 31, color: '#F59E0B' },
      { name: 'En tránsito', value: 18, color: '#0066A1' },
      { name: 'Incidencias', value: 3, color: '#EF4444' }
    ],
    servicios: [
      { servicio: 'EMS Internacional', porcentaje: 46, color: '#0066A1' },
      { servicio: 'Box Miami / API', porcentaje: 25, color: '#F59E0B' },
      { servicio: 'Pymexpress', porcentaje: 15, color: '#78BE20' },
      { servicio: 'Paquete Postal', porcentaje: 14, color: '#004B78' }
    ],
    picoMesTexto: 'Pico máximo registrado en Noviembre con 14,350 guías (Temporada Black Friday)',
    enviosPorMes: [
      { mes: 'Ene', envios: 8900 },
      { mes: 'Feb', envios: 9400 },
      { mes: 'Mar', envios: 10200 },
      { mes: 'Abr', envios: 10800 },
      { mes: 'May', envios: 11300 },
      { mes: 'Jun', envios: 11900 },
      { mes: 'Jul', envios: 12100 },
      { mes: 'Ago', envios: 11800 },
      { mes: 'Set', envios: 12200 },
      { mes: 'Oct', envios: 12600 },
      { mes: 'Nov', envios: 14350 },
      { mes: 'Dic', envios: 14100 }
    ],
    actividadReciente: [
      { time: 'Hace 1 minuto', text: 'Liberación DGA de 320 paquetes Box Miami con arancel cancelado', color: 'bg-verde-principal' },
      { time: 'Hace 15 minutos', text: 'Inspección no intrusiva rayos X de vuelo carguero procedente de Miami', color: 'bg-azul-primario' },
      { time: 'Hace 33 minutos', text: 'Notificación de aforo a 45 destinatarios con factura comercial requerida', color: 'bg-amber-500' },
      { time: 'Hace 47 minutos', text: 'Transferencia de lote postal nacionalizado hacia Centro Zapote', color: 'bg-purple-600' }
    ]
  }
};

export const DATE_PERIOD_OPTIONS = [
  { id: 'hoy', label: 'Hoy', shortLabel: 'Hoy', description: 'Últimas 24 horas', badge: 'Diario' },
  { id: '7d', label: 'Últimos 7 días', shortLabel: '7 días', description: 'Semana en curso', badge: 'Semanal' },
  { id: '30d', label: 'Últimos 30 días', shortLabel: '30 días', description: 'Mes actual estándar', badge: '30 días' },
  { id: '90d', label: 'Último trimestre', shortLabel: 'Trimestre', description: 'Últimos 90 días', badge: 'Trimestral' },
  { id: 'ano', label: 'Año actual (2024)', shortLabel: 'Año 2024', description: 'Histórico anual', badge: 'Anual' }
];

/**
 * Obtiene los datos correspondientes a la sede solicitada y los adapta al período de tiempo seleccionado
 * con fallback seguro a Central San José y período de 30 días.
 */
export const getBranchDashboardData = (branchName, period = '30d') => {
  const base = SEDES_DASHBOARD_DATA[branchName] || SEDES_DASHBOARD_DATA['Sucursal Central San José'];

  const rawRegistrados = parseInt(String(base.stats.registrados.valor).replace(/,/g, ''), 10) || 14820;
  const rawTransito = parseInt(String(base.stats.transito.valor).replace(/,/g, ''), 10) || 3415;
  const rawEntregados = parseInt(String(base.stats.entregados.valor).replace(/,/g, ''), 10) || 11180;
  const rawConsultas = parseInt(String(base.stats.consultas.valor).replace(/,/g, ''), 10) || 1290;

  // Hoy: Últimas 24 horas (desglose por horas)
  if (period === 'hoy' || period === 'Hoy') {
    const regHoy = Math.max(25, Math.round(rawRegistrados / 28));
    const transHoy = Math.max(10, Math.round(rawTransito / 18));
    const entHoy = Math.max(20, Math.round(rawEntregados / 28));
    const consHoy = Math.max(5, Math.round(rawConsultas / 25));

    return {
      ...base,
      periodId: 'hoy',
      periodLabel: 'Hoy',
      periodoBadge: 'Hoy (24h)',
      chartTitulo: 'Envíos por Hora — Jornada de Hoy',
      picoMesTexto: 'Mayor afluencia hoy entre las 13:00 y las 15:00 con despachos VES y Pymexpress',
      stats: {
        registrados: { valor: regHoy.toLocaleString(), delta: '+4.2% vs ayer', deltaType: 'positive' },
        transito: { valor: transHoy.toLocaleString(), delta: 'En ruta activa', deltaType: 'neutral' },
        entregados: { valor: entHoy.toLocaleString(), delta: '98.5% en horario', deltaType: 'positive' },
        consultas: { valor: consHoy.toLocaleString(), delta: '96% IA resueltas', deltaType: 'positive' }
      },
      chartData: [
        { mes: '08:00', envios: Math.round(regHoy * 0.08) },
        { mes: '10:00', envios: Math.round(regHoy * 0.18) },
        { mes: '12:00', envios: Math.round(regHoy * 0.22) },
        { mes: '14:00', envios: Math.round(regHoy * 0.28) },
        { mes: '16:00', envios: Math.round(regHoy * 0.16) },
        { mes: '18:00', envios: Math.round(regHoy * 0.08) }
      ]
    };
  }

  // Últimos 7 días: Semana en curso (desglose de Lun a Dom)
  if (period === '7d' || period === 'Últimos 7 días') {
    const reg7 = Math.round(rawRegistrados * 0.24);
    const trans7 = Math.round(rawTransito * 0.35);
    const ent7 = Math.round(rawEntregados * 0.24);
    const cons7 = Math.round(rawConsultas * 0.24);

    return {
      ...base,
      periodId: '7d',
      periodLabel: 'Últimos 7 días',
      periodoBadge: 'Semanal (7d)',
      chartTitulo: 'Envíos por Día — Últimos 7 Días',
      picoMesTexto: 'Pico semanal registrado el día Viernes con consolidación de carga nacional',
      stats: {
        registrados: { valor: reg7.toLocaleString(), delta: '+6.1% vs semana ant.', deltaType: 'positive' },
        transito: { valor: trans7.toLocaleString(), delta: 'Rutas activas', deltaType: 'neutral' },
        entregados: { valor: ent7.toLocaleString(), delta: '98.1% a tiempo', deltaType: 'positive' },
        consultas: { valor: cons7.toLocaleString(), delta: '95% IA resueltas', deltaType: 'positive' }
      },
      chartData: [
        { mes: 'Lun', envios: Math.round(reg7 * 0.16) },
        { mes: 'Mar', envios: Math.round(reg7 * 0.17) },
        { mes: 'Mié', envios: Math.round(reg7 * 0.18) },
        { mes: 'Jue', envios: Math.round(reg7 * 0.19) },
        { mes: 'Vie', envios: Math.round(reg7 * 0.21) },
        { mes: 'Sáb', envios: Math.round(reg7 * 0.07) },
        { mes: 'Dom', envios: Math.round(reg7 * 0.02) }
      ]
    };
  }

  // Último trimestre: 90 días (desglose de 3 meses)
  if (period === '90d' || period === 'Último trimestre' || period === 'Último trimestre (90 días)') {
    const reg90 = Math.round(rawRegistrados * 2.92);
    const trans90 = Math.round(rawTransito * 1.8);
    const ent90 = Math.round(rawEntregados * 2.9);
    const cons90 = Math.round(rawConsultas * 2.85);

    const m9 = base.enviosPorMes[9]?.envios || Math.round(rawRegistrados * 0.95);
    const m10 = base.enviosPorMes[10]?.envios || Math.round(rawRegistrados * 0.98);
    const m11 = base.enviosPorMes[11]?.envios || Math.round(rawRegistrados * 1.02);

    return {
      ...base,
      periodId: '90d',
      periodLabel: 'Último trimestre',
      periodoBadge: 'Trimestral',
      chartTitulo: 'Envíos por Mes — Último Trimestre',
      picoMesTexto: 'Crecimiento sostenido del 8.4% durante el último trimestre operacional',
      stats: {
        registrados: { valor: reg90.toLocaleString(), delta: '+8.4% trimestral', deltaType: 'positive' },
        transito: { valor: trans90.toLocaleString(), delta: 'Flujo promedio', deltaType: 'neutral' },
        entregados: { valor: ent90.toLocaleString(), delta: '98.3% efectividad', deltaType: 'positive' },
        consultas: { valor: cons90.toLocaleString(), delta: '94% IA resueltas', deltaType: 'positive' }
      },
      chartData: [
        { mes: 'Octubre', envios: m9 },
        { mes: 'Noviembre', envios: m10 },
        { mes: 'Diciembre', envios: m11 }
      ]
    };
  }

  // Año actual 2024: Acumulado anual completo (desglose de 12 meses)
  if (period === 'ano' || period === 'Año actual (2024)' || period === 'Año 2024') {
    const totalAnualRegistrados = base.enviosPorMes.reduce((acc, curr) => acc + curr.envios, 0);
    const totalAnualEntregados = Math.round(totalAnualRegistrados * 0.978);
    const totalAnualConsultas = Math.round(rawConsultas * 11.8);

    return {
      ...base,
      periodId: 'ano',
      periodLabel: 'Año 2024',
      periodoBadge: 'Anual (2024)',
      chartTitulo: 'Envíos por Mes — Evolución Anual 2024',
      picoMesTexto: base.picoMesTexto,
      stats: {
        registrados: { valor: totalAnualRegistrados.toLocaleString(), delta: '+14.2% interanual', deltaType: 'positive' },
        transito: { valor: rawTransito.toLocaleString(), delta: 'En ruta actual', deltaType: 'neutral' },
        entregados: { valor: totalAnualEntregados.toLocaleString(), delta: '98.2% acumulado', deltaType: 'positive' },
        consultas: { valor: totalAnualConsultas.toLocaleString(), delta: '95% IA resueltas', deltaType: 'positive' }
      },
      chartData: base.enviosPorMes
    };
  }

  // Rango personalizado de fechas
  if (typeof period === 'object' && period.from && period.to) {
    const d1 = new Date(period.from);
    const d2 = new Date(period.to);
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const daysDiff = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24))) + 1;
    const factor = Math.min(12, Math.max(0.05, daysDiff / 30));

    const customReg = Math.round(rawRegistrados * factor);
    const customEnt = Math.round(rawEntregados * factor);
    const customCons = Math.round(rawConsultas * factor);

    return {
      ...base,
      periodId: 'custom',
      periodLabel: `${period.from} al ${period.to}`,
      periodoBadge: `${daysDiff} días`,
      chartTitulo: `Envíos — Rango Personalizado (${daysDiff} días)`,
      picoMesTexto: `Visualizando período personalizado de ${daysDiff} días operacionales`,
      stats: {
        registrados: { valor: customReg.toLocaleString(), delta: `${daysDiff} días`, deltaType: 'neutral' },
        transito: { valor: rawTransito.toLocaleString(), delta: 'En tránsito', deltaType: 'neutral' },
        entregados: { valor: customEnt.toLocaleString(), delta: '98.0% efectividad', deltaType: 'positive' },
        consultas: { valor: customCons.toLocaleString(), delta: 'Atendidas', deltaType: 'positive' }
      },
      chartData: [
        { mes: 'Tramo Inicial', envios: Math.round(customReg * 0.28) },
        { mes: 'Tramo Medio', envios: Math.round(customReg * 0.44) },
        { mes: 'Tramo Final', envios: Math.round(customReg * 0.28) }
      ]
    };
  }

  // Predeterminado: Últimos 30 días (4 semanas del mes)
  return {
    ...base,
    periodId: '30d',
    periodLabel: 'Últimos 30 días',
    periodoBadge: '30 días',
    chartTitulo: 'Envíos por Semana — Últimos 30 Días',
    chartData: [
      { mes: 'Semana 1', envios: Math.round(rawRegistrados * 0.22) },
      { mes: 'Semana 2', envios: Math.round(rawRegistrados * 0.26) },
      { mes: 'Semana 3', envios: Math.round(rawRegistrados * 0.28) },
      { mes: 'Semana 4', envios: Math.round(rawRegistrados * 0.24) }
    ]
  };
};

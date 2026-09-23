# Correos de Costa Rica: Plataforma Digital Ciudadana

> **Proyecto Académico:** *Anteproyecto — Mejora Digital Correos de Costa Rica*  
> **Estudiantes:** Alex Aguilar y Johandy Balitan  
> **Institución:** Escuela de Informática y Diseño Digital — Universidad de Costa Rica (UCR)  
> **Propuesta:** Rediseño de experiencia de usuario y modernización de la infraestructura digital pública postal y logística de Costa Rica (simulación académica no conectada a sistemas de producción reales).

---

## 1. Tecnologías y Stack Técnico

- **Frontend Core:** React 18 (Componentes funcionales + Hooks).
- **Enrutamiento:** React Router DOM v6 con Route Guards (`<ProtectedRoute>` para usuarios y rol `Administrador` para `/admin/*`).
- **Diseño & Estilos:** Tailwind CSS con tokens oficiales exactos y accesibilidad WCAG 2.1 AA (Inter font, modo alto contraste, escalado de texto, soporte lector de pantalla).
- **Visualización de Datos:** Recharts para gráficos ejecutivos interactivos (línea, barras, dona).
- **Backend Simulado:** JSON Server en puerto `3001` con base de datos `db.json` para 6 CRUDs completos (`usuarios`, `envios`, `sucursales`, `servicios`, `tarifas`, `faq`, `consultas`, `ia_logs`).
- **Servicios:** Capa modular en `src/services/` con fallback resiliente en `localStorage` (la aplicación opera interactivamente aún si el servidor REST no ha sido iniciado).
- **API Externa Real:** Integración en tiempo real con API pública de Tipo de Cambio USD / CRC para cotización en casillero Miami y envíos internacionales.
- **Testing:** Vitest + React Testing Library con 5 suites de pruebas unitarias.

---

## 2. Paleta Oficial de Colores (Anexo 4: Guía de Estilo)

| Token | Uso Semántico | HEX | RGB |
|---|---|---|---|
| `azul-primario` | Identidad / marca, botones primarios, iconografía activa | `#0066A1` | 0, 102, 161 |
| `azul-oscuro` | Hover / interacción, footer y encabezados de tarjeta | `#004B78` | 0, 75, 118 |
| `verde-principal` | Acento secundario, éxito, CTA de conversión | `#78BE20` | 120, 190, 32 |
| `verde-oscuro` | Hover de verde | `#4F8F16` | 79, 143, 22 |
| `blanco` | Superficie predominante (cards, navbar) | `#FFFFFF` | 255, 255, 255 |
| `gris-claro` | Fondo general / canvas | `#F5F7F8` | 245, 247, 248 |
| `gris-oscuro` | Texto y alto contraste | `#263238` | 38, 50, 56 |

---

## 3. Estructura de Rutas

### Vistas Públicas:
- `/`: Inicio (Hero H1, 3 métricas, card de rastreo con stepper 4 pasos, grid 3x2 de servicios, sección "¿Dónde estamos?" con geolocalización, banner pasaporte/cédula VES, tarjetas Pymexpress y Casillero Miami).
- `/servicios`: Catálogo oficial de servicios + calculadora interactiva de tarifas.
- `/rastreo/:trackingNumber?`: Rastreo interactivo con validador regex (`^(CR|CP)\d{9}CR$`), timeline, suscripción de alertas y comprobante digital imprimible.
- `/oficinas`: Localizador de 110 sucursales, filtros por las 7 provincias, horario en vivo y agendamiento de cita oficial VES.
- `/asistente-ia`: Chat interactivo con Asistente Postal IA (NLP simulado, autoservicios y tarjeta de rastreo embebida).
- `/ayuda`: Centro de ayuda con FAQs y formulario PQRS interactivo.
- `/login` y `/register`: Autenticación con perfiles rápidos de demostración (Carlos Mora / Ciudadana María Elena Rojas).

### Usuario Autenticado (`/cuenta/*` con Route Guard):
- `/cuenta/perfil`: Datos personales, dirección de entrega y casillero Miami.
- `/cuenta/historial`: Historial de envíos tramitados.
- `/cuenta/paquetes-guardados`: Envíos anclados con estado en vivo.
- `/cuenta/configuracion`: Preferencias de notificaciones SMS/Email y 2FA.

### Administrador (`/admin/*` con Route Guard para rol `Administrador`):
- `/admin`: Dashboard ejecutivo (4 stat cards, evolución mensual Recharts, distribución de servicios, dona de estados, últimos envíos con exportación CSV, timeline de actividad).
- `/admin/envios`: CRUD Envíos y Paquetería (filtros chip, tabla con Ver/Editar/Eliminar, panel de distribución y mini-formulario "Nuevo Envío Rápido").
- `/admin/usuarios`: CRUD Usuarios y Clientes (tabla, formulario nuevo usuario, roles del sistema).
- `/admin/sucursales`: CRUD Oficinas y Sucursales (tabla con estado abierto/cerrado, barras de cobertura provincial, formulario nueva sucursal con coordenadas).
- `/admin/servicios-tarifas`: CRUD Servicios y Tarifas (2 tablas apiladas: Servicios + Tarifas, calculadora rápida).
- `/admin/consultas`: CRUD PQRS (tickets, prioridades, estados, panel explicativo del flujo N8N).
- `/admin/asistente-ia`: Logs & NLP (análisis de intenciones, tasa de confianza, tabla de interacciones, estado del motor).
- `/admin/reportes`: Reportes y Estadísticas (gráficos interactivos Recharts, descargas PDF/Excel).
- `/admin/configuracion`: Configuración del Sistema (información general, matriz de roles y permisos RBAC, integraciones, seguridad y accesibilidad).

---

## 4. Instrucciones para Levantar el Proyecto

### Requisitos Previos:
- Node.js (v18 o superior)
- NPM (v9 o superior)

### Instalación de Dependencias:
```bash
npm install
```

### Opción A: Ejecutar App + JSON Server Concurrente (Recomendada)
Para levantar simultáneamente la aplicación React en el puerto `5173` y el backend REST simulado en el puerto `3001`:
```bash
npm run dev:all
```

### Opción B: Ejecutar por Separado
**Terminal 1 (Backend REST):**
```bash
npm run server
```
*El servidor JSON Server quedará escuchando en `http://localhost:3001` con endpoints para `/usuarios`, `/envios`, `/sucursales`, `/servicios`, `/tarifas`, `/faq`, `/consultas`, `/ia_logs`.*

**Terminal 2 (Frontend React):**
```bash
npm run dev
```
*Abre tu navegador en `http://localhost:5173`.*

---

## 5. Ejecución de Pruebas Unitarias

La suite incluye 5 pruebas clave con Vitest y React Testing Library:
1. `trackingRegex.test.js`: Valida el cumplimiento del estándar UPU de guías (`CR098421734CR` y `CP123456789CR`).
2. `tariffCalculator.test.js`: Valida la lógica de estimación tarifaria según peso y categoría.
3. `formValidation.test.js`: Valida la integridad de formularios y campos obligatorios de PQRS.
4. `authService.test.js`: Valida la autenticación de operadores administradores y usuarios suspendidos.
5. `stepperComponent.test.jsx`: Valida el renderizado accesible de las 4 etapas del rastreo postal con React Testing Library.

Para ejecutar las pruebas:
```bash
npm test
```

---

## 6. Documentación de Flujos de Automatización N8N

El anteproyecto define dos flujos de integración y automatización con **N8N**:

### Flujo 1: Registro Ciudadano y Bienvenida
```
[Formulario Registro Web] 
       │
       ▼ (HTTP POST Webhook)
[Webhook Trigger N8N: /webhook/nuevo-usuario]
       │
       ▼
[Node: Validación de Identidad y Padrón Cívico]
       │
       ▼
[Node: Inserción en JSON Server / Base Postal]
       │
       ▼
[Node: Asignación de Código de Casillero Box Correos]
       │
       ▼
[Node: Despacho de Correo Electrónico Oficial de Bienvenida]
```
- **Descripción:** Cuando un ciudadano se registra en `/register`, se envía un webhook hacia N8N conteniendo nombre, correo y teléfono. N8N valida los datos, registra el identificador de cliente y dispara un correo con las credenciales de la Sucursal Virtual y dirección de casillero en Miami.

### Flujo 2: Radicación y Clasificación Automática de PQRS
```
[Formulario PQRS / Ayuda] 
       │
       ▼ (HTTP POST Webhook)
[Webhook Trigger N8N: /webhook/pqrs-ciudadana]
       │
       ▼
[Node: Extracción y Clasificación NLP de Urgencia]
       │
       ├──► Si Categoría = "Aduanas" ──► Notificación a Unidad de Aforo Fiscal
       ├──► Si Categoría = "Reclamos" ──► Notificación a Auditoría de Seguros
       └──► Si Categoría = "Pymes" ──► Enrutamiento a Atención Comercial Pymexpress
       │
       ▼
[Node: Generación de Ticket Oficial #PQ-2025-XXXX]
       │
       ▼
[Node: Envío de SMS / Email de Confirmación al Ciudadano]
```
- **Descripción:** Las solicitudes radicadas en `/ayuda` o mediante el Asistente IA son procesadas por N8N. Un nodo de lenguaje natural analiza el asunto y texto, categoriza el nivel de prioridad (Alta/Media/Baja) y transfiere el ticket al equipo resolutor asignado.

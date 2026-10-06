<div align="center">

# 🌟 Puvnex CRM — Frontend App
### *Next-Gen Executive Cloud Suite & Client Management Portal*

[![Vue 3](https://img.shields.io/badge/Vue_3-3.5+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.2+-41B883?style=for-the-badge&logo=primefaces&logoColor=white)](https://primevue.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.3+-FFE57F?style=for-the-badge&logo=vuedotjs&logoColor=black)](https://pinia.vuejs.org/)

<br/>

*Interfaz de usuario moderna, reactiva y ejecutiva diseñada para la administración de clientes, supervisión financiera, gestión de hosting/dominios y portal de autoservicio.*

---

</div>

## 📑 Tabla de Contenidos

- [✨ Características Visuales & Funcionales](#-características-visuales--funcionales)
- [🎨 Diseño & Sistema de Componentes](#-diseño--sistema-de-componentes)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🧩 Módulos del Sistema](#-módulos-del-sistema)
- [🚀 Inicio Rápido](#-inicio-rápido)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Variables de Entorno](#variables-de-entorno)
  - [Servidor de Desarrollo](#servidor-de-desarrollo)
  - [Compilación para Producción](#compilación-para-producción)
- [🔗 Integración con Backend (Proxy API)](#-integración-con-backend-proxy-api)

---

## ✨ Características Visuales & Funcionales

- 🌌 **Executive Dark UI**: Diseño visual prémium con contrastes calibrados para reducir la fatiga visual.
- 📱 **100% Responsivo**: Vistas adaptativas que alternan entre tablas de datos completas en escritorio y tarjetas interactivas (*Card Grids*) en móviles.
- ⚡ **Rendimiento Reactivo**: Construido sobre Vite para tiempos de carga casi instantáneos y reemplazo de módulos en caliente (HMR).
- 🔒 **Rutas Protegidas (RBAC)**: Guards de navegación en Vue Router que validan autenticación JWT y roles de usuario.
- 📊 **Dashboards & KPIs Interactivos**: Visualización de métricas financieras, servicios activos y solicitudes pendientes.
- 🔔 **Sistema de Alertas Toast & Modales**: Notificaciones flotantes y formularios modales con validaciones en tiempo real.

---

## 🎨 Diseño & Sistema de Componentes

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework UI** | [Vue 3](https://vuejs.org/) | Composition API (`<script setup>`) reactivo y modular |
| **Build Tool** | [Vite](https://vitejs.dev/) | Bundler de nueva generación con alta velocidad de compilación |
| **Tipado** | [TypeScript](https://www.typescriptlang.org/) | Tipado estricto en modelos, props y composables |
| **UI Components** | [PrimeVue 4 (Aura Theme)](https://primevue.org/) | Componentes de CRM (DataTables, Modals, Dropdowns, Badges) |
| **Iconografía** | [PrimeIcons](https://primevue.org/icons/) | Catálogo de iconos vectoriales optimizados |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) | Utilidades CSS para layout, gradientes y animaciones |
| **State Management** | [Pinia](https://pinia.vuejs.org/) | Manejo reactivo de sesión, tokens de usuario y permisos |
| **Enrutamiento** | [Vue Router 4](https://router.vuejs.org/) | Navegación SPA con protección por roles |

---

## 📂 Estructura del Proyecto

```bash
Puvnex_frontend/
├── src/
│   ├── api/                      # Clientes Axios y llamadas a endpoints por dominio
│   ├── assets/                   # Estilos globales y configuraciones de Tailwind
│   ├── components/               # Componentes reutilizables agrupados por módulo
│   │   ├── clientes/             # Tablas, tarjetas, KPIs y modales de clientes
│   │   ├── common/               # Toasts, botones y modales genéricos
│   │   ├── dashboard/            # Tarjetas de KPI, gráficos y resúmenes financieros
│   │   ├── dominios/             # Formularios y visualizadores de dominios/DNS
│   │   ├── hostings/             # Gestión de planes y servidores de hosting
│   │   ├── layout/               # Barra de navegación lateral colapsable (Sidebar)
│   │   ├── pagos/                # Tablas de pagos, conciliación y recibos
│   │   ├── portal/               # Vistas y componentes del portal de cliente
│   │   ├── recordatorios/        # Alertas de cobro y recordatorios masivos
│   │   └── solicitudes/          # Mesa de soporte y tickets de clientes
│   ├── composables/              # Lógica reutilizable (useClientes, useToast, etc.)
│   ├── router/                   # Configuración de rutas y Navigation Guards
│   ├── stores/                   # Stores globales de Pinia (Auth, Session)
│   ├── views/                    # Vistas principales de la aplicación
│   ├── App.vue                   # Componente raíz
│   └── main.ts                   # Punto de entrada y registro de plugins
├── .env.example                  # Plantilla de variables de entorno frontend
├── .gitignore                    # Reglas de exclusión de Git
├── index.html                    # Documento HTML principal
├── package.json                  # Dependencias y scripts del proyecto
├── tailwind.config.js            # Configuración de tema, colores y sombras
├── tsconfig.json                 # Configuración de TypeScript
└── vite.config.ts                # Configuración de Vite y proxy de desarrollo
```

---

## 🧩 Módulos del Sistema

| Módulo | Vista Principal | Descripción |
| :--- | :--- | :--- |
| **Dashboard** | `DashboardView.vue` | Panel ejecutivo con KPIs financieros, cobros pendientes y estadísticas de servicios. |
| **Clientes** | `ClientesView.vue` | Directorio empresarial, gestión de contactos, datos fiscales y estados de cuenta. |
| **Dominios** | `DominiosView.vue` | Control de fechas de vencimiento, registradores, nameservers y zonas DNS. |
| **Hosting** | `HostingsView.vue` | Supervisión de cuentas cPanel, servidores asignados y planes contratados. |
| **Pagos** | `PagosView.vue` | Registro de transacciones, métodos de pago, comprobantes y cuentas por cobrar. |
| **Recordatorios** | `RecordatoriosView.vue` | Notificaciones automáticas de renovación y cobros programados vía correo. |
| **Solicitudes** | `SolicitudesView.vue` | Mesa de ayuda, tickets de soporte técnico con hilos de conversación. |
| **Portal Cliente** | `PortalInicioView.vue` | Área de autoservicio para que los clientes consulten sus servicios y facturas. |

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js 18.0+** (Recomendado Node 20 o superior)
- **npm**, **pnpm** o **yarn**
- **Git**

### Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone git@github.com:Paulob0t/Puvnex_frontend.git
   cd Puvnex_frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

### Variables de Entorno

Copia el archivo de ejemplo a `.env` (opcional en desarrollo ya que Vite usa el proxy predeterminado):

```bash
cp .env.example .env
```

```ini
# URL base para la API del backend
VITE_API_BASE_URL=/api/v1
```

### Servidor de Desarrollo

Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

Accede desde tu navegador en: [http://localhost:5180](http://localhost:5180)

### Compilación para Producción

Genera el paquete optimizado para despliegue:

```bash
npm run build
```

Para previsualizar la compilación localmente:

```bash
npm run preview
```

---

## 🔗 Integración con Backend (Proxy API)

El archivo `vite.config.ts` viene preconfigurado con un proxy inverso para evitar problemas de CORS durante el desarrollo:

```typescript
server: {
  port: 5180,
  strictPort: true,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true
    }
  }
}
```

Todas las llamadas hacia `/api/*` se redirigen transparentemente a `http://127.0.0.1:8000/api/*`.

---

<div align="center">

Desarrollado con ❤️ por **Paulo Essau** • *Puvnex Suite Cloud*

</div>

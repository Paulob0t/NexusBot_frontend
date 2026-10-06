# 🚀 NexusBot CRM - Frontend (Vue 3 + Vite)

Interfaz de usuario moderna y ejecutiva para la Suite Cloud Empresarial NexusBot CRM.

---

## 🛠️ Stack Tecnológico

| Capa | Herramienta | Utilidad |
| :--- | :--- | :--- |
| **Framework** | **Vue 3 (Composition API) + Vite** | Entorno de desarrollo rápido y construcción optimizada. |
| **Lenguaje** | **TypeScript** | Tipado estático y robustez en la base de código. |
| **Componentes UI** | **PrimeVue (Aura Theme) + PrimeIcons** | Tablas de datos avanzadas, modales, filtros, badges y notificaciones. |
| **Estilos** | **Tailwind CSS** | Estilos utilitarios, tema oscuro ejecutivo (*Executive Dark UI*) y diseño responsivo. |
| **Manejo de Estado** | **Pinia** | Gestión de estado reactivo para autenticación, sesión y preferencias. |
| **Enrutamiento** | **Vue Router 4** | Navegación protegida por guards de autenticación y roles (RBAC). |
| **Cliente HTTP** | **Axios** | Interceptor de tokens JWT y peticiones a la API. |

---

## 💻 Instalación y Ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará accesible en `http://localhost:5180`.

### 3. Compilar para producción

```bash
npm run build
```

---

## ⚙️ Configuración del Proxy de API

El archivo `vite.config.ts` incluye un proxy preconfigurado hacia el backend en desarrollo:

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
Cualquier petición a `/api/*` se redirigirá automáticamente a `http://127.0.0.1:8000/api/*`.

# Sistema de Inventarios de Infraestructura - Bancolombia

## Descripción del Proyecto

Este proyecto es un **sistema integral de inventario de infraestructura tecnológica** desarrollado para **Bancolombia**. El sistema permite gestionar de manera centralizada múltiples tipos de recursos tecnológicos incluyendo servidores físicos, servidores virtuales, bases de datos, sistemas PSeries, dispositivos de almacenamiento (storage) y sucursales.

El sistema proporciona operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) para cada tipo de recurso, con funcionalidades avanzadas de búsqueda, filtrado, importación/exportación de datos y generación de reportes. La arquitectura está diseñada para ser escalable, mantenible y fácil de usar por los equipos de infraestructura.

---

## Tecnologías Utilizadas

### Frontend

- **React 18+**: Biblioteca principal para la interfaz de usuario
- **Tailwind CSS**: Framework de utilidades CSS para diseño responsivo
- **React Router DOM**: Manejo de rutas y navegación
- **Lucide React**: Biblioteca de iconos moderna
- **SweetAlert2**: Modales y alertas interactivas
- **Fetch API**: Cliente HTTP nativo para comunicación con el backend

### Backend

- **FastAPI**: Framework web moderno y rápido para Python
- **MySQL**: Base de datos relacional para persistencia de datos
- **XAMPP**: Entorno de desarrollo local para Apache, MySQL y PHP

---

## Estructura del Proyecto

\`\`\`
📦 inventariodatacenter/
├── 📂 public/
│ ├── 📜 chevron-left.png
│ ├── 📜 logo.png
│ ├── 📜 logowhite.png
│ ├── 📜 tcs.png
│ └── 📜 vite.svg
├── 📂 src/
│ ├── 📂 assets/
│ │ └── 📜 react.svg
│ ├── 📂 hooks/
│ │ └── 📜 Excelimporter.jsx
│ ├── 📂 routes/
│ │ ├── 📜 AuthContext.jsx
│ │ ├── 📜 EnrutadorApp.jsx
│ │ └── 📜 ProtectedRoute.jsx
│ ├── 📂 views/
│ │ ├── 📂 auth/
│ │ │ ├── 📜 Login.jsx
│ │ │ └── 📜 Perfil.jsx
│ │ ├── 📂 dashboard/
│ │ │ └── 📜 dashboard.jsx
│ │ ├── 📂 layout/
│ │ │ └── 📜 sidebar.jsx
│ │ └── 📂 services/
│ │ ├── 📂 Base de datos/
│ │ │ ├── 📜 baseDeDatos.jsx
│ │ │ ├── 📜 CrearBasedeDatos.jsx
│ │ │ ├── 📜 Editarbasededatos.jsx
│ │ │ └── 📜 verbasededatos.jsx
│ │ ├── 📂 Pseries/
│ │ │ ├── 📜 crearPserie.jsx
│ │ │ ├── 📜 editarPseries.jsx
│ │ │ ├── 📜 Pseries.jsx
│ │ │ └── 📜 verPseries.jsx
│ │ ├── 📂 servidores Fisicos/
│ │ │ ├── 📜 CrearServidor.jsx
│ │ │ ├── 📜 editarservidor.jsx
│ │ │ ├── 📜 servidoresF.jsx
│ │ │ └── 📜 verservidor.jsx
│ │ ├── 📂 servidores Virtuales/
│ │ │ ├── 📜 crearservidorv.jsx
│ │ │ ├── 📜 editarservidorv.jsx
│ │ │ ├── 📜 servidoresV.jsx
│ │ │ └── 📜 verservidoresv.jsx
│ │ ├── 📂 storage/
│ │ │ ├── 📜 crearStorage.jsx
│ │ │ ├── 📜 editarStorage.jsx
│ │ │ ├── 📜 Storage.jsx
│ │ │ └── 📜 verStorage.jsx
│ │ └── 📂 Sucursales/
│ │ ├── 📜 crearSucursales.jsx
│ │ ├── 📜 editarSucursal.jsx
│ │ ├── 📜 sucursales.jsx
│ │ └── 📜 verSucursal.jsx
│ ├── 📜 App.css
│ ├── 📜 App.jsx
│ ├── 📜 index.css
│ ├── 📜 main.jsx
│ └── 📜 vite-env.d.ts
├── 📜 .gitignore
├── 📜 .gitlab-ci.yml
├── 📜 ejemplo.md
├── 📜 eslint.config.js
├── 📜 index.html
├── 📜 package-lock.json
├── 📜 package.json
├── 📜 postcss.config.js
├── 📜 README.md
├── 📜 static.json
├── 📜 tailwind.config.js
├── 📜 tsconfig.app.json
└── 📜 vite.config.js
\`\`\`

---

## Módulos del Sistema

### 🖥️ Servidores Virtuales

- Gestión completa de máquinas virtuales
- Estados operacionales y monitoreo
- Asignación de clusters y plataformas

### 🏢 Servidores Físicos

- Inventario de hardware físico
- Especificaciones técnicas detalladas
- Ubicación y responsables

### 🗄️ Bases de Datos

- Catálogo de instancias de bases de datos
- Monitoreo y gestión de bases de datos

### ⚡ PSeries (IBM Power Systems)

- Gestión especializada de sistemas IBM Power
- Monitoreo y gestión de PSeries

### 💾 Storage (Almacenamiento)

- Dispositivos de almacenamiento
- Capacidades y utilización

### 🏪 Sucursales

- Inventario por ubicación geográfica
- Equipos asignados por sucursal
- Contactos y responsables locales
- Estados operacionales por sede

---

## Características Principales

### ✨ Funcionalidades Core

- [x] 🔒 **Autenticación JWT** - Sistema seguro de login y autorización
- [x] 🔎 **Búsqueda Avanzada** - Filtros múltiples y búsqueda en tiempo real
- [x] ➕ **Gestión CRUD** - Crear, leer, actualizar y eliminar registros
- [x] 📊 **Dashboard Interactivo** - Métricas y estadísticas en tiempo real
- [x] 📁 **Importación/Exportación** - Soporte para archivos Excel
- [x] 📱 **Diseño Responsivo** - Interfaz adaptable a todos los dispositivos

### 🚀 Funcionalidades Avanzadas

- [x] 🔄 **Sincronización en Tiempo Real** - Actualizaciones automáticas
- [x] 📈 **Reportes Personalizados** - Generación de informes detallados
- [x] 📋 **Validación Avanzada** - Formularios con validación en tiempo real

---

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn
- XAMPP (para desarrollo local)
- Git

### 1. Clonar el Repositorio

\`\`\`bash
git clone http://10.8.150.91/virtualizacion-automatizaciones/inventariodatacenter.git
cd inventariodatacenter
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Iniciar la Aplicación

\`\`\`bash
npm run dev
\`\`\`

# Modo producción

npm run build
npm run preview
\`\`\`

### 5. Configurar Backend (XAMPP)

1. Iniciar Apache y MySQL en XAMPP
2. Importar el esquema de base de datos
3. Configurar las credenciales de conexión
4. Iniciar el servidor FastAPI

---

## Seguridad

### Medidas Implementadas

- [x] **Autenticación JWT** con expiración automática
- [x] **Autorización basada en roles**
- [x] **Validación de entrada** en frontend y backend
- [x] **HTTPS** en todos los entornos

---

## Soporte y Contacto

### Equipo de Desarrollo

**Jorge Eduardo Muñoz Quintero**  
_Desarrollador Principal_  
📧 joedmuno@bancolombia.com.co | 2811750@tcs.com

**Equipo de Soporte TCS**  
_Soporte en Campo_  
📧 Gestion_SupCampo_TCS@bancolombia.com.co

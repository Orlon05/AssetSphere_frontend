# Sistema de Inventario de Servidores Físicos y Virtuales - Bancolombia

## Descripción del Proyecto

Este proyecto es un sistema de inventario para gestionar servidores físicos y virtuales utilizados por **Bancolombia**. El sistema permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para administrar los servidores, almacenando la información en una base de datos MySQL. El frontend se ha desarrollado utilizando **React**, mientras que las peticiones HTTP se manejan con **Fetch** para interactuar con la API de backend. El backend está implementado con **FastAPI**, y el servidor se ejecuta con **XAMPP** para manejar tanto el backend como la base de datos. El diseño se implementa con **CSS** para asegurar una interfaz de usuario limpia y responsiva.

---

## Estructura del Proyecto

El proyecto sigue una arquitectura basada en componentes, con separación clara entre frontend (React) y backend (API con FastAPI conectada a MySQL).

- **Frontend**: React + Fetch + CSS
- **Backend**: FastAPI
- **Base de Datos**: MySQL gestionada con XAMPP
- **Autenticación**: JWT (opcional)

---

## Tecnologías Utilizadas

- **React**: Para la interfaz de usuario y gestión del estado.
- **Fetch**: Para realizar peticiones HTTP a la API del backend.
- **CSS**: Para el diseño responsivo del sistema.
- **FastAPI**: Para crear la API del backend.
- **XAMPP**: Para gestionar el servidor y la base de datos MySQL.
- **MySQL**: Para la gestión de datos del inventario.
- **JWT**: (opcional) Para la autenticación de usuarios.

---

## Características

- **Gestión de servidores físicos y virtuales**: Añadir, visualizar, editar y eliminar registros de servidores.
- **Búsqueda y filtrado**: Funcionalidad para buscar servidores por tipo, estado, ubicación, etc.
- **Validación de formularios**: Validaciones en el frontend para evitar datos incompletos o incorrectos.
- **Interfaz intuitiva**: Diseño centrado en la usabilidad y navegación fácil.
- **Dashboard de estadísticas**: (opcional) Visualización de datos en gráficos como el uso de servidores, espacio disponible, etc.

---

## Planificación del Proyecto

### Fase 1: Configuración del Entorno

1. **Instalación de herramientas**:
   - Instalación de XAMPP para gestionar MySQL y el servidor.
   - Instalación de FastAPI y creación del proyecto de backend.
   - Instalación de Node.js y creación del proyecto React.

2. **Inicialización del proyecto**:
   - Crear la estructura del proyecto.
   - Configurar el sistema de rutas en React y FastAPI.
   - Configurar la conexión entre el backend y MySQL mediante XAMPP.

### Fase 2: Desarrollo del Backend (API)

1. **Creación de la base de datos**:
   - Definir el esquema de la base de datos en MySQL con tablas para servidores, usuarios y otros datos relevantes.

2. **Desarrollo de la API con FastAPI**:
   - Implementar rutas para manejar las operaciones CRUD para los servidores.
   - Conectar las rutas con la base de datos MySQL para añadir, actualizar, eliminar y obtener servidores.

3. **Autenticación** (opcional):
   - Implementar autenticación JWT para usuarios que acceden al sistema.

### Fase 3: Desarrollo del Frontend (React)

1. **Estructura de componentes**:
   - Crear los componentes principales como `ServidorList`, `ServidorForm`, `Navbar`, `Dashboard`.

2. **Integración con Fetch**:
   - Usar Fetch para conectar el frontend con el backend FastAPI, permitiendo realizar operaciones como GET, POST, PUT, DELETE.

3. **Validaciones de formularios**:
   - Asegurar que los formularios tengan validaciones tanto en el cliente como en el servidor.

4. **Estilizado**:
   - Aplicar CSS para crear una interfaz limpia y responsiva, asegurando una buena experiencia de usuario en diferentes dispositivos.

### Fase 4: Pruebas y Despliegue

1. **Pruebas del sistema**:
   - Probar todas las funcionalidades (CRUD, autenticación, etc.) en un entorno local.
   - Probar la interfaz y la usabilidad del sistema.

2. **Documentación**:
   - Incluir documentación detallada sobre cómo usar el sistema.

3. **Despliegue**:
   - Desplegar el backend y frontend en un servidor.
   - Configurar la base de datos MySQL en el entorno de producción.

## Características principales
- [x] 🔒 Autenticación JWT
- [x] 🔎 Consulta de servidores
- [x] ➕ Agregar nuevos servidores
- [x] ✏️ Actualizar información
- [x] ⛔ Eliminar servidores del inventario
- [x] 👮 Registro de las acciones de los usuarios

## Instalación

 1. **Clonar el repositorio**
```bash
git clone http://10.8.150.91/virtualizacion-automatizaciones/inventariodatacenter.git
cd inventariodatacenter-backend

2. **Instalar las dependencias**
```bash
npm install
```
3. **Iniciar la APP**
```bash
npm run dev
```
## Contribuciones
Si quieres contribuir en el desarrollo, por favor envia un **Pull Request**. Recuerda antes asegurarte que funcione correctamente en local, para intentar entre todos, tener un repositorio limpio y funcional.

[Estructuración-Carpetas]:
.
├── public/                     # Archivos estáticos (imágenes, favicon, etc.)
│   ├── imagenes/             # Aquí van las imágenes para uso general en la app.
│   │   └── user.png          # Ejemplo de una imagen de usuario
│   │
│   └── vite.svg               # Imagen SVG utilizada por Vite (generalmente el logo)
│
├── src/                        # Código fuente de la aplicación
│   ├── assets/                # Recursos generales (imágenes, logos, iconos).
│   │   ├── react.svg            # Logo de React
│   │   └── tcs_logo.png         # Logo específico de la app o la empresa
│   │
│   ├── components/             # Componentes de la interfaz de usuario.
│   │   ├── buttons/             # Botones reutilizables y genéricos.
│   │   │   └── DeleteButton.jsx # Botón específico para eliminar elementos.
│   │   │
│   │   ├── cards/              # Componentes de tipo "tarjeta" o "card"
│   │   │   ├── card.jsx         # Componente genérico de tarjeta.
│   │   │   ├── card.module.css   # Estilos para el componente Card
│   │   │   ├── CardStatsServers.jsx # Tarjeta específica que muestra estadísticas de servidores
│   │   │   ├── UserList.jsx       # Lista de usuarios.
│   │   │   ├── userList.module.css   # Estilos para la lista de usuarios
│   │   │   ├── UserListItem.jsx    # Componente individual de un ítem de la lista de usuarios.
│   │   │   └── userListItem.module.css  # Estilos para el ítem de la lista de usuarios
│   │   │
│   │   ├── charts/             # Componentes para mostrar gráficos.
│   │   │   ├── BarChart.jsx      # Gráfico de barras.
│   │   │   ├── barChart.module.css   # Estilos para el gráfico de barras
│   │   │   ├── DonutChart.jsx    # Gráfico de dona.
│   │   │   └── donutChart.module.css  # Estilos para el gráfico de dona
│   │   │
│   │   ├── data/               # Componentes o archivos para manejar datos de prueba.
│   │   │   │
│   │   │   └── servidores.jsx    # Datos de ejemplo de servidores. *Considera mover esto a utils/mocks o services*
│   │   │
│   │   ├── forms/             # Componentes de formularios.
│   │   │   ├── CrearUsuario.jsx # Formulario para crear un usuario.
│   │   │   ├── crearUsuario.module.css  # Estilos para el formulario de crear usuario
│   │   │   ├── EditarUsuario.jsx  # Formulario para editar un usuario.
│   │   │   ├── Login.jsx        # Formulario de login.
│   │   │   └── login.module.css  # Estilos para el formulario de login
│   │   │
│   │   ├── layouts/            # Componentes para definir la estructura de la app (header, sidebar, footer, etc)
│   │   │   ├── ExcelImporter.jsx # Componente para importar datos de Excel
│   │   │   ├── excelImporter.module.css # Estilos para el importador de Excel
│   │   │   ├── Loader.jsx            # Componente de carga visual.
│   │   │   ├── loader.module.css      # Estilos para el componente de carga
│   │   │   ├── Logo.jsx              # Componente para el logo de la aplicación
│   │   │   ├── logo.module.css        # Estilos para el componente logo
│   │   │   ├── Navegacion.jsx        # Barra de navegación principal
│   │   │   ├── navegacion.module.css   # Estilos para la barra de navegación
│   │   │   ├── Sidebar.jsx           # Componente de la barra lateral de navegación.
│   │   │   ├── sidebar.module.css   # Estilos para la barra lateral
│   │   │   └── Table.jsx             # Tabla genérica reutilizable.
│   │   │
│   │   ├── pages/              # Componentes que representan las vistas o páginas de la aplicación
│   │   │   ├── Analitica.jsx       # Página de análisis/dashboard principal.
│   │   │   ├── analitica.module.css # Estilos para la página de analítica
│   │   │   ├── CrearServidor.jsx     # Página para crear un servidor.
│   │   │   ├── crearServidor.module.css # Estilos para crear un servidor
│   │   │   ├── Dashboard.jsx         # Componente que orquesta/renderiza la vista de dashboard.
│   │   │   ├── dashboard.module.css    # Estilos para el componente dashboard
│   │   │   ├── EditarServidor.jsx    # Página para editar un servidor.
│   │   │   ├── editarServidor.module.css # Estilos para editar un servidor
│   │   │   ├── fisicos.module.css       # *Estilos para un componente que debería estar en su propia carpeta, como una "feature" o en pages/
│   │   │
│   │   │   ├── Logs.jsx              # Página para ver logs.
│   │   │   ├── logs.module.css        # Estilos para la página de logs
│   │   │   ├── ServidoresFisicos.jsx   # Página para listar servidores físicos.
│   │   │   ├── ServidoresVirtuales.jsx # Página para listar servidores virtuales.
│   │   │   ├── Storage.jsx            # Página para gestionar el storage.
│   │   │   ├── Usuarios.jsx           # Página para gestionar usuarios.
│   │   │   └── usuarios.module.css     # Estilos para la página de usuarios
│   │   │
│   │   ├── perfil/             # Componentes específicos de perfil de usuario.
│   │   │   ├── Perfil.jsx        # Componente para mostrar/editar el perfil de un usuario.
│   │   │   └── perfil.module.css  # Estilos para el perfil de usuario
│   │   │
│   │   ├── popups/             # Componentes de popups y notificaciones
│   │   │   ├── PopupError.jsx      # Popup para mostrar errores.
│   │   │   ├── popupError.module.css  # Estilos para el popup de errores.
│   │   │   ├── SessionTimerNotification.jsx # Notificación de timer de sesión.
│   │   │   └── sessionTimerNotification.module.css  # Estilos para la noti del timer
│   │   │
│   │   └── routes/             # Componentes relacionados con el enrutamiento
│   │       ├── AuthContext.jsx    # Contexto para la autenticación. *Considera mover a contexts/*
│   │       ├── EnrutadorApp.jsx    # Componente que define las rutas de la app.
│   │       └── ProtectedRoute.jsx  # Componente para proteger las rutas.
│   │
│   ├── contexts/              # Contextos para manejar el estado global
│   │   ├── AuthContext.js       # Contexto para la autenticación (debería ser .jsx si es un componente)
│   │   ├── ThemeContext.js      # Contexto para el tema de la app
│   │   └── index.js           # Exporta todos los contextos
│   │
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useFetch.js          # Hook para realizar peticiones HTTP
│   │   ├── useForm.js           # Hook para manejar formularios
│   │   └── index.js           # Exporta todos los hooks
│   │
│   ├── utils/                 # Funciones y utilidades generales
│   │   ├── helpers.js         # Funciones de utilidad general (formatos, conversiones, etc)
│   │   ├── constants.js       # Constantes globales.
│   │   └── validations.js     # Lógica para validar datos.
│   │
│   ├── App.jsx               # Componente principal de la aplicación
│   ├── index.css             # Estilos globales.
│   └── main.jsx              # Punto de entrada de Vite
│
├── .eslintrc.json            # Configuración de ESLint
├── .gitignore                # Archivos a ignorar en Git
├── ejemplo.md                # Archivo MD adicional para información o documentación
├── eslint.config.js          # Configuración de ESLint para un directorio y sus subdirectorios. *Considera usar un solo archivo de configuración 
│
├── index.html                # Punto de entrada HTML de la aplicación.
├── inventario.sql            # Query de la DB (no es un archivo de front-end y debería estar en el backend/documentación).
├── package-lock.json         # Dependencias adicionales (no tocar).
├── package.json              # Dependencias del proyecto
├── README.md                 # Documentación del proyecto.
├── vite.config.js            # Configuración de Vite
└── tsconfig.json             # Configuración de TypeScript (si aplica)

## Contacto

**Jorge Eduardo Muñoz Quintero**\
*Desarrollador principal*\
joedmuno@bancolombia.com.co |  2811750@tcs.com

**Soporte en campo TCS**\
*Equipo del proyecto*\
Gestion_SupCampo_TCS@bancolombia.com.co

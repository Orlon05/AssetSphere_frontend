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

## Contacto

**Jorge Eduardo Muñoz Quintero**\
*Desarrollador principal*\
joedmuno@bancolombia.com.co |  2811750@tcs.com

**Soporte en campo TCS**\
*Equipo del proyecto*\
Gestion_SupCampo_TCS@bancolombia.com.co

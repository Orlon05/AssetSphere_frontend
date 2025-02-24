-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-02-2025 a las 16:14:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inventario_prueba`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `base_de_datos`
--

CREATE TABLE `base_de_datos` (
  `id` int(11) NOT NULL,
  `instance_id` varchar(100) NOT NULL,
  `cost_center` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `item` varchar(100) NOT NULL,
  `owner_contact` varchar(200) NOT NULL,
  `name` varchar(100) NOT NULL,
  `application_code` varchar(100) NOT NULL,
  `inactive` varchar(10) NOT NULL,
  `asset_life_cycle_status` varchar(50) NOT NULL,
  `system_environment` varchar(10) NOT NULL,
  `cloud` varchar(10) NOT NULL,
  `version_number` varchar(100) NOT NULL,
  `serial` varchar(50) NOT NULL,
  `ci_tag` varchar(200) NOT NULL,
  `instance_name` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `ha` varchar(50) NOT NULL,
  `port` varchar(50) DEFAULT NULL,
  `owner_name` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `manufacturer_name` varchar(100) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `supported` varchar(50) NOT NULL,
  `account_id` varchar(100) NOT NULL,
  `create_date` datetime(6) NOT NULL,
  `modified_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `base_de_datos`
--

INSERT INTO `base_de_datos` (`id`, `instance_id`, `cost_center`, `category`, `type`, `item`, `owner_contact`, `name`, `application_code`, `inactive`, `asset_life_cycle_status`, `system_environment`, `cloud`, `version_number`, `serial`, `ci_tag`, `instance_name`, `model`, `ha`, `port`, `owner_name`, `department`, `company`, `manufacturer_name`, `supplier_name`, `supported`, `account_id`, `create_date`, `modified_date`) VALUES
(1, 'inst_001', 'CC_001', 'Software', 'License', 'Windows 10 Pro', 'john.doe@example.com', 'PC1', 'WIN10', 'No', 'Active', 'Production', 'Yes', '10.0.19041', 'S/N_001', 'CT_001', 'PC1_VM', 'Dell Optiplex 3070', 'Yes', '8080', 'John Doe', 'IT', 'TechCorp', 'Dell', 'SoftwareCo', 'Yes', 'ACC123', '2025-01-01 10:00:00.000000', '2025-01-21 09:00:00.000000'),
(2, 'inst_002', 'CC_002', 'Hardware', 'Server', 'Dell PowerEdge R740', 'alice.smith@example.com', 'Server1', 'SRV01', 'No', 'Inactive', 'Developmen', 'No', '2.0', 'S/N_002', 'CT_002', 'SRV1', 'PowerEdge R740', 'No', '8081', 'Alice Smith', 'Operations', 'TechCorp', 'Dell', 'ServerSuppliers', 'Yes', 'ACC124', '2025-01-02 11:00:00.000000', '2025-01-21 09:30:00.000000'),
(3, 'inst_003', 'CC_003', 'Network', 'Router', 'Cisco 2950', 'bob.jones@example.com', 'Router1', 'ROUTER01', 'Yes', 'Active', 'Production', 'No', '15.0', 'S/N_003', 'CT_003', 'ROUTER1', 'Cisco 2950', 'Yes', '8082', 'Bob Jones', 'Network', 'TechCorp', 'Cisco', 'NetGear', 'Yes', 'ACC125', '2025-01-03 12:00:00.000000', '2025-01-21 10:00:00.000000'),
(4, 'inst_004', 'CC_004', 'Storage', 'NAS', 'NetApp FAS8200', 'jane.doe@example.com', 'NAS1', 'STORAGE01', 'No', 'Active', 'Testing', 'Yes', '9.1', 'S/N_004', 'CT_004', 'NAS1', 'NetApp FAS8200', 'Yes', '8083', 'Jane Doe', 'Storage', 'TechCorp', 'NetApp', 'StorageInc', 'Yes', 'ACC126', '2025-01-04 13:00:00.000000', '2025-01-21 10:30:00.000000'),
(5, 'inst_005', 'CC_005', 'Database', 'DBMS', 'Oracle DB', 'mary.johnson@example.com', 'DB1', 'ORACLEDB', 'No', 'Inactive', 'Staging', 'No', '12c', 'S/N_005', 'CT_005', 'DB1', 'Oracle DB', 'No', '8084', 'Mary Johnson', 'Database', 'TechCorp', 'Oracle', 'DBSupplier', 'Yes', 'ACC127', '2025-01-05 14:00:00.000000', '2025-01-21 11:00:00.000000'),
(6, 'inst_006', 'CC_006', 'Software', 'License', 'Office 365', 'david.williams@example.com', 'PC2', 'OFFICE365', 'Yes', 'Active', 'Production', 'Yes', '1.0', 'S/N_006', 'CT_006', 'PC2_VM', 'Microsoft Office 365', 'Yes', '8085', 'David Williams', 'IT', 'TechCorp', 'Microsoft', 'SoftwareCo', 'Yes', 'ACC128', '2025-01-06 15:00:00.000000', '2025-01-21 11:30:00.000000'),
(7, 'inst_007', 'CC_007', 'Hardware', 'Laptop', 'HP EliteBook 840', 'olivia.brown@example.com', 'Laptop1', 'LAPTOP01', 'No', 'Inactive', 'Developmen', 'No', '1.5', 'S/N_007', 'CT_007', 'LAPTOP1', 'HP EliteBook 840', 'No', '8086', 'Olivia Brown', 'HR', 'TechCorp', 'HP', 'LaptopInc', 'Yes', 'ACC129', '2025-01-07 16:00:00.000000', '2025-01-21 12:00:00.000000'),
(8, 'inst_008', 'CC_008', 'Network', 'Switch', 'Juniper EX3300', 'kevin.taylor@example.com', 'Switch1', 'SWITCH01', 'No', 'Active', 'Production', 'Yes', '12.0', 'S/N_008', 'CT_008', 'SWITCH1', 'Juniper EX3300', 'Yes', '8087', 'Kevin Taylor', 'Network', 'TechCorp', 'Juniper', 'SwitchSuppliers', 'Yes', 'ACC130', '2025-01-08 17:00:00.000000', '2025-01-21 12:30:00.000000'),
(9, 'inst_009', 'CC_009', 'Storage', 'SAN', 'EMC VNX 5600', 'susan.miller@example.com', 'SAN1', 'STORAGE02', 'Yes', 'Active', 'Staging', 'No', '7.2', 'S/N_009', 'CT_009', 'SAN1', 'EMC VNX 5600', 'Yes', '8088', 'Susan Miller', 'Storage', 'TechCorp', 'EMC', 'StorageCo', 'Yes', 'ACC131', '2025-01-09 18:00:00.000000', '2025-01-21 13:00:00.000000'),
(10, 'inst_010', 'CC_010', 'Database', 'DBMS', 'MySQL 8.0', 'charles.martin@example.com', 'DB2', 'MYSQLDB', 'No', 'Inactive', 'Testing', 'Yes', '8.0', 'S/N_010', 'CT_010', 'DB2', 'MySQL 8.0', 'No', '8089', 'Charles Martin', 'Database', 'TechCorp', 'MySQL', 'DBSupplier', 'Yes', 'ACC132', '2025-01-10 19:00:00.000000', '2025-01-21 13:30:00.000000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `event` varchar(100) NOT NULL,
  `detail` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(50) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `logs`
--

INSERT INTO `logs` (`id`, `type`, `event`, `detail`, `user_id`, `ip_address`, `timestamp`) VALUES
(1, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1734625135),
(2, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1734646774),
(3, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1734654476),
(4, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1734687443),
(5, 'warning', 'register', 'Intento de registro no autorizado para el usuario \'wilson\'', 1, '127.0.0.1', 1734688509),
(6, 'warning', 'register', 'Intento de registro no autorizado para el usuario \'wilson\'', 1, '127.0.0.1', 1734688517),
(7, 'warning', 'register', 'Intento de registro no autorizado para el usuario \'wilson\'', 1, '127.0.0.1', 1734688520),
(8, 'warning', 'register', 'Intento de registro no autorizado para el usuario \'wilson\'', 1, '127.0.0.1', 1734689187),
(9, 'info', 'register', 'Se ha registrado un nuevo usuario \'wochavar\' correctamente', 1, '127.0.0.1', 1734690103),
(10, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1734692754),
(11, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1734692776),
(12, 'warning', 'login', 'Intento de inicio de sesión fallido para el usuario \'admin123\'', NULL, '127.0.0.1', 1736519119),
(13, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736519131),
(14, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736519456),
(15, 'warning', 'delete_storage', 'Se ha intentado eliminar un almacenamiento (ID: 10) sin permisos suficientes.', 1, '127.0.0.1', 1736520542),
(16, 'warning', 'delete_storage', 'Se ha intentado eliminar un almacenamiento (ID: 11) sin permisos suficientes.', 1, '127.0.0.1', 1736520556),
(17, 'warning', 'delete_storage', 'Se ha intentado eliminar un almacenamiento (ID: 10) sin permisos suficientes.', 1, '127.0.0.1', 1736520562),
(18, 'warning', 'delete_storage', 'Se ha intentado eliminar un almacenamiento (ID: 10) sin permisos suficientes.', 1, '127.0.0.1', 1736520693),
(19, 'warning', 'delete_storage', 'Se ha intentado eliminar un almacenamiento (ID: 10) sin permisos suficientes.', 1, '127.0.0.1', 1736520748),
(20, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736526092),
(21, 'info', 'delete_storage', 'Se ha eliminado un storage (#10) exitosamente', 1, '127.0.0.1', 1736526831),
(22, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736538978),
(23, 'info', 'delete_storage', 'Se ha eliminado un storage (#9) exitosamente', 1, '127.0.0.1', 1736539185),
(24, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736782811),
(25, 'info', 'edit_storage', 'Se ha actualizado la informacion del storage (#8)', 1, '127.0.0.1', 1736785760),
(26, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736795558),
(27, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736796560),
(28, 'error', 'delete_storage', 'Error inesperado al eliminar storage (#8): No inspection system is available for object of type <class \'pydantic._internal._model_construction.ModelMetaclass\'>', 1, '127.0.0.1', 1736796677),
(29, 'error', 'delete_storage', 'Error inesperado al eliminar storage (#7): No inspection system is available for object of type <class \'pydantic._internal._model_construction.ModelMetaclass\'>', 1, '127.0.0.1', 1736796683),
(30, 'info', 'delete_storage', 'Se ha eliminado un storage (#8) exitosamente', 1, '127.0.0.1', 1736796954),
(31, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736800269),
(32, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736803955),
(33, 'info', 'add_storage', 'Se ha añadido un nuevo storage', 1, '127.0.0.1', 1736803970),
(34, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1736804439),
(35, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1739982850),
(36, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1739982940),
(37, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1740079920),
(38, 'info', 'login', 'El usuario \'admin\' ha iniciado sesión correctamente', 1, '127.0.0.1', 1740079983);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `code` varchar(255) NOT NULL,
  `min_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`code`, `min_role`) VALUES
('VIEW_PHYSICAL_SERVERS', 1),
('VIEW_SERVER_STATS', 1),
('VIEW_USERS', 1),
('ADD_BASE_DATOS', 2),
('ADD_PHYSICAL_SERVERS', 2),
('ADD_PSERIES', 2),
('ADD_STORAGE', 2),
('DELETE_BASE_DATOS', 2),
('DELETE_PHYSICAL_SERVERS', 2),
('DELETE_PSERIES', 2),
('DELETE_STORAGE', 2),
('EDIT_BASE_DATOS', 2),
('EDIT_PHYSICAL_SERVERS', 2),
('EDIT_PSERIES', 2),
('EDIT_STORAGE', 2),
('VIEW_BASES_DATOS', 2),
('VIEW_BASE_DATOS', 2),
('VIEW_PSERIES', 2),
('VIEW_STORAGE', 2),
('VIEW_STORAGES', 2),
('ADD_NEW_USER', 3),
('VIEW_LOGS', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `physical_servers`
--

CREATE TABLE `physical_servers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(100) NOT NULL,
  `processor` varchar(100) DEFAULT NULL,
  `cpu_cores` int(11) DEFAULT NULL,
  `ram` int(11) DEFAULT NULL,
  `total_disk_size` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `environment` varchar(100) DEFAULT NULL,
  `serial` varchar(100) NOT NULL,
  `rack_id` varchar(50) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `city` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `asset_id` varchar(50) DEFAULT NULL,
  `service_owner` varchar(50) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `os_type` varchar(100) DEFAULT NULL,
  `os_version` varchar(100) DEFAULT NULL,
  `warranty_start_date` datetime(6) DEFAULT NULL,
  `warranty_end_date` datetime(6) DEFAULT NULL,
  `application_code` varchar(100) DEFAULT NULL,
  `responsible_evc` varchar(100) DEFAULT NULL,
  `domain` varchar(100) DEFAULT NULL,
  `subsidiary` varchar(100) DEFAULT NULL,
  `responsible_organization` varchar(100) DEFAULT NULL,
  `billable` varchar(50) DEFAULT NULL,
  `oc_provisioning` varchar(100) DEFAULT NULL,
  `oc_deletion` varchar(100) DEFAULT NULL,
  `oc_modification` varchar(100) DEFAULT NULL,
  `maintenance_period` varchar(100) DEFAULT NULL,
  `maintenance_organization` varchar(100) DEFAULT NULL,
  `cost_center` varchar(100) DEFAULT NULL,
  `billing_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `physical_servers`
--

INSERT INTO `physical_servers` (`id`, `name`, `brand`, `model`, `processor`, `cpu_cores`, `ram`, `total_disk_size`, `status`, `role`, `environment`, `serial`, `rack_id`, `unit`, `ip_address`, `city`, `location`, `asset_id`, `service_owner`, `comments`, `os_type`, `os_version`, `warranty_start_date`, `warranty_end_date`, `application_code`, `responsible_evc`, `domain`, `subsidiary`, `responsible_organization`, `billable`, `oc_provisioning`, `oc_deletion`, `oc_modification`, `maintenance_period`, `maintenance_organization`, `cost_center`, `billing_type`) VALUES
(1, 'Servidor1', 'Dell', 'PowerEdge R740xd', 'Intel Xeon Gold 6230', 16, 16, '2 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'R740xd-12345', 'Rack1', 'Unidad 1', '192.168.1.10', 'Madrid', 'Centro de Datos A', 'Fijo', 'Anyelo', 'Servidor para pruebas de aplicaciones web.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(2, 'Servidor2', 'Lenovo', 'ThinkSystem SR650', 'Intel Xeon Gold 6240', 24, 16, '3 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'SR650-98765', 'Rack2', 'Unidad 4', '192.168.1.20', 'Barcelona', 'Centro de Datos B', 'Fijo', 'David', 'Base de datos principal para usuarios.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(3, 'Servidor3', 'HP', 'ProLiant DL380 Gen10', 'Intel Xeon Platinum 8280', 28, 16, '4.5 TB', 'Apagado', 'Servidor de Pruebas', 'Desarrollo', 'DL380-54321', 'Rack3', 'Unidad 2', '192.168.1.30', 'Sevilla', 'Centro de Datos C', 'Fijo', 'Guillermo', 'Servidor para pruebas de QA.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(4, 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 1, 16, 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Cambiado', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(5, 'Servidor5', 'Dell', 'PowerEdge R630', 'Intel Xeon E5-2690 v4', 16, 16, '2.5 TB', 'asfasf', 'Servidor de Aplicaciones', 'Producción', 'R630-24680', 'Rack5', 'Unidad 5', '192.168.1.50', 'Bogotá', 'Centro de Datos E', 'Fijo', 'Mariana', 'Aplicación crítica de gestión de clientes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(6, 'Servidor6', 'Lenovo', 'ThinkSystem SR630', 'Intel Xeon Silver 4114', 12, 16, '2 TB', 'Apagado', 'Servidor Web', 'Desarrollo', 'SR630-11223', 'Rack6', 'Unidad 7', '192.168.1.60', 'Medellín', 'Centro de Datos F', 'Fijo', 'Nestor', 'Servidor de pruebas para equipo de desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(7, 'Servidor7', 'HP', 'ProLiant DL580 Gen10', 'Intel Xeon Gold 6248', 24, 16, '4 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'DL580-78546', 'Rack7', 'Unidad 6', '192.168.1.70', 'Cali', 'Centro de Datos G', 'Fijo', 'Ruben', 'Base de datos para análisis de datos en tiempo real.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(8, 'Servidor8', 'Cisco', 'UCS B200 M5', 'Intel Xeon Platinum 8260', 16, 16, '2 TB', 'Apagado', 'Servidor de Pruebas', 'Desarrollo', 'B200M5-45678', 'Rack8', 'Unidad 9', '192.168.1.80', 'Barranquilla', 'Centro de Datos H', 'Fijo', 'Wilson', 'Servidor para pruebas internas de software.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(9, 'Servidor9', 'Dell', 'PowerEdge R740', 'Intel Xeon Gold 6230', 16, 16, '3 TB', 'mantenimiento', 'Servidor de Aplicaciones', 'Desarrollo', 'R740-13245', 'Rack9', 'Unidad 4', '192.168.1.90', 'Madrid', 'Centro de Datos I', 'Fijo', 'Maria', 'Aplicación para gestión de inventarios en desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(10, 'Servidor10', 'Lenovo', 'ThinkSystem SR860', 'Intel Xeon Gold 6240', 24, 16, '5 TB', 'Encendido', 'Servidor Web', 'Producción', 'SR860-65784', 'Rack10', 'Unidad 8', '192.168.1.100', 'Barcelona', 'Centro de Datos J', 'Fijo', 'Santiago', 'Servidor web para página de clientes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(11, 'Servidor11', 'HP', 'ProLiant DL380 Gen10', 'Intel Xeon Platinum 8280', 28, 16, '6 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'DL380-11222', 'Rack11', 'Unidad 1', '192.168.1.110', 'Sevilla', 'Centro de Datos K', 'Fijo', 'Anyelo', 'Base de datos para procesamiento de pedidos.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(12, 'Servidor12', 'Cisco', 'UCS C240 M5', 'Intel Xeon Gold 6248', 24, 16, '4 TB', 'Apagado', 'Servidor de Archivos', 'Desarrollo', 'C240M5-55677', 'Rack12', 'Unidad 2', '192.168.1.120', 'Medellín', 'Centro de Datos L', 'Fijo', 'David', 'Servidor de almacenamiento de archivos para dev team.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(13, 'Servidor13', 'Dell', 'PowerEdge R650', 'Intel Xeon Platinum 8280', 28, 16, '5.5 TB', 'mantenimiento', 'Servidor de Backup', 'Producción', 'R650-75894', 'Rack13', 'Unidad 3', '192.168.1.130', 'Valencia', 'Centro de Datos M', 'Fijo', 'Guillermo', 'Servidor para backup de datos críticos.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(14, 'Servidor14', 'Lenovo', 'ThinkSystem SR650', 'Intel Xeon Gold 6246', 24, 16, '4 TB', 'Apagado', 'Servidor de Aplicaciones', 'Desarrollo', 'SR650-99876', 'Rack14', 'Unidad 5', '192.168.1.140', 'Cali', 'Centro de Datos N', 'Fijo', 'Hugo', 'Servidor de aplicaciones para pruebas.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(15, 'Servidor15', 'Cisco', 'UCS B460 M5', 'Intel Xeon Platinum 8180', 32, 16, '6 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'B460M5-11234', 'Rack15', 'Unidad 9', '192.168.1.150', 'Barranquilla', 'Centro de Datos O', 'Fijo', 'Mariana', 'Servidor para pruebas de nuevas tecnologías web.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(16, 'Servidor16', 'HP', 'ProLiant DL560 Gen10', 'Intel Xeon Gold 6250', 20, 16, '3.5 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'DL560-54789', 'Rack16', 'Unidad 6', '192.168.1.160', 'Sevilla', 'Centro de Datos P', 'Fijo', 'Nestor', 'Base de datos para análisis de datos en tiempo real.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(17, 'Servidor17', 'Dell', 'PowerEdge R740', 'Intel Xeon Silver 4210', 16, 16, '2.5 TB', 'Apagado', 'Servidor de Archivos', 'Desarrollo', 'R740-98765', 'Rack17', 'Unidad 1', '192.168.1.170', 'Madrid', 'Centro de Datos Q', 'Fijo', 'Ruben', 'Almacenamiento de archivos temporales para desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(18, 'Servidor18', 'Lenovo', 'ThinkSystem SR630', 'Intel Xeon Platinum 8280', 24, 16, '5 TB', 'Encendido', 'Servidor de Backup', 'Producción', 'SR630-87654', 'Rack18', 'Unidad 3', '192.168.1.180', 'Barcelona', 'Centro de Datos R', 'Fijo', 'Wilson', 'Backup de la infraestructura crítica.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(19, 'Servidor19', 'Cisco', 'UCS C220 M5', 'Intel Xeon Gold 6240', 18, 16, '4 TB', 'Apagado', 'Servidor de Aplicaciones', 'Desarrollo', 'C220M5-23568', 'Rack19', 'Unidad 4', '192.168.1.190', 'Valencia', 'Centro de Datos S', 'Fijo', 'Maria', 'Servidor de pruebas para nuevas aplicaciones.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(20, 'Servidor20', 'HP', 'ProLiant DL380 Gen10', 'Intel Xeon Platinum 8260', 24, 16, '3.5 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'DL380-19876', 'Rack20', 'Unidad 7', '192.168.1.200', 'Bogotá', 'Centro de Datos T', 'Fijo', 'Santiago', 'Servidor web para pruebas de cliente.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(21, 'Servidor21', 'Dell', 'PowerEdge R650', 'Intel Xeon Gold 6230', 16, 16, '2 TB', 'Encendido', 'Servidor Web', 'Producción', 'R650-76320', 'Rack21', 'Unidad 8', '192.168.1.210', 'Cali', 'Centro de Datos U', 'Fijo', 'Anyelo', 'Servidor web para sitio de clientes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(22, 'Servidor22', 'Lenovo', 'ThinkSystem SR860', 'Intel Xeon Silver 4114', 12, 16, '1.5 TB', 'Apagado', 'Servidor de Backup', 'Desarrollo', 'SR860-35791', 'Rack22', 'Unidad 5', '192.168.1.220', 'Barranquilla', 'Centro de Datos V', 'Fijo', 'David', 'Servidor para backup en ambiente de desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(23, 'Servidor23', 'HP', 'ProLiant DL560 Gen10', 'Intel Xeon Gold 6248', 20, 16, '3 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'DL560-24680', 'Rack23', 'Unidad 9', '192.168.1.230', 'Madrid', 'Centro de Datos W', 'Fijo', 'Guillermo', 'Servidor para bases de datos de clientes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(24, 'Servidor24', 'Cisco', 'UCS C240 M5', 'Intel Xeon Platinum 8280', 32, 16, '6 TB', 'Apagado', 'Servidor de Archivos', 'Desarrollo', 'C240M5-87453', 'Rack24', 'Unidad 3', '192.168.1.240', 'Medellín', 'Centro de Datos X', 'Fijo', 'Hugo', 'Servidor de almacenamiento para pruebas internas.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(25, 'Servidor25', 'Dell', 'PowerEdge R740', 'Intel Xeon Gold 6230', 16, 16, '2.5 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'R740-78456', 'Rack25', 'Unidad 4', '192.168.1.250', 'Valencia', 'Centro de Datos Y', 'Fijo', 'Mariana', 'Servidor web para aplicaciones en desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(26, 'Servidor26', 'Lenovo', 'ThinkSystem SR630', 'Intel Xeon Platinum 8260', 24, 16, '4 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'SR630-23784', 'Rack26', 'Unidad 7', '192.168.1.260', 'Cali', 'Centro de Datos Z', 'Fijo', 'Nestor', 'Servidor de base de datos de producción.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(27, 'Servidor27', 'HP', 'ProLiant DL380 Gen10', 'Intel Xeon Platinum 8280', 28, 16, '6 TB', 'Encendido', 'Servidor de Archivos', 'Desarrollo', 'DL380-11234', 'Rack27', 'Unidad 5', '192.168.1.270', 'Bogotá', 'Centro de Datos AA', 'Fijo', 'Ruben', 'Servidor de almacenamiento de archivos para desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(28, 'Servidor28', 'Cisco', 'UCS B200 M5', 'Intel Xeon Gold 6248', 24, 16, '5 TB', 'Apagado', 'Servidor de Backup', 'Producción', 'B200M5-23456', 'Rack28', 'Unidad 6', '192.168.1.280', 'Barranquilla', 'Centro de Datos BB', 'Fijo', 'Wilson', 'Servidor de respaldo para servidores de producción.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(29, 'Servidor29', 'Dell', 'PowerEdge R740xd', 'Intel Xeon Gold 6240', 24, 16, '5 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'R740xd-32415', 'Rack29', 'Unidad 8', '192.168.1.290', 'Madrid', 'Centro de Datos CC', 'Fijo', 'Maria', 'Servidor web para pruebas y desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(30, 'Servidor30', 'Lenovo', 'ThinkSystem SR650', 'Intel Xeon Gold 6246', 20, 16, '4.5 TB', 'Encendido', 'Servidor de Aplicaciones', 'Producción', 'SR650-99823', 'Rack30', 'Unidad 9', '192.168.1.300', 'Sevilla', 'Centro de Datos DD', 'Fijo', 'Santiago', 'Servidor de aplicaciones para clientes importantes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(31, 'Servidor31', 'HP', 'ProLiant DL580 Gen10', 'Intel Xeon Platinum 8280', 28, 16, '5 TB', 'Encendido', 'Servidor de Archivos', 'Desarrollo', 'DL580-43567', 'Rack31', 'Unidad 2', '192.168.1.310', 'Valencia', 'Centro de Datos EE', 'Fijo', 'Anyelo', 'Servidor para almacenamiento de archivos en desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(32, 'Servidor32', 'Cisco', 'UCS C240 M5', 'Intel Xeon Platinum 8280', 24, 16, '5 TB', 'Apagado', 'Servidor Web', 'Producción', 'C240M5-99876', 'Rack32', 'Unidad 5', '192.168.1.320', 'Medellín', 'Centro de Datos FF', 'Fijo', 'David', 'Servidor web para cliente VIP.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(33, 'Servidor33', 'Dell', 'PowerEdge R630', 'Intel Xeon E5-2690 v4', 16, 16, '2 TB', 'Encendido', 'Servidor de Backup', 'Desarrollo', 'R630-27364', 'Rack33', 'Unidad 1', '192.168.1.330', 'Bogotá', 'Centro de Datos GG', 'Fijo', 'Guillermo', 'Servidor de respaldo de desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(34, 'Servidor34', 'Lenovo', 'ThinkSystem SR860', 'Intel Xeon Gold 6248', 32, 16, '6 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'SR860-34762', 'Rack34', 'Unidad 4', '192.168.1.340', 'Cali', 'Centro de Datos HH', 'Fijo', 'Hugo', 'Servidor para base de datos de clientes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(35, 'Servidor35', 'HP', 'ProLiant DL380 Gen10', 'Intel Xeon Gold 6250', 24, 16, '3.5 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'DL380-19876', 'Rack35', 'Unidad 3', '192.168.1.350', 'Sevilla', 'Centro de Datos II', 'Fijo', 'Mariana', 'Servidor web para pruebas internas.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(36, 'Servidor36', 'Cisco', 'UCS C220 M5', 'Intel Xeon Silver 4210', 16, 16, '2.5 TB', 'Apagado', 'Servidor de Archivos', 'Desarrollo', 'C220M5-45769', 'Rack36', 'Unidad 6', '192.168.1.360', 'Madrid', 'Centro de Datos JJ', 'Fijo', 'Nestor', 'Servidor de almacenamiento de archivos internos para pruebas.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(37, 'Servidor37', 'Dell', 'PowerEdge R740', 'Intel Xeon Gold 6230', 16, 16, '2 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'R740-12345', 'Rack37', 'Unidad 2', '192.168.1.370', 'Bogotá', 'Centro de Datos KK', 'Fijo', 'Ruben', 'Servidor web para pruebas de nueva funcionalidad.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(38, 'Servidor38', 'Lenovo', 'ThinkSystem SR630', 'Intel Xeon Silver 4114', 12, 16, '1 TB', 'Encendido', 'Servidor de Backup', 'Producción', 'SR630-45612', 'Rack38', 'Unidad 4', '192.168.1.380', 'Cali', 'Centro de Datos LL', 'Fijo', 'Wilson', 'Servidor de backup para servidores de producción.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(39, 'Servidor39', 'HP', 'ProLiant DL360 Gen10', 'Intel Xeon Gold 6248', 24, 16, '4 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'DL360-15749', 'Rack39', 'Unidad 5', '192.168.1.390', 'Medellín', 'Centro de Datos MM', 'Fijo', 'Anyelo', 'Servidor web para pruebas de rendimiento.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(40, 'Servidor40', 'Cisco', 'UCS C220 M5', 'Intel Xeon Platinum 8280', 32, 16, '6 TB', 'Encendido', 'Servidor de Base de Datos', 'Producción', 'C220M5-98423', 'Rack40', 'Unidad 7', '192.168.1.400', 'Valencia', 'Centro de Datos NN', 'Fijo', 'David', 'Servidor de base de datos para clientes internacionales.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(41, 'Servidor41', 'Dell', 'PowerEdge R630', 'Intel Xeon E5-2699 v4', 24, 16, '3 TB', 'Encendido', 'Servidor de Backup', 'Desarrollo', 'R630-18734', 'Rack41', 'Unidad 8', '192.168.1.410', 'Madrid', 'Centro de Datos OO', 'Fijo', 'Guillermo', 'Servidor de backup para pruebas internas.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(42, 'Servidor42', 'Lenovo', 'ThinkSystem SR650', 'Intel Xeon Gold 6246', 20, 16, '4 TB', 'Apagado', 'Servidor Web', 'Producción', 'SR650-87956', 'Rack42', 'Unidad 2', '192.168.1.420', 'Bogotá', 'Centro de Datos PP', 'Fijo', 'Hugo', 'Servidor web para cliente corporativo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(43, 'Servidor43', 'HP', 'ProLiant DL580 Gen10', 'Intel Xeon Platinum 8280', 28, 16, '5 TB', 'Encendido', 'Servidor de Base de Datos', 'Desarrollo', 'DL580-54823', 'Rack43', 'Unidad 6', '192.168.1.430', 'Cali', 'Centro de Datos QQ', 'Fijo', 'Mariana', 'Servidor de base de datos para pruebas internas.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(44, 'Servidor44', 'Cisco', 'UCS B200 M5', 'Intel Xeon Gold 6248', 20, 16, '4 TB', 'Encendido', 'Servidor de Archivos', 'Producción', 'B200M5-34785', 'Rack44', 'Unidad 9', '192.168.1.440', 'Sevilla', 'Centro de Datos RR', 'Fijo', 'Nestor', 'Servidor de almacenamiento para archivos importantes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(45, 'Servidor45', 'Dell', 'PowerEdge R740', 'Intel Xeon Gold 6230', 16, 16, '2 TB', 'Encendido', 'Servidor Web', 'Desarrollo', 'R740-83792', 'Rack45', 'Unidad 3', '192.168.1.450', 'Medellín', 'Centro de Datos SS', 'Fijo', 'Ruben', 'Servidor web para el portal de clientes.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(46, 'Servidor46', 'Lenovo', 'ThinkSystem SR860', 'Intel Xeon Platinum 8280', 32, 16, '6 TB', 'Apagado', 'Servidor de Backup', 'Producción', 'SR860-75823', 'Rack46', 'Unidad 4', '192.168.1.460', 'Cali', 'Centro de Datos TT', 'Fijo', 'Wilson', 'Servidor para backup en servidores críticos.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(47, 'Servidor47', 'HP', 'ProLiant DL360 Gen10', 'Intel Xeon Gold 6248', 24, 16, '4.5 TB', 'Encendido', 'Servidor de Aplicaciones', 'Desarrollo', 'DL360-39756', 'Rack47', 'Unidad 5', '192.168.1.470', 'Bogotá', 'Centro de Datos UU', 'Fijo', 'Anyelo', 'Servidor de aplicaciones para pruebas de cliente.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(48, 'Servidor48', 'Cisco', 'UCS C240 M5', 'Intel Xeon Silver 4210', 16, 16, '2.5 TB', 'Apagado', 'Servidor Web', 'Desarrollo', 'C240M5-28734', 'Rack48', 'Unidad 6', '192.168.1.480', 'Sevilla', 'Centro de Datos VV', 'Fijo', 'David', 'Servidor web para pruebas en ambiente de desarrollo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(49, 'Servidor49', 'Dell', 'PowerEdge R750', 'Intel Xeon Gold 6230', 20, 16, '3 TB', 'Encendido', 'Servidor de Archivos', 'Producción', 'R750-83642', 'Rack49', 'Unidad 7', '192.168.1.490', 'Medellín', 'Centro de Datos WW', 'Fijo', 'Guillermo', 'Servidor para almacenamiento de archivos en producción.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno'),
(50, 'Servidor50', 'Lenovo', 'ThinkSystem SR860', 'Intel Xeon Gold 6248', 24, 16, '5 TB', 'Encendido', 'Servidor de Base de Datos', 'Desarrollo', 'SR860-25734', 'Rack50', 'Unidad 8', '192.168.1.500', 'Valencia', 'Centro de Datos XX', 'Fijo', 'Santiago', 'Servidor de base de datos en desarrollo para cliente nuevo.', 'Linux', 'Ubuntu 20.04', '2025-02-21 10:14:32.000000', '2028-02-21 10:14:32.000000', 'APP-DEFAULT', 'Departamento IT', 'empresa.local', 'Matriz', 'Infraestructura TI', 'No', 'Pendiente', 'Pendiente', 'Pendiente', 'Mensual', 'Servicios TI', 'CC-0001', 'Interno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pseries`
--

CREATE TABLE `pseries` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `application` varchar(100) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  `ip_address` varchar(20) NOT NULL,
  `environment` varchar(100) NOT NULL,
  `slot` varchar(100) NOT NULL,
  `lpar_id` varchar(20) NOT NULL,
  `status` varchar(50) NOT NULL,
  `os` varchar(100) NOT NULL,
  `version` varchar(100) NOT NULL,
  `subsidiary` varchar(50) NOT NULL,
  `min_cpu` varchar(50) NOT NULL,
  `act_cpu` varchar(50) NOT NULL,
  `max_cpu` varchar(50) NOT NULL,
  `min_v_cpu` varchar(50) NOT NULL,
  `act_v_cpu` varchar(50) NOT NULL,
  `max_v_cpu` varchar(50) NOT NULL,
  `min_memory` varchar(50) NOT NULL,
  `act_memory` varchar(50) NOT NULL,
  `max_memory` varchar(50) NOT NULL,
  `expansion_factor` varchar(50) NOT NULL,
  `memory_per_factor` varchar(50) NOT NULL,
  `processor_compatibility` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pseries`
--

INSERT INTO `pseries` (`id`, `name`, `application`, `hostname`, `ip_address`, `environment`, `slot`, `lpar_id`, `status`, `os`, `version`, `subsidiary`, `min_cpu`, `act_cpu`, `max_cpu`, `min_v_cpu`, `act_v_cpu`, `max_v_cpu`, `min_memory`, `act_memory`, `max_memory`, `expansion_factor`, `memory_per_factor`, `processor_compatibility`) VALUES
(1, 'Server1', 'App1', 'hostname1', '192.168.1.1', 'Production', 'Slot1', 'LPAR1', 'Active', 'Linux', 'Ubuntu 20.04', 'Subsidiary1', '2', '4', '8', '1', '2', '4', '8GB', '16GB', '32GB', '2', '8GB', 'Intel'),
(2, 'Server2', 'App2', 'hostname2', '192.168.1.2', 'Development', 'Slot2', 'LPAR2', 'Inactive', 'Linux', 'CentOS 8', 'Subsidiary2', '4', '4', '16', '2', '4', '8', '16GB', '32GB', '64GB', '4', '8GB', 'AMD'),
(3, 'Server3', 'App3', 'hostname3', '192.168.1.3', 'Testing', 'Slot3', 'LPAR3', 'Active', 'Windows', 'Windows Server 2019', 'Subsidiary3', '4', '8', '16', '2', '6', '12', '32GB', '64GB', '128GB', '4', '16GB', 'Intel'),
(4, 'Server4', 'App4', 'hostname4', '192.168.1.4', 'Production', 'Slot4', 'LPAR4', 'Active', 'Linux', 'Red Hat 7', 'Subsidiary4', '6', '8', '12', '4', '6', '10', '64GB', '128GB', '256GB', '8', '16GB', 'AMD'),
(5, 'Server5', 'App5', 'hostname5', '192.168.1.5', 'Development', 'Slot5', 'LPAR5', 'Inactive', 'Linux', 'Ubuntu 18.04', 'Subsidiary5', '2', '4', '8', '2', '3', '6', '8GB', '16GB', '32GB', '2', '8GB', 'Intel'),
(6, 'Server6', 'App6', 'hostname6', '192.168.1.6', 'Testing', 'Slot6', 'LPAR6', 'Active', 'Windows', 'Windows Server 2022', 'Subsidiary6', '4', '6', '12', '3', '5', '10', '16GB', '32GB', '64GB', '3', '10GB', 'Intel'),
(7, 'Server7', 'App7', 'hostname7', '192.168.1.7', 'Production', 'Slot7', 'LPAR7', 'Active', 'Linux', 'CentOS 7', 'Subsidiary7', '8', '8', '16', '4', '8', '12', '64GB', '128GB', '256GB', '4', '16GB', 'AMD'),
(8, 'Server8', 'App8', 'hostname8', '192.168.1.8', 'Development', 'Slot8', 'LPAR8', 'Inactive', 'Linux', 'Ubuntu 22.04', 'Subsidiary8', '4', '4', '12', '2', '4', '6', '32GB', '64GB', '128GB', '6', '16GB', 'Intel'),
(9, 'Server9', 'App9', 'hostname9', '192.168.1.9', 'Testing', 'Slot9', 'LPAR9', 'Active', 'Windows', 'Windows Server 2016', 'Subsidiary9', '4', '6', '10', '3', '5', '7', '16GB', '32GB', '64GB', '4', '8GB', 'Intel'),
(10, 'Server10', 'App10', 'hostname10', '192.168.1.10', 'Production', 'Slot10', 'LPAR10', 'Inactive', 'Linux', 'Red Hat 8', 'Subsidiary10', '6', '8', '12', '3', '5', '9', '32GB', '64GB', '128GB', '5', '12GB', 'AMD');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Bancolombia'),
(2, 'TCS'),
(3, 'Administrador'),
(4, 'Dev');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `storage`
--

CREATE TABLE `storage` (
  `id` int(11) NOT NULL,
  `cod_item_configuracion` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `application_code` varchar(100) NOT NULL,
  `cost_center` varchar(100) NOT NULL,
  `active` varchar(5) NOT NULL,
  `category` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `item` varchar(50) NOT NULL,
  `company` varchar(50) NOT NULL,
  `organization_responsible` varchar(100) NOT NULL,
  `host_name` varchar(50) NOT NULL,
  `manufacturer` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `model` varchar(50) NOT NULL,
  `serial` varchar(50) NOT NULL,
  `org_maintenance` varchar(100) NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `disk_size` varchar(50) NOT NULL,
  `location` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `storage`
--

INSERT INTO `storage` (`id`, `cod_item_configuracion`, `name`, `application_code`, `cost_center`, `active`, `category`, `type`, `item`, `company`, `organization_responsible`, `host_name`, `manufacturer`, `status`, `owner`, `model`, `serial`, `org_maintenance`, `ip_address`, `disk_size`, `location`) VALUES
(1, 'CONF001', 'Servidor Central', 'APP001', 'CC001', 'Yes', 'Hardware', 'Servidor', 'Unidad 1', 'TechCorp', 'IT Department', 'Host001', 'Dell', 'Active', 'John Doe', 'PowerEdge R740', 'SN123456', 'TechCorp Maintenance', '192.168.1.1', '2TB', 'Data Center A'),
(2, 'CONF002', 'Storage Backup', 'APP002', 'CC002', 'Yes', 'Hardware', 'Almacenamiento', 'Unidad 2', 'DataSolutions', 'Backup Team', 'Host002', 'HP', 'Active', 'Jane Smith', 'ProLiant DL380', 'SN654321', 'Backup Maintenance', '192.168.1.2', '4TB', 'Data Center B'),
(3, 'CONF003', 'Router Principal', 'APP003', 'CC003', 'Yes', 'Network', 'Router', 'Unidad 3', 'NetCorp', 'Network Team', 'Router01', 'Cisco', 'Active', 'Mark Taylor', 'RV340', 'SN112233', 'NetCorp Maintenance', '10.0.0.1', 'N/A', 'Main Office'),
(4, 'CONF004', 'Switch Red', 'APP004', 'CC004', 'Yes', 'Network', 'Switch', 'Unidad 4', 'SwitchTech', 'Network Team', 'Switch01', 'Juniper', 'Active', 'Emily Clark', 'EX2300', 'SN445566', 'SwitchTech Maintenance', '10.0.0.2', 'N/A', 'Branch Office A'),
(5, 'CONF005', 'Servidor de Pruebas', 'APP005', 'CC005', 'No', 'Hardware', 'Servidor', 'Unidad 5', 'TestLab', 'QA Department', 'Host005', 'Lenovo', 'Inactive', 'Peter Johnson', 'ThinkSystem SR650', 'SN998877', 'TestLab Maintenance', '192.168.1.5', '1TB', 'Testing Lab'),
(6, 'CONF006', 'Almacenamiento Cloud', 'APP006', 'CC006', 'Yes', 'Cloud', 'Almacenamiento', 'Unidad 6', 'CloudServices', 'IT Department', 'Cloud01', 'AWS', 'Active', 'Anna Davis', 'S3 Bucket', 'N/A', 'CloudServices Support', 'N/A', 'Unlimited', 'Cloud Region A'),
(7, 'CONF007', 'Servidor Web', 'APP007', 'CC007', 'Yes', 'Hardware', 'Servidor', 'Unidad 7', 'WebSolutions', 'IT Department', 'Host007', 'HP', 'Active', 'Tom Brown', 'ProLiant ML350', 'SN223344', 'WebSolutions Maintenance', '192.168.1.7', '500GB', 'Web Hosting Center'),
(8, 'CONF008', 'Base de Datos', 'APP008', 'CC008', 'Yes', 'Software', 'Base de Datos', 'Unidad 8', 'DBSystems', 'Database Team', 'DBHost01', 'Oracle', 'Active', 'Sophia Lee', 'Oracle DB12c', 'N/A', 'DBSystems Maintenance', '192.168.1.8', '10TB', 'Data Center A'),
(9, 'CONF009', 'Impresora Central', 'APP009', 'CC009', 'No', 'Hardware', 'Impresora', 'Unidad 9', 'PrintSolutions', 'Admin Department', 'Printer01', 'Brother', 'Inactive', 'Lucas Miller', 'HL-L6200DW', 'SN667788', 'PrintSolutions Support', '192.168.1.9', 'N/A', 'Main Office'),
(10, 'CONF010', 'Firewall', 'APP010', 'CC010', 'Yes', 'Network', 'Firewall', 'Unidad 10', 'SecureNet', 'Security Team', 'Firewall01', 'Palo Alto', 'Active', 'Ethan Wilson', 'PA-220', 'SN556677', 'SecureNet Maintenance', '10.0.0.3', 'N/A', 'Main Office');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` int(11) NOT NULL,
  `authorized` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `email`, `role`, `authorized`) VALUES
(1, 'Administrador', 'admin', '$2a$12$lRH7TytmwdRdB1nrjie.Ze3dN//RT7dBQyGAPjceDo4okUF2mKMMG', 'admin@inventario.tcs', 3, 1),
(2, 'wilson', 'wochavar', '$2b$12$i4L01ozLsyypD8c8UhmSWOaC8cNGiYeTDMRxZrXX2MKR9Ffu7NjY6', 'wochavar@bancolombia.com.co', 4, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `base_de_datos`
--
ALTER TABLE `base_de_datos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`code`),
  ADD KEY `min_role` (`min_role`);

--
-- Indices de la tabla `physical_servers`
--
ALTER TABLE `physical_servers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pseries`
--
ALTER TABLE `pseries`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role` (`role`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `base_de_datos`
--
ALTER TABLE `base_de_datos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `physical_servers`
--
ALTER TABLE `physical_servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `pseries`
--
ALTER TABLE `pseries`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `storage`
--
ALTER TABLE `storage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`min_role`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

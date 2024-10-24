-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-09-2024 a las 17:35:36
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
-- Base de datos: `inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `garantias`
--

CREATE TABLE `garantias` (
  `id_garantias` varchar(50) NOT NULL,
  `serial` varchar(50) NOT NULL,
  `accion` varchar(100) DEFAULT NULL,
  `fin_garantia` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servidores_fisicos`
--

CREATE TABLE `servidores_fisicos` (
  `serial` varchar(50) NOT NULL,
  `nombre_servidor` varchar(100) NOT NULL,
  `propietario` varchar(50) DEFAULT NULL,
  `chasis` varchar(50) DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `id_rack` varchar(50) NOT NULL,
  `unidad` varchar(50) NOT NULL,
  `ip` varchar(50) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `so` varchar(20) NOT NULL,
  `tipo_activo_rack` varchar(50) DEFAULT NULL,
  `modelo` varchar(100) NOT NULL,
  `ambiente` varchar(50) DEFAULT NULL,
  `procesador` varchar(100) DEFAULT NULL,
  `cores` int(11) DEFAULT NULL,
  `discos` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servidores_virtuales`
--

CREATE TABLE `servidores_virtuales` (
  `id_servidor_virtual` int(11) NOT NULL,
  `nombre_vm` varchar(100) NOT NULL,
  `ip_vm` varchar(100) NOT NULL,
  `estado_vm` varchar(50) NOT NULL,
  `so_vm` varchar(50) DEFAULT NULL,
  `cores_vm` int(11) NOT NULL,
  `ram_vm` int(11) NOT NULL,
  `host_vm` varchar(100) DEFAULT NULL,
  `cluster_vm` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `garantias`
--
ALTER TABLE `garantias`
  ADD PRIMARY KEY (`id_garantias`),
  ADD KEY `fk_serial` (`serial`);

--
-- Indices de la tabla `servidores_fisicos`
--
ALTER TABLE `servidores_fisicos`
  ADD PRIMARY KEY (`serial`);

--
-- Indices de la tabla `servidores_virtuales`
--
ALTER TABLE `servidores_virtuales`
  ADD PRIMARY KEY (`id_servidor_virtual`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `servidores_virtuales`
--
ALTER TABLE `servidores_virtuales`
  MODIFY `id_servidor_virtual` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `garantias`
--
ALTER TABLE `garantias`
  ADD CONSTRAINT `fk_serial` FOREIGN KEY (`serial`) REFERENCES `servidores_fisicos` (`serial`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

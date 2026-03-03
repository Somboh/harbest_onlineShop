-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-03-2026 a las 19:28:52
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
-- Base de datos: `harbest`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultor`
--

CREATE TABLE `agricultor` (
  `email` varchar(200) NOT NULL,
  `foto` varchar(200) NOT NULL,
  `nombre` text NOT NULL,
  `contra` text NOT NULL,
  `direccion` text NOT NULL,
  `telefono` int(11) NOT NULL,
  `id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agricultor`
--

INSERT INTO `agricultor` (`email`, `foto`, `nombre`, `contra`, `direccion`, `telefono`, `id`) VALUES
('farmer1@example.com', 'products/ut8a3qzwxstn8kfpbv5x', 'Pedro', '$2b$10$mJs/PhBEn1Y3/pwQrVppce2eNZgjoBqL.kRsv8dCp01WJhrQFdPsq', 'Calle False 123', 1234567890, 'JAwVIQiY');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

CREATE TABLE `fotos` (
  `path` text NOT NULL,
  `id` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fotos`
--

INSERT INTO `fotos` (`path`, `id`) VALUES
('https://res.cloudinary.com/dbvqgejl4/image/upload/v1772560903/products/av4axaetlfwxa58r0ivc.png', 'products/av4axaetlfwxa58r0ivc'),
('https://res.cloudinary.com/dbvqgejl4/image/upload/v1772560864/products/do9pxia1fxq8cx0xxwa9.png', 'products/do9pxia1fxq8cx0xxwa9'),
('https://res.cloudinary.com/dbvqgejl4/image/upload/v1772560949/products/ut8a3qzwxstn8kfpbv5x.png', 'products/ut8a3qzwxstn8kfpbv5x'),
('https://res.cloudinary.com/dbvqgejl4/image/upload/v1772558984/products/vwiwg4q6wyurdy4y6kp5.jpg', 'products/vwiwg4q6wyurdy4y6kp5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `foto` varchar(200) NOT NULL,
  `nombre` text NOT NULL,
  `descripcion` text NOT NULL,
  `precio` float NOT NULL,
  `cantidad` int(11) NOT NULL,
  `email_agricultor` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` text NOT NULL,
  `foto` varchar(200) NOT NULL,
  `nombre` text NOT NULL,
  `email` text NOT NULL,
  `contra` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `foto`, `nombre`, `email`, `contra`) VALUES
('rNrxWcrH', 'products/do9pxia1fxq8cx0xxwa9', 'Pablo', 'user2@example.com', '$2b$10$slCVtMeSWMvzofSeWfXYXONM4/OLoHlknd/GL66mb7y13FJmDbK.O');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agricultor`
--
ALTER TABLE `agricultor`
  ADD PRIMARY KEY (`id`(200)),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `foto` (`foto`);

--
-- Indices de la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_producto_agricultor` (`email_agricultor`),
  ADD KEY `fk_producto_foto` (`foto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD KEY `foto` (`foto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agricultor`
--
ALTER TABLE `agricultor`
  ADD CONSTRAINT `agricultor_ibfk_1` FOREIGN KEY (`foto`) REFERENCES `fotos` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_agricultor` FOREIGN KEY (`email_agricultor`) REFERENCES `agricultor` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_producto_foto` FOREIGN KEY (`foto`) REFERENCES `fotos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`foto`) REFERENCES `fotos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

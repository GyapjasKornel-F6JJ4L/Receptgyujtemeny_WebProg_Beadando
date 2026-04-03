-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 08:16 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `receptgyűjtemény`
--
CREATE DATABASE IF NOT EXISTS `receptgyűjtemény` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `receptgyűjtemény`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Levesek'),
(2, 'Főételek'),
(3, 'Desszertek'),
(4, 'Saláták'),
(5, 'Reggelik');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`) VALUES
(1, 'marhahús'),
(2, 'sertéshús'),
(3, 'csirkemell'),
(4, 'csirkecomb'),
(5, 'hal'),
(6, 'tojás'),
(7, 'liszt'),
(8, 'cukor'),
(9, 'só'),
(10, 'bors'),
(11, 'olaj'),
(12, 'vaj'),
(13, 'tej'),
(14, 'tejföl'),
(15, 'sajt'),
(16, 'hagyma'),
(17, 'fokhagyma'),
(18, 'krumpli'),
(19, 'répa'),
(20, 'paprika'),
(21, 'paradicsom'),
(22, 'rizs'),
(23, 'tészta'),
(24, 'alma'),
(25, 'uborka'),
(26, 'káposzta'),
(27, 'zabpehely'),
(28, 'méz'),
(29, 'citrom'),
(30, 'gomba');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `description` text COLLATE utf8_hungarian_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `first_made` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `user_id`, `category_id`, `title`, `description`, `image`, `created_at`, `first_made`) VALUES
(1, 2, 1, 'Gulyásleves', 'Autentikus gulyásleves', NULL, '2026-03-31', NULL),
(2, 3, 1, 'Húsleves', 'Autentikus húsleves', NULL, '2026-03-31', NULL),
(3, 4, 2, 'Paprikás csirke', 'Autentikus paprikás csirke', NULL, '2026-03-31', NULL),
(4, 1, 2, 'Rántott hús', 'Autentikus rántott hús', NULL, '2026-03-31', NULL),
(5, 2, 3, 'Palacsinta', 'Autentikus palacsinta', NULL, '2026-03-31', NULL),
(6, 3, 3, 'Almás pite', 'Autentikus almás pite', NULL, '2026-03-31', NULL),
(7, 4, 4, 'Görög saláta', 'Autentikus görög saláta', NULL, '2026-03-31', NULL),
(8, 1, 4, 'Uborkasaláta', 'Autentikus uborkasaláta', NULL, '2026-03-31', NULL),
(9, 2, 5, 'Rántotta', 'Autentikus rántotta', NULL, '2026-03-31', NULL),
(10, 3, 5, 'Zabkása', 'Autentikus zabkása', NULL, '2026-03-31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ingredients`
--

CREATE TABLE `recipe_ingredients` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `ingredient_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit` varchar(50) COLLATE utf8_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `recipe_ingredients`
--

INSERT INTO `recipe_ingredients` (`id`, `recipe_id`, `ingredient_id`, `quantity`, `unit`) VALUES
(1, 1, 1, '500.00', 'g'),
(2, 1, 16, '1.00', 'db'),
(3, 1, 18, '3.00', 'db'),
(4, 1, 20, '1.00', 'db'),
(5, 2, 1, '700.00', 'g'),
(6, 2, 18, '2.00', 'db'),
(7, 2, 19, '2.00', 'db'),
(8, 3, 3, '500.00', 'g'),
(9, 3, 16, '1.00', 'db'),
(10, 3, 14, '200.00', 'ml'),
(11, 4, 2, '500.00', 'g'),
(12, 4, 6, '2.00', 'db'),
(13, 4, 7, '100.00', 'g'),
(14, 5, 7, '200.00', 'g'),
(15, 5, 6, '2.00', 'db'),
(16, 5, 13, '300.00', 'ml'),
(17, 6, 7, '300.00', 'g'),
(18, 6, 24, '3.00', 'db'),
(19, 6, 6, '100.00', 'g'),
(20, 7, 21, '2.00', 'db'),
(21, 7, 25, '1.00', 'db'),
(22, 7, 15, '100.00', 'g'),
(23, 8, 25, '2.00', 'db'),
(24, 8, 9, '5.00', 'g'),
(25, 9, 6, '3.00', 'db'),
(26, 9, 12, '10.00', 'g'),
(27, 10, 27, '50.00', 'g'),
(28, 10, 13, '200.00', 'ml');

-- --------------------------------------------------------

--
-- Table structure for table `steps`
--

CREATE TABLE `steps` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `step_number` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `steps`
--

INSERT INTO `steps` (`id`, `recipe_id`, `step_number`, `description`) VALUES
(1, 1, 1, 'Hagymát pirítjuk'),
(2, 1, 2, 'Húst hozzáadjuk'),
(3, 1, 3, 'Fűszerezzük'),
(4, 1, 4, 'Felöntjük vízzel'),
(5, 1, 5, 'Főzzük'),
(6, 2, 1, 'Húst főzni tesszük'),
(7, 2, 2, 'Zöldséget adunk hozzá'),
(8, 2, 3, 'Lassan főzzük'),
(9, 2, 4, 'Leszűrjük'),
(10, 2, 5, 'Tálaljuk'),
(11, 3, 1, 'Hagymát pirítjuk'),
(12, 3, 2, 'Csirkét sütjük'),
(13, 3, 3, 'Paprikát adunk hozzá'),
(14, 3, 4, 'Tejföllel sűrítjük'),
(15, 3, 5, 'Főzzük'),
(16, 4, 1, 'Húst klopfoljuk'),
(17, 4, 2, 'Panírozzuk'),
(18, 4, 3, 'Olajban sütjük'),
(19, 4, 4, 'Megfordítjuk'),
(20, 4, 5, 'Tálaljuk'),
(21, 5, 1, 'Tésztát keverünk'),
(22, 5, 2, 'Serpenyőt melegítünk'),
(23, 5, 3, 'Kisütjük'),
(24, 5, 4, 'Megfordítjuk'),
(25, 5, 5, 'Tálaljuk'),
(26, 6, 1, 'Tésztát készítünk'),
(27, 6, 2, 'Almát reszelünk'),
(28, 6, 3, 'Rétegezzük'),
(29, 6, 4, 'Sütjük'),
(30, 6, 5, 'Tálaljuk'),
(31, 7, 1, 'Zöldséget vágunk'),
(32, 7, 2, 'Összekeverjük'),
(33, 7, 3, 'Fűszerezzük'),
(34, 7, 4, 'Olajat adunk'),
(35, 7, 5, 'Tálaljuk'),
(36, 8, 1, 'Uborkát szeletelünk'),
(37, 8, 2, 'Sózzuk'),
(38, 8, 3, 'Ecetezzük'),
(39, 8, 4, 'Állni hagyjuk'),
(40, 8, 5, 'Tálaljuk'),
(41, 9, 1, 'Tojást felverjük'),
(42, 9, 2, 'Serpenyőbe öntjük'),
(43, 9, 3, 'Keverjük'),
(44, 9, 4, 'Sütjük'),
(45, 9, 5, 'Tálaljuk'),
(46, 10, 1, 'Tejet melegítünk'),
(47, 10, 2, 'Zabot adunk hozzá'),
(48, 10, 3, 'Főzzük'),
(49, 10, 4, 'Mézzel ízesítjük'),
(50, 10, 5, 'Tálaljuk');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'kockas_pista', 'pista@lol.hu', 'password', '2026-03-31 18:12:14'),
(2, 'suteskiraly69', 'kiraly@chef.hu', 'password', '2026-03-31 18:12:14'),
(3, 'tejfol_nindzsa', 'nindzsa@konyha.hu', 'password', '2026-03-31 18:12:14'),
(4, 'rantotthus_isten', 'hus@mennyei.hu', 'password', '2026-03-31 18:12:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Indexes for table `steps`
--
ALTER TABLE `steps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `steps`
--
ALTER TABLE `steps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`);

--
-- Constraints for table `steps`
--
ALTER TABLE `steps`
  ADD CONSTRAINT `steps_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

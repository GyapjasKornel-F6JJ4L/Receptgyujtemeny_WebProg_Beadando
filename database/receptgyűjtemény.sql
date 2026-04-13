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
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `abbreviation` varchar(20) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `name`, `abbreviation`) VALUES
(1, 'gramm', 'g'),
(2, 'kilogramm', 'kg'),
(3, 'milliliter', 'ml'),
(4, 'liter', 'l'),
(5, 'darab', 'db'),
(6, 'evőkanál', 'ek'),
(7, 'teáskanál', 'tk'),
(8, 'csipet', 'csipet'),
(9, 'szem', 'szem'),
(10, 'szelet', 'szelet'),
(11, 'deciliter', 'dl'),
(12, 'gerezd', 'gerezd'),
(13, 'ízlásra', 'ízlásra');

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
(1, 2, 1, 'Gulyásleves', 'Autentikus magyar gulyásleves marhahúsból, paprikával és burgonyával.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', '2026-03-31', '2025-01-15'),
(2, 3, 1, 'Húsleves', 'Tradicionális magyar húsleves marhahúsból zöldségekkel.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', '2026-03-31', '2024-11-20'),
(3, 4, 2, 'Paprikás csirke', 'Csirkecomb paprikás ragu tejföllel, házi csipetkével.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', '2026-03-31', '2025-02-28'),
(4, 1, 2, 'Rántott hús', 'Sertéskaraj panírban, aranybarnára sütve.', 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400', '2026-03-31', '2024-12-05'),
(5, 2, 3, 'Palacsinta', 'Hagyományos magyar palacsinta lekvárral és kristálycukorral.', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', '2026-03-31', '2025-03-10'),
(6, 3, 3, 'Almás pite', 'Réteges almás pite fahéjjal és citrommal.', 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400', '2026-03-31', '2024-10-15'),
(7, 4, 4, 'Görög saláta', 'Friss görög saláta paradicsommal, uborkával és fetával.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', '2026-03-31', '2025-04-01'),
(8, 1, 4, 'Uborkasaláta', 'Ecetes uborka fokhagymával és kapribogysóval.', 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=400', '2026-03-31', '2024-09-20'),
(9, 2, 5, 'Rántotta', 'Tojás rántotta friss petrezselyemmel.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400', '2026-03-31', '2025-01-25'),
(10, 3, 5, 'Zabkása', 'Meleg zabkása mézzel és gyümölcsökkel.', 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400', '2026-03-31', '2024-08-10'),
(11, 1, 1, 'Csirkeaprólék leves', 'Csirkeaprólék leves zöldségekkel és citrommal.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', '2026-04-01', '2025-02-15'),
(12, 2, 2, 'Bolognai spagetti', 'Olasz stílusú darált hús paradicsom szósszal.', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', '2026-04-01', '2024-12-20'),
(13, 3, 2, 'Sült csirkecomb', 'Sült csirkecomb fokhagymás vajmártással.', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', '2026-04-01', '2025-03-25'),
(14, 4, 3, 'Túrós pite', 'Túrós pite mazsolás és vaníliás töltelékkel.', 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400', '2026-04-01', '2024-11-10'),
(15, 1, 4, 'Ceasar saláta', 'Ceasar saláta csirkemellel és parmezánnal.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', '2026-04-01', '2025-04-05');

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
(5, 1, 10, '5.00', 'g'),
(6, 1, 9, '10.00', 'g'),
(7, 2, 1, '700.00', 'g'),
(8, 2, 18, '2.00', 'db'),
(9, 2, 19, '2.00', 'db'),
(10, 2, 17, '3.00', 'gerezd'),
(11, 2, 9, '15.00', 'g'),
(12, 3, 4, '500.00', 'g'),
(13, 3, 16, '1.00', 'db'),
(14, 3, 14, '200.00', 'ml'),
(15, 3, 20, '2.00', 'db'),
(16, 3, 10, '3.00', 'g'),
(17, 4, 2, '500.00', 'g'),
(18, 4, 6, '2.00', 'db'),
(19, 4, 7, '100.00', 'g'),
(20, 4, 11, '300.00', 'ml'),
(21, 4, 9, '5.00', 'g'),
(22, 5, 7, '200.00', 'g'),
(23, 5, 6, '2.00', 'db'),
(24, 5, 13, '300.00', 'ml'),
(25, 5, 8, '30.00', 'g'),
(26, 6, 7, '300.00', 'g'),
(27, 6, 24, '3.00', 'db'),
(28, 6, 6, '100.00', 'g'),
(29, 6, 8, '150.00', 'g'),
(30, 6, 29, '1.00', 'db'),
(31, 7, 21, '2.00', 'db'),
(32, 7, 25, '1.00', 'db'),
(33, 7, 15, '100.00', 'g'),
(34, 7, 11, '50.00', 'ml'),
(35, 7, 9, '3.00', 'g'),
(36, 8, 25, '2.00', 'db'),
(37, 8, 9, '5.00', 'g'),
(38, 8, 29, '30.00', 'ml'),
(39, 9, 6, '3.00', 'db'),
(40, 9, 12, '10.00', 'g'),
(41, 9, 9, '2.00', 'g'),
(42, 10, 27, '50.00', 'g'),
(43, 10, 13, '200.00', 'ml'),
(44, 10, 28, '20.00', 'g'),
(45, 11, 4, '400.00', 'g'),
(46, 11, 19, '2.00', 'db'),
(47, 11, 18, '2.00', 'db'),
(48, 11, 16, '1.00', 'db'),
(49, 11, 29, '1.00', 'db'),
(50, 12, 2, '400.00', 'g'),
(51, 12, 23, '400.00', 'g'),
(52, 12, 21, '400.00', 'g'),
(53, 12, 16, '1.00', 'db'),
(54, 12, 9, '10.00', 'g'),
(55, 13, 3, '600.00', 'g'),
(56, 13, 12, '50.00', 'g'),
(57, 13, 17, '4.00', 'gerezd'),
(58, 13, 9, '5.00', 'g'),
(59, 14, 7, '250.00', 'g'),
(60, 14, 15, '300.00', 'g'),
(61, 14, 6, '3.00', 'db'),
(62, 14, 13, '200.00', 'ml'),
(63, 14, 8, '100.00', 'g'),
(64, 15, 3, '300.00', 'g'),
(65, 15, 21, '2.00', 'db'),
(66, 15, 25, '1.00', 'db'),
(67, 15, 7, '50.00', 'g'),
(68, 15, 11, '60.00', 'ml');

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
(1, 1, 1, 'A hagymát apróra vágjuk és olajon aranybarnára pirítjuk.'),
(2, 1, 2, 'A marhahúst kockákra vágjuk és a hagymára tesszük.'),
(3, 1, 3, 'Megszórjuk pirospaprikával és átkeverjük.'),
(4, 1, 4, 'Felöntjük hideg vízzel, sózzuk, borsozzuk.'),
(5, 1, 5, 'Hozzáadjuk a kockázott burgonyát és lassan főzzük 1,5 órát.'),
(6, 1, 6, 'Tálaláskor tejföllel díszítjük.'),
(7, 2, 1, 'A marhahúst nagy darabban hideg vízben feltesszük főni.'),
(8, 2, 2, 'Hozzáadjuk a zöldségeket: burgonyát, répat, hagymát.'),
(9, 2, 3, 'Lassan főzzük 2-3 órát, amíg a hús puha nem lesz.'),
(10, 2, 4, 'Leszűrjük, a húst és zöldséget külön tálaljuk.'),
(11, 2, 5, 'A levet tálaljuk, csipetkével vagy vékony metélttel.'),
(12, 3, 1, 'A csirkecombot daraboljuk és beszórjuk sóval, borssal.'),
(13, 3, 2, 'Hagymát aprítunk és olajon üvegesre pirítjuk.'),
(14, 3, 3, 'Rátesszük a csirkét és minden oldalról lepirítjuk.'),
(15, 3, 4, 'Hozzáadjuk a paprikát, felöntjük vízzel.'),
(16, 3, 5, 'Főzzük 30 percet, majd tejföllel behabarjuk.'),
(17, 3, 6, 'Csipetkével vagy rizzsel tálaljuk.'),
(18, 4, 1, 'A sertéskarajt szeletekre vágjuk és klopfoljuk.'),
(19, 4, 2, 'Enyhén sózzuk, majd lisztbe, tojásba, zsemlemorzsába mártjuk.'),
(20, 4, 3, 'Elég olajban, közepes lángon sütjük aranybarnára.'),
(21, 4, 4, 'Megfordítjuk és a másik oldalt is megsütjük.'),
(22, 4, 5, 'Papír törölközőn lecsöpögtetjük és tálaljuk.'),
(23, 5, 1, 'A lisztet, tojást, tejet és csipet sót csomómentesre keverjük.'),
(24, 5, 2, 'Serpenyőt felforrósítjuk, vékonyan olajozzuk.'),
(25, 5, 3, 'Merítünk egy merítőkanálnyi tésztát, elterítjük.'),
(26, 5, 4, 'Amikor a széle aranybarna, megfordítjuk.'),
(27, 5, 5, 'Lekváral vagy túróval töltjük és felgöngyöljük.'),
(28, 6, 1, 'A lisztet, cukrot, vajat és tojást tésztává gyúrjuk.'),
(29, 6, 2, 'A tésztát két lapra nyújtjuk, egyet tepsi aljába teszünk.'),
(30, 6, 3, 'Az almát meghámozzuk, reszeljük, cukorral és fahéjjal keverjük.'),
(31, 6, 4, 'Az almát a tésztára tesszük, befedjük a másik lappal.'),
(32, 6, 5, '180°C-on 45 percig sütjük, amíg aranybarna nem lesz.'),
(33, 7, 1, 'A paradicsomot, uborkát és paprikát kockára vágjuk.'),
(34, 7, 2, 'Hagymát vékonyan szeleteljük.'),
(35, 7, 3, 'Az olívaolajat olaj ecettel összekeverjük.'),
(36, 7, 4, 'Mindent összeforgatunk, sózzuk, borsozzuk.'),
(37, 7, 5, 'Fetával és olívával díszítve tálaljuk.'),
(38, 8, 1, 'Az uborkát vékony szeletekre vágjuk.'),
(39, 8, 2, 'Megszórjuk sóval és állni hagyjuk 30 percig.'),
(40, 8, 3, 'Lecsepegtetjük, felöntjük ecettel.'),
(41, 8, 4, 'Hozzáadjuk a fokhagymát és kapribogyót.'),
(42, 8, 5, 'Hűtőben 2 órát állni hagyjuk, majd tálaljuk.'),
(43, 9, 1, 'A tojásokat felverjük, enyhén sózzuk.'),
(44, 9, 2, 'Serpenyőben vajat olvasztunk.'),
(45, 9, 3, 'Belecsurgatjuk a tojást, közepes lángon keverjük.'),
(46, 9, 4, 'Amíg puha, de már nem folyós, levesszük.'),
(47, 9, 5, 'Petrezselyemmel megszórva tálaljuk.'),
(48, 10, 1, 'A tejet felforrósítjuk, de ne forraljuk.'),
(49, 10, 2, 'Belecsorgatjuk a zabpelyhet, folyamatosan keverjük.'),
(50, 10, 3, '5-7 percig főzzük, amíg sűrű nem lesz.'),
(51, 10, 4, 'Levesszük, hozzáadjuk a mézet és keverjük.'),
(52, 10, 5, 'Dióval vagy gyümölccsel tálaljuk.'),
(53, 11, 1, 'A csirkeaprólékot alaposan megmossuk.'),
(54, 11, 2, 'Hideg vízben feltesszük, hozzáadjuk a zöldségeket.'),
(55, 11, 3, 'Kb. 1 óra alatt puhára főzzük.'),
(56, 11, 4, 'Leszűrjük, a húst leválasztjuk a csontokról.'),
(57, 11, 5, 'Citrommal és petrezselyemmel ízesítve tálaljuk.'),
(58, 12, 1, 'A hagymát és fokhagymát apróra vágjuk.'),
(59, 12, 2, 'Olajon megpirítjuk, hozzáadjuk a darált húst.'),
(60, 12, 3, 'Beletesszük a paradicsomkonzervet, sózzuk, borsozzuk.'),
(61, 12, 4, '40 percig főzzük, közben hozzáadjuk a fűszereket.'),
(62, 12, 5, 'A spagettit külön megfőzzük, a szósszal leöntjük.'),
(63, 13, 1, 'A csirkecombot beszórjuk sóval, borssal.'),
(64, 13, 2, 'Sütőben 200°C-on 35-40 percig sütjük.'),
(65, 13, 3, 'A vajat fokhagymával összekeverjük.'),
(66, 13, 4, 'Sütés végén a vajkeveréket a csirkére kenjük.'),
(67, 13, 5, 'Petrrezselymes burgonyával tálaljuk.'),
(68, 14, 1, 'A lisztet, vajat, cukrot és tojást összegyúrjuk.'),
(69, 14, 2, 'A túrót cukorral és vaníliával keverjük.'),
(70, 14, 3, 'A tésztát ketté osztjuk, egyik felét tepsi aljába.'),
(71, 14, 4, 'Rátesszük a túrós töltelék, befedjük a másik tésztával.'),
(72, 14, 5, '180°C-on 40 percig sütjük.'),
(73, 15, 1, 'A csirkemellet csíkokra vágjuk, sózzuk, borsozzuk.'),
(74, 15, 2, 'Serpenyőben megsütjük, majd félretesszük.'),
(75, 15, 3, 'A saláta alapanyagait összeforgatjuk.'),
(76, 15, 4, 'Rátesszük a csirkét és parmezánt.'),
(77, 15, 5, 'Crutonnal és öntettel tálaljuk.');

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
(1, 'kockas_pista', 'pista@lol.hu', '$2y$10$mhzzdt2TrJ.UDdYiD0NEKu7u9PN9wyLUvJyNC8bcTsPA6Jo14n.QW', '2026-03-31 18:12:14'),
(2, 'suteskiraly69', 'kiraly@chef.hu', '$2y$10$mhzzdt2TrJ.UDdYiD0NEKu7u9PN9wyLUvJyNC8bcTsPA6Jo14n.QW', '2026-03-31 18:12:14'),
(3, 'tejfol_nindzsa', 'nindzsa@konyha.hu', '$2y$10$mhzzdt2TrJ.UDdYiD0NEKu7u9PN9wyLUvJyNC8bcTsPA6Jo14n.QW', '2026-03-31 18:12:14'),
(4, 'rantotthus_isten', 'hus@mennyei.hu', '$2y$10$mhzzdt2TrJ.UDdYiD0NEKu7u9PN9wyLUvJyNC8bcTsPA6Jo14n.QW', '2026-03-31 18:12:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units` ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`),
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
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `steps`
--
ALTER TABLE `steps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

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

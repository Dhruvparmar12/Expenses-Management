-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 07, 2019 at 07:40 AM
-- Server version: 10.3.15-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Expenses_Mangement`
--

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `e_id` int(10) NOT NULL,
  `u_id` bigint(13) NOT NULL,
  `e_name` varchar(50) NOT NULL,
  `e_amount` int(7) NOT NULL,
  `e_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`e_id`, `u_id`, `e_name`, `e_amount`, `e_date`) VALUES
(2, 1, 'Goa-trips', 60000, '2019-07-01'),
(4, 1, 'Abu', 35000, '2019-08-02'),
(5, 1, 'Trip', 1500, '2019-08-04'),
(6, 6, 'Hotel Bill', 50000, '2019-08-02');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `g_id` int(10) NOT NULL,
  `g_name` varchar(50) NOT NULL,
  `created_by` bigint(13) NOT NULL,
  `created_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`g_id`, `g_name`, `created_by`, `created_date`) VALUES
(1, 'Abu road', 1, '2019-08-06'),
(2, 'Trip 1', 6, '2019-08-06'),
(3, 'Trip 3', 6, '2019-08-06'),
(4, 'Trip 4', 1, '2019-08-06'),
(5, 'Trip 5', 6, '2019-08-06'),
(6, 'Trip 6', 6, '2019-08-06'),
(7, 'Goa', 1, '2019-08-06'),
(8, 'Exapmle', 1, '2019-08-06'),
(9, 'Temp', 1, '2019-08-06'),
(10, 'Temp 1', 1, '2019-08-06'),
(11, 'Hello', 1, '2019-08-06'),
(12, 'Funny', 1, '2019-08-06'),
(13, 'Dhruv', 1, '2019-08-07');

-- --------------------------------------------------------

--
-- Table structure for table `groups_member`
--

CREATE TABLE `groups_member` (
  `g_m_id` int(10) NOT NULL,
  `g_id` int(10) NOT NULL,
  `u_id` bigint(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `groups_member`
--

INSERT INTO `groups_member` (`g_m_id`, `g_id`, `u_id`) VALUES
(1, 1, 1),
(2, 1, 6),
(3, 1, 7),
(4, 1, 8),
(5, 2, 6),
(6, 2, 1),
(7, 2, 7),
(8, 2, 8),
(9, 3, 6),
(10, 3, 1),
(11, 3, 7),
(12, 3, 8),
(13, 4, 1),
(14, 4, 7),
(15, 4, 8),
(16, 5, 6),
(17, 6, 6),
(18, 6, 7),
(19, 6, 8),
(20, 7, 1),
(21, 7, 6),
(22, 7, 7),
(23, 8, 1),
(24, 8, 6),
(25, 8, 7),
(26, 9, 1),
(27, 9, 6),
(28, 9, 7),
(29, 9, 8),
(30, 10, 1),
(31, 10, 6),
(32, 11, 1),
(33, 11, 6),
(34, 12, 1),
(35, 12, 7),
(36, 12, 8),
(37, 13, 1),
(38, 13, 6),
(39, 13, 7);

-- --------------------------------------------------------

--
-- Table structure for table `split_bill`
--

CREATE TABLE `split_bill` (
  `s_b_id` int(10) NOT NULL,
  `s_e_id` int(10) NOT NULL,
  `u_id` bigint(13) NOT NULL,
  `g_id` int(10) NOT NULL,
  `amount` double(7,2) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `split_bill`
--

INSERT INTO `split_bill` (`s_b_id`, `s_e_id`, `u_id`, `g_id`, `amount`, `status`) VALUES
(1, 1, 1, 1, 3750.00, 'paid'),
(2, 1, 6, 1, 3750.00, 'paid'),
(3, 1, 7, 1, 3750.00, 'paid'),
(4, 1, 8, 1, 3750.00, 'paid'),
(5, 2, 6, 6, 5000.00, 'paid'),
(6, 2, 7, 6, 5000.00, 'unpaid'),
(7, 2, 8, 6, 5000.00, 'unpaid'),
(8, 3, 6, 2, 5250.00, 'unpaid'),
(9, 3, 1, 2, 5250.00, 'unpaid'),
(10, 3, 7, 2, 5250.00, 'unpaid'),
(11, 3, 8, 2, 5250.00, 'unpaid'),
(12, 4, 1, 9, 1500.00, 'unpaid'),
(13, 4, 6, 9, 1500.00, 'unpaid'),
(14, 4, 7, 9, 1500.00, 'unpaid'),
(15, 4, 8, 9, 1500.00, 'unpaid'),
(16, 5, 1, 10, 1500.00, 'paid'),
(17, 5, 6, 10, 1500.00, 'unpaid'),
(18, 6, 1, 11, 1000.00, 'unpaid'),
(19, 6, 6, 11, 1000.00, 'unpaid'),
(20, 7, 1, 12, 1000.00, 'unpaid'),
(21, 7, 7, 12, 1000.00, 'unpaid'),
(22, 7, 8, 12, 1000.00, 'unpaid'),
(23, 8, 1, 13, 1000.00, 'unpaid'),
(24, 8, 6, 13, 1000.00, 'unpaid'),
(25, 8, 7, 13, 1000.00, 'unpaid'),
(26, 9, 6, 7, 3000.00, 'unpaid'),
(27, 9, 1, 7, 3000.00, 'unpaid'),
(28, 9, 7, 7, 3000.00, 'unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `split_expense`
--

CREATE TABLE `split_expense` (
  `s_e_id` int(10) NOT NULL,
  `u_id` bigint(13) NOT NULL,
  `g_id` int(10) NOT NULL,
  `e_name` varchar(50) NOT NULL,
  `e_amount` double(7,2) DEFAULT NULL,
  `e_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `split_expense`
--

INSERT INTO `split_expense` (`s_e_id`, `u_id`, `g_id`, `e_name`, `e_amount`, `e_date`) VALUES
(1, 6, 1, 'ABC', 15000.00, '2019-08-27'),
(2, 6, 6, 'XYZ', 15000.00, '2019-08-27'),
(3, 1, 2, 'KBC', 21000.00, '2019-08-29'),
(4, 1, 9, 'Temp', 6000.00, '2019-08-03'),
(5, 1, 10, 'Food Bill', 3000.00, '2019-08-04'),
(6, 1, 11, 'Food Bill', 2000.00, '2019-08-04'),
(7, 1, 12, 'Food Bill', 3000.00, '2019-08-04'),
(8, 1, 13, 'Dhruv', 3000.00, '2019-08-04'),
(9, 1, 7, 'Happy', 9000.00, '2019-08-04');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `u_id` bigint(13) NOT NULL,
  `u_name` varchar(50) NOT NULL,
  `u_email` varchar(50) NOT NULL,
  `u_password` varchar(255) NOT NULL,
  `u_mobile` bigint(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`u_id`, `u_name`, `u_email`, `u_password`, `u_mobile`) VALUES
(1, 'Dhruv', 'dhruvrajput62@gmail.com', '$2b$10$yKKWc2FlgReFtdc/NHWnQ.1PTntTilUr4wycRSQDg.K4iLu88snB.', 7600959694),
(6, 'Shivam', 'shivam123@gmail.com', '$2b$10$DewHMozD.dl1BkOzFJmuZega.G1KzueZdf9rJ7GxGSm0HiKO48BBi', 7600959694),
(7, 'Parth', 'shivam1234@gmail.com', '$2b$10$0gbjA0RDZYlBgHH1nnrIHeBm8FzYFKW6Hs375wN6n.IzajevOquHe', 7600959694),
(8, 'Vivek', 'shivam62@gmail.com', '$2b$10$h5ahQIskZHkEyBSNpnJgRuQEGALG6JTRcfoAfCSG8Cz3VIbpdgsWK', 7600959694);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`e_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`g_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `groups_member`
--
ALTER TABLE `groups_member`
  ADD PRIMARY KEY (`g_m_id`),
  ADD KEY `g_id` (`g_id`),
  ADD KEY `u_id` (`u_id`);

--
-- Indexes for table `split_bill`
--
ALTER TABLE `split_bill`
  ADD PRIMARY KEY (`s_b_id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `s_e_id` (`s_e_id`),
  ADD KEY `g_id` (`g_id`);

--
-- Indexes for table `split_expense`
--
ALTER TABLE `split_expense`
  ADD PRIMARY KEY (`s_e_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`u_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `e_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `g_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `groups_member`
--
ALTER TABLE `groups_member`
  MODIFY `g_m_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `split_bill`
--
ALTER TABLE `split_bill`
  MODIFY `s_b_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `split_expense`
--
ALTER TABLE `split_expense`
  MODIFY `s_e_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `u_id` bigint(13) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups_member`
--
ALTER TABLE `groups_member`
  ADD CONSTRAINT `groups_member_ibfk_1` FOREIGN KEY (`g_id`) REFERENCES `groups` (`g_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groups_member_ibfk_2` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `split_bill`
--
ALTER TABLE `split_bill`
  ADD CONSTRAINT `split_bill_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `user` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `split_bill_ibfk_2` FOREIGN KEY (`s_e_id`) REFERENCES `split_expense` (`s_e_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `split_bill_ibfk_3` FOREIGN KEY (`g_id`) REFERENCES `groups` (`g_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

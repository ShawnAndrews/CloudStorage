-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Oct 05, 2017 at 01:50 PM
-- Server version: 5.6.36-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `UserUploads`
--

-- --------------------------------------------------------

--
-- Table structure for table `Accounts`
--

CREATE TABLE IF NOT EXISTS `Accounts` (
  `id` varchar(30) NOT NULL,
  `name` varchar(50) NOT NULL,
  `picture` varchar(200) NOT NULL,
  `gender` varchar(6) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Files`
--

CREATE TABLE IF NOT EXISTS `Files` (
  `id` varchar(30) NOT NULL,
  `google_drive_id` varchar(30) DEFAULT NULL,
  `imgur_link` varchar(50) DEFAULT NULL,
  `filename` varchar(255) NOT NULL,
  `filesize` bigint(20) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`filename`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `FilesStatistics`
--

CREATE TABLE IF NOT EXISTS `FilesStatistics` (
  `ip` varchar(15) NOT NULL,
  `id` varchar(30) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`ip`,`id`,`date`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Timeouts`
--

CREATE TABLE IF NOT EXISTS `Timeouts` (
  `id` varchar(30) NOT NULL,
  `numOfUploads` int(11) NOT NULL DEFAULT '0',
  `lastUploadTime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Timeouts`
--

-- --------------------------------------------------------

--
-- Table structure for table `Tokens`
--

CREATE TABLE IF NOT EXISTS `Tokens` (
  `id` varchar(30) NOT NULL,
  `token` varchar(200) NOT NULL,
  `expiry_date` datetime NOT NULL,
  PRIMARY KEY (`token`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2026 at 03:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_nawa`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

CREATE TABLE `about_us` (
  `id_blog` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `daily_status` enum('Open','Closed','Private Event') NOT NULL DEFAULT 'Open',
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id_form` int(11) NOT NULL,
  `nama_customer` varchar(255) NOT NULL,
  `no_meja` int(11) NOT NULL,
  `Kritik` varchar(255) NOT NULL,
  `Saran` varchar(255) NOT NULL,
  `submited_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id_form`, `nama_customer`, `no_meja`, `Kritik`, `Saran`, `submited_time`) VALUES
(1, '0', 1, 'lebih banyak menu', 'Lebih banyak menu', '2026-04-30 11:33:39'),
(2, '0', 5, 'Tidak ada', 'Tidak ada', '2026-04-30 11:35:28'),
(3, '0', 5, 'Sudah bagus', 'Sudah bagus', '2026-04-30 14:00:03'),
(4, 'Peter', 4, 'Kurang games', 'boleh ditambahkan games', '2026-05-07 11:05:42');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL,
  `kategori_menu` varchar(255) NOT NULL,
  `menu_price` int(11) NOT NULL,
  `deskripsi_menu` text NOT NULL,
  `adds_on` text NOT NULL,
  `menu_status` enum('Tersedia','Habis') NOT NULL DEFAULT 'Tersedia',
  `gambar_menu` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `menu_name`, `kategori_menu`, `menu_price`, `deskripsi_menu`, `adds_on`, `menu_status`, `gambar_menu`) VALUES
(9, 'Nasi Goreng Nusantara', 'Main Course', 42000, 'Nasi dengan bumbu rempah Nusantara, telur ceplok, ayam, dan pangsit', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000},{\"id\":\"tidak_pedes\",\"label\":\"Tidak pedes\",\"price\":0}]', 'Tersedia', '1778135776248.png'),
(10, 'Nasi Goreng Kecombrang', 'Main Course', 40000, 'Nasi dengan bumbu rempah kecombrang, telur orak-arik, ayam, teri medan dan pangsit.', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000},{\"id\":\"tidak_pedes\",\"label\":\"Tidak pedes\",\"price\":0}]', 'Tersedia', '1778136290304.png'),
(11, 'Nasi Telur khas Pontianak', 'Main Course', 30000, 'Nasi telur bumbu khas pontianak', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000}]', 'Tersedia', '1778136542673.png'),
(12, 'Nasi Telur Khas Thailand', 'Main Course', 30000, 'Nasi telur bumbu khas Thailand', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000}]', 'Tersedia', '1778136615819.png'),
(13, 'Rice Beef Creamy Buttermilk', 'Main Course', 48000, 'Nasi, beef slices, telur dan saus creamy buttermilk', '[{\"id\":\"nasi_wangi\",\"label\":\"Nasi wangi\",\"price\":5000},{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000}]', 'Tersedia', '1778136739586.png'),
(14, 'Pad Kra Pao Beef', 'Main Course', 45000, 'Nasi, daging, telur, daun kemanggi, kacang panjang khas Thailand', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000}]', 'Tersedia', '1778136819559.png'),
(15, 'Pad Kra Pao Chicken', 'Main Course', 40000, 'Nasi, ayam, telur, daun kemanggi, kacang panjang khas Thailand', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":7999}]', 'Tersedia', '1778136894649.png'),
(16, 'Pad Thai', 'Noodle', 45000, 'Mie khas Thailand, saus asam manis, ayam, udang, kacang, sayur', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000}]', 'Tersedia', '1778136996439.png'),
(17, 'Creamy Buttermilk Beef Pasta', 'Noodle', 45000, 'Spaghetti, saus buttermilk, smoked beef', '[]', 'Tersedia', '1778137097928.png'),
(18, 'Miesoa Mala Chicken', 'Noodle', 45000, 'Mie khas Tiongkok dengan kuah mala, ayam, telur dan sayuran', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":7997}]', 'Tersedia', '1778141233699.png'),
(19, 'Mie Rempah Nawa', 'Noodle', 30000, 'Mie khas Nawa dengan bumbu rempah Nusantara', '[{\"id\":\"telur\",\"label\":\"Telur\",\"price\":8000}]', 'Tersedia', '1778141380087.png'),
(20, 'Nawa Salad Wrap', 'Salad', 30000, 'Selada iceberg, wortel, jagung, tomat, kol ungu, ayam', '[]', 'Tersedia', '1778144436453.png'),
(21, 'Nawa Chicken Salad', 'Salad', 45000, 'Selada iceberg, wortel, jagung, tomat, kol ungu, ayam', '[]', 'Tersedia', '1778144561507.png'),
(22, 'Tape Cheese Roll', 'Snack', 34000, 'Tape, Keju, Kayu manis', '[]', 'Tersedia', '1778144632650.png'),
(23, 'Banana Boom', 'Snack', 30000, 'Pisang, Saus Cokelat, dan keju', '[]', 'Tersedia', '1778144709035.png'),
(24, 'Nawa Plater', 'Snack', 38000, 'Kentang Goreng, Sosis, dan Wonton', '[]', 'Tersedia', '1778144776078.png'),
(25, 'Tahu Cabai Garam', 'Snack', 32000, 'Tahu renyah dan bumbu asin Pedas', '[]', 'Tersedia', '1778144827657.png'),
(26, 'Caramel Macchiato', 'Coffee', 38000, 'Esspreso, susu, sirup caramel, saus caramel', '[{\"id\":\"less_ice\",\"label\":\"Less ice\",\"price\":0}]', 'Tersedia', '1778145020067.png'),
(27, 'Kopi Nawa', 'Coffee', 28000, 'Kopi susu gula aren', '[{\"id\":\"less_ice\",\"label\":\"Less ice\",\"price\":0}]', 'Tersedia', '1778145100282.png'),
(28, 'Popcorn Latte', 'Coffee', 38000, 'Esspreso, susu, sirup popcorn, popcorn', '[{\"id\":\"less_ice\",\"label\":\"Less Ice\",\"price\":0}]', 'Tersedia', '1778145207893.png'),
(29, 'Nawa Choco Mint', 'Non Coffee', 32000, 'Bubuk Cokelat dan sirup mint', '[]', 'Tersedia', '1778145334496.png');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `table_number` int(11) NOT NULL,
  `qr_token` varchar(255) NOT NULL,
  `status` enum('Pending','Diproses','Selesai','Dibatalkan') NOT NULL DEFAULT 'Pending',
  `total_price` float NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` enum('Cash','QRIS') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `table_number`, `qr_token`, `status`, `total_price`, `created_at`, `payment_method`) VALUES
(17, 1, '', 'Selesai', 54000, '2026-05-05 08:26:08', 'Cash'),
(18, 1, '', 'Selesai', 49000, '2026-05-05 14:50:39', 'QRIS'),
(19, 1, '', 'Selesai', 49000, '2026-05-05 14:54:45', 'QRIS'),
(20, 1, '', 'Selesai', 80000, '2026-05-06 03:19:45', 'QRIS'),
(22, 0, '', 'Selesai', 54000, '2026-05-07 00:38:27', 'Cash'),
(23, 1, '50803be5-ab1d-47b5-b902-e9d27686ec70', 'Selesai', 54000, '2026-05-07 01:01:19', 'Cash'),
(24, 4, '403f6149-379f-4755-a19f-0e6666cd0755', 'Selesai', 58000, '2026-05-07 01:02:40', 'QRIS'),
(25, 4, '403f6149-379f-4755-a19f-0e6666cd0755', 'Selesai', 50000, '2026-05-07 06:37:14', 'Cash'),
(26, 3, '7a19d899-da88-42ed-b27f-3342d8dd8dbf', 'Selesai', 85000, '2026-05-07 11:02:04', 'QRIS'),
(27, 1, '50803be5-ab1d-47b5-b902-e9d27686ec70', 'Dibatalkan', 86000, '2026-05-07 11:43:13', 'QRIS'),
(28, 1, '50803be5-ab1d-47b5-b902-e9d27686ec70', 'Selesai', 70000, '2026-05-07 11:45:43', 'Cash');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL,
  `menu_price` float NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `adds_on` varchar(255) NOT NULL,
  `subtotal` float NOT NULL,
  `kitchen_status` enum('Baru','Diproses','Selesao') NOT NULL DEFAULT 'Baru'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`item_id`, `order_id`, `menu_id`, `menu_name`, `menu_price`, `quantity`, `adds_on`, `subtotal`, `kitchen_status`) VALUES
(33, 17, 6, 'Creamy Buttermilk Beef Pasta', 30000, 1, '', 30000, ''),
(34, 17, 4, 'Manggo Matcha', 24000, 1, '', 24000, ''),
(35, 18, 5, 'Nawa Salad Wrap', 25000, 1, '', 25000, ''),
(36, 18, 7, 'Choco Sea Salt', 24000, 1, '', 24000, ''),
(37, 19, 7, 'Choco Sea Salt', 24000, 1, '', 24000, ''),
(38, 19, 5, 'Nawa Salad Wrap', 25000, 1, '', 25000, ''),
(39, 20, 5, 'Nawa Salad Wrap', 25000, 2, '', 50000, ''),
(40, 20, 6, 'Creamy Buttermilk Beef Pasta', 30000, 1, '', 30000, ''),
(43, 22, 6, 'Creamy Buttermilk Beef Pasta', 30000, 1, '', 30000, ''),
(44, 22, 7, 'Choco Sea Salt', 24000, 1, '', 24000, ''),
(45, 23, 6, 'Creamy Buttermilk Beef Pasta', 30000, 1, '', 30000, ''),
(46, 23, 7, 'Choco Sea Salt', 24000, 1, '', 24000, ''),
(47, 24, 6, 'Creamy Buttermilk Beef Pasta', 30000, 1, '', 30000, ''),
(48, 24, 2, 'Nawa Coffee', 28000, 1, '', 28000, ''),
(49, 25, 9, 'Nasi Goreng Nusantara', 50000, 1, 'Telur (+Rp8.000)', 50000, ''),
(50, 26, 13, 'Rice Beef Creamy Buttermilk', 53000, 1, 'Nasi wangi (+Rp5.000)', 53000, ''),
(51, 26, 29, 'Nawa Choco Mint', 32000, 1, '', 32000, ''),
(52, 27, 10, 'Nasi Goreng Kecombrang', 48000, 1, 'Telur (+Rp8.000)', 48000, 'Baru'),
(53, 27, 28, 'Popcorn Latte', 38000, 1, '', 38000, 'Baru'),
(54, 28, 12, 'Nasi Telur Khas Thailand', 38000, 1, 'Telur (+Rp8.000)', 38000, ''),
(55, 28, 29, 'Nawa Choco Mint', 32000, 1, '', 32000, '');

-- --------------------------------------------------------

--
-- Table structure for table `reservasi`
--

CREATE TABLE `reservasi` (
  `id_reservasi` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `guest` int(11) NOT NULL,
  `notes` text NOT NULL,
  `status` enum('Dikonfirmasi','Menunggu','Ditolak','Selesai') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservasi`
--

INSERT INTO `reservasi` (`id_reservasi`, `name`, `phone`, `email`, `event_type`, `date`, `time`, `guest`, `notes`, `status`, `created_at`) VALUES
(1, 'Yonathan', '2147483647', 'jonathans1604@gmail.com', 'Ulang Tahun', '2026-05-07', '10:00:00', 50, 'Dekorasi ulang tahun, dan makanan signature nawa', 'Selesai', '2026-05-01 07:00:58'),
(2, 'Aufa', '856889012', 'natlanvanmuezer@gmail.com', 'Meeting', '2026-05-22', '20:00:00', 4, 'Butuh kabel panjang', 'Selesai', '2026-05-06 03:12:48'),
(3, 'Arvin', '085695576332', 'arvin@gmail.com', 'Syukuran', '2026-05-08', '07:00:00', 31, 'Makanan Enak', 'Selesai', '2026-05-06 04:49:17'),
(4, 'Peter Yesaya', '089764756412', 'peteryesaya@gmail.com', 'Ulang Tahun', '2026-05-19', '12:00:00', 30, 'Dekorasi ulang tahun, balon ulang tahun', 'Selesai', '2026-05-07 11:04:35');

-- --------------------------------------------------------

--
-- Table structure for table `table`
--

CREATE TABLE `table` (
  `table_id` int(11) NOT NULL,
  `table_number` varchar(255) NOT NULL,
  `qr_token` varchar(255) NOT NULL,
  `qr_generated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `table`
--

INSERT INTO `table` (`table_id`, `table_number`, `qr_token`, `qr_generated`) VALUES
(1, '1', '50803be5-ab1d-47b5-b902-e9d27686ec70', '2026-05-06 10:21:34'),
(2, '2', '67abe195-926f-4c84-90f9-cc514537284f', '2026-05-06 16:42:14'),
(3, '3', '7a19d899-da88-42ed-b27f-3342d8dd8dbf', '2026-05-06 16:42:16'),
(4, '4', '403f6149-379f-4755-a19f-0e6666cd0755', '2026-05-06 16:42:38'),
(5, '5', '1f1388fa-dfb6-450a-b00d-62f1cae0fc82', '2026-05-07 18:26:26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`) VALUES
(1, 'Elsa Devita', '1234', 'admin'),
(2, 'jonathans', '486901', 'admin'),
(3, 'Sari Dewi', 'dewisari1', 'dapur'),
(4, 'aufa', 'aufa1', 'kasir'),
(5, 'budi', '4567', 'dapur'),
(6, 'arvin', 'arvin1', 'owner');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id_form`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_items_ibfk_1` (`order_id`);

--
-- Indexes for table `reservasi`
--
ALTER TABLE `reservasi`
  ADD PRIMARY KEY (`id_reservasi`);

--
-- Indexes for table `table`
--
ALTER TABLE `table`
  ADD PRIMARY KEY (`table_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id_form` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `reservasi`
--
ALTER TABLE `reservasi`
  MODIFY `id_reservasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `table`
--
ALTER TABLE `table`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

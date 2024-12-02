
CREATE TABLE `attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(2) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` ( `name`, `is_deleted`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
( 'Color', 1, '2024-10-23 06:30:51', '', '2024-10-25 06:35:14', NULL),
( 'Size', 1, '2024-10-23 06:30:59', '', '2024-10-25 06:35:14', NULL),
( 'Part No', 1, '2024-10-23 10:49:30', '', '2024-10-23 12:06:43', NULL),
( 'Style', 1, '2024-10-23 11:32:23', '', '2024-10-25 06:35:14', NULL),
( 'Material', 1, '2024-10-23 11:33:31', '', '2024-10-25 06:35:14', NULL),
( 'Attribute 1', 1, '2024-10-25 06:36:25', '', '2024-10-25 12:39:23', NULL),
( 'B', 0, '2024-10-28 06:29:28', '', '2024-10-28 06:29:28', NULL),
( 'Roll', 1, '2024-10-25 12:41:56', '', '2024-10-28 06:26:43', NULL),
( 'Type', 1, '2024-10-25 12:41:59', '', '2024-10-28 06:26:43', NULL),
( 'A', 0, '2024-10-28 06:29:22', '', '2024-10-28 06:29:22', NULL),
( 'Attribute 3', 1, '2024-10-25 06:36:41', '', '2024-10-25 12:39:23', NULL),
( 'Colour', 1, '2024-10-25 12:39:36', '', '2024-10-28 06:26:43', NULL),
( 'Attribute 4', 1, '2024-10-25 06:36:47', '', '2024-10-25 12:39:23', NULL),
( 'Size', 1, '2024-10-25 12:39:33', '', '2024-10-28 06:26:43', NULL),
( 'Attribute 2', 1, '2024-10-25 06:36:34', '', '2024-10-25 12:39:23', NULL),
( 'Size', 0, '2024-10-28 06:28:51', '', '2024-10-28 06:28:51', NULL),
( 'Bolt', 0, '2024-10-28 06:29:39', '', '2024-10-28 06:29:39', NULL),
( 'add', 1, '2024-10-28 09:37:55', '', '2024-10-28 09:38:02', NULL),
( 'yaseen attribute', 1, '2024-10-28 09:38:18', '', '2024-10-28 09:38:32', NULL),
( 'azeem,', 1, '2024-10-28 09:39:16', '', '2024-10-28 09:40:05', NULL),
( 'cfasf', 1, '2024-10-28 09:39:34', '', '2024-10-28 09:40:05', NULL),
( 'test', 1, '2024-10-28 09:47:34', '', '2024-10-28 09:47:41', NULL),
( 'colour', 0, '2024-10-29 08:52:45', '', '2024-10-29 08:52:45', NULL),
( 'Wall thickness', 0, '2024-10-29 08:53:00', '', '2024-10-29 08:53:00', NULL),
( 'Voltage', 0, '2024-11-06 07:08:41', '', '2024-11-06 07:08:41', NULL),
( 'Margins', 0, '2024-11-18 13:16:49', '', '2024-11-18 13:16:49', NULL);




CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
);




CREATE TABLE `favourites` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);



CREATE TABLE `orders` (
  `id` char(40) NOT NULL,
  `order_no` char(40) NOT NULL,
  `document_no` int(11) NOT NULL DEFAULT 0,
  `order_date` date DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `total_amount` decimal(10,0) NOT NULL DEFAULT 0,
  `delivery_date` date DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `cancel_reason` text DEFAULT NULL,
  `cancelled_by` char(40) DEFAULT NULL,
  `status` enum('Pending','In Progress','Shipped','Cancelled') NOT NULL DEFAULT 'Pending',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) NOT NULL,
  PRIMARY KEY (`id`)
) ;



CREATE TABLE `order_detail` (
  `id` char(40) NOT NULL,
  `order_id` char(40) DEFAULT NULL,
  `product_id` char(40) DEFAULT NULL,
  `variant_id` char(40) DEFAULT NULL,
  `price` decimal(10,0) NOT NULL DEFAULT 0,
  `quantity` decimal(10,0) NOT NULL DEFAULT 0,
  `amount` decimal(10,0) NOT NULL DEFAULT 0,
  `sort_order` tinyint(2) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);



TRUNCATE TABLE parlour_module;
INSERT INTO `parlour_module` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Parlour Style', 1, '2024-08-06 07:06:35', NULL),
(2, 'Cow Standing', 1, '2024-08-06 07:06:35', NULL),
(3, 'Type of Cows', 1, '2024-08-06 07:06:35', NULL),
(4, 'Electricity', 1, '2024-08-06 07:06:35', NULL),
(5, 'Installation', 1, '2024-08-06 07:06:35', NULL),
(6, 'Delivery', 1, '2024-08-06 07:06:35', NULL),
(7, 'Rump Rails', 1, '2024-08-06 07:06:35', NULL),
(8, 'Front Guide Rails', 1, '2024-08-06 07:06:35', NULL),
(9, 'Back Guide rails', 1, '2024-08-06 07:06:35', NULL),
(10, 'Front Exit Gates', 1, '2024-08-06 07:06:35', NULL),
(11, 'Back Entrance Gates', 1, '2024-08-06 07:06:35', NULL),
(12, 'Gate control', 1, '2024-08-06 07:06:35', NULL),
(13, 'Pit Kerb Rail', 1, '2024-08-06 07:06:35', NULL),
(14, 'Stalling', 1, '2024-08-06 07:06:35', NULL),
(15, 'Stalling Extras', 1, '2024-08-06 07:06:35', NULL),
(16, 'Herringbone Vacuum Line', 1, '2024-08-06 07:06:35', '2024-11-14 11:40:53'),
(17, 'Vacuum Outfit', 1, '2024-08-06 07:06:35', NULL),
(18, 'Pump Type', 1, '2024-08-06 07:06:35', NULL),
(19, 'Pulsation System', 1, '2024-08-06 07:06:35', NULL),
(20, 'Pulsation Type', 1, '2024-08-06 07:06:35', NULL),
(21, 'Cluster Units', 1, '2024-08-06 07:06:35', NULL),
(22, 'Herringbone Cluster Support', 1, '2024-08-06 07:06:35', '2024-11-15 09:59:23'),
(23, 'Delivery Milk Pump', 1, '2024-08-06 07:06:35', '2024-11-14 11:32:21'),
(24, 'Inline Filters', 1, '2024-08-06 07:06:35', NULL),
(25, 'Plate Cooler', 1, '2024-08-06 07:06:35', NULL),
(26, 'Bulk Tank Filling', 1, '2024-08-06 07:06:35', NULL),
(28, 'Bucket Assembly', 1, '2024-08-06 07:06:35', NULL),
(29, 'Bucket Qty', 1, '2024-08-06 07:06:35', NULL),
(30, 'Unit Control', 1, '2024-08-06 07:06:35', NULL),
(31, 'Milk Sensor', 1, '2024-08-06 07:06:35', NULL),
(32, 'Sampling Device', 1, '2024-08-06 07:06:35', NULL),
(33, 'Herringbone Easy Start', 1, '2024-08-06 07:06:35', '2024-11-14 12:08:18'),
(34, 'Parlour Identification', 1, '2024-08-06 07:06:35', NULL),
(35, 'Transponder Type', 1, '2024-08-06 07:06:35', NULL),
(36, 'CIP', 1, '2024-08-06 07:06:35', NULL),
(37, 'System', 1, '2024-08-06 07:06:35', NULL),
(38, 'Chemical Pumps', 1, '2024-08-06 07:06:35', NULL),
(39, 'Herringbone Parlour wash drops', 1, '2024-08-06 07:06:35', '2024-11-15 10:12:12'),
(40, 'Wash pump unit', 1, '2024-08-06 07:06:35', NULL),
(41, 'Animal Handling', 1, '2024-08-06 07:06:35', NULL),
(42, 'Crowd gate', 1, '2024-08-06 07:06:35', NULL),
(43, 'Animal Teat spray', 1, '2024-08-06 07:06:35', '2024-11-11 12:30:32'),
(44, 'Udder washer', 1, '2024-08-06 07:06:35', NULL),
(45, 'Smart Collar Type', 1, '2024-08-06 07:06:35', NULL),
(46, 'Extender Unit', 1, '2024-08-06 07:06:35', NULL),
(47, 'Feed units', 1, '2024-08-06 07:06:35', NULL),
(48, 'In Parlour Feed control', 1, '2024-08-06 07:06:35', NULL),
(50, 'Touch Screen', 1, '2024-09-05 10:01:39', NULL),
(51, 'Voice Assist', 1, '2024-09-05 10:01:39', NULL),
(52, 'Herd Teat Spray', 1, '2024-11-11 12:29:38', NULL),
(53, 'Leg Dividers', 1, '2024-11-11 12:39:29', NULL),
(54, 'Rota Clean Wash Boom', 1, '2024-11-11 12:46:52', NULL),
(55, 'Rotary Style', 1, '2024-11-11 12:46:52', '2024-11-13 04:56:08'),
(56, 'Rotary Deck', 1, '2024-11-14 09:54:08', '2024-11-14 10:01:02'),
(57, 'Bail Type', 1, '2024-11-14 09:54:08', '2024-11-14 10:01:13'),
(58, 'Retention Arms', 1, '2024-11-14 09:54:45', '2024-11-14 10:06:50'),
(59, 'Rotary Pro Floor', 1, '2024-11-14 09:54:45', '2024-11-14 10:05:47'),
(60, 'Rotation', 1, '2024-11-14 09:57:25', '2024-11-14 10:05:33'),
(61, 'Pace Entrance System', 1, '2024-11-14 09:57:25', '2024-11-14 10:05:25'),
(62, 'Outer Nib', 1, '2024-11-14 09:57:54', '2024-11-14 10:05:59'),
(63, 'Inner Nib', 1, '2024-11-14 09:57:54', '2024-11-14 10:06:12'),
(64, 'Pro Floor', 1, '2024-11-14 09:58:43', '2024-11-14 10:06:22'),
(65, 'Rail Ramp', 1, '2024-11-14 09:59:26', '2024-11-14 10:14:15'),
(66, 'Diversion Milk Pump', 1, '2024-11-14 11:33:02', NULL),
(67, 'Rotary Vacuum Line', 1, '2024-11-14 11:41:52', NULL),
(68, 'Rotary Easy Start', 1, '2024-11-14 12:07:52', '2024-11-14 12:09:29'),
(69, 'Feed Types', 1, '2024-11-15 06:03:18', '2024-11-15 06:03:53'),
(70, 'Feed Control', 1, '2024-11-15 06:03:18', NULL),
(71, 'Feeding Troughs', 1, '2024-11-15 06:03:41', NULL),
(72, 'Rotary Cluster Support', 1, '2024-11-15 09:59:58', NULL),
(73, 'Rotary Parlour Wash Drops', 1, '2024-11-15 10:06:53', '2024-11-15 10:12:21');





CREATE TABLE `products` (
  `id` char(40) NOT NULL,
  `product_category_id` char(40) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `label_tags` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by` varchar(40) DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `updated_by` varchar(40) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `schedule_date` date DEFAULT NULL,
  `schedule_time` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);



CREATE TABLE `product_attributes` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `attribute_id` int(11) DEFAULT NULL,
  `attribute_name` varchar(255) DEFAULT NULL,
  `sort_order` tinyint(2) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ;



CREATE TABLE `product_cart` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `variant_id` char(40) DEFAULT NULL,
  `quantity` decimal(10,0) NOT NULL DEFAULT 0,
  `price` decimal(10,0) NOT NULL DEFAULT 0,
  `amount` decimal(10,0) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
);



CREATE TABLE `product_categories` (
  `id` char(40) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);



CREATE TABLE `product_images` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);



CREATE TABLE `product_variants` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `part_number` varchar(255) DEFAULT NULL,
  `price` decimal(10,0) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) NOT NULL,
  PRIMARY KEY (`id`)
);



CREATE TABLE `product_variant_attributes` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `variant_id` char(40) DEFAULT NULL,
  `attribute_id` int(11) DEFAULT NULL,
  `attribute_name` varchar(255) DEFAULT NULL,
  `attribute_value` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
);


Drop Table quote_request;
CREATE TABLE `quote_request` (
  `id` char(40) NOT NULL,
  `document_no` char(40) DEFAULT NULL,
  `document_date` date DEFAULT NULL,
  `request_type` tinyint(2) NOT NULL DEFAULT 1,
  `name` varchar(255) DEFAULT NULL,
  `house` varchar(255) DEFAULT NULL,
  `road` varchar(255) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `county_id` varchar(255) DEFAULT NULL,
  `country_id` char(40) DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `parlour_style_id` char(40) DEFAULT NULL,
  `rotary_style_id` char(40) DEFAULT NULL,
  `no_of_milking_units` char(40) DEFAULT NULL,
  `no_of_cow_stalls` int(11) DEFAULT NULL,
  `cow_standing_id` char(40) DEFAULT NULL,
  `type_of_cow_id` char(40) DEFAULT NULL,
  `no_of_cows` int(11) DEFAULT NULL,
  `electricity_id` char(40) DEFAULT NULL,
  `express_fit` tinyint(1) DEFAULT 1,
  `installation_id` char(40) DEFAULT NULL,
  `delivery_id` char(40) DEFAULT NULL,
  `est_delivery_date` date DEFAULT NULL,
  `rotary_deck_id` char(40) DEFAULT NULL,
  `bail_type_id` char(40) DEFAULT NULL,
  `pace_entrance` tinyint(1) NOT NULL DEFAULT 0,
  `pace_entrance_system_id` char(40) DEFAULT NULL,
  `retention_arm_id` char(40) DEFAULT NULL,
  `rotary_pro_floor_id` char(40) DEFAULT NULL,
  `in_parlour_feeding` tinyint(1) NOT NULL DEFAULT 0,
  `rotation_id` char(40) DEFAULT NULL,
  `rail_ramp_id` char(40) DEFAULT NULL,
  `outer_nib_id` char(40) DEFAULT NULL,
  `inner_nib_id` char(40) DEFAULT NULL,
  `pro_floor_id` char(40) DEFAULT NULL,
  `rump_rail_id` char(40) DEFAULT NULL,
  `front_guide_rail_id` char(40) DEFAULT NULL,
  `back_guide_rail_id` char(40) DEFAULT NULL,
  `front_exit_gate_id` char(40) DEFAULT NULL,
  `back_entrance_gate_id` char(40) DEFAULT NULL,
  `gate_control_id` char(40) DEFAULT NULL,
  `pit_kerb_rail_id` char(40) DEFAULT NULL,
  `stalling_id` char(40) DEFAULT NULL,
  `stalling_extra_id` char(40) DEFAULT NULL,
  `parlour_stall_extras` varchar(255) DEFAULT NULL,
  `herringbone_vacuum_line_id` char(40) DEFAULT NULL,
  `rotary_vacuum_line_id` char(40) DEFAULT NULL,
  `vacuum_outfit_id` char(40) DEFAULT NULL,
  `pump_type_id` char(40) DEFAULT NULL,
  `motors` tinyint(1) DEFAULT 0,
  `vdrive_system` tinyint(1) DEFAULT 0,
  `pulsation_system_id` char(40) DEFAULT NULL,
  `pulsation_type_id` char(40) DEFAULT NULL,
  `fresh_air_line` tinyint(2) NOT NULL DEFAULT 0,
  `cluster_unit_id` char(40) DEFAULT NULL,
  `herringbone_cluster_support_id` char(40) DEFAULT NULL,
  `rotary_cluster_support_id` char(40) DEFAULT NULL,
  `delivery_milk_pump_id` char(40) DEFAULT NULL,
  `mdrive_system` tinyint(1) DEFAULT 0,
  `delivery_receiving_vessel` tinyint(1) DEFAULT 0,
  `sanitary_vessel` tinyint(1) DEFAULT 0,
  `milk_wash_line` tinyint(1) DEFAULT 0,
  `inline_filters` enum('Reusable Filter','Standard Filter') DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `airforce_air_purge` tinyint(1) DEFAULT 0,
  `plate_cooler_id` char(40) DEFAULT NULL,
  `plate_cooler_solenoid` tinyint(1) DEFAULT 0,
  `bulk_tank_filling_id` char(40) DEFAULT NULL,
  `divert_line` tinyint(1) DEFAULT 0,
  `diversion_milk_pump_id` char(40) DEFAULT NULL,
  `diversion_receiving_vessel` tinyint(1) DEFAULT 0,
  `easy_milk_line` tinyint(1) DEFAULT 0,
  `rotary_easy_start_id` char(40) DEFAULT NULL,
  `bucket_assembly_id` char(40) DEFAULT NULL,
  `bucket_qty_id` char(40) DEFAULT NULL,
  `unit_control_id` char(40) DEFAULT NULL,
  `milk_sensor_id` char(40) DEFAULT NULL,
  `sampling_device_id` char(40) DEFAULT NULL,
  `herringbone_easy_start_id` char(40) DEFAULT NULL,
  `parlour_identification_id` char(40) DEFAULT NULL,
  `transponder_type_id` char(40) DEFAULT NULL,
  `touch_screen` tinyint(1) DEFAULT 0,
  `voice_assist` tinyint(1) DEFAULT 0,
  `vision_herd_management_extras` varchar(255) DEFAULT NULL,
  `cip_id` char(40) DEFAULT NULL,
  `daytona_wash` tinyint(1) DEFAULT 0,
  `chemical_pump_id` char(40) DEFAULT NULL,
  `system_id` char(40) DEFAULT NULL,
  `water_boiler` tinyint(1) DEFAULT 0,
  `water_heater` tinyint(1) DEFAULT 0,
  `rota_clean_wash_boom_id` char(40) DEFAULT NULL,
  `rotary_platform_brush` tinyint(1) NOT NULL DEFAULT 0,
  `herringbone_parlour_wash_drop_id` char(40) DEFAULT NULL,
  `rotary_parlour_wash_drop_id` char(40) DEFAULT NULL,
  `wash_boom` tinyint(1) DEFAULT 0,
  `skirt_wash_brush` tinyint(1) NOT NULL DEFAULT 0,
  `wash_pump_unit_id` char(40) DEFAULT NULL,
  `animal_handling_id` char(40) DEFAULT NULL,
  `crowd_gate_id` char(40) DEFAULT NULL,
  `width` float DEFAULT NULL,
  `length` float DEFAULT NULL,
  `airstream_cluster_flush` tinyint(1) NOT NULL DEFAULT 0,
  `herd_teat_spray_id` char(40) DEFAULT NULL,
  `animal_teat_spray_id` char(40) DEFAULT NULL,
  `udder_washer_id` char(40) DEFAULT NULL,
  `smart_collar_type_id` char(40) DEFAULT NULL,
  `base_station` tinyint(1) DEFAULT 0,
  `extender_unit_id` char(40) DEFAULT NULL,
  `nedap_now` tinyint(1) DEFAULT 0,
  `feed_unit_id` char(40) DEFAULT NULL,
  `feed_hooper` tinyint(1) NOT NULL DEFAULT 0,
  `feed_type_id` char(40) DEFAULT NULL,
  `feed_control_id` char(40) DEFAULT NULL,
  `extra_long_auger` tinyint(1) NOT NULL DEFAULT 0,
  `feeding_trough_id` char(40) DEFAULT NULL,
  `feed_system_protection_rails` tinyint(1) DEFAULT 0,
  `in_parlour_feed_control_id` char(40) DEFAULT NULL,
  `leg_divider_id` char(40) DEFAULT NULL,
  `flex_auger_system` tinyint(1) NOT NULL DEFAULT 0,
  `drop_box_assembly` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('Draft','Submitted','Under Review','Processed','Expired') NOT NULL DEFAULT 'Draft',
  `assignee` char(40) DEFAULT NULL,
  `submitted_by` char(40) DEFAULT NULL,
  `submitted_date` date DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `final_quote` varchar(255) DEFAULT NULL,
  `final_quote_path` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
);





TRUNCATE TABLE _control_access;
INSERT INTO `_control_access` (`control_access_id`, `module_name`, `form_name`, `route`, `permission_id`, `permission_name`, `sort_order`) VALUES
(1, 'Administrator', 'User Permission', 'user_permission', 'list', 'List', 1.101),
(2, 'Administrator', 'User Permission', 'user_permission', 'add', 'Add', 1.102),
(3, 'Administrator', 'User Permission', 'user_permission', 'edit', 'Edit', 1.103),
(4, 'Administrator', 'User Permission', 'user_permission', 'delete', 'Delete', 1.104),
(5, 'Administrator', 'User', 'user', 'list', 'List', 1.201),
(6, 'Administrator', 'User', 'user', 'add', 'Add', 1.202),
(7, 'Administrator', 'User', 'user', 'edit', 'Edit', 1.203),
(8, 'Administrator', 'User', 'user', 'delete', 'Delete', 1.204),
(9, 'Administrator', 'Settings', 'settings', 'list', 'List', 1.204),
(10, 'Quote Management', 'Parlour Master', 'parlour-master', 'list', 'List', 1.201),
(11, 'Quote Management', 'Parlour Master', 'parlour-master', 'add', 'Add', 1.202),
(12, 'Quote Management', 'Parlour Master', 'parlour-master', 'edit', 'Edit', 1.203),
(13, 'Quote Management', 'Parlour Master', 'parlour-master', 'delete', 'Delete', 1.204),
(14, 'Quote Management', 'Parlour Request', 'parlour-request', 'list', 'List', 1.201),
(15, 'Quote Management', 'Parlour Request', 'parlour-request', 'add', 'Add', 1.202),
(16, 'Quote Management', 'Parlour Request', 'parlour-request', 'edit', 'Edit', 1.203),
(17, 'Quote Management', 'Parlour Request', 'parlour-request', 'delete', 'Delete', 1.204),
(18, 'Product Management', 'Attribute', 'attribute', 'list', 'List', 1.204),
(19, 'Product Management', 'Attribute', 'attribute', 'add', 'Add', 1.204),
(20, 'Product Management', 'Attribute', 'attribute', 'edit', 'Edit', 1.204),
(21, 'Product Management', 'Attribute', 'attribute', 'delete', 'Delete', 1.204),
(22, 'Product Management', 'Product Category', 'product-category', 'list', 'List', 1.204),
(23, 'Product Management', 'Product Category', 'product-category', 'add', 'Add', 1.204),
(24, 'Product Management', 'Product Category', 'product-category', 'edit', 'Edit', 1.204),
(25, 'Product Management', 'Product Category', 'product-category', 'delete', 'Delete', 1.204),
(26, 'Product Management', 'Product', 'product', 'list', 'List', 1.204),
(27, 'Product Management', 'Product', 'product', 'add', 'Add', 1.204),
(28, 'Product Management', 'Product', 'product', 'edit', 'Edit', 1.204),
(29, 'Product Management', 'Product', 'product', 'delete', 'Delete', 1.204),
(30, 'Product Management', 'Shop', 'shop', 'list', 'List', 1.204),
(34, 'Order Management', 'Order', 'order', 'list', 'List', 1.204),
(35, 'Order Management', 'Order', 'order', 'view', 'View', 1.204),
(36, 'Order Management', 'Order', 'order', 'edit', 'Edit', 1.204);
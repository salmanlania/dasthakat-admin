DROP Table user;
CREATE TABLE `user` (
  `id` char(40) NOT NULL,
  `user_type` enum('Internal','Dealer') DEFAULT 'Internal',
  `permission_id` int(11) DEFAULT NULL,
  `name` char(40) NOT NULL,
  `email` char(40) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_no` char(40) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `dealer_id` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `site_url` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `api_token` varchar(255) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(2) NOT NULL DEFAULT 0,
  `is_change_password` tinyint(2) NOT NULL DEFAULT 0,
  `last_login` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP Table parlour_module;
CREATE TABLE `parlour_module` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
   PRIMARY KEY (`id`)
);

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
(16, 'Vacuum Line', 1, '2024-08-06 07:06:35', NULL),
(17, 'Vacuum Outfit', 1, '2024-08-06 07:06:35', NULL),
(18, 'Pump Type', 1, '2024-08-06 07:06:35', NULL),
(19, 'Pulsation System', 1, '2024-08-06 07:06:35', NULL),
(20, 'Pulsation Type', 1, '2024-08-06 07:06:35', NULL),
(21, 'Cluster Units', 1, '2024-08-06 07:06:35', NULL),
(22, 'Cluster Support', 1, '2024-08-06 07:06:35', NULL),
(23, 'Milk Pump', 1, '2024-08-06 07:06:35', NULL),
(24, 'Inline Filters', 1, '2024-08-06 07:06:35', NULL),
(25, 'Plate Cooler', 1, '2024-08-06 07:06:35', NULL),
(26, 'Bulk Tank Filling', 1, '2024-08-06 07:06:35', NULL),
(27, 'Milk Pump', 1, '2024-08-06 07:06:35', NULL),
(28, 'Bucket Assembly', 1, '2024-08-06 07:06:35', NULL),
(29, 'Bucket Qty', 1, '2024-08-06 07:06:35', NULL),
(30, 'Unit Control', 1, '2024-08-06 07:06:35', NULL),
(31, 'Milk Sensor', 1, '2024-08-06 07:06:35', NULL),
(32, 'Sampling Device', 1, '2024-08-06 07:06:35', NULL),
(33, 'Easy Start', 1, '2024-08-06 07:06:35', NULL),
(34, 'Parlour Identification', 1, '2024-08-06 07:06:35', NULL),
(35, 'Transponder Type', 1, '2024-08-06 07:06:35', NULL),
(36, 'CIP', 1, '2024-08-06 07:06:35', NULL),
(37, 'System', 1, '2024-08-06 07:06:35', NULL),
(38, 'Chemical Pumps', 1, '2024-08-06 07:06:35', NULL),
(39, 'Parlour wash drops', 1, '2024-08-06 07:06:35', NULL),
(40, 'Wash pump unit', 1, '2024-08-06 07:06:35', NULL),
(41, 'Animal Handling', 1, '2024-08-06 07:06:35', NULL),
(42, 'Crowd gate', 1, '2024-08-06 07:06:35', NULL),
(43, 'Teat spray', 1, '2024-08-06 07:06:35', NULL),
(44, 'Udder washer', 1, '2024-08-06 07:06:35', NULL),
(45, 'Smart Collar Type', 1, '2024-08-06 07:06:35', NULL),
(46, 'Extender Unit', 1, '2024-08-06 07:06:35', NULL),
(47, 'Feed units', 1, '2024-08-06 07:06:35', NULL),
(48, 'In Parlour Feed control', 1, '2024-08-06 07:06:35', NULL),
(49, 'Number of feed types', 1, '2024-08-06 07:06:35', NULL);


DROP Table parlour_master;
CREATE TABLE `parlour_master` (
  `id` char(40) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) 



DROP Table countries;
CREATE TABLE `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dial_code` char(40) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` char(40) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
   PRIMARY KEY (`id`)
);

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `dial_code`, `name`, `code`, `created_at`, `updated_at`) VALUES
(1, '+93', 'Afghanistan', 'AF', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(2, '+358', 'Aland Islands', 'AX', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(3, '+355', 'Albania', 'AL', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(4, '+213', 'Algeria', 'DZ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(5, '+1684', 'AmericanSamoa', 'AS', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(6, '+376', 'Andorra', 'AD', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(7, '+244', 'Angola', 'AO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(8, '+1264', 'Anguilla', 'AI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(9, '+672', 'Antarctica', 'AQ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(10, '+1268', 'Antigua and Barbuda', 'AG', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(11, '+54', 'Argentina', 'AR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(12, '+374', 'Armenia', 'AM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(13, '+297', 'Aruba', 'AW', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(14, '+61', 'Australia', 'AU', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(15, '+43', 'Austria', 'AT', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(16, '+994', 'Azerbaijan', 'AZ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(17, '+1242', 'Bahamas', 'BS', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(18, '+973', 'Bahrain', 'BH', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(19, '+880', 'Bangladesh', 'BD', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(20, '+1246', 'Barbados', 'BB', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(21, '+375', 'Belarus', 'BY', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(22, '+32', 'Belgium', 'BE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(23, '+501', 'Belize', 'BZ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(24, '+229', 'Benin', 'BJ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(25, '+1441', 'Bermuda', 'BM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(26, '+975', 'Bhutan', 'BT', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(27, '+591', 'Bolivia, Plurinational State of', 'BO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(28, '+387', 'Bosnia and Herzegovina', 'BA', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(29, '+267', 'Botswana', 'BW', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(30, '+55', 'Brazil', 'BR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(31, '+246', 'British Indian Ocean Territory', 'IO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(32, '+673', 'Brunei Darussalam', 'BN', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(33, '+359', 'Bulgaria', 'BG', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(34, '+226', 'Burkina Faso', 'BF', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(35, '+257', 'Burundi', 'BI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(36, '+855', 'Cambodia', 'KH', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(37, '+237', 'Cameroon', 'CM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(38, '+1', 'Canada', 'CA', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(39, '+238', 'Cape Verde', 'CV', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(40, '+ 345', 'Cayman Islands', 'KY', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(41, '+236', 'Central African Republic', 'CF', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(42, '+235', 'Chad', 'TD', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(43, '+56', 'Chile', 'CL', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(44, '+86', 'China', 'CN', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(45, '+61', 'Christmas Island', 'CX', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(46, '+61', 'Cocos (Keeling) Islands', 'CC', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(47, '+57', 'Colombia', 'CO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(48, '+269', 'Comoros', 'KM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(49, '+242', 'Congo', 'CG', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(50, '+243', 'Congo, The Democratic Republic of the Congo', 'CD', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(51, '+682', 'Cook Islands', 'CK', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(52, '+506', 'Costa Rica', 'CR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(53, '+225', 'Cote d\'Ivoire', 'CI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(54, '+385', 'Croatia', 'HR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(55, '+53', 'Cuba', 'CU', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(56, '+357', 'Cyprus', 'CY', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(57, '+420', 'Czech Republic', 'CZ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(58, '+45', 'Denmark', 'DK', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(59, '+253', 'Djibouti', 'DJ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(60, '+1767', 'Dominica', 'DM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(61, '+1849', 'Dominican Republic', 'DO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(62, '+593', 'Ecuador', 'EC', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(63, '+20', 'Egypt', 'EG', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(64, '+503', 'El Salvador', 'SV', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(65, '+240', 'Equatorial Guinea', 'GQ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(66, '+291', 'Eritrea', 'ER', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(67, '+372', 'Estonia', 'EE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(68, '+251', 'Ethiopia', 'ET', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(69, '+500', 'Falkland Islands (Malvinas)', 'FK', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(70, '+298', 'Faroe Islands', 'FO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(71, '+679', 'Fiji', 'FJ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(72, '+358', 'Finland', 'FI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(73, '+33', 'France', 'FR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(74, '+594', 'French Guiana', 'GF', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(75, '+689', 'French Polynesia', 'PF', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(76, '+241', 'Gabon', 'GA', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(77, '+220', 'Gambia', 'GM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(78, '+995', 'Georgia', 'GE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(79, '+49', 'Germany', 'DE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(80, '+233', 'Ghana', 'GH', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(81, '+350', 'Gibraltar', 'GI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(82, '+30', 'Greece', 'GR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(83, '+299', 'Greenland', 'GL', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(84, '+1473', 'Grenada', 'GD', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(85, '+590', 'Guadeloupe', 'GP', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(86, '+1671', 'Guam', 'GU', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(87, '+502', 'Guatemala', 'GT', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(88, '+44', 'Guernsey', 'GG', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(89, '+224', 'Guinea', 'GN', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(90, '+245', 'Guinea-Bissau', 'GW', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(91, '+595', 'Guyana', 'GY', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(92, '+509', 'Haiti', 'HT', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(93, '+379', 'Holy See (Vatican City State)', 'VA', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(94, '+504', 'Honduras', 'HN', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(95, '+852', 'Hong Kong', 'HK', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(96, '+36', 'Hungary', 'HU', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(97, '+354', 'Iceland', 'IS', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(98, '+91', 'India', 'IN', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(99, '+62', 'Indonesia', 'ID', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(100, '+98', 'Iran, Islamic Republic of Persian Gulf', 'IR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(101, '+964', 'Iraq', 'IQ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(102, '+353', 'Ireland', 'IE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(103, '+44', 'Isle of Man', 'IM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(104, '+972', 'Israel', 'IL', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(105, '+39', 'Italy', 'IT', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(106, '+1876', 'Jamaica', 'JM', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(107, '+81', 'Japan', 'JP', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(108, '+44', 'Jersey', 'JE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(109, '+962', 'Jordan', 'JO', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(110, '+77', 'Kazakhstan', 'KZ', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(111, '+254', 'Kenya', 'KE', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(112, '+686', 'Kiribati', 'KI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(113, '+850', 'Korea, Democratic People\'s Republic of Korea', 'KP', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(114, '+82', 'Korea, Republic of South Korea', 'KR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(115, '+965', 'Kuwait', 'KW', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(116, '+996', 'Kyrgyzstan', 'KG', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(117, '+856', 'Laos', 'LA', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(118, '+371', 'Latvia', 'LV', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(119, '+961', 'Lebanon', 'LB', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(120, '+266', 'Lesotho', 'LS', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(121, '+231', 'Liberia', 'LR', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(122, '+218', 'Libyan Arab Jamahiriya', 'LY', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(123, '+423', 'Liechtenstein', 'LI', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(124, '+370', 'Lithuania', 'LT', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(125, '+352', 'Luxembourg', 'LU', '2024-08-02 12:06:06', '2024-08-02 12:06:06'),
(126, '+853', 'Macao', 'MO', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(127, '+389', 'Macedonia', 'MK', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(128, '+261', 'Madagascar', 'MG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(129, '+265', 'Malawi', 'MW', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(130, '+60', 'Malaysia', 'MY', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(131, '+960', 'Maldives', 'MV', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(132, '+223', 'Mali', 'ML', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(133, '+356', 'Malta', 'MT', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(134, '+692', 'Marshall Islands', 'MH', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(135, '+596', 'Martinique', 'MQ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(136, '+222', 'Mauritania', 'MR', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(137, '+230', 'Mauritius', 'MU', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(138, '+262', 'Mayotte', 'YT', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(139, '+52', 'Mexico', 'MX', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(140, '+691', 'Micronesia, Federated States of Micronesia', 'FM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(141, '+373', 'Moldova', 'MD', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(142, '+377', 'Monaco', 'MC', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(143, '+976', 'Mongolia', 'MN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(144, '+382', 'Montenegro', 'ME', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(145, '+1664', 'Montserrat', 'MS', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(146, '+212', 'Morocco', 'MA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(147, '+258', 'Mozambique', 'MZ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(148, '+95', 'Myanmar', 'MM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(149, '+264', 'Namibia', 'NA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(150, '+674', 'Nauru', 'NR', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(151, '+977', 'Nepal', 'NP', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(152, '+31', 'Netherlands', 'NL', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(153, '+599', 'Netherlands Antilles', 'AN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(154, '+687', 'New Caledonia', 'NC', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(155, '+64', 'New Zealand', 'NZ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(156, '+505', 'Nicaragua', 'NI', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(157, '+227', 'Niger', 'NE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(158, '+234', 'Nigeria', 'NG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(159, '+683', 'Niue', 'NU', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(160, '+672', 'Norfolk Island', 'NF', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(161, '+1670', 'Northern Mariana Islands', 'MP', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(162, '+47', 'Norway', 'NO', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(163, '+968', 'Oman', 'OM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(164, '+92', 'Pakistan', 'PK', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(165, '+680', 'Palau', 'PW', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(166, '+970', 'Palestinian Territory, Occupied', 'PS', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(167, '+507', 'Panama', 'PA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(168, '+675', 'Papua New Guinea', 'PG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(169, '+595', 'Paraguay', 'PY', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(170, '+51', 'Peru', 'PE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(171, '+63', 'Philippines', 'PH', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(172, '+872', 'Pitcairn', 'PN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(173, '+48', 'Poland', 'PL', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(174, '+351', 'Portugal', 'PT', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(175, '+1939', 'Puerto Rico', 'PR', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(176, '+974', 'Qatar', 'QA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(177, '+40', 'Romania', 'RO', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(178, '+7', 'Russia', 'RU', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(179, '+250', 'Rwanda', 'RW', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(180, '+262', 'Reunion', 'RE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(181, '+590', 'Saint Barthelemy', 'BL', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(182, '+290', 'Saint Helena, Ascension and Tristan Da Cunha', 'SH', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(183, '+1869', 'Saint Kitts and Nevis', 'KN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(184, '+1758', 'Saint Lucia', 'LC', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(185, '+590', 'Saint Martin', 'MF', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(186, '+508', 'Saint Pierre and Miquelon', 'PM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(187, '+1784', 'Saint Vincent and the Grenadines', 'VC', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(188, '+685', 'Samoa', 'WS', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(189, '+378', 'San Marino', 'SM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(190, '+239', 'Sao Tome and Principe', 'ST', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(191, '+966', 'Saudi Arabia', 'SA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(192, '+221', 'Senegal', 'SN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(193, '+381', 'Serbia', 'RS', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(194, '+248', 'Seychelles', 'SC', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(195, '+232', 'Sierra Leone', 'SL', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(196, '+65', 'Singapore', 'SG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(197, '+421', 'Slovakia', 'SK', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(198, '+386', 'Slovenia', 'SI', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(199, '+677', 'Solomon Islands', 'SB', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(200, '+252', 'Somalia', 'SO', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(201, '+27', 'South Africa', 'ZA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(202, '+211', 'South Sudan', 'SS', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(203, '+500', 'South Georgia and the South Sandwich Islands', 'GS', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(204, '+34', 'Spain', 'ES', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(205, '+94', 'Sri Lanka', 'LK', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(206, '+249', 'Sudan', 'SD', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(207, '+597', 'Suriname', 'SR', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(208, '+47', 'Svalbard and Jan Mayen', 'SJ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(209, '+268', 'Swaziland', 'SZ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(210, '+46', 'Sweden', 'SE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(211, '+41', 'Switzerland', 'CH', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(212, '+963', 'Syrian Arab Republic', 'SY', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(213, '+886', 'Taiwan', 'TW', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(214, '+992', 'Tajikistan', 'TJ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(215, '+255', 'Tanzania, United Republic of Tanzania', 'TZ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(216, '+66', 'Thailand', 'TH', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(217, '+670', 'Timor-Leste', 'TL', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(218, '+228', 'Togo', 'TG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(219, '+690', 'Tokelau', 'TK', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(220, '+676', 'Tonga', 'TO', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(221, '+1868', 'Trinidad and Tobago', 'TT', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(222, '+216', 'Tunisia', 'TN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(223, '+90', 'Turkey', 'TR', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(224, '+993', 'Turkmenistan', 'TM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(225, '+1649', 'Turks and Caicos Islands', 'TC', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(226, '+688', 'Tuvalu', 'TV', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(227, '+256', 'Uganda', 'UG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(228, '+380', 'Ukraine', 'UA', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(229, '+971', 'United Arab Emirates', 'AE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(230, '+44', 'United Kingdom', 'GB', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(231, '+1', 'United States', 'US', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(232, '+598', 'Uruguay', 'UY', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(233, '+998', 'Uzbekistan', 'UZ', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(234, '+678', 'Vanuatu', 'VU', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(235, '+58', 'Venezuela, Bolivarian Republic of Venezuela', 'VE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(236, '+84', 'Vietnam', 'VN', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(237, '+1284', 'Virgin Islands, British', 'VG', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(238, '+1340', 'Virgin Islands, U.S.', 'VI', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(239, '+681', 'Wallis and Futuna', 'WF', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(240, '+967', 'Yemen', 'YE', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(241, '+260', 'Zambia', 'ZM', '2024-08-02 12:06:07', '2024-08-02 12:06:07'),
(242, '+263', 'Zimbabwe', 'ZW', '2024-08-02 12:06:07', '2024-08-02 12:06:07');


CREATE TABLE `parlour_master` (
  `id` char(40) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
   PRIMARY KEY (`id`)
);
-- Quote Request
DROP Table quote_request;

CREATE TABLE `quote_request` (
  `id` char(40) NOT NULL,
  `document_no` char(40) DEFAULT NULL,
  `document_date` date DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `house` varchar(255) DEFAULT NULL,
  `road` varchar(255) DEFAULT NULL,
  `town` varchar(255) DEFAULT NULL,
  `county_id` varchar(255) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `postcode` int(11) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `parlour_style_id` char(40) DEFAULT NULL,
  `no_of_milking_units` char(40) DEFAULT NULL,
  `no_of_cow_stats` int(11) DEFAULT NULL,
  `cow_standing_id` char(40) DEFAULT NULL,
  `type_of_cow_id` char(40) DEFAULT NULL,
  `no_of_cows` int(11) DEFAULT NULL,
  `electricity_id` char(40) DEFAULT NULL,
  `express_fit` tinyint(1) DEFAULT 1,
  `installation_id` char(40) DEFAULT NULL,
  `delivery_id` char(40) DEFAULT NULL,
  `est_delivery_date` date DEFAULT NULL,
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
  `vacuum_line_id` char(40) DEFAULT NULL,
  `vacuum_outfit_id` char(40) DEFAULT NULL,
  `pump_type_id` char(40) DEFAULT NULL,
  `motors` tinyint(1) DEFAULT 0,
  `vdrive_system` tinyint(1) DEFAULT 0,
  `pulsation_system_id` char(40) DEFAULT NULL,
  `pulsation_type_id` char(40) DEFAULT NULL,
  `fresh_air_line` tinyint(2) NOT NULL DEFAULT 0,
  `cluster_unit_id` char(40) DEFAULT NULL,
  `cluster_support_id` char(40) DEFAULT NULL,
  `delivery_milk_pump_id` char(40) DEFAULT NULL,
  `mdrive_system` tinyint(1) DEFAULT 0,
  `delivery_receiving_vessel` tinyint(1) DEFAULT 0,
  `sanitary_vessel` tinyint(1) DEFAULT 0,
  `milk_wash_line` tinyint(1) DEFAULT 0,
  `inline_filter_id` char(40) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `airforce_air_purge` tinyint(1) DEFAULT 0,
  `plate_cooler_id` char(40) DEFAULT NULL,
  `plate_cooler_solenoid` tinyint(1) DEFAULT 0,
  `bulk_tank_filling_id` int(11) DEFAULT NULL,
  `divert_line` tinyint(1) DEFAULT 0,
  `diversion_milk_pump_id` char(40) DEFAULT NULL,
  `diversion_receiving_vessel` tinyint(1) DEFAULT 0,
  `easy_milk_line` tinyint(1) DEFAULT 0,
  `bucket_assembly_id` char(40) DEFAULT NULL,
  `bucket_qty_id` char(40) DEFAULT NULL,
  `unit_control_id` char(40) DEFAULT NULL,
  `milk_sensor_id` char(40) DEFAULT NULL,
  `sampling_device_id` char(40) DEFAULT NULL,
  `easy_start_id` char(40) DEFAULT NULL,
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
  `parlour_wash_drop_id` char(40) DEFAULT NULL,
  `wash_pump_unit_id` char(40) DEFAULT NULL,
  `animal_handling_id` char(40) DEFAULT NULL,
  `crowd_gate_id` char(40) DEFAULT NULL,
  `width` float DEFAULT NULL,
  `length` float DEFAULT NULL,
  `airstream_cluster_flush` tinyint(1) NOT NULL DEFAULT 0,
  `teat_spray_id` char(40) DEFAULT NULL,
  `udder_washer_id` char(40) DEFAULT NULL,
  `smart_collar_type_id` char(40) DEFAULT NULL,
  `base_station` tinyint(1) DEFAULT 0,
  `extender_unit_id` char(40) DEFAULT NULL,
  `nedap_now` tinyint(1) DEFAULT 0,
  `feed_unit_id` char(40) DEFAULT NULL,
  `feed_system_protection_rails` tinyint(1) DEFAULT 0,
  `in_parlour_feed_control_id` char(40) DEFAULT NULL,
  `flex_auger_system` tinyint(1) NOT NULL DEFAULT 0,
  `drop_box_assembly` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('Draft','Under Review','Processed','Submitted') NOT NULL DEFAULT 'Draft',
  `assignee` char(40) DEFAULT NULL,
  `submitted_by` char(40) DEFAULT NULL,
  `submitted_date` date DEFAULT NULL,
  `comments` TEXT DEFAULT NULL,
  `final_quote` varchar(255) DEFAULT NULL,
  `final_quote_path` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) DEFAULT NULL,
   PRIMARY KEY (`id`)
);

DROP Table brun_feed_system;
CREATE TABLE `brun_feed_system` (
  `id` char(40) NOT NULL,
  `request_id` char(40) DEFAULT NULL,
  `feed_stations` int(11) DEFAULT NULL,
  `feed_type` char(40) DEFAULT NULL,
  `anti_bully_bars` tinyint(2) DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
   PRIMARY KEY (`id`)
);

DROP Table uploaded_files;
CREATE TABLE uploaded_files (
   `id` CHAR(40) NOT NULL,
   `request_id` CHAR(40),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
);


DROP Table setting;
CREATE TABLE setting (
    `id` CHAR(40) NOT NULL,
    `module` CHAR(255),
    `field` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`)
);


CREATE TABLE `log_history` (
  `id` char(40) NOT NULL,
  `request_id` char(40) DEFAULT NULL,
  `screen` varchar(255) DEFAULT NULL,
  `tab` int(11) NOT NULL,
  `json` text DEFAULT NULL,
  `created_by_id` char(40) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);


ALTER TABLE `quote_request` CHANGE `inline_filter_id` `inline_filters` ENUM('Reusable','Sock') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL;

DROP Table notifications;
CREATE TABLE `notifications` (
  `id` char(40) NOT NULL,
  `heading_text` char(40) DEFAULT NULL,
  `user_id` char(40) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `is_read` TINYINT(2) DEFAULT 0,
  `is_deleted` TINYINT(2) DEFAULT 0,
  `created_by` char(40) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` DATETIME on update CURRENT_TIMESTAMP NULL DEFAULT NULL ,
  PRIMARY KEY (`id`)
);

DROP Table messages;
CREATE TABLE `messages` (
  `id` char(40) NOT NULL,
  `request_id` char(40) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `file_name` varchar(255)DEFAULT NULL,
  `file_path` varchar(255)DEFAULT NULL,
  `created_by` char(40) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` DATETIME on update CURRENT_TIMESTAMP NULL DEFAULT NULL ,
  PRIMARY KEY (`id`)
);


ALTER TABLE `quote_request` ADD `comments` TEXT NULL DEFAULT NULL AFTER `submitted_date`;



Drop TABLE IF EXISTS attributes;
CREATE TABLE `attributes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(2) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` char(40) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_by` char(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

Drop TABLE IF EXISTS orders;
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
);

Drop TABLE IF EXISTS order_detail;
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

Drop TABLE IF EXISTS products;
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


Drop TABLE IF EXISTS product_attributes;
CREATE TABLE `product_attributes` (
  `id` char(40) NOT NULL,
  `product_id` char(40) DEFAULT NULL,
  `attribute_id` int(11) DEFAULT NULL,
  `attribute_name` varchar(255) DEFAULT NULL,
  `sort_order` tinyint(2) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);



Drop TABLE IF EXISTS product_cart;
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


Drop TABLE IF EXISTS product_categories;
CREATE TABLE `product_categories` (
  `id` char(40) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);


Drop TABLE IF EXISTS product_images;
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



Drop TABLE IF EXISTS product_variants;
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


Drop TABLE IF EXISTS product_variant_attributes;
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

Drop TABLE IF EXISTS setting;
CREATE TABLE `setting` (
  `id` char(40) NOT NULL,
  `module` char(255) DEFAULT NULL,
  `field` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);


Drop TABLE IF EXISTS uploaded_files;
CREATE TABLE `uploaded_files` (
  `id` char(40) NOT NULL,
  `request_id` char(40) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
);


Drop TABLE IF EXISTS _control_access;
CREATE TABLE `_control_access` (
  `control_access_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(255) NOT NULL,
  `form_name` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `permission_id` varchar(16) NOT NULL,
  `permission_name` varchar(32) NOT NULL,
  `sort_order` decimal(11,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`control_access_id`)
);


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
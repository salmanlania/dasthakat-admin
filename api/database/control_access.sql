
DROP TABLE IF EXISTS `_control_access`;

CREATE TABLE `_control_access` (
  `control_access_id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(255) NOT NULL,
  `form_name` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `permission_id` varchar(16) NOT NULL,
  `permission_name` varchar(32) NOT NULL,
  `sort_order` decimal(11,3) NOT NULL DEFAULT 0.000,
  PRIMARY KEY (`control_access_id`),
  UNIQUE KEY `UNQ` (`route`,`permission_id`)
);

TRUNCATE TABLE  `_control_access`;
INSERT  INTO `_control_access`(`control_access_id`,`module_name`,`form_name`,`route`,`permission_id`,`permission_name`,`sort_order`) 
VALUES
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
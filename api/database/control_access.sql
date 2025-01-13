
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


  TRUNCATE TABLE  `control_access`;
  INSERT  INTO `control_access`(`module_name`,`form_name`,`route`,`permission_id`,`permission_name`,`sort_order`) 
  VALUES
  ('Administrator', 'User Permission', 'user_permission', 'list', 'List', 1.101),
  ('Administrator', 'User Permission', 'user_permission', 'add', 'Add', 1.102),
  ('Administrator', 'User Permission', 'user_permission', 'edit', 'Edit', 1.103),
  ('Administrator', 'User Permission', 'user_permission', 'delete', 'Delete', 1.104),

  ('Administrator', 'User', 'user', 'list', 'List', 1.101),
  ('Administrator', 'User', 'user', 'add', 'Add', 1.102),
  ('Administrator', 'User', 'user', 'edit', 'Edit', 1.103),
  ('Administrator', 'User', 'user', 'delete', 'Delete', 1.104),

  ('General Group', 'Company', 'company', 'list', 'List', 1.101),
  ('General Group', 'Company', 'company', 'add', 'Add', 1.102),
  ('General Group', 'Company', 'company', 'edit', 'Edit', 1.103),
  ('General Group', 'Company', 'company', 'delete', 'Delete', 1.104),

  ('General Group', 'Company Branch', 'company_branch', 'list', 'List', 1.101),
  ('General Group', 'Company Branch', 'company_branch', 'add', 'Add', 1.102),
  ('General Group', 'Company Branch', 'company_branch', 'edit', 'Edit', 1.103),
  ('General Group', 'Company Branch', 'company_branch', 'delete', 'Delete', 1.104),

  ('General Group', 'Currency', 'currency', 'list', 'List', 1.101),
  ('General Group', 'Currency', 'currency', 'add', 'Aist', 1.101),
  ('General Group', 'Currency', 'currency', 'edit', 'Edit', 1.101),
  ('General Group', 'Currency', 'currency', 'delete', 'Delete', 1.101),

  ('General Group', 'Salesman', 'salesman', 'list', 'List', 1.101),
  ('General Group', 'Salesman', 'salesman', 'add', 'Add', 1.102),
  ('General Group', 'Salesman', 'salesman', 'edit', 'Edit', 1.103),
  ('General Group', 'Salesman', 'salesman', 'delete', 'Delete', 1.104),

  ('General Group', 'Customer', 'customer', 'list', 'List', 1.101),
  ('General Group', 'Customer', 'customer', 'add', 'Add', 1.102),
  ('General Group', 'Customer', 'customer', 'edit', 'Edit', 1.103),
  ('General Group', 'Customer', 'customer', 'delete', 'Delete', 1.104),

  ('General Group', 'Vendor', 'supplier', 'list', 'List', 1.101),
  ('General Group', 'Vendor', 'supplier', 'add', 'Add', 1.102),
  ('General Group', 'Vendor', 'supplier', 'edit', 'Edit', 1.103),
  ('General Group', 'Vendor', 'supplier', 'delete', 'Delete', 1.104),

  ('General Group', 'Agent', 'agent', 'list', 'List', 1.101),
  ('General Group', 'Agent', 'agent', 'add', 'Add', 1.102),
  ('General Group', 'Agent', 'agent', 'edit', 'Edit', 1.103),
  ('General Group', 'Agent', 'agent', 'delete', 'Delete', 1.104),

  ('General Group', 'Terms', 'terms', 'list', 'List', 1.101),
  ('General Group', 'Terms', 'terms', 'add', 'Add', 1.102),
  ('General Group', 'Terms', 'terms', 'edit', 'Edit', 1.103),
  ('General Group', 'Terms', 'terms', 'delete', 'Delete', 1.104),

  ('General Group', 'Port', 'port', 'list', 'List', 1.101),
  ('General Group', 'Port', 'port', 'add', 'Add', 1.102),
  ('General Group', 'Port', 'port', 'edit', 'Edit', 1.103),
  ('General Group', 'Port', 'port', 'delete', 'Delete', 1.104),

  ('General Group', 'Flag', 'flag', 'list', 'List', 1.101),
  ('General Group', 'Flag', 'flag', 'add', 'Add', 1.102),
  ('General Group', 'Flag', 'flag', 'edit', 'Edit', 1.103),
  ('General Group', 'Flag', 'flag', 'delete', 'Delete', 1.104),

  ('General Group', 'Class', 'class', 'list', 'List', 1.101),
  ('General Group', 'Class', 'class', 'add', 'Add', 1.102),
  ('General Group', 'Class', 'class', 'edit', 'Edit', 1.103),
  ('General Group', 'Class', 'class', 'delete', 'Delete', 1.104),

  ('General Group', 'Events', 'event', 'list', 'List', 1.101),
  ('General Group', 'Events', 'event', 'add', 'Add', 1.102),
  ('General Group', 'Events', 'event', 'edit', 'Edit', 1.103),
  ('General Group', 'Events', 'event', 'delete', 'Delete', 1.104),

  ('General Group', 'Vessel', 'vessel', 'list', 'List', 1.101),
  ('General Group', 'Vessel', 'vessel', 'add', 'Add', 1.102),
  ('General Group', 'Vessel', 'vessel', 'edit', 'Edit', 1.103),
  ('General Group', 'Vessel', 'vessel', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Category', 'category', 'list', 'List', 1.101),
  ('Inventory Setup', 'Category', 'category', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Category', 'category', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Category', 'category', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Sub Category', 'sub_category', 'list', 'List', 1.101),
  ('Inventory Setup', 'Sub Category', 'sub_category', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Sub Category', 'sub_category', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Sub Category', 'sub_category', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Brand', 'brand', 'list', 'List', 1.101),
  ('Inventory Setup', 'Brand', 'brand', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Brand', 'brand', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Brand', 'brand', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Unit', 'unit', 'list', 'List', 1.101),
  ('Inventory Setup', 'Unit', 'unit', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Unit', 'unit', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Unit', 'unit', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Product', 'product', 'list', 'List', 1.101),
  ('Inventory Setup', 'Product', 'product', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Product', 'product', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Product', 'product', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Validity', 'validity', 'list', 'List', 1.101),
  ('Inventory Setup', 'Validity', 'validity', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Validity', 'validity', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Validity', 'validity', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Payment', 'payment', 'list', 'List', 1.101),
  ('Inventory Setup', 'Payment', 'payment', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Payment', 'payment', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Payment', 'payment', 'delete', 'Delete', 1.104),

  ('Sale Management', 'Quotation', 'quotation', 'list', 'List', 1.101),
  ('Sale Management', 'Quotation', 'quotation', 'add', 'Add', 1.102),
  ('Sale Management', 'Quotation', 'quotation', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Quotation', 'quotation', 'delete', 'Delete', 1.104),

  ('Sale Management', 'Charge Order', 'charge_order', 'list', 'List', 1.101),
  ('Sale Management', 'Charge Order', 'charge_order', 'add', 'Add', 1.102),
  ('Sale Management', 'Charge Order', 'charge_order', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Charge Order', 'charge_order', 'delete', 'Delete', 1.104);

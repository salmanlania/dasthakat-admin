CREATE TABLE `agent` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `agent_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `agent_code` VARCHAR(255) DEFAULT NULL,
  `address` TEXT,
  `city` VARCHAR(255) DEFAULT NULL,
  `state` VARCHAR(255) DEFAULT NULL,
  `zip_code` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `office_no` VARCHAR(255) DEFAULT NULL,
  `fax` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`agent_id`)
);

CREATE TABLE `audit` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `audit_id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `action` CHAR(36) DEFAULT NULL,
  `action_on` CHAR(40) DEFAULT NULL,
  `action_by` CHAR(36) DEFAULT NULL,
  `action_at` DATETIME DEFAULT NULL,
  `document_type` VARCHAR(255) DEFAULT NULL,
  `document_id` CHAR(36) NOT NULL,
  `document_name` VARCHAR(255) DEFAULT NULL,
  `json_data` BLOB,
  PRIMARY KEY (`audit_id`)
);

CREATE TABLE `brand` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `brand_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
);

CREATE TABLE `category` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `category_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`category_id`)
);

CREATE TABLE `charge_order` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `charge_order_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) DEFAULT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `ref_document_type_id` INT(11) DEFAULT NULL,
  `ref_document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE NOT NULL,
  `salesman_id` CHAR(36) DEFAULT NULL,
  `customer_id` CHAR(36) DEFAULT NULL,
  `event_id` CHAR(36) DEFAULT NULL,
  `vessel_id` CHAR(36) DEFAULT NULL,
  `flag_id` CHAR(36) DEFAULT NULL,
  `port_id` CHAR(36) DEFAULT NULL,
  `class1_id` CHAR(36) DEFAULT NULL,
  `class2_id` CHAR(36) DEFAULT NULL,
  `agent_id` CHAR(36) DEFAULT NULL,
  `technician_id` JSON DEFAULT NULL,
  `customer_po_no` VARCHAR(255) DEFAULT NULL,
  `agent_notes` TEXT,
  `technician_notes` TEXT,
  `remarks` TEXT,
  `total_quantity` DECIMAL(15, 2) DEFAULT NULL,
  `total_amount` DECIMAL(15, 2) DEFAULT NULL,
  `discount_amount` DECIMAL(15, 2) DEFAULT NULL,
  `net_amount` DECIMAL(15, 2) DEFAULT NULL,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`charge_order_id`)
);

CREATE TABLE `charge_order_detail` (
  `charge_order_detail_id` CHAR(36) NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  `product_code` VARCHAR(255) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `product_type_id` CHAR(36) DEFAULT NULL,
  `warehouse_id` CHAR(36) DEFAULT NULL,
  `quotation_detail_id` CHAR(36) DEFAULT NULL,
  `purchase_order_id` CHAR(36) DEFAULT NULL,
  `purchase_order_detail_id` CHAR(36) DEFAULT NULL,
  `service_order_id` CHAR(36) DEFAULT NULL,
  `service_order_detail_id` CHAR(36) DEFAULT NULL,
  `servicelist_id` CHAR(36) DEFAULT NULL,
  `servicelist_detail_id` CHAR(36) DEFAULT NULL,
  `picklist_id` CHAR(36) DEFAULT NULL,
  `picklist_detail_id` CHAR(36) DEFAULT NULL,
  `job_order_id` CHAR(36) DEFAULT NULL,
  `job_order_detail_id` CHAR(36) DEFAULT NULL,
  `shipment_id` CHAR(36) DEFAULT NULL,
  `shipment_detail_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `vendor_part_no` VARCHAR(255) DEFAULT NULL,
  `internal_notes` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `cost_price` DECIMAL(15, 2) DEFAULT 0.00,
  `markup` DECIMAL(15, 2) DEFAULT 0.00,
  `rate` DECIMAL(15, 2) DEFAULT 0.00,
  `amount` DECIMAL(15, 2) DEFAULT 0.00,
  `discount_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `discount_percent` DECIMAL(15, 2) DEFAULT 0.00,
  `gross_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`charge_order_detail_id`)
);

CREATE TABLE `class` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `class_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`class_id`)
);

CREATE TABLE `commission_agent` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `commission_agent_type_id` INT(11) NOT NULL,
  `commission_agent_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `address` TEXT,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`commission_agent_id`)
);

CREATE TABLE `company` (
  `company_id` CHAR(36) NOT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `base_currency_id` CHAR(36) DEFAULT NULL,
  `is_exempted` TINYINT(1) NOT NULL DEFAULT 0,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`company_id`)
);

CREATE TABLE `company_branch` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `branch_code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `phone_no` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`company_branch_id`)
);

CREATE TABLE `const_document_type` (
  `document_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `document_name` VARCHAR(255) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `zero_padding` TINYINT(4) DEFAULT 4,
  `reset_on_fiscal_year` ENUM('Yes', 'No') DEFAULT 'Yes',
  `table_name` VARCHAR(255) DEFAULT NULL,
  `route` VARCHAR(255) DEFAULT NULL,
  `primary_key` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`document_type_id`)
);

CREATE TABLE `control_access` (
  `control_access_id` INT(11) unsigned NOT NULL AUTO_INCREMENT,
  `module_name` VARCHAR(255) NOT NULL,
  `form_name` VARCHAR(255) NOT NULL,
  `route` VARCHAR(255) NOT NULL,
  `permission_id` CHAR(36) NOT NULL,
  `permission_name` VARCHAR(255) DEFAULT NULL,
  `sort_order` DECIMAL(15, 2) DEFAULT 0.00,
  PRIMARY KEY (`control_access_id`)
);

CREATE TABLE `core_company_branch_document_prefix` (
  `company_branch_document_prefix_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) DEFAULT NULL,
  `document_name` VARCHAR(255) DEFAULT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `zero_padding` TINYINT(4) DEFAULT NULL,
  `reset_on_fiscal_year` ENUM('Yes', 'No', 'Manual') DEFAULT NULL,
  `table_name` VARCHAR(255) DEFAULT NULL,
  `route` VARCHAR(255) DEFAULT NULL,
  `primary_key` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  PRIMARY KEY (`company_branch_document_prefix_id`)
);

CREATE TABLE `core_stock_ledger` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_id` CHAR(36) NOT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE DEFAULT NULL,
  `warehouse_id` CHAR(36) NOT NULL,
  `document_detail_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `document_unit_id` CHAR(36) NOT NULL,
  `document_qty` DECIMAL(15, 2) DEFAULT 0.00,
  `unit_conversion` DECIMAL(15, 2) DEFAULT 0.00,
  `base_unit_id` CHAR(36) DEFAULT NULL,
  `base_qty` DECIMAL(15, 2) DEFAULT 0.00,
  `document_currency_id` CHAR(36) DEFAULT NULL,
  `document_rate` DECIMAL(15, 2) DEFAULT 0.00,
  `document_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `currency_conversion` DECIMAL(15, 2) DEFAULT 0.00,
  `base_currency_id` CHAR(36) DEFAULT NULL,
  `base_rate` DECIMAL(15, 2) DEFAULT 0.00,
  `base_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `remarks` TEXT,
  `created_at` DATETIME DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `unit` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  PRIMARY KEY (
    `company_id`,
    `company_branch_id`,
    `document_type_id`,
    `document_id`,
    `document_detail_id`,
    `warehouse_id`
  )
);

CREATE TABLE `currency` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `currency_id` CHAR(36) NOT NULL,
  `currency_code` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `symbol_left` VARCHAR(255) DEFAULT NULL,
  `symbol_right` VARCHAR(255) DEFAULT NULL,
  `value` DECIMAL(15, 2) DEFAULT 1.00,
  `status` TINYINT(1) DEFAULT 1,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`currency_id`),
  UNIQUE KEY `currency_code` (`currency_code`)
);

CREATE TABLE `customer` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `customer_code` INT(11) NOT NULL,
  `salesman_id` CHAR(36) DEFAULT NULL,
  `country` VARCHAR(255) DEFAULT NULL,
  `address` TEXT,
  `billing_address` TEXT,
  `phone_no` VARCHAR(255) DEFAULT NULL,
  `block_status` CHAR(36) NOT NULL DEFAULT 'no',
  `email_sales` VARCHAR(255) DEFAULT NULL,
  `email_accounting` VARCHAR(255) DEFAULT NULL,
  `payment_id` CHAR(36) DEFAULT NULL,
  `rebate_percent` DECIMAL(15, 2) DEFAULT NULL,
  `status` TINYINT(4) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
);

CREATE TABLE `customer_commission_agent` (
  `customer_commission_agent_id` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  `type` VARCHAR(255) NOT NULL,
  `commission_percentage` DECIMAL(15, 2) NOT NULL,
  `commission_agent_id` CHAR(36) NOT NULL,
  `status` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`customer_commission_agent_id`)
);

CREATE TABLE `customer_vessel` (
  `customer_vessel_id` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `vessel_id` CHAR(36) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`customer_vessel_id`)
);

CREATE TABLE `event` (
  `company_branch_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `event_id` CHAR(36) NOT NULL,
  `event_no` INT(11) NOT NULL,
  `event_code` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `vessel_id` CHAR(36) NOT NULL,
  `class1_id` CHAR(36) DEFAULT NULL,
  `class2_id` CHAR(36) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`event_id`)
);

CREATE TABLE `event_dispatch` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `event_dispatch_id` CHAR(36) NOT NULL,
  `event_id` CHAR(36) NOT NULL,
  `port_id` CHAR(36) DEFAULT NULL,
  `agent_id` CHAR(36) DEFAULT NULL,
  `technician_id` TEXT,
  `technician_notes` TEXT,
  `event_date` DATE DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `agent_notes` TEXT,
  `status` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`event_dispatch_id`)
);

CREATE TABLE `flag` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `flag_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`flag_id`)
);

CREATE TABLE `good_received_note` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `good_received_note_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `purchase_order_id` CHAR(36) DEFAULT NULL,
  `quotation_id` CHAR(36) DEFAULT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `payment_id` CHAR(36) DEFAULT NULL,
  `remarks` TEXT,
  `total_quantity` DECIMAL(15, 2) DEFAULT NULL,
  `total_amount` DECIMAL(15, 2) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`good_received_note_id`)
);

CREATE TABLE `good_received_note_detail` (
  `good_received_note_id` CHAR(36) NOT NULL,
  `good_received_note_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `purchase_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) NOT NULL,
  `product_type_id` INT(11) DEFAULT NULL,
  `warehouse_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `document_currency_id` INT(11) DEFAULT NULL,
  `base_currency_id` INT(11) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `unit_conversion` DECIMAL(15, 2) DEFAULT NULL,
  `currency_conversion` DECIMAL(15, 2) DEFAULT NULL,
  `vendor_notes` TEXT,
  `description` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT NULL,
  `rate` DECIMAL(15, 2) DEFAULT NULL,
  `amount` DECIMAL(15, 2) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`good_received_note_detail_id`)
);

CREATE TABLE `job_order` (
  `company_id` CHAR(36) DEFAULT NULL,
  `company_branch_id` CHAR(36) DEFAULT NULL,
  `job_order_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATETIME DEFAULT NULL,
  `event_id` CHAR(36) DEFAULT NULL,
  `customer_id` CHAR(36) DEFAULT NULL,
  `vessel_id` CHAR(36) DEFAULT NULL,
  `flag_id` CHAR(36) DEFAULT NULL,
  `class1_id` CHAR(36) DEFAULT NULL,
  `class2_id` CHAR(36) DEFAULT NULL,
  `agent_id` CHAR(36) DEFAULT NULL,
  `salesman_id` CHAR(36) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`job_order_id`)
);

CREATE TABLE `job_order_detail` (
  `company_id` CHAR(36) DEFAULT NULL,
  `company_branch_id` CHAR(36) DEFAULT NULL,
  `job_order_id` CHAR(36) DEFAULT NULL,
  `job_order_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `product_type_id` INT(11) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `internal_notes` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `status` INT(11) DEFAULT NULL,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`job_order_detail_id`)
);

CREATE TABLE `job_order_detail_certificate` (
  `certificate_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `job_order_id` CHAR(36) NOT NULL,
  `job_order_detail_id` CHAR(36) NOT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `certificate_number` VARCHAR(255) NOT NULL,
  `certificate_date` DATETIME DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`certificate_id`)
);

CREATE TABLE `opening_stock` (
  `opening_stock_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `category_id` CHAR(36) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `remarks` TEXT,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`opening_stock_id`)
);

CREATE TABLE `opening_stock_detail` (
  `opening_stock_detail_id` CHAR(36) NOT NULL,
  `opening_stock_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `product_type_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) NOT NULL,
  `unit_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) NOT NULL,
  `document_currency_id` INT(11) NOT NULL,
  `base_currency_id` INT(11) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `unit_conversion` DECIMAL(15, 2) NOT NULL,
  `currency_conversion` DECIMAL(15, 2) NOT NULL,
  `quantity` DECIMAL(15, 2) NOT NULL,
  `rate` DECIMAL(15, 2) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`opening_stock_detail_id`)
);

CREATE TABLE `payment` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `payment_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`payment_id`)
);

CREATE TABLE `picklist` (
  `picklist_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATETIME DEFAULT NULL,
  `charge_order_id` CHAR(36) NOT NULL,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `is_deleted` TINYINT(1) DEFAULT 0, 
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`picklist_id`)
);

CREATE TABLE `picklist_detail` (
  `picklist_detail_id` CHAR(36) NOT NULL,
  `picklist_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) NOT NULL,
  `product_description` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`picklist_detail_id`)
);

CREATE TABLE `picklist_received` (
  `picklist_received_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATETIME DEFAULT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `picklist_id` CHAR(36) NOT NULL,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`picklist_received_id`)
);

CREATE TABLE `picklist_received_detail` (
  `picklist_received_detail_id` CHAR(36) NOT NULL,
  `picklist_received_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `picklist_detail_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) DEFAULT NULL,
  `remarks` VARCHAR(255) DEFAULT NULL,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`picklist_received_detail_id`)
);

CREATE TABLE `port` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `port_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`port_id`)
);

CREATE TABLE `product` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) NOT NULL,
  `product_type_id` INT(11) DEFAULT NULL,
  `category_id` CHAR(36) DEFAULT NULL,
  `sub_category_id` CHAR(36) DEFAULT NULL,
  `brand_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `product_no` INT(11) DEFAULT NULL,
  `product_code` VARCHAR(255) NOT NULL,
  `short_code` CHAR(36) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `impa_code` VARCHAR(255) DEFAULT NULL,
  `cost_price` DECIMAL(15, 2) DEFAULT NULL DEFAULT 0.00,
  `sale_price` DECIMAL(15, 2) DEFAULT NULL DEFAULT 0.00,
  `status` TINYINT(1) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`product_id`)
);

CREATE TABLE `product_type` (
  `product_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` CHAR(36) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`product_type_id`)
);

CREATE TABLE `purchase_invoice` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `purchase_invoice_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `vendor_invoice_no` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE NOT NULL,
  `supplier_id` CHAR(36) NOT NULL,
  `buyer_id` CHAR(36) NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `purchase_order_id` CHAR(36) DEFAULT NULL,
  `payment_id` CHAR(36) DEFAULT NULL,
  `required_date` DATE DEFAULT NULL,
  `ship_via` VARCHAR(255) DEFAULT NULL,
  `ship_to` VARCHAR(255) DEFAULT NULL,
  `department` VARCHAR(255) DEFAULT NULL,
  `remarks` TEXT,
  `freight` DECIMAL(15, 2) DEFAULT 0.00,
  `net_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `created_at` DATETIME DEFAULT NULL,
  `created_by` CHAR(36) NOT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  PRIMARY KEY (`purchase_invoice_id`)
);

CREATE TABLE `purchase_invoice_detail` (
  `purchase_invoice_detail_id` CHAR(36) NOT NULL,
  `purchase_invoice_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `purchase_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) NOT NULL,
  `unit_id` CHAR(36) NOT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `vpart` VARCHAR(255) DEFAULT NULL,
  `vendor_notes` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `po_price` DECIMAL(15, 2) DEFAULT 0.00,
  `rate` DECIMAL(15, 2) DEFAULT 0.00,
  `amount` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`purchase_invoice_detail_id`)
);

CREATE TABLE `purchase_order` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `purchase_order_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `quotation_id` CHAR(36) DEFAULT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `payment_id` CHAR(36) DEFAULT NULL,
  `buyer_id` CHAR(36) DEFAULT NULL,
  `type` VARCHAR(255) DEFAULT NULL,
  `required_date` DATE DEFAULT NULL,
  `ship_to` VARCHAR(255) DEFAULT NULL,
  `ship_via` VARCHAR(255) DEFAULT NULL,
  `department` VARCHAR(255) DEFAULT NULL,
  `remarks` TEXT,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`purchase_order_id`)
);

CREATE TABLE `purchase_order_detail` (
  `purchase_order_id` CHAR(36) NOT NULL,
  `purchase_order_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) NOT NULL,
  `product_type_id` INT(11) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `vpart` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT NULL,
  `rate` DECIMAL(15, 2) DEFAULT NULL,
  `amount` DECIMAL(15, 2) DEFAULT NULL,
  `vendor_notes` TEXT,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`purchase_order_detail_id`)
);

CREATE TABLE `purchase_return` (
  `purchase_return_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) DEFAULT NULL,
  `company_branch_id` CHAR(36) DEFAULT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `purchase_order_id` CHAR(36) DEFAULT NULL,
  `sale_return_id` CHAR(36) DEFAULT NULL,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `status` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`purchase_return_id`)
);

CREATE TABLE `purchase_return_detail` (
  `purchase_return_detail_id` CHAR(36) NOT NULL,
  `purchase_return_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `purchase_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `vpart` VARCHAR(255) DEFAULT NULL,
  `vendor_notes` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `rate` DECIMAL(15, 2) DEFAULT 0.00,
  `amount` DECIMAL(15, 2) DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`purchase_return_detail_id`)
);

CREATE TABLE `quotation` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `quotation_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) DEFAULT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE NOT NULL,
  `salesman_id` CHAR(36) DEFAULT NULL,
  `event_id` CHAR(36) DEFAULT NULL,
  `vessel_id` CHAR(36) DEFAULT NULL,
  `customer_id` CHAR(36) DEFAULT NULL,
  `person_incharge_id` CHAR(36) DEFAULT NULL,
  `flag_id` CHAR(36) DEFAULT NULL,
  `class1_id` CHAR(36) DEFAULT NULL,
  `class2_id` CHAR(36) DEFAULT NULL,
  `validity_id` CHAR(36) DEFAULT NULL,
  `payment_id` CHAR(36) DEFAULT NULL,
  `port_id` CHAR(36) DEFAULT NULL,
  `term_id` TEXT,
  `customer_ref` VARCHAR(255) DEFAULT NULL,
  `service_date` DATE DEFAULT NULL,
  `due_date` DATE DEFAULT NULL,
  `attn` VARCHAR(255) DEFAULT NULL,
  `delivery` VARCHAR(255) DEFAULT NULL,
  `internal_notes` TEXT,
  `term_desc` TEXT,
  `remarks` VARCHAR(255) DEFAULT NULL,
  `total_cost` DECIMAL(15, 2) DEFAULT 0.00,
  `total_quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `total_discount` DECIMAL(15, 2) DEFAULT 0.00,
  `net_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `is_approved` TINYINT(1) DEFAULT 0,
  `rebate_percent` DECIMAL(15, 2) DEFAULT NULL,
  `rebate_amount` DECIMAL(15, 2) DEFAULT NULL,
  `salesman_percent` DECIMAL(15, 2) DEFAULT NULL,
  `salesman_amount` DECIMAL(15, 2) DEFAULT NULL,
  `final_amount` DECIMAL(15, 2) DEFAULT NULL,
  `status` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`quotation_id`)
);

CREATE TABLE `quotation_commission_agent` (
  `id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `quotation_id` CHAR(36) NOT NULL,
  `commission_agent_id` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `vessel_id` CHAR(36) NOT NULL,
  `percentage` DECIMAL(15, 2) NOT NULL,
  `amount` DECIMAL(15, 2) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `quotation_detail` (
  `quotation_id` CHAR(36) NOT NULL,
  `quotation_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `product_code` VARCHAR(255) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `product_type_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `vendor_part_no` VARCHAR(255) DEFAULT NULL,
  `vendor_notes` TEXT,
  `internal_notes` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `cost_price` DECIMAL(15, 2) DEFAULT 0.00,
  `markup` DECIMAL(15, 2) DEFAULT 0.00,
  `rate` DECIMAL(15, 2) DEFAULT 0.00,
  `amount` DECIMAL(15, 2) DEFAULT 0.00,
  `discount_amount` DECIMAL(15, 2) DEFAULT 0.00,
  `discount_percent` DECIMAL(15, 2) DEFAULT NULL,
  `gross_amount` DECIMAL(15, 2) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`quotation_detail_id`)
);

CREATE TABLE `quotation_status` (
  `id` CHAR(36) NOT NULL,
  `quotation_id` CHAR(36) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `sale_invoice` (
  `company_id` CHAR(36) DEFAULT NULL,
  `company_branch_id` CHAR(36) DEFAULT NULL,
  `sale_invoice_id` CHAR(36) NOT NULL,
  `document_type_id` CHAR(36) DEFAULT NULL,
  `document_no` INT(11) DEFAULT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `ship_date` DATETIME DEFAULT NULL,
  `vessel_billing_address` TEXT,
  `total_quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`sale_invoice_id`)
);

CREATE TABLE `sale_invoice_detail` (
  `sale_invoice_detail_id` CHAR(36) NOT NULL,
  `sale_invoice_id` CHAR(36) DEFAULT NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `rate` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`sale_invoice_detail_id`)
);

CREATE TABLE `sale_return` (
  `sale_return_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `sale_invoice_id` CHAR(36) DEFAULT NULL,
  `total_quantity` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`sale_return_id`)
);

CREATE TABLE `sale_return_detail` (
  `sale_return_detail_id` CHAR(36) NOT NULL,
  `sale_return_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `sale_invoice_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) NOT NULL,
  `unit_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `quantity` DECIMAL(15, 2) NOT NULL,
  `rate` DECIMAL(15, 2) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`sale_return_detail_id`)
);

CREATE TABLE `salesman` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `salesman_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `commission_percentage` DECIMAL(15, 2) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`salesman_id`)
);

CREATE TABLE `service_order` (
  `service_order_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) DEFAULT NULL,
  `company_branch_id` CHAR(36) DEFAULT NULL,
  `document_type_id` CHAR(36) DEFAULT NULL,
  `document_no` INT(11) DEFAULT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE DEFAULT NULL,
  `event_id` CHAR(36) DEFAULT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`service_order_id`)
);

CREATE TABLE `service_order_detail` (
  `service_order_detail_id` CHAR(36) NOT NULL,
  `service_order_id` CHAR(36) DEFAULT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `product_type_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `internal_notes` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT 0.00,
  `unit_id` CHAR(36) DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`service_order_detail_id`)
);

CREATE TABLE `servicelist` (
  `servicelist_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATETIME DEFAULT NULL,
  `charge_order_id` CHAR(36) NOT NULL,
  `total_quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`servicelist_id`)
);

CREATE TABLE `servicelist_detail` (
  `servicelist_detail_id` CHAR(36) NOT NULL,
  `servicelist_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) NOT NULL,
  `quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`servicelist_detail_id`)
);

CREATE TABLE `servicelist_received` (
  `servicelist_received_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATETIME DEFAULT NULL,
  `servicelist_id` CHAR(36) NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `total_quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`servicelist_received_id`)
);

CREATE TABLE `servicelist_received_detail` (
  `servicelist_received_detail_id` CHAR(36) NOT NULL,
  `servicelist_received_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `servicelist_detail_id` CHAR(36) NOT NULL,
  `product_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) DEFAULT NULL,
  `remarks` VARCHAR(255) DEFAULT NULL,
  `quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`servicelist_received_detail_id`)
);

CREATE TABLE `setting` (
  `id` CHAR(36) NOT NULL,
  `module` VARCHAR(255) DEFAULT NULL,
  `field` VARCHAR(255) NOT NULL,
  `value` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `shipment` (
  `shipment_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` CHAR(36) DEFAULT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) DEFAULT NULL,
  `document_identity` VARCHAR(255) DEFAULT NULL,
  `document_date` DATE DEFAULT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `event_id` CHAR(36) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`shipment_id`)
);

CREATE TABLE `shipment_detail` (
  `shipment_detail_id` CHAR(36) NOT NULL,
  `shipment_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) NOT NULL,
  `product_type_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `supplier_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `internal_notes` TEXT,
  `quantity` DECIMAL(15, 2) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`shipment_detail_id`)
);

CREATE TABLE `stock_return` (
  `stock_return_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `charge_order_id` CHAR(36) DEFAULT NULL,
  `picklist_id` CHAR(36) DEFAULT NULL,
  `sale_return_id` CHAR(36) DEFAULT NULL,
  `document_date` DATE NOT NULL,
  `return_date` DATETIME DEFAULT NULL,
  `ship_via` VARCHAR(255) DEFAULT NULL,
  `ship_to` VARCHAR(255) DEFAULT NULL,
  `total_quantity` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `status` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`stock_return_id`)
);

CREATE TABLE `stock_return_detail` (
  `stock_return_detail_id` CHAR(36) NOT NULL,
  `stock_return_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `charge_order_detail_id` CHAR(36) DEFAULT NULL,
  `picklist_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) NOT NULL,
  `unit_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_description` TEXT,
  `description` TEXT,
  `quantity` DECIMAL(15, 2) NOT NULL,
  `rate` DECIMAL(15, 2) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`stock_return_detail_id`)
);

CREATE TABLE `sub_category` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `category_id` CHAR(36) NOT NULL,
  `sub_category_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`sub_category_id`)
);

CREATE TABLE `supplier` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `supplier_id` CHAR(36) NOT NULL,
  `payment_id` CHAR(36) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `supplier_code` CHAR(40) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `contact_person` VARCHAR(255) DEFAULT NULL,
  `contact1` CHAR(40) DEFAULT NULL,
  `contact2` CHAR(40) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `address` TEXT,
  `status` TINYINT(1) DEFAULT 1,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`supplier_id`)
);

CREATE TABLE `technician` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `technician_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`technician_id`)
);

CREATE TABLE `terms` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `term_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`term_id`)
);

CREATE TABLE `unit` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `unit_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`unit_id`)
);

CREATE TABLE `user` (
  `company_id` CHAR(36) NOT NULL,
  `permission_id` CHAR(36) DEFAULT NULL,
  `user_id` CHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `user_name` CHAR(40) DEFAULT NULL,
  `user_type` CHAR(36) DEFAULT NULL,
  `password` CHAR(40) NOT NULL,
  `phone_no` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `status` TINYINT(1) DEFAULT 1,
  `api_token` TEXT,
  `from_time` time DEFAULT NULL,
  `to_time` time DEFAULT NULL,
  `super_admin` TINYINT(1) DEFAULT 0,
  `is_exempted` TINYINT(1) NOT NULL DEFAULT 0,
  `otp` VARCHAR(255) DEFAULT NULL,
  `otp_created_at` DATETIME NOT NULL,
  `last_login` DATETIME DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

CREATE TABLE `user_branch_access` (
  `user_branch_access_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`user_branch_access_id`)
);

CREATE TABLE `user_permission` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `user_permission_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `permission` TEXT,
  `description` TEXT,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`user_permission_id`)
);

CREATE TABLE `validity` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `validity_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`validity_id`)
);

CREATE TABLE `vendor_quotation_detail` (
  `vendor_quotation_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `quotation_id` CHAR(36) NOT NULL,
  `quotation_detail_id` CHAR(36) NOT NULL,
  `vendor_id` CHAR(36) NOT NULL,
  `vendor_rate` DECIMAL(15, 2) DEFAULT 0.00,
  `is_primary_vendor` TINYINT(1) DEFAULT 0,
  `vendor_part_no` VARCHAR(255) DEFAULT NULL,
  `vendor_notes` TEXT,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`vendor_quotation_detail_id`)
);

CREATE TABLE `vessel` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `vessel_id` CHAR(36) NOT NULL,
  `customer_id` CHAR(36) DEFAULT NULL,
  `flag_id` CHAR(36) DEFAULT NULL,
  `class1_id` CHAR(36) DEFAULT NULL,
  `class2_id` CHAR(36) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `imo` CHAR(40) DEFAULT NULL,
  `billing_address` TEXT,
  `block_status` CHAR(36) NOT NULL DEFAULT 'no',
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`vessel_id`)
);

CREATE TABLE `vessel_commission_agent` (
  `vessel_commission_agent_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) DEFAULT NULL,
  `commission_agent_id` CHAR(36) NOT NULL,
  `vessel_id` CHAR(36) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `commission_percentage` DECIMAL(15, 2) NOT NULL,
  `status` VARCHAR(255) DEFAULT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`vessel_commission_agent_id`)
);

CREATE TABLE `vp_quotation_rfq` (
  `id` CHAR(36) NOT NULL,
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `quotation_id` CHAR(36) NOT NULL,
  `vendor_id` CHAR(36) DEFAULT NULL,
  `date_sent` DATETIME DEFAULT NULL,
  `date_required` DATE DEFAULT NULL,
  `date_returned` DATETIME DEFAULT NULL,
  `vendor_ref_no` VARCHAR(255) DEFAULT NULL,
  `vendor_remarks` VARCHAR(255) DEFAULT NULL,
  `notification_count` INT(11) NOT NULL DEFAULT 0,
  `is_cancelled` TINYINT(1) NOT NULL DEFAULT 0,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `vp_quotation_rfq_detail` (
  `detail_id` CHAR(36) NOT NULL,
  `id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `quotation_detail_id` CHAR(36) NOT NULL,
  `vendor_quotation_detail_id` CHAR(36) DEFAULT NULL,
  `product_id` CHAR(36) DEFAULT NULL,
  `product_type_id` CHAR(36) DEFAULT NULL,
  `unit_id` CHAR(36) DEFAULT NULL,
  `product_name` VARCHAR(255) DEFAULT NULL,
  `product_description` TEXT,
  `quantity` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `vendor_rate` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `vendor_part_no` VARCHAR(255) DEFAULT NULL,
  `vendor_notes` TEXT,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`detail_id`)
);

CREATE TABLE `warehouse` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `warehouse_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) DEFAULT NULL,
  `updated_by` CHAR(36) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`warehouse_id`)
);
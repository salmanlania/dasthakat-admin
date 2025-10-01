
ALTER TABLE `charge_order_detail`
  ADD COLUMN `vendor_notes` TEXT DEFAULT NULL AFTER `vendor_part_no`;


-- php artisan make:migration add_cost_and_rebate_columns_to_charge_order_table --table=charge_order

ALTER TABLE charge_order 
  ADD COLUMN total_cost DECIMAL (10, 2) AFTER total_quantity,
  ADD COLUMN rebate_percent DECIMAL (10, 2) AFTER net_amount,
  ADD COLUMN rebate_amount DECIMAL (10, 2) AFTER rebate_percent,
  ADD COLUMN salesman_percent DECIMAL (10, 2) AFTER rebate_amount,
  ADD COLUMN salesman_amount DECIMAL (10, 2) AFTER salesman_percent,
  ADD COLUMN final_amount DECIMAL (10, 2) AFTER salesman_amount ;


CREATE TABLE charge_order_commission_agent (
  `id` char(36) NOT NULL,
  `charge_order_id` char(36) NOT NULL,
  `commission_agent_id` char(36) NOT NULL,
  `sort_order` INT(11) DEFAULT 0 NOT NULL,
  `customer_id` char(36) NOT NULL,
  `vessel_id` char(36) NOT NULL,
  `percentage` decimal(10,2) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);


-- charge order vendor platform tables

CREATE TABLE `charge_order_vendor_rate_history` (
  `id` varchar(36) NOT NULL,
  `vp_charge_order_rfq_id` varchar(36) DEFAULT NULL,
  `vp_charge_order_rfq_detail_id` varchar(36) DEFAULT NULL,
  `charge_order_id` varchar(36) DEFAULT NULL,
  `charge_order_detail_id` varchar(36) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_description` text,
  `vendor_id` varchar(36) DEFAULT NULL,
  `vendor_rate` decimal(18,6) DEFAULT NULL,
  `validity_date` date DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_qvrh_vendor_id` (`vendor_id`),
  KEY `idx_qvrh_product_id` (`product_id`),
  KEY `idx_qvrh_product_name` (`product_name`),
  KEY `idx_qvrh_validity_date` (`validity_date`),
  KEY `idx_qvrh_charge_order_id` (`charge_order_id`),
  KEY `idx_qvrh_charge_order_detail_id` (`charge_order_detail_id`),
  KEY `idx_qvrh_vp_rfq_id` (`vp_charge_order_rfq_id`),
  KEY `idx_qvrh_vp_rfq_detail_id` (`vp_charge_order_rfq_detail_id`)
) ;

CREATE TABLE `vendor_charge_order_detail` (
  `vendor_charge_order_detail_id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `company_branch_id` char(36) NOT NULL,
  `charge_order_id` char(36) NOT NULL,
  `charge_order_detail_id` char(36) NOT NULL,
  `vendor_id` char(36) NOT NULL,
  `sort_order` int NOT NULL,
  `vendor_rate` decimal(10,2) DEFAULT '0.00',
  `is_primary_vendor` tinyint(1) DEFAULT '0',
  `vendor_part_no` text,
  `vendor_notes` text,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor_charge_order_detail_id`)
);

CREATE TABLE `vp_charge_order_rfq` (
  `id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `company_branch_id` char(36) NOT NULL,
  `document_type_id` int NOT NULL,
  `document_no` int NOT NULL,
  `document_prefix` varchar(255) NOT NULL,
  `document_identity` varchar(255) NOT NULL,
  `vendor_ref_no` varchar(255) DEFAULT NULL,
  `vendor_remarks` varchar(255) DEFAULT NULL,
  `charge_order_id` char(36) NOT NULL,
  `vendor_id` char(36) DEFAULT NULL,
  `date_required` date DEFAULT NULL,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT '0',
  `date_sent` datetime DEFAULT NULL,
  `date_returned` datetime DEFAULT NULL,
  `validity_date` date DEFAULT NULL,
  `notification_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_vp_charge_order_rfq_charge_order_id` (`charge_order_id`),
  KEY `idx_vp_charge_order_rfq_vendor_id` (`vendor_id`)
) ;

CREATE TABLE `vp_charge_order_rfq_detail` (
  `detail_id` char(36) NOT NULL,
  `id` char(36) NOT NULL,
  `charge_order_detail_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_description` text,
  `product_type_id` char(36) DEFAULT NULL,
  `unit_id` char(36) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `vendor_rate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `vendor_part_no` varchar(255) DEFAULT NULL,
  `vendor_notes` varchar(255) DEFAULT NULL,
  `vendor_charge_order_detail_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `idx_vp_charge_order_rfq_detail_charge_order_detail_id` (`charge_order_detail_id`),
  KEY `idx_vp_charge_order_rfq_detail_vendor_charge_order_detail_id` (`vendor_charge_order_detail_id`)
) ;


INSERT INTO
    `const_document_type` (
        `document_type_id`,
        `document_name`,
        `document_prefix`,
        `table_name`,
        `primary_key`
    )
VALUES
    (
        57,
        'Vendor Charge Order',
        '{BC}/VC-',
        'vp_charge_order_rfq',
        'id'
    );

ALTER TABLE `sale_invoice`
  ADD COLUMN `status` VARCHAR(50) DEFAULT NULL AFTER `document_date`;
CREATE TABLE `accounts` (
    `account_id` CHAR(36) NOT NULL,
    `company_id` CHAR(36) NOT NULL,
    `gl_type_id` INT(11) NOT NULL,
    `parent_account_id` CHAR(36) NULL,
    `account_code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` CHAR(36) NULL,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` CHAR(36) NULL,
    PRIMARY KEY (`account_id`),
    KEY `idx_company_id` (`company_id`),
    KEY `idx_gl_type_id` (`gl_type_id`),
    KEY `idx_parent_account_id` (`parent_account_id`)
);
ALTER TABLE `accounts` ADD COLUMN `head_account_id` INT(11) NULL AFTER `parent_account_id`;

CREATE TABLE `head_accounts` (
  `head_account_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` CHAR(36) NOT NULL,
  `head_account_name` VARCHAR(255) NOT NULL,
  `head_account_type` int(11) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL,
  PRIMARY KEY (`head_account_id`)
);

ALTER TABLE `accounts` DROP COLUMN `head_account_id`;
DROP TABLE `account_heads`;

CREATE TABLE `const_gl_type` (
	`gl_type_id` INT(11) ,
	`name` VARCHAR(255) DEFAULT NULL
); 
INSERT INTO `const_gl_type` (`gl_type_id`, `name`) VALUES('1','Assets');
INSERT INTO `const_gl_type` (`gl_type_id`, `name`) VALUES('2','Liabilities');
INSERT INTO `const_gl_type` (`gl_type_id`, `name`) VALUES('3','Equity');
INSERT INTO `const_gl_type` (`gl_type_id`, `name`) VALUES('4','Revenue');
INSERT INTO `const_gl_type` (`gl_type_id`, `name`) VALUES('5','Expense');

ALTER TABLE `accounts` ADD COLUMN `head_account_id` INT(11) NULL AFTER `parent_account_id`;

CREATE TABLE `head_accounts` (
  `head_account_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` CHAR(36) NOT NULL,
  `head_account_name` VARCHAR(255) NOT NULL,
  `head_account_type` int(11) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL,
  PRIMARY KEY (`head_account_id`)
);

CREATE TABLE `core_ledger` (
    `ledger_id` CHAR(36) NOT NULL PRIMARY KEY,
    `company_id` CHAR(36) NOT NULL,
    `company_branch_id` CHAR(36),
    `document_type_id` TINYINT NOT NULL,
    `document_id` CHAR(36) NOT NULL,
    `document_identity` VARCHAR(100),
    `document_detail_id` CHAR(36),
    `document_date` DATE NOT NULL,
    `sort_order` TINYINT,
    `partner_type` ENUM('Customer','Vendor') DEFAULT NULL,
    `partner_id` CHAR(36),
    `ref_document_type_id` TINYINT,
    `ref_document_identity` VARCHAR(100),
    `account_id` CHAR(36) NOT NULL,
    `remarks` TEXT,
    `document_currency_id` CHAR(36),
    `document_debit` DECIMAL(15,2) DEFAULT 0,
    `document_credit` DECIMAL(15,2) DEFAULT 0,
    `base_currency_id` CHAR(36),
    `conversion_rate` DECIMAL(15,2) DEFAULT 1.00,
    `debit` DECIMAL(15,2) DEFAULT 0,
    `credit` DECIMAL(15,2) DEFAULT 0,
    `product_id` CHAR(36),
    `qty` DECIMAL(15,2),
    `document_amount` DECIMAL(15,2) DEFAULT 0,
    `amount` DECIMAL(15,2) DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `created_by_id` CHAR(36),
    `cheque_no` VARCHAR(50),
    `cheque_date` DATE,

    -- Indexes for speed
    INDEX idx_company (company_id),
    INDEX idx_account (account_id),
    INDEX idx_doc_date (document_date)
);

ALTER TABLE `product` ADD COLUMN `cogs_account_id` CHAR(36) NULL AFTER `sale_price`,
ADD COLUMN `inventory_account_id` CHAR(36) NULL AFTER `cogs_account_id`,
ADD COLUMN `revenue_account_id` CHAR(36) NULL AFTER `inventory_account_id`,
ADD COLUMN `adjustment_account_id` CHAR(36) NULL AFTER `revenue_account_id`;

ALTER TABLE `customer` ADD COLUMN `outstanding_account_id` CHAR(36) NULL AFTER `rebate_percent`;
ALTER TABLE `supplier` ADD COLUMN `outstanding_account_id` CHAR(36) NULL AFTER `address`;
ALTER TABLE `accounts` ADD COLUMN `is_post` TINYINT DEFAULT 0 AFTER `status`;

CREATE TABLE `customer_payment` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `customer_payment_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `base_currency_id` CHAR(36) NOT NULL,
  `document_currency_id` CHAR(36) NOT NULL,
  `transaction_account_id` CHAR(36) NOT NULL,
  `conversion_rate` DECIMAL(15, 2) NOT NULL,
  `payment_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `total_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

CREATE TABLE `customer_payment_detail` (
  `customer_payment_id` CHAR(36) NOT NULL,
  `customer_payment_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `sale_invoice_id` CHAR(36) NOT NULL,
  `ref_document_identity` VARCHAR(255) NOT NULL,
  `original_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `balance_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `settled_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `account_id` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

ALTER TABLE `customer_payment`
  ADD PRIMARY KEY (`customer_payment_id`),
  ADD INDEX `idx_company` (`company_id`),
  ADD INDEX
   `idx_company_branch` (`company_branch_id`),
  ADD INDEX `idx_customer` (`customer_id`),
  ADD INDEX `idx_transaction_account` (`transaction_account_id`),
  ADD INDEX `idx_document_identity` (`document_identity`),
  ADD INDEX `idx_document_date` (`document_date`);

ALTER TABLE `customer_payment_detail`
  ADD PRIMARY KEY (`customer_payment_detail_id`),
  ADD INDEX `idx_customer_payment` (`customer_payment_id`),
  ADD INDEX `idx_sale_invoice` (`sale_invoice_id`),
  ADD INDEX `idx_account` (`account_id`);

  
INSERT INTO `const_document_type` ( `document_type_id`, `document_name`, `document_prefix`, `table_name`, `primary_key`)
VALUES ( 58, 'Customer Payment', '{BC}/CP-', 'customer_payment', 'customer_payment_id' );



CREATE TABLE `payment_voucher` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `payment_voucher_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `base_currency_id` CHAR(36) NOT NULL,
  `document_currency_id` CHAR(36) NOT NULL,
  `transaction_account_id` CHAR(36) NOT NULL,
  `conversion_rate` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  -- `net_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL,
  
  PRIMARY KEY (`payment_voucher_id`),
  INDEX idx_company (`company_id`),
  INDEX idx_branch (`company_branch_id`),
  INDEX idx_document_identity (`document_identity`),
  INDEX idx_document_date (`document_date`),
  INDEX idx_transaction_account (`transaction_account_id`)
);

CREATE TABLE `payment_voucher_detail` (
  `payment_voucher_id` CHAR(36) NOT NULL,
  `payment_voucher_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `account_id` CHAR(36) NOT NULL,
  -- `document_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `payment_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  -- `tax_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  -- `tax_percent` DECIMAL(15, 2) NULL DEFAULT 0,
  -- `net_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `cheque_no` VARCHAR(255) DEFAULT NULL,
  `cheque_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL,
  
  PRIMARY KEY (`payment_voucher_detail_id`),
  INDEX idx_payment_voucher (`payment_voucher_id`),
  INDEX idx_account (`account_id`)
);

  
INSERT INTO `const_document_type` ( `document_type_id`, `document_name`, `document_prefix`, `table_name`, `primary_key`)
VALUES ( 59, 'Payment Voucher', '{BC}/PV-', 'payment_voucher', 'payment_voucher_id' );

ALTER TABLE `payment_voucher_detail` ADD COLUMN `ledger_date` DATE DEFAULT NULL AFTER `cheque_date`;



CREATE TABLE `vendor_payment` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `vendor_payment_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `supplier_id` CHAR(36) NOT NULL,
  `base_currency_id` CHAR(36) NOT NULL,
  `document_currency_id` CHAR(36) NOT NULL,
  `transaction_account_id` CHAR(36) NOT NULL,
  `conversion_rate` DECIMAL(15, 2) NOT NULL,
  `payment_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `total_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

CREATE TABLE `vendor_payment_detail` (
  `vendor_payment_id` CHAR(36) NOT NULL,
  `vendor_payment_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `purchase_invoice_id` CHAR(36) NOT NULL,
  `ref_document_identity` VARCHAR(255) NOT NULL,
  `original_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `balance_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `settled_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `account_id` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

ALTER TABLE `vendor_payment`
  ADD PRIMARY KEY (`vendor_payment_id`),
  ADD INDEX `idx_company` (`company_id`),
  ADD INDEX
   `idx_company_branch` (`company_branch_id`),
  ADD INDEX `idx_supplier` (`supplier_id`),
  ADD INDEX `idx_transaction_account` (`transaction_account_id`),
  ADD INDEX `idx_document_identity` (`document_identity`),
  ADD INDEX `idx_document_date` (`document_date`);

ALTER TABLE `vendor_payment_detail`
  ADD PRIMARY KEY (`vendor_payment_detail_id`),
  ADD INDEX `idx_vendor_payment` (`vendor_payment_id`),
  ADD INDEX `idx_purchase_invoice` (`purchase_invoice_id`),
  ADD INDEX `idx_account` (`account_id`);

  
INSERT INTO `const_document_type` ( `document_type_id`, `document_name`, `document_prefix`, `table_name`, `primary_key`)
VALUES ( 60, 'Vendor Payment', '{BC}/VP-', 'vendor_payment', 'vendor_payment_id' );


CREATE TABLE `cost_center` (
    `company_id` CHAR(36) NOT NULL,
    `company_branch_id` CHAR(36) NOT NULL,
    `cost_center_id` CHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `created_by` CHAR(36),
    `updated_by` CHAR(36),
    `created_at` DATETIME,
    `updated_at` DATETIME
);

ALTER TABLE `payment_voucher_detail`
ADD COLUMN `event_id` CHAR(36) DEFAULT NULL AFTER `ledger_date`,
ADD COLUMN `cost_center_id` CHAR(36) DEFAULT NULL AFTER `event_id`,
DROP COLUMN `cheque_date`;

ALTER TABLE `core_ledger`
ADD COLUMN `event_id` CHAR(36) DEFAULT NULL AFTER `partner_id`,
ADD COLUMN `cost_center_id` CHAR(36) DEFAULT NULL AFTER `event_id`;
ALTER TABLE `payment_voucher_detail` ADD COLUMN `supplier_id` CHAR(36) DEFAULT NULL AFTER `ledger_date`;

CREATE TABLE `customer_payment_settlement` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `customer_payment_settlement_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `customer_id` CHAR(36) NOT NULL,
  `base_currency_id` CHAR(36) NOT NULL,
  `document_currency_id` CHAR(36) NOT NULL,
  `transaction_account_id` CHAR(36) NOT NULL,
  `conversion_rate` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

CREATE TABLE `customer_payment_settlement_detail` (
  `customer_payment_settlement_id` CHAR(36) NOT NULL,
  `customer_payment_settlement_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `customer_payment_id` CHAR(36) NOT NULL,
  `ref_document_identity` VARCHAR(255) NOT NULL,
  `account_id` CHAR(36) NOT NULL,
  `check_date` Date NULL,
  `check_no` TEXT NULL,
  `amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

ALTER TABLE `customer_payment_settlement`
  ADD PRIMARY KEY (`customer_payment_settlement_id`),
  ADD INDEX `idx_company` (`company_id`),
  ADD INDEX
   `idx_company_branch` (`company_branch_id`),
  ADD INDEX `idx_customer` (`customer_id`),
  ADD INDEX `idx_transaction_account` (`transaction_account_id`),
  ADD INDEX `idx_document_identity` (`document_identity`),
  ADD INDEX `idx_document_date` (`document_date`);

ALTER TABLE `customer_payment_settlement_detail`
  ADD PRIMARY KEY (`customer_payment_settlement_detail_id`),
  ADD INDEX `idx_customer_payment_settlement` (`customer_payment_settlement_id`),
  ADD INDEX `idx_customer_payment` (`customer_payment_id`),
  ADD INDEX `idx_account` (`account_id`);

  
INSERT INTO `const_document_type` ( `document_type_id`, `document_name`, `document_prefix`, `table_name`, `primary_key`)
VALUES ( 61, 'Customer Payment Settlement', '{BC}/CPS-', 'customer_payment_settlement', 'customer_payment_settlement_id' );

ALTER TABLE `customer_payment_settlement_detail`
  CHANGE COLUMN `check_date` `cheque_date` DATE NULL,
  CHANGE COLUMN `check_no` `cheque_no` TEXT NULL;

  
CREATE TABLE `payment_voucher_tagging` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `payment_voucher_tagging_id` CHAR(36) NOT NULL,
  `document_type_id` INT(11) NOT NULL,
  `document_prefix` VARCHAR(255) NOT NULL,
  `document_no` INT(11) NOT NULL,
  `document_identity` VARCHAR(255) NOT NULL,
  `document_date` DATE NOT NULL,
  `payment_voucher_id` CHAR(36) NOT NULL,
  `supplier_id` CHAR(36) NOT NULL,
  `base_currency_id` CHAR(36) NOT NULL,
  `document_currency_id` CHAR(36) NOT NULL,
  `conversion_rate` DECIMAL(15, 2) NOT NULL,
  `total_amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

CREATE TABLE `payment_voucher_tagging_detail` (
  `payment_voucher_tagging_id` CHAR(36) NOT NULL,
  `payment_voucher_tagging_detail_id` CHAR(36) NOT NULL,
  `sort_order` INT(11) NOT NULL,
  `purchase_invoice_id` CHAR(36) NOT NULL,
  `ref_document_identity` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(15, 2) NULL DEFAULT 0,
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` CHAR(36) NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` CHAR(36) NULL
);

ALTER TABLE `payment_voucher_tagging`
  ADD PRIMARY KEY (`payment_voucher_tagging_id`),
  ADD INDEX `idx_company` (`company_id`),
  ADD INDEX `idx_company_branch` (`company_branch_id`),
  ADD INDEX `idx_supplier` (`supplier_id`),
  ADD INDEX `idx_payment_voucher` (`payment_voucher_id`),
  ADD INDEX `idx_document_identity` (`document_identity`),
  ADD INDEX `idx_document_date` (`document_date`);

ALTER TABLE `payment_voucher_tagging_detail`
  ADD PRIMARY KEY (`payment_voucher_tagging_detail_id`),
  ADD INDEX `idx_payment_voucher_tagging` (`payment_voucher_tagging_id`),
  ADD INDEX `idx_payment_purchase_invoice` (`purchase_invoice_id`);

INSERT INTO `const_document_type` ( `document_type_id`, `document_name`, `document_prefix`, `table_name`, `primary_key`)
VALUES ( 62, 'Payment Voucher Tagging', '{BC}/PVS-', 'payment_voucher_tagging', 'payment_voucher_tagging_id' );

ALTER TABLE customer_payment_settlement 
ADD COLUMN `transaction_no` VARCHAR(255) NULL AFTER `transaction_account_id`,
ADD COLUMN `customer_payment_id` CHAR(36) NULL AFTER `transaction_no`;

ALTER TABLE customer_payment_settlement_detail 
DROP COLUMN `customer_payment_id`,
DROP COLUMN `ref_document_identity`,
DROP COLUMN `cheque_no`,
DROP COLUMN `cheque_date`;

ALTER TABLE customer_payment_settlement 
ADD COLUMN `bank_amount` CHAR(36) NULL AFTER `customer_payment_id`;

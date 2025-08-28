fALTER TABLE
  `charge_order`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `net_amount`;

ALTER TABLE
  `picklist`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `total_quantity`;

ALTER TABLE
  `picklist_received`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `total_quantity`;

ALTER TABLE
  `servicelist`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `total_quantity`;

ALTER TABLE
  `servicelist_received`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `total_quantity`;

ALTER TABLE
  `purchase_order`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `total_amount`;

ALTER TABLE
  `service_order`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `charge_order_id`;

ALTER TABLE
  `job_order_detail`
ADD
  COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
AFTER
  `charge_order_id`;

ALTER TABLE
  `sale_invoice`
ADD
  COLUMN `total_discount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00
AFTER
  `total_amount`,
ADD
  COLUMN `net_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00
AFTER
  `total_discount`;

ALTER TABLE
  `sale_invoice_detail`
ADD
  COLUMN `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00
AFTER
  `amount`,
ADD
  COLUMN `discount_percent` DECIMAL(10, 2) NOT NULL DEFAULT 0.00
AFTER
  `discount_amount`,
ADD
  COLUMN `gross_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00
AFTER
  `discount_percent`;

-- SET @rownum := 0;
-- UPDATE `supplier`
-- SET `supplier_code` = (@rownum := @rownum + 1)
-- ORDER BY `created_at`;
-- ALTER TABLE `gms`.`supplier` CHANGE `supplier_code` `supplier_code` INT(11) NOT NULL;
CREATE TABLE `const_gl_type` (
  `gl_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`gl_type_id`)
);

CREATE TABLE `coa_level1` (
  `coa_level1_id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL,
  `gl_type_id` int DEFAULT NULL,
  `level1_code` char(3) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`coa_level1_id`),
  UNIQUE KEY `level1_code` (`level1_code`, `coa_level1_id`)
);

CREATE TABLE `coa_level2` (
  `coa_level2_id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL,
  `coa_level1_id` char(36) DEFAULT NULL,
  `level2_code` char(3) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`coa_level2_id`),
  UNIQUE KEY `uniq` (`coa_level1_id`, `level2_code`)
);

CREATE TABLE `coa_level3` (
  `coa_level3_id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL,
  `coa_level2_id` char(36) DEFAULT NULL,
  `coa_level1_id` char(36) DEFAULT NULL,
  `level3_code` varchar(3) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`coa_level3_id`),
  UNIQUE KEY `uniq` (`coa_level2_id`, `coa_level1_id`, `level3_code`)
);

INSERT INTO
  `const_gl_type` (`gl_type_id`, `name`)
VALUES
  (1, 'Assets'),
  (2, 'Liabilities'),
  (3, 'Equity'),
  (4, 'Revenue'),
  (5, 'Expense');

CREATE TABLE `sales_team` (
  `company_id` CHAR(36) NOT NULL,
  `company_branch_id` CHAR(36) NOT NULL,
  `sales_team_id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NULL,
  `created_by` CHAR(36) NULL,
  `updated_at` DATETIME NULL,
  `updated_by` CHAR(36) NULL,
  PRIMARY KEY (`sales_team_id`),
  KEY `sales_team_company_id_index` (`company_id`),
  KEY `sales_team_company_branch_id_index` (`company_branch_id`),
  KEY `sales_team_name_index` (`name`)
);
ALTER TABLE `event` ADD COLUMN `sales_team_id` CHAR(36) DEFAULT NULL AFTER `class2_id`;
  

  CREATE TABLE IF NOT EXISTS `quotation_vendor_rate_history` (
  `id` varchar(36) NOT NULL,
  `vp_quotation_rfq_id` varchar(36) DEFAULT NULL,
  `vp_quotation_rfq_detail_id` varchar(36) DEFAULT NULL,
  `quotation_id` varchar(36) DEFAULT NULL,
  `quotation_detail_id` varchar(36) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_description` text DEFAULT NULL,
  `vendor_id` varchar(36) DEFAULT NULL,
  `vendor_rate` decimal(18,6) DEFAULT NULL,
  `validity_date` date DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE INDEX `idx_qvrh_vendor_id` ON `quotation_vendor_rate_history` (`vendor_id`);
CREATE INDEX `idx_qvrh_product_id` ON `quotation_vendor_rate_history` (`product_id`);
CREATE INDEX `idx_qvrh_product_name` ON `quotation_vendor_rate_history` (`product_name`);
CREATE INDEX `idx_qvrh_validity_date` ON `quotation_vendor_rate_history` (`validity_date`);
CREATE INDEX `idx_qvrh_quotation_id` ON `quotation_vendor_rate_history` (`quotation_id`);
CREATE INDEX `idx_qvrh_quotation_detail_id` ON `quotation_vendor_rate_history` (`quotation_detail_id`);
CREATE INDEX `idx_qvrh_vp_rfq_id` ON `quotation_vendor_rate_history` (`vp_quotation_rfq_id`);
CREATE INDEX `idx_qvrh_vp_rfq_detail_id` ON `quotation_vendor_rate_history` (`vp_quotation_rfq_detail_id`);

ALTER TABLE `vp_quotation_rfq`
  ADD COLUMN `validity_date` date NULL AFTER `date_returned`;

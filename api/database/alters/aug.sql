ALTER TABLE `charge_order` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `net_amount`;
ALTER TABLE `picklist` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_quantity`;
ALTER TABLE `picklist_received` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_quantity`;
ALTER TABLE `servicelist` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_quantity`;
ALTER TABLE `servicelist_received` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_quantity`;
ALTER TABLE `purchase_order` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_amount`;
ALTER TABLE `service_order` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `charge_order_id`;
ALTER TABLE `job_order_detail` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `charge_order_id`;


ALTER TABLE `sale_invoice` 
ADD COLUMN `total_discount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `total_amount`,
ADD COLUMN `net_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `total_discount`;

ALTER TABLE `sale_invoice_detail` 
ADD COLUMN `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `amount`,
ADD COLUMN `discount_percent` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `discount_amount`,
ADD COLUMN `gross_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `discount_percent`;


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
  UNIQUE KEY `level1_code` (`level1_code`,`coa_level1_id`)
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
  UNIQUE KEY `uniq` (`coa_level1_id`,`level2_code`)
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
  UNIQUE KEY `uniq` (`coa_level2_id`,`coa_level1_id`,`level3_code`)
);

INSERT INTO `const_gl_type` (`gl_type_id`, `name`) 
VALUES (1, 'Assets'),
       (2, 'Liabilities'),
       (3, 'Equity'),
       (4, 'Revenue'),
       (5, 'Expense');

  
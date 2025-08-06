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
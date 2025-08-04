ALTER TABLE `charge_order` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `net_amount`;
ALTER TABLE `picklist` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_quantity`;
ALTER TABLE `servicelist` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_quantity`;
ALTER TABLE `purchase_order` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total_amount`;
ALTER TABLE `service_order` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `charge_order_id`;
ALTER TABLE `job_order_detail` ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `charge_order_id`;


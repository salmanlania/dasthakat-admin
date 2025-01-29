
ALTER TABLE purchase_order
ADD COLUMN buyer_id CHAR(36) AFTER buyer_name,
ADD COLUMN ship_to VARCHAR(255) AFTER buyer_id;
ALTER TABLE purchase_order
DROP COLUMN buyer_name,
DROP COLUMN buyer_email;

ALTER TABLE purchase_order_detail
ADD COLUMN vpart VARCHAR(255) AFTER description;

-- 23/jan/2025
ALTER TABLE `core_stock_ledger`   
  DROP COLUMN `fiscal_year_id`, 
  CHANGE `company_id` `company_id` CHAR(36) NOT NULL,
  CHANGE `company_branch_id` `company_branch_id` CHAR(36) NOT NULL,
  CHANGE `warehouse_id` `warehouse_id` CHAR(36) NOT NULL,
  CHANGE `document_unit_id` `document_unit_id` CHAR(36) NOT NULL,
  CHANGE `document_qty` `document_qty` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `unit_conversion` `unit_conversion` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `base_unit_id` `base_unit_id` CHAR(36) NULL,
  CHANGE `base_qty` `base_qty` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `document_currency_id` `document_currency_id` CHAR(36) NULL,
  CHANGE `document_rate` `document_rate` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `document_amount` `document_amount` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `currency_conversion` `currency_conversion` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `base_currency_id` `base_currency_id` CHAR(36) NULL,
  CHANGE `base_rate` `base_rate` DECIMAL(10,2) DEFAULT 0.00  NULL,
  CHANGE `base_amount` `base_amount` DECIMAL(10,2) DEFAULT 0.00  NULL;
  
  ALTER TABLE `core_stock_ledger`   
  CHANGE `created_by_id` `created_by` CHAR(36) NULL;

CREATE TABLE `quotation_status`(  
  `id` CHAR(36) NOT NULL,
  `quotation_id` CHAR(36) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `created_by` CHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `quotation`   
  ADD COLUMN `status` VARCHAR(255) NULL AFTER `net_amount`;

CREATE TABLE `product_type`(  
  `product_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` CHAR(36) NOT NULL,
  `created_by` CHAR(36) ,
  `created_at` DATETIME ,
  PRIMARY KEY (`product_type_id`)
);

ALTER TABLE `quotation_detail`   
  ADD COLUMN `product_code` VARCHAR(255) NULL AFTER `sort_order`,
  ADD COLUMN `product_name` VARCHAR(255) NULL AFTER `product_id`;

INSERT INTO product_type (product_type_id, name, created_at)
VALUES
    (1, 'Service', NOW()),
    (2, 'Inventory', NOW()),
    (3, 'IMPA', NOW()),
    (4, 'Others', NOW());

ALTER TABLE product
CHANGE COLUMN product_type product_type_id INT(11);

ALTER TABLE quotation_detail ADD COLUMN product_type_id CHAR(36) AFTER product_name 


ALTER TABLE `good_received_note` 
ADD COLUMN `quotation_id` CHAR(36) AFTER `purchase_order_id`,
ADD COLUMN `charge_order_id` CHAR(36) AFTER `quotation_id`;

ALTER TABLE `purchase_invoice` 
DROP COLUMN `type`,
ADD COLUMN `good_received_note_id` CHAR(36) AFTER `department`;

ALTER TABLE user CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb3_general_ci;
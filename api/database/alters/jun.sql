ALTER TABLE `sale_return` ADD COLUMN `ship_to` VARCHAR(255) AFTER `document_date`;
ALTER TABLE `sale_return` ADD COLUMN `ship_via` VARCHAR(255) AFTER `ship_to`;
ALTER TABLE `sale_return` ADD COLUMN `return_date` DATETIME AFTER `ship_via`;

ALTER TABLE `vessel` ADD COLUMN `block_status` CHAR(36) NOT NULL DEFAULT 'no' AFTER `flag_id`;
ALTER TABLE `customer` ADD COLUMN `block_status` CHAR(36) NOT NULL DEFAULT 'no' AFTER `phone_no`;

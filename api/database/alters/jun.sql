ALTER TABLE `sale_return` ADD COLUMN `ship_to` VARCHAR(255) AFTER `document_date`;
ALTER TABLE `sale_return` ADD COLUMN `ship_via` VARCHAR(255) AFTER `ship_to`;
ALTER TABLE `sale_return` ADD COLUMN `return_date` DATETIME AFTER `ship_via`;

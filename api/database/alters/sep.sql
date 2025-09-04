
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


CREATE TABLE quotation_commission_agent (
  `id` char(36) NOT NULL,
  `quotation_id` char(36) NOT NULL,
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
ALTER TABLE `sale_return` ADD COLUMN `ship_to` VARCHAR(255) AFTER `document_date`;
ALTER TABLE `sale_return` ADD COLUMN `ship_via` VARCHAR(255) AFTER `ship_to`;
ALTER TABLE `sale_return` ADD COLUMN `return_date` DATETIME AFTER `ship_via`;

ALTER TABLE `vessel` ADD COLUMN `block_status` CHAR(36) NOT NULL DEFAULT 'no' AFTER `flag_id`;
ALTER TABLE `customer` ADD COLUMN `block_status` CHAR(36) NOT NULL DEFAULT 'no' AFTER `phone_no`;

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
        54,
        'Stock Return',
        '{BC}/STR-',
        'stock_return',
        'stock_return_id'
    );

    
CREATE TABLE `stock_return` (
  `stock_return_id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `company_branch_id` char(36) NOT NULL,
  `document_type_id` int NOT NULL,
  `document_no` int NOT NULL,
  `document_prefix` varchar(255) NOT NULL,
  `document_identity` varchar(255) NOT NULL,
  `document_date` date NOT NULL,
  `ship_to` varchar(255) DEFAULT NULL,
  `ship_via` varchar(255) DEFAULT NULL,
  `return_date` datetime DEFAULT NULL,
  `charge_order_id` char(36) DEFAULT NULL,
  `picklist_id` char(36) DEFAULT NULL,
  `total_quantity` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`stock_return_id`)
);


CREATE TABLE `stock_return_detail` (
  `stock_return_detail_id` char(36) NOT NULL,
  `stock_return_id` char(36) NOT NULL,
  `charge_order_detail_id` char(36) DEFAULT NULL,
  `picklist_detail_id` char(36) DEFAULT NULL,
  `sort_order` int NOT NULL,
  `product_id` char(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text,
  `description` text,
  `unit_id` char(36) NOT NULL,
  `warehouse_id` char(36) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`stock_return_detail_id`)
);


ALTER TABLE `sale_return`   
  DROP COLUMN `ship_to`, 
  DROP COLUMN `ship_via`, 
  DROP COLUMN `return_date`, 
  DROP COLUMN `status`, 
  CHANGE `picklist_id` `sale_invoice_id` CHAR(36) NULL;

ALTER TABLE `sale_return_detail`   
  CHANGE `picklist_detail_id` `sale_invoice_detail_id` CHAR(36)  NULL;

ALTER TABLE `purchase_return`   
  ADD COLUMN `sale_return_id` CHAR(36) NULL;
ALTER TABLE `stock_return`   
  ADD COLUMN `sale_return_id` CHAR(36) NULL;


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
        55,
        'Opening Stock',
        '{BC}/OS-',
        'opening_stock',
        'opening_stock_id'
    );

-- Opening Stock Table
CREATE TABLE `opening_stock` (
  `opening_stock_id` char(36) NOT NULL,
  `company_id` char(36) NOT NULL,
  `company_branch_id` char(36) NOT NULL,
  `document_type_id` int NOT NULL,
  `document_no` int NOT NULL,
  `document_prefix` varchar(255) NOT NULL,
  `document_identity` varchar(255) NOT NULL,
  `document_date` date NOT NULL,
  `total_quantity` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`opening_stock_id`)
);
  
-- Opening Stock Detail Table
CREATE TABLE `opening_stock_detail` (
  `opening_stock_detail_id` char(36) NOT NULL,
  `opening_stock_id` char(36) NOT NULL,
  `sort_order` INT(11) DEFAULT 0,
  `product_type_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_description` text,
  `description` text,
  `unit_id` char(36) NOT NULL,
  `warehouse_id` char(36) NOT NULL,
  `document_currency_id` INT(11) NOT NULL,
  `base_currency_id` INT(11) NOT NULL,
  `unit_conversion` decimal(10,2) NOT NULL,
  `currency_conversion` decimal(10,2) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`opening_stock_detail_id`)
);

CREATE TABLE commission_agent (
  `company_id` char(36) NOT NULL,
  `company_branch_id` char(36) NOT NULL,
  `commission_agent_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` text,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`commission_agent_id`)
);

CREATE TABLE vessel_commission_agent (
  `vessel_commission_agent_id` char(36) NOT NULL,
  `vessel_id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `commission_percentage` decimal(10,2) NOT NULL,
  `commission_agent_id` char(36) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`vessel_commission_agent_id`)
);

CREATE TABLE customer_commission_agent (
  `customer_commission_agent_id` char(36) NOT NULL,
  `customer_id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `commission_percentage` decimal(10,2) NOT NULL,
  `commission_agent_id` char(36) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`customer_commission_agent_id`)
);

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
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `sale_invoice` 
ADD COLUMN `ship_date` DATETIME DEFAULT NULL AFTER `document_date`;


ALTER TABLE `vessel_commission_agent`
  ADD COLUMN `sort_order` INT(11) NULL AFTER `type`;
ALTER TABLE `customer_commission_agent`
  ADD COLUMN `sort_order` INT(11) NULL AFTER `type`;

  
ALTER TABLE `quotation_commission_agent`
  ADD COLUMN `updated_at` DATETIME DEFAULT NULL,
  ADD COLUMN `updated_by` CHAR(36) DEFAULT NULL;
  
>>>>>>> June-task-report


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
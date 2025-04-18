INSERT INTO
    const_document_type (
        document_type_id,
        document_name,
        document_prefix,
        table_name,
        primary_key
    )
VALUES
    (
        50,
        'SO Document Number',
        '{BC}/DN-',
        'service_order',
        'service_order_id'
    );

ALTER TABLE
    `charge_order_detail`
ADD
    COLUMN `service_order_id` char(36) NULL
AFTER
    `shipment_detail_id`,
ADD
    COLUMN `service_order_detail_id` char(36) NULL
AFTER
    `service_order_id`;

CREATE TABLE `service_order` (
    `service_order_id` CHAR(36) PRIMARY KEY,
    `company_id` CHAR(36),
    `company_branch_id` CHAR(36),
    `document_type_id` CHAR(36),
    `document_no` INT(11),
    `document_prefix` VARCHAR(255),
    `document_identity` VARCHAR(255),
    `document_date` DATE,
    `event_id` CHAR(36),
    `charge_order_id` CHAR(36),
    `created_at` DATETIME NULL,
    `created_by` CHAR(36) NULL,
    `updated_at` DATETIME NULL,
    `updated_by` CHAR(36) NULL
);

CREATE TABLE `service_order_detail` (
    `service_order_detail_id` CHAR(36) PRIMARY KEY,
    `service_order_id` CHAR(36),
    `sort_order` INT DEFAULT 0,
    `charge_order_id` CHAR(36) NULL,
    `charge_order_detail_id` CHAR(36) NULL,
    `product_id` CHAR(36) NULL,
    `product_type_id` CHAR(36) NULL,
    `product_name` VARCHAR(255) NULL,
    `product_description` TEXT NULL,
    `description` TEXT NULL,
    `internal_notes` TEXT NULL,
    `quantity` DECIMAL(12, 2) DEFAULT 0,
    `unit_id` CHAR(36) NULL,
    `supplier_id` CHAR(36) NULL,
    `created_at` DATETIME NULL,
    `created_by` CHAR(36) NULL,
    `updated_at` DATETIME NULL,
    `updated_by` CHAR(36) NULL
);

ALTER TABLE servicelist_received_detail
MODIFY COLUMN warehouse_id CHAR(36) NULL;

ALTER TABLE product
ADD COLUMN short_code CHAR(36) NULL AFTER product_code ;

ALTER TABLE `user`
ADD `is_exempted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `to_time`,
ADD `otp` VARCHAR(255) NULL DEFAULT NULL AFTER `is_exempted`;

ALTER TABLE `company`
ADD `is_exempted` TINYINT(1) NOT NULL DEFAULT 0 AFTER `base_currency_id`;

ALTER TABLE `user`
ADD `otp_created_at` DATETIME NOT NULL;

ALTER TABLE `charge_order_detail`
ADD COLUMN `vendor_part_no` VARCHAR(255) DEFAULT NULL AFTER `supplier_id`,
ADD COLUMN `markup` DECIMAL(10,2) DEFAULT 0 AFTER `cost_price`;

ALTER TABLE `quotation`
ADD COLUMN `total_cost` DECIMAL(10,2) DEFAULT 0 AFTER `term_desc`;


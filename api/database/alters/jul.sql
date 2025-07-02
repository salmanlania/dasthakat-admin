CREATE TABLE `vendor_quotation_detail` (
    `vendor_quotation_detail_id` CHAR(36) NOT NULL,
    `company_id` CHAR(36) NOT NULL,
    `company_branch_id` CHAR(36) NOT NULL,
    `quotation_id` CHAR(36) NOT NULL,
    `quotation_detail_id` CHAR(36) NOT NULL,
    `vendor_id` CHAR(36) NOT NULL,
    `vendor_rate` DECIMAL(10,2) DEFAULT 0.00,
    `is_primary_vendor` TINYINT(1) DEFAULT 0,
    `vendor_part_no` TEXT DEFAULT NULL,
    `vendor_notes` TEXT DEFAULT NULL,
    `created_by` CHAR(36) DEFAULT NULL,
    `updated_by` CHAR(36) DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`vendor_quotation_detail_id`)
);

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

ALTER TABLE `vendor_quotation_detail` ADD COLUMN `sort_order` INT(11) NOT NULL AFTER `vendor_id`;


ALTER TABLE vendor_quotation_detail
MODIFY quotation_detail_id CHAR(36) 
COLLATE utf8mb4_unicode_ci;


SHOW FULL COLUMNS FROM vendor_quotation_detail WHERE FIELD = 'quotation_detail_id';


CREATE TABLE vp_quotation_rfq (
    id CHAR(36) PRIMARY KEY,
    quotation_id CHAR(36) NOT NULL,
    vendor_id CHAR(36) NULL,
    STATUS CHAR(50) NULL,
    total_items INT NULL,
    items_quoted INT NULL,
    date_required DATETIME NULL,
    date_sent DATETIME NULL,
    date_returned DATETIME NULL,
    created_at TIMESTAMP NULL,
    created_by CHAR(36) NULL,
    updated_at TIMESTAMP NULL,
    updated_by CHAR(36) NULL
);

-- Create indexes
CREATE INDEX idx_vp_quotation_rfq_quotation_id ON vp_quotation_rfq(quotation_id);
CREATE INDEX idx_vp_quotation_rfq_vendor_id ON vp_quotation_rfq(vendor_id);
CREATE INDEX idx_vp_quotation_rfq_status ON vp_quotation_rfq(STATUS);

CREATE TABLE vp_quotation_rfq_detail (
    detail_id CHAR(36) PRIMARY KEY,
    id CHAR(36) NOT NULL,
    quotation_detail_id CHAR(36) NOT NULL,
    vendor_quotation_detail_id CHAR(36) NULL,
    created_at TIMESTAMP NULL,
    created_by CHAR(36) NULL,
    updated_at TIMESTAMP NULL,
    updated_by CHAR(36) NULL
);

-- Create indexes
CREATE INDEX idx_vp_quotation_rfq_detail_quotation_detail_id ON vp_quotation_rfq_detail(quotation_detail_id);
CREATE INDEX idx_vp_quotation_rfq_detail_vendor_quotation_detail_id ON vp_quotation_rfq_detail(vendor_quotation_detail_id);

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
        56,
        'Vendor Quotation',
        '{BC}/VQ-',
        'vp_quotation_rfq',
        'id'
    );



  ALTER table `vp_quotation_rfq`
  ADD COLUMN `company_id` char(36) NOT NULL AFTER `id`,
  ADD COLUMN `company_branch_id` char(36) NOT NULL AFTER `company_id`,
  ADD COLUMN `document_type_id` int NOT NULL AFTER `company_branch_id`,
  ADD COLUMN `document_no` int NOT NULL AFTER `document_type_id`,
  ADD COLUMN `document_prefix` varchar(255) NOT NULL AFTER `document_no`,
  ADD COLUMN `document_identity` varchar(255) NOT NULL AFTER `document_prefix`;
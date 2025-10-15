create table vendor_bill (
    `vendor_bill_id` char(36) NOT NULL,
    `company_id` char(36) NOT NULL,
    `company_branch_id` char(36) NOT NULL,
    `document_type_id` int NOT NULL,
    `document_no` int NOT NULL,
    `document_prefix` varchar(255) NOT NULL,
    `document_identity` varchar(255) NOT NULL,
    `document_date` date DEFAULT NULL,
    `supplier_id` char(36) DEFAULT NULL,
    `base_currency_id` char(36) DEFAULT NULL,
    `document_currency_id` char(36) DEFAULT NULL,
    `transaction_account_id` char(36) DEFAULT NULL,
    `conversion_rate` decimal(10,2) DEFAULT NULL,
    `total_amount` decimal(10,2) DEFAULT NULL,
    `remarks` varchar(255) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `created_by` char(36) DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    `updated_by` char(36) DEFAULT NULL,
    PRIMARY KEY (`vendor_bill_id`),
    KEY `idx_vendor_bill_company_id` (`company_id`),
    KEY `idx_vendor_bill_company_branch_id` (`company_branch_id`),
    KEY `idx_vendor_bill_supplier_id` (`supplier_id`),
    KEY `idx_vendor_bill_document_type_id` (`document_type_id`),
    KEY `idx_vendor_bill_transaction_account_id` (`transaction_account_id`),
    KEY `idx_vendor_bill_document_identity` (`document_identity`),
    KEY `idx_vendor_bill_document_date` (`document_date`)
);


create table vendor_bill_detail (
    `vendor_bill_detail_id` char(36) NOT NULL,
    `vendor_bill_id` char(36) NOT NULL,
    `sort_order` int NOT NULL,
    `account_id` char(36) NOT NULL,
    `remarks` varchar(255) DEFAULT NULL,
    `amount` decimal(10,2) DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `created_by` char(36) DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    `updated_by` char(36) DEFAULT NULL,
    PRIMARY KEY (`vendor_bill_detail_id`),
    KEY `idx_vendor_bill_detail_vendor_bill_id` (`vendor_bill_id`),
    KEY `idx_vendor_bill_detail_account_id` (`account_id`)
);

INSERT INTO `const_document_type` ( `document_type_id`, `document_name`, `document_prefix`, `table_name`, `primary_key`)
VALUES ( 64, 'Vendor Bill', '{BC}/VB-', 'vendor_bill', 'vendor_bill_id' );

ALTER TABLE `credit_note` ADD `remarks` TEXT DEFAULT NULL;



create table payee (
    `payee_id` char(36) NOT NULL,
    `company_id` char(36) NOT NULL,
    `company_branch_id` char(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `created_by` char(36) DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    `updated_by` char(36) DEFAULT NULL,
    PRIMARY KEY (`payee_id`),
    KEY `idx_payee_company_id` (`company_id`),
    KEY `idx_payee_company_branch_id` (`company_branch_id`),
    KEY `idx_payee_name` (`name`)
);
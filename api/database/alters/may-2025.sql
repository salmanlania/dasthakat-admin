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
        52,
        'Purchase Return',
        '{BC}/PR-',
        'purchase_return',
        'purchase_return_id'
    ),
    (
        53,
        'Sale Return',
        '{BC}/SR-',
        'sale_return',
        'sale_return_id'
    );

CREATE TABLE sale_return (
    sale_return_id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    company_branch_id CHAR(36) NOT NULL,
    document_type_id INT NOT NULL,
    document_no INT NOT NULL,
    document_prefix VARCHAR(255) NOT NULL,
    document_identity VARCHAR(255) NOT NULL,
    document_date DATE NOT NULL,
    charge_order_id CHAR(36) DEFAULT NULL,
    picklist_id CHAR(36) DEFAULT NULL,
    total_quantity DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_by CHAR(36) DEFAULT NULL,
    updated_by CHAR(36) DEFAULT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL
);

CREATE TABLE sale_return_detail (
    sale_return_detail_id CHAR(36) PRIMARY KEY,
    sale_return_id CHAR(36) NOT NULL,
    charge_order_detail_id CHAR(36) DEFAULT NULL,
    picklist_detail_id CHAR(36) DEFAULT NULL,
    sort_order INT NOT NULL,
    product_id CHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    unit_id CHAR(36) NOT NULL,
    warehouse_id CHAR(36) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_by CHAR(36) DEFAULT NULL,
    updated_by CHAR(36) DEFAULT NULL,
    created_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT NULL
);


CREATE TABLE purchase_return (
    purchase_return_id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NULL,
    company_branch_id CHAR(36) NULL,
    document_type_id INT NOT NULL,
    document_no VARCHAR(255) NOT NULL,
    document_prefix VARCHAR(255) NOT NULL,
    document_identity VARCHAR(255) NOT NULL,
    document_date DATE NOT NULL,
    charge_order_id CHAR(36) NULL,
    purchase_order_id CHAR(36) NULL,
    total_quantity DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    created_by CHAR(36) NULL,
    updated_by CHAR(36) NULL,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE purchase_return_detail (
    purchase_return_detail_id CHAR(36) PRIMARY KEY,
    purchase_return_id CHAR(36) NOT NULL,
    charge_order_detail_id CHAR(36) NULL,
    purchase_order_detail_id CHAR(36) NULL,
    sort_order INT NULL,
    product_id CHAR(36) NULL,
    product_name VARCHAR(255) NULL,
    product_description VARCHAR(255) NULL,
    description VARCHAR(255) NULL,
    unit_id CHAR(36) NOT NULL,
    vpart VARCHAR(255) NULL,
    quantity DECIMAL(15, 2) DEFAULT 0,
    rate DECIMAL(15, 2) DEFAULT 0,
    amount DECIMAL(15, 2) DEFAULT 0,
    vendor_notes TEXT NULL,
    created_by CHAR(36) NULL,
    updated_by CHAR(36) NULL,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `sale_invoice` ADD COLUMN `vessel_billing_address` VARCHAR(255) AFTER `document_date`;

ALTER TABLE `purchase_return_detail` ADD COLUMN `warehouse_id` CHAR(36) AFTER `unit_id`;
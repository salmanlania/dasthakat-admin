ALTER TABLE job_order_detail
ADD COLUMN sort_order INT(11) AFTER charge_order_detail_id,
ADD COLUMN description TEXT ;


ALTER TABLE charge_order_detail
ADD COLUMN quotation_detail_id CHAR(36) AFTER purchase_order_detail_id,
ADD COLUMN internal_notes VARCHAR(255) AFTER quotation_detail_id;

ALTER TABLE job_order_detail
ADD COLUMN internal_notes VARCHAR(255) AFTER product_type_id;

ALTER TABLE picklist_received_detail
ADD COLUMN remarks VARCHAR(255) AFTER product_id;

ALTER TABLE good_received_note_detail
ADD COLUMN purchase_order_detail_id CHAR(36) AFTER good_received_note_id;

ALTER TABLE picklist_received_detail
ADD COLUMN warehouse_id CHAR(36) AFTER product_id;


INSERT INTO const_document_type (document_type_id, document_name, document_prefix, table_name, primary_key) 
VALUES (46, 'Service List', '{BC}/SL-', 'servicelist', 'servicelist_id');

INSERT INTO const_document_type (document_type_id, document_name, document_prefix, table_name, primary_key)
VALUES (47, 'Service List Received', '{BC}/SLR-', 'servicelist_received', 'servicelist_received_id');

CREATE TABLE servicelist (
    servicelist_id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    company_branch_id CHAR(36) NOT NULL,
    document_type_id INT NOT NULL,
    document_no INT NOT NULL,
    document_prefix VARCHAR(50) NOT NULL,
    document_identity VARCHAR(100) NOT NULL,
    document_date DATETIME,
    charge_order_id CHAR(36) NOT NULL,
    total_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE servicelist_detail (
    servicelist_detail_id CHAR(36) PRIMARY KEY,
    servicelist_id CHAR(36) NOT NULL,
    charge_order_detail_id CHAR(36) NOT NULL,
    sort_order INT NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE servicelist_received (
    servicelist_received_id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    company_branch_id CHAR(36) NOT NULL,
    document_type_id INT NOT NULL,
    document_no INT NOT NULL,
    document_prefix VARCHAR(50) NOT NULL,
    document_identity VARCHAR(100) NOT NULL,
    document_date DATETIME,
    servicelist_id CHAR(36) NOT NULL,
    total_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE servicelist_received_detail (
    servicelist_received_detail_id CHAR(36) PRIMARY KEY,
    servicelist_received_id CHAR(36) NOT NULL,
    servicelist_detail_id CHAR(36) NOT NULL,
    sort_order INT NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

ALTER TABLE charge_order_detail 
ADD COLUMN servicelist_id CHAR(36) AFTER purchase_order_detail_id,
ADD COLUMN servicelist_detail_id CHAR(36) AFTER servicelist_id;


ALTER TABLE quotation_detail 
ADD COLUMN product_description VARCHAR(255) AFTER product_name;

ALTER TABLE charge_order_detail 
ADD COLUMN product_description VARCHAR(255) AFTER product_name;

ALTER TABLE purchase_order_detail 
ADD COLUMN product_description VARCHAR(255) AFTER product_name;

ALTER TABLE good_received_note_detail 
ADD COLUMN product_description VARCHAR(255) AFTER product_name;

ALTER TABLE picklist_detail 
ADD COLUMN product_description VARCHAR(255) AFTER product_id;

ALTER TABLE job_order_detail 
ADD COLUMN product_description VARCHAR(255) AFTER product_name;

ALTER TABLE purchase_invoice_detail 
ADD COLUMN product_name VARCHAR(255) AFTER product_id,
ADD COLUMN product_description VARCHAR(255) AFTER product_name;


CREATE TABLE job_order_detail_certificate (
    certifiate_id CHAR(36) PRIMARY KEY,
    job_order_id CHAR(36) NOT NULL,
    job_order_detail_id CHAR(36) NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    certificate_date DATETIME,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

ALTER TABLE agent 
ADD COLUMN office_no VARCHAR(255) AFTER phone;

ALTER TABLE charge_order_detail
ADD COLUMN job_order_id CHAR(36) AFTER quotation_detail_id;
ADD COLUMN job_order_detail_id CHAR(36) AFTER job_order_id;


ALTER TABLE servicelist_received_detail
ADD COLUMN remarks VARCHAR(255) AFTER product_id;

ALTER TABLE servicelist_received_detail
ADD COLUMN warehouse_id CHAR(36) AFTER product_id;

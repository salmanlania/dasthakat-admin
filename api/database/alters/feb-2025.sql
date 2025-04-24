ALTER TABLE quotation_detail 
ADD COLUMN vendor_part_no VARCHAR(255) AFTER supplier_id;

ALTER TABLE charge_order_detail 
ADD COLUMN cost_price DECIMAL(10,2) AFTER quantity,
ADD COLUMN rate DECIMAL(10,2) AFTER cost_price,
ADD COLUMN amount DECIMAL(10,2) AFTER rate,
ADD COLUMN discount_amount DECIMAL(10,2) AFTER amount,
ADD COLUMN discount_percent DECIMAL(10,2) AFTER discount_amount,
ADD COLUMN gross_amount DECIMAL(10,2) AFTER discount_percent,
ADD COLUMN purchase_order_id CHAR(36) AFTER warehouse_id,
ADD COLUMN purchase_order_detail_id CHAR(36) AFTER purchase_order_id

ALTER TABLE charge_order_detail 
CHANGE COLUMN product_type product_type_id CHAR(36);

ALTER TABLE charge_order 
ADD COLUMN total_amount DECIMAL(10,2) AFTER total_quantity,
ADD COLUMN discount_amount DECIMAL(10,2) AFTER total_amount,
ADD COLUMN net_amount DECIMAL(10,2) AFTER discount_amount;

ALTER TABLE purchase_order_detail 
ADD COLUMN product_name VARCHAR(255) AFTER product_id,
ADD COLUMN product_type_id INT(11) AFTER product_name;

ALTER TABLE good_received_note_detail 
ADD COLUMN product_name VARCHAR(255) AFTER product_id,
ADD COLUMN product_type_id INT(11) AFTER product_name;

ALTER TABLE charge_order 
ADD COLUMN customer_po_no VARCHAR(255) AFTER customer_id;

INSERT INTO const_document_type (document_type_id, document_name, document_prefix, table_name, primary_key) 
VALUES (43, 'Pick List', '{BC}/PL-', 'picklist', 'picklist_id');

INSERT INTO const_document_type (document_type_id, document_name, document_prefix, table_name, primary_key)
VALUES (44, 'Picklist Received', '{BC}/PLR-', 'picklist_received', 'picklist_received_id')

CREATE TABLE picklist (
    picklist_id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    company_branch_id CHAR(36) NOT NULL,
    document_type_id INT NOT NULL,
    document_no INT NOT NULL,
    document_prefix VARCHAR(50) NOT NULL,
    document_identity VARCHAR(100) NOT NULL,
    charge_order_id CHAR(36) NOT NULL,
    total_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE picklist_detail (
    picklist_detail_id CHAR(36) PRIMARY KEY,
    picklist_id CHAR(36) NOT NULL,
    charge_order_detail_id CHAR(36) NOT NULL,
    sort_order INT NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);


ALTER TABLE charge_order_detail 
ADD COLUMN picklist_id CHAR(36) AFTER purchase_order_detail_id,
ADD COLUMN picklist_detail_id CHAR(36) AFTER picklist_id;





CREATE TABLE picklist_received (
    picklist_received_id CHAR(36) PRIMARY KEY,
    company_id CHAR(36) NOT NULL,
    company_branch_id CHAR(36) NOT NULL,
    document_type_id INT NOT NULL,
    document_no INT NOT NULL,
    document_prefix VARCHAR(50) NOT NULL,
    document_identity VARCHAR(100) NOT NULL,
    picklist_id CHAR(36) NOT NULL,
    total_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE picklist_received_detail (
    picklist_received_detail_id CHAR(36) PRIMARY KEY,
    picklist_received_id CHAR(36) NOT NULL,
    picklist_detail_id CHAR(36) NOT NULL,
    sort_order INT NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_by CHAR(36) NOT NULL,
    updated_by CHAR(36) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);


ALTER TABLE picklist
ADD COLUMN document_date DATETIME AFTER document_identity;

ALTER TABLE picklist_received
ADD COLUMN document_date DATETIME AFTER document_identity;

ALTER TABLE vessel
ADD COLUMN customer_id CHAR(36) AFTER name;
ALTER TABLE supplier
ADD COLUMN payment_id CHAR(36) AFTER location;
ALTER TABLE quotation_detail
ADD COLUMN internal_notes VARCHAR(255) AFTER vendor_part_no;
ALTER TABLE purchase_order_detail
ADD COLUMN charge_order_detail_id CHAR(36) AFTER purchase_order_detail_id;

insert into const_document_type (document_type_id, document_name, document_prefix, table_name, primary_key)
values (45, 'Internal Job Order', '{BC}/IJO-', 'job_order', 'job_order_id');


CREATE TABLE job_order (
    company_id CHAR(36),
    company_branch_id CHAR(36),
    job_order_id CHAR(36) PRIMARY KEY,
    document_type_id INT NOT NULL,
    document_no INT NOT NULL,
    document_prefix VARCHAR(50),
    document_identity VARCHAR(100),
    document_date DATETIME,
    event_id CHAR(36),
    customer_id CHAR(36),
    vessel_id CHAR(36),
    flag_id CHAR(36),
    class1_id CHAR(36),
    class2_id CHAR(36),
    agent_id CHAR(36),
    salesman_id CHAR(36),
    created_by CHAR(36),
    updated_by CHAR(36),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE job_order_detail (
    company_id CHAR(36),
    company_branch_id CHAR(36),
    job_order_id CHAR(36),
    job_order_detail_id CHAR(36) PRIMARY KEY,
    charge_order_id CHAR(36),
    charge_order_detail_id CHAR(36),
    product_id CHAR(36),
    product_name varchar(255),
    unit_id CHAR(36),
    supplier_id CHAR(36),
    product_type_id INT,
    quantity DECIMAL(10, 2),
    created_by CHAR(36),
    updated_by CHAR(36),
    created_at DATETIME,
    updated_at DATETIME
);

ALTER TABLE `picklist_received`
ADD COLUMN `charge_order_id` CHAR(36) NULL DEFAULT NULL AFTER `picklist_id`;

ALTER TABLE `picklist_received_detail`
ADD COLUMN `charge_order_detail_id` CHAR(36) NULL DEFAULT NULL AFTER `picklist_received_detail_id`;

ALTER TABLE `servicelist_received`
ADD COLUMN `charge_order_id` CHAR(36) NULL DEFAULT NULL AFTER `servicelist_id`;

ALTER TABLE `servicelist_received_detail`
ADD COLUMN `charge_order_detail_id` CHAR(36) NULL DEFAULT NULL AFTER `servicelist_received_detail_id`;

ALTER TABLE `good_received_note_detail`
ADD COLUMN `charge_order_detail_id` CHAR(36) NULL DEFAULT NULL AFTER `good_received_note_detail_id`;

ALTER TABLE `purchase_invoice_detail`
ADD COLUMN `charge_order_detail_id` CHAR(36) NULL DEFAULT NULL AFTER `purchase_invoice_detail_id`;

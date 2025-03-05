ALTER TABLE job_order_detail
ADD COLUMN sort_order INT(11) AFTER charge_order_detail_id,
ADD COLUMN description TEXT ;


ALTER TABLE charge_order_detail
ADD COLUMN quotation_detail_id CHAR(36) AFTER purchase_order_detail_id,
ADD COLUMN internal_notes VARCHAR(255) AFTER quotation_detail_id,

ALTER TABLE job_order_detail
ADD COLUMN internal_notes VARCHAR(255) AFTER product_type_id,

ALTER TABLE picklist_received_detail
ADD COLUMN remarks VARCHAR(255) AFTER product_id,

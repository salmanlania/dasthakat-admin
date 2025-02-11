ALTER TABLE quotation_detail 
ADD COLUMN vendor_part_no VARCHAR(255) AFTER supplier_id;

ALTER TABLE charge_order_detail 
ADD COLUMN cost_price DECIMAL(10,2) AFTER quantity,
ADD COLUMN rate DECIMAL(10,2) AFTER cost_price,
ADD COLUMN amount DECIMAL(10,2) AFTER rate,
ADD COLUMN discount_amount DECIMAL(10,2) AFTER amount,
ADD COLUMN discount_percent DECIMAL(10,2) AFTER discount_amount,
ADD COLUMN gross_amount DECIMAL(10,2) AFTER discount_percent,
ADD COLUMN purchase_order_id CHAR(36) BEFORE quantity;
ADD COLUMN purchase_order_detail_id CHAR(36) AFTER purchase_order_id;

ALTER TABLE charge_order_detail 
CHANGE COLUMN product_type product_type_id CHAR(36);
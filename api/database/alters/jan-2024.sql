
ALTER TABLE purchase_order
ADD COLUMN buyer_id CHAR(36) AFTER buyer_name,
ADD COLUMN ship_to VARCHAR(255) AFTER buyer_id,
DROP COLUMN buyer_name,
DROP COLUMN buyer_email;

ALTER TABLE purchase_order_detail
ADD COLUMN vpart VARCHAR(255) AFTER description;

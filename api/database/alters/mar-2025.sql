ALTER TABLE job_order_detail
ADD COLUMN sort_order INT(11) AFTER charge_order_detail_id,
ADD COLUMN description TEXT ;


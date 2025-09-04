
ALTER TABLE `charge_order_detail`
  ADD COLUMN `vendor_notes` TEXT DEFAULT NULL AFTER `vendor_part_no`;

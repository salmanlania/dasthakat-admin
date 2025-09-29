
  TRUNCATE TABLE  `control_access`;
  INSERT  INTO `control_access`(`module_name`,`form_name`,`route`,`permission_id`,`permission_name`,`sort_order`) 
  VALUES
  ('General Group', 'Company', 'company', 'list', 'List', 1.101),
  ('General Group', 'Company', 'company', 'add', 'Add', 1.102),
  ('General Group', 'Company', 'company', 'edit', 'Edit', 1.103),
  ('General Group', 'Company', 'company', 'delete', 'Delete', 1.104),

  ('General Group', 'Company Branch', 'company_branch', 'list', 'List', 1.101),
  ('General Group', 'Company Branch', 'company_branch', 'add', 'Add', 1.102),
  ('General Group', 'Company Branch', 'company_branch', 'edit', 'Edit', 1.103),
  ('General Group', 'Company Branch', 'company_branch', 'delete', 'Delete', 1.104),

  ('General Group', 'Settings', 'setting', 'update', 'Update', 1.101),

  ('General Group', 'Currency', 'currency', 'list', 'List', 1.101),
  ('General Group', 'Currency', 'currency', 'add', 'Add', 1.101),
  ('General Group', 'Currency', 'currency', 'edit', 'Edit', 1.101),
  ('General Group', 'Currency', 'currency', 'delete', 'Delete', 1.101),

  ('General Group', 'Salesman', 'salesman', 'list', 'List', 1.101),
  ('General Group', 'Salesman', 'salesman', 'add', 'Add', 1.102),
  ('General Group', 'Salesman', 'salesman', 'edit', 'Edit', 1.103),
  ('General Group', 'Salesman', 'salesman', 'delete', 'Delete', 1.104),

  ('General Group', 'Customer', 'customer', 'list', 'List', 1.101),
  ('General Group', 'Customer', 'customer', 'add', 'Add', 1.102),
  ('General Group', 'Customer', 'customer', 'edit', 'Edit', 1.103),
  ('General Group', 'Customer', 'customer', 'delete', 'Delete', 1.104),
  
  ('General Group', 'Customer Commission Agent', 'customer_commission_agent', 'edit', 'Edit', 1.101),

  ('General Group', 'Vendor', 'supplier', 'list', 'List', 1.101),
  ('General Group', 'Vendor', 'supplier', 'add', 'Add', 1.102),
  ('General Group', 'Vendor', 'supplier', 'edit', 'Edit', 1.103),
  ('General Group', 'Vendor', 'supplier', 'delete', 'Delete', 1.104),

  ('General Group', 'Agent', 'agent', 'list', 'List', 1.101),
  ('General Group', 'Agent', 'agent', 'add', 'Add', 1.102),
  ('General Group', 'Agent', 'agent', 'edit', 'Edit', 1.103),
  ('General Group', 'Agent', 'agent', 'delete', 'Delete', 1.104),

  ('General Group', 'Commission Agent', 'commission_agent', 'list', 'List', 1.101),
  ('General Group', 'Commission Agent', 'commission_agent', 'add', 'Add', 1.102),
  ('General Group', 'Commission Agent', 'commission_agent', 'edit', 'Edit', 1.103),
  ('General Group', 'Commission Agent', 'commission_agent', 'delete', 'Delete', 1.104),

  ('General Group', 'Sales Team', 'sales_team', 'list', 'List', 1.101),
  ('General Group', 'Sales Team', 'sales_team', 'add', 'Add', 1.102),
  ('General Group', 'Sales Team', 'sales_team', 'edit', 'Edit', 1.103),
  ('General Group', 'Sales Team', 'sales_team', 'delete', 'Delete', 1.104),

  ('General Group', 'Terms', 'terms', 'list', 'List', 1.101),
  ('General Group', 'Terms', 'terms', 'add', 'Add', 1.102),
  ('General Group', 'Terms', 'terms', 'edit', 'Edit', 1.103),
  ('General Group', 'Terms', 'terms', 'delete', 'Delete', 1.104),

  ('General Group', 'Port', 'port', 'list', 'List', 1.101),
  ('General Group', 'Port', 'port', 'add', 'Add', 1.102),
  ('General Group', 'Port', 'port', 'edit', 'Edit', 1.103),
  ('General Group', 'Port', 'port', 'delete', 'Delete', 1.104),

  ('General Group', 'Flag', 'flag', 'list', 'List', 1.101),
  ('General Group', 'Flag', 'flag', 'add', 'Add', 1.102),
  ('General Group', 'Flag', 'flag', 'edit', 'Edit', 1.103),
  ('General Group', 'Flag', 'flag', 'delete', 'Delete', 1.104),

  ('General Group', 'Cost Center', 'cost_center', 'list', 'List', 1.101),
  ('General Group', 'Cost Center', 'cost_center', 'add', 'Add', 1.102),
  ('General Group', 'Cost Center', 'cost_center', 'edit', 'Edit', 1.103),
  ('General Group', 'Cost Center', 'cost_center', 'delete', 'Delete', 1.104),

  ('General Group', 'Class', 'class', 'list', 'List', 1.101),
  ('General Group', 'Class', 'class', 'add', 'Add', 1.102),
  ('General Group', 'Class', 'class', 'edit', 'Edit', 1.103),
  ('General Group', 'Class', 'class', 'delete', 'Delete', 1.104),

  ('General Group', 'Events', 'event', 'list', 'List', 1.101),
  ('General Group', 'Events', 'event', 'add', 'Add', 1.102),
  ('General Group', 'Events', 'event', 'edit', 'Edit', 1.103),
  ('General Group', 'Events', 'event', 'delete', 'Delete', 1.104),

  ('General Group', 'Vessel', 'vessel', 'list', 'List', 1.101),
  ('General Group', 'Vessel', 'vessel', 'add', 'Add', 1.102),
  ('General Group', 'Vessel', 'vessel', 'edit', 'Edit', 1.103),
  ('General Group', 'Vessel', 'vessel', 'delete', 'Delete', 1.104),

  ('General Group', 'Vessel Commission Agent', 'vessel_commission_agent', 'edit', 'Edit', 1.101),

 ('User Management', 'User Permission', 'user_permission', 'list', 'List', 1.101),
  ('User Management', 'User Permission', 'user_permission', 'add', 'Add', 1.102),
  ('User Management', 'User Permission', 'user_permission', 'edit', 'Edit', 1.103),
  ('User Management', 'User Permission', 'user_permission', 'delete', 'Delete', 1.104),

  ('User Management', 'User', 'user', 'list', 'List', 1.101),
  ('User Management', 'User', 'user', 'add', 'Add', 1.102),
  ('User Management', 'User', 'user', 'edit', 'Edit', 1.103),
  ('User Management', 'User', 'user', 'delete', 'Delete', 1.104),

  ('General Ledger', 'Module Settings', 'gl_accounts_setting', 'gl_update', 'GL Update', 1.101),
  ('General Ledger', 'Module Settings', 'gl_inventory_setting', 'inventory_update', 'Inventory Update', 1.102),

  ('General Ledger', 'Chart Of Accounts', 'accounts', 'list', 'List', 1.101),
  ('General Ledger', 'Chart Of Accounts', 'accounts', 'add', 'Add', 1.102),
  ('General Ledger', 'Chart Of Accounts', 'accounts', 'edit', 'Edit', 1.103),
  ('General Ledger', 'Chart Of Accounts', 'accounts', 'delete', 'Delete', 1.104),

  -- ('General Ledger', 'Coa Level 1', 'coa_level1', 'list', 'List', 1.101),
  -- ('General Ledger', 'Coa Level 1', 'coa_level1', 'add', 'Add', 1.102),
  -- ('General Ledger', 'Coa Level 1', 'coa_level1', 'edit', 'Edit', 1.103),
  -- ('General Ledger', 'Coa Level 1', 'coa_level1', 'delete', 'Delete', 1.104),
  
  -- ('General Ledger', 'Coa Level 2', 'coa_level2', 'list', 'List', 1.101),
  -- ('General Ledger', 'Coa Level 2', 'coa_level2', 'add', 'Add', 1.102),
  -- ('General Ledger', 'Coa Level 2', 'coa_level2', 'edit', 'Edit', 1.103),
  -- ('General Ledger', 'Coa Level 2', 'coa_level2', 'delete', 'Delete', 1.104),
  
  -- ('General Ledger', 'Coa Level 3', 'coa_level3', 'list', 'List', 1.101),
  -- ('General Ledger', 'Coa Level 3', 'coa_level3', 'add', 'Add', 1.102),
  -- ('General Ledger', 'Coa Level 3', 'coa_level3', 'edit', 'Edit', 1.103),
  -- ('General Ledger', 'Coa Level 3', 'coa_level3', 'delete', 'Delete', 1.104),
  
  ('General Ledger', 'Customer Payment', 'customer_payment', 'list', 'List', 1.101),
  ('General Ledger', 'Customer Payment', 'customer_payment', 'add', 'Add', 1.102),
  ('General Ledger', 'Customer Payment', 'customer_payment', 'edit', 'Edit', 1.103),
  ('General Ledger', 'Customer Payment', 'customer_payment', 'delete', 'Delete', 1.104),
  
  ('General Ledger', 'Customer Payment Settlement', 'customer_payment_settlement', 'list', 'List', 1.101),
  ('General Ledger', 'Customer Payment Settlement', 'customer_payment_settlement', 'add', 'Add', 1.102),
  ('General Ledger', 'Customer Payment Settlement', 'customer_payment_settlement', 'edit', 'Edit', 1.103),
  ('General Ledger', 'Customer Payment Settlement', 'customer_payment_settlement', 'delete', 'Delete', 1.104),
  
  ('General Ledger', 'Vendor Payment', 'vendor_payment', 'list', 'List', 1.101),
  ('General Ledger', 'Vendor Payment', 'vendor_payment', 'add', 'Add', 1.102),
  ('General Ledger', 'Vendor Payment', 'vendor_payment', 'edit', 'Edit', 1.103),
  ('General Ledger', 'Vendor Payment', 'vendor_payment', 'delete', 'Delete', 1.104),
  
  ('General Ledger', 'Payment Voucher', 'payment_voucher', 'list', 'List', 1.101),
  ('General Ledger', 'Payment Voucher', 'payment_voucher', 'add', 'Add', 1.102),
  ('General Ledger', 'Payment Voucher', 'payment_voucher', 'edit', 'Edit', 1.103),
  ('General Ledger', 'Payment Voucher', 'payment_voucher', 'delete', 'Delete', 1.104),
  
  ('Inventory Setup', 'Category', 'category', 'list', 'List', 1.101),
  ('Inventory Setup', 'Category', 'category', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Category', 'category', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Category', 'category', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Sub Category', 'sub_category', 'list', 'List', 1.101),
  ('Inventory Setup', 'Sub Category', 'sub_category', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Sub Category', 'sub_category', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Sub Category', 'sub_category', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Brand', 'brand', 'list', 'List', 1.101),
  ('Inventory Setup', 'Brand', 'brand', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Brand', 'brand', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Brand', 'brand', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Unit', 'unit', 'list', 'List', 1.101),
  ('Inventory Setup', 'Unit', 'unit', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Unit', 'unit', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Unit', 'unit', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Product', 'product', 'list', 'List', 1.101),
  ('Inventory Setup', 'Product', 'product', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Product', 'product', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Product', 'product', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Validity', 'validity', 'list', 'List', 1.101),
  ('Inventory Setup', 'Validity', 'validity', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Validity', 'validity', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Validity', 'validity', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Payment', 'payment', 'list', 'List', 1.101),
  ('Inventory Setup', 'Payment', 'payment', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Payment', 'payment', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Payment', 'payment', 'delete', 'Delete', 1.104),

  ('Inventory Setup', 'Warehouse', 'warehouse', 'list', 'List', 1.101),
  ('Inventory Setup', 'Warehouse', 'warehouse', 'add', 'Add', 1.102),
  ('Inventory Setup', 'Warehouse', 'warehouse', 'edit', 'Edit', 1.103),
  ('Inventory Setup', 'Warehouse', 'warehouse', 'delete', 'Delete', 1.104),

  ('Sale Management', 'Quotation', 'quotation', 'list', 'List', 1.101),
  ('Sale Management', 'Quotation', 'quotation', 'add', 'Add', 1.102),
  ('Sale Management', 'Quotation', 'quotation', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Quotation', 'quotation', 'delete', 'Delete', 1.104),
  ('Sale Management', 'Quotation', 'quotation', 'commission_agent', 'Commission Agent', 1.105),

  ('Sale Management', 'Charge Order', 'charge_order', 'list', 'List', 1.101),
  ('Sale Management', 'Charge Order', 'charge_order', 'add', 'Add', 1.102),
  ('Sale Management', 'Charge Order', 'charge_order', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Charge Order', 'charge_order', 'delete', 'Delete', 1.104),
  ('Sale Management', 'Charge Order', 'charge_order', 'cancel', 'Cancel', 1.105),
  ('Sale Management', 'Charge Order', 'charge_order', 'commission_agent', 'Commission Agent', 1.105),

  ('Sale Management', 'Purchase Order', 'purchase_order', 'list', 'List', 1.101),
  ('Sale Management', 'Purchase Order', 'purchase_order', 'add', 'Add', 1.102),
  ('Sale Management', 'Purchase Order', 'purchase_order', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Purchase Order', 'purchase_order', 'delete', 'Delete', 1.104),
  ('Sale Management', 'Purchase Order', 'purchase_order', 'cancel', 'Cancel', 1.105),

  ('Sale Management', 'Internal Job Order', 'job_order', 'list', 'List', 1.101),
  ('Sale Management', 'Internal Job Order', 'job_order', 'add', 'Add', 1.102),
  ('Sale Management', 'Internal Job Order', 'job_order', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Internal Job Order', 'job_order', 'delete', 'Delete', 1.104),
  
  ('Sale Management', 'Service Order', 'service_order', 'list', 'List', 1.101),
  ('Sale Management', 'Service Order', 'service_order', 'add', 'Add', 1.102),
  ('Sale Management', 'Service Order', 'service_order', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Service Order', 'service_order', 'delete', 'Delete', 1.104),
  
  ('Sale Management', 'Shipment', 'shipment', 'list', 'List', 1.101),
  ('Sale Management', 'Shipment', 'shipment', 'add', 'Add', 1.102),
  ('Sale Management', 'Shipment', 'shipment', 'edit', 'Edit', 1.103),
  ('Sale Management', 'Shipment', 'shipment', 'delete', 'Delete', 1.104),
  
  ('Accounting', 'Sale Invoice', 'sale_invoice', 'list', 'List', 1.101),
  ('Accounting', 'Sale Invoice', 'sale_invoice', 'add', 'Add', 1.102),
  ('Accounting', 'Sale Invoice', 'sale_invoice', 'edit', 'Edit', 1.103),
  ('Accounting', 'Sale Invoice', 'sale_invoice', 'delete', 'Delete', 1.104),
  
  ('Warehousing', 'Picklist', 'picklist', 'list', 'List', 1.101),
  ('Warehousing', 'Picklist', 'picklist', 'add', 'Add', 1.102),
  ('Warehousing', 'Picklist', 'picklist', 'receive', 'Receive', 1.103),

  ('Warehousing', 'Servicelist', 'servicelist', 'list', 'List', 1.101),
  ('Warehousing', 'Servicelist', 'servicelist', 'add', 'Add', 1.102),
  ('Warehousing', 'Servicelist', 'servicelist', 'receive', 'Receive', 1.103),

  ('Warehousing', 'Opening Stock', 'opening_stock', 'list', 'List', 1.101),
  ('Warehousing', 'Opening Stock', 'opening_stock', 'add', 'Add', 1.102),
  ('Warehousing', 'Opening Stock', 'opening_stock', 'edit', 'Edit', 1.103),
  ('Warehousing', 'Opening Stock', 'opening_stock', 'delete', 'Delete', 1.104),

  ('Warehousing', 'Goods Received Note', 'good_received_note', 'list', 'List', 1.101),
  ('Warehousing', 'Goods Received Note', 'good_received_note', 'add', 'Add', 1.102),
  ('Warehousing', 'Goods Received Note', 'good_received_note', 'edit', 'Edit', 1.103),
  ('Warehousing', 'Goods Received Note', 'good_received_note', 'delete', 'Delete', 1.104),

  ('Warehousing', 'Purchase Return', 'purchase_return', 'list', 'List', 1.101),
  ('Warehousing', 'Purchase Return', 'purchase_return', 'add', 'Add', 1.102),
  ('Warehousing', 'Purchase Return', 'purchase_return', 'edit', 'Edit', 1.103),
  ('Warehousing', 'Purchase Return', 'purchase_return', 'delete', 'Delete', 1.104),
  
  ('Accounting', 'Sale Return', 'sale_return', 'list', 'List', 1.101),
  ('Accounting', 'Sale Return', 'sale_return', 'add', 'Add', 1.102),
  ('Accounting', 'Sale Return', 'sale_return', 'edit', 'Edit', 1.103),
  ('Accounting', 'Sale Return', 'sale_return', 'delete', 'Delete', 1.104),
  
  ('Warehousing', 'Stock Return', 'stock_return', 'list', 'List', 1.101),
  ('Warehousing', 'Stock Return', 'stock_return', 'add', 'Add', 1.102),
  ('Warehousing', 'Stock Return', 'stock_return', 'edit', 'Edit', 1.103),
  ('Warehousing', 'Stock Return', 'stock_return', 'delete', 'Delete', 1.104),

  ('Logistics', 'Scheduling', 'dispatch', 'list', 'List', 1.101),
  ('Logistics', 'Scheduling', 'dispatch', 'update', 'Update', 1.102),

  ('Accounting', 'Purchase Invoice', 'purchase_invoice', 'list', 'List', 1.101),
  ('Accounting', 'Purchase Invoice', 'purchase_invoice', 'add', 'Add', 1.102),
  ('Accounting', 'Purchase Invoice', 'purchase_invoice', 'edit', 'Edit', 1.103),
  ('Accounting', 'Purchase Invoice', 'purchase_invoice', 'delete', 'Delete', 1.104),

  ('Vendor Platform', 'Vendor Quote', 'vp_quotation', 'list', 'List', 1.101),
  ('Vendor Platform', 'Vendor Quote', 'vp_quotation', 'add', 'Add', 1.102),
  ('Vendor Platform', 'Vendor Quote', 'vp_quotation', 'edit', 'Edit', 1.103),

  ('Vendor Platform', 'Vendor Charge', 'vp_charge_order', 'list', 'List', 1.101),
  ('Vendor Platform', 'Vendor Charge', 'vp_charge_order', 'add', 'Add', 1.102),
  ('Vendor Platform', 'Vendor Charge', 'vp_charge_order', 'edit', 'Edit', 1.103),

  ('System', 'Audit', 'audit', 'list', 'List', 1.101),
  ('System', 'Audit', 'audit', 'view', 'View', 1.103),

  ('Reports', 'Quote Report', 'quote_report', 'show', 'Show', 1.101), 
  ('Reports', 'Bid Response', 'bid_response', 'show', 'Show', 1.102), 
  ('Reports', 'Bid Success', 'bid_success', 'show', 'Show', 1.103); 
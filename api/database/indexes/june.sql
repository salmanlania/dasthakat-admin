ALTER TABLE customer ADD FULLTEXT(NAME);
ALTER TABLE quotation ADD FULLTEXT(customer_ref, document_identity);
ALTER TABLE PORT ADD FULLTEXT(NAME);
ALTER TABLE vessel ADD FULLTEXT(NAME);
ALTER TABLE USER ADD FULLTEXT(user_name);
ALTER TABLE event ADD FULLTEXT(event_code);


-- Quotation table
CREATE INDEX idx_quotation_company ON quotation(company_id, company_branch_id);
CREATE INDEX idx_quotation_status ON quotation(STATUS);
CREATE INDEX idx_quotation_doc_identity ON quotation(document_identity);
CREATE INDEX idx_quotation_doc_date ON quotation(document_date);
CREATE INDEX idx_quotation_ref ON quotation(customer_ref);
CREATE INDEX idx_quotation_customer_id ON quotation(customer_id);
CREATE INDEX idx_quotation_port_id ON quotation(port_id);
CREATE INDEX idx_quotation_event_id ON quotation(event_id);
CREATE INDEX idx_quotation_vessel_id ON quotation(vessel_id);

-- Quotation Status table
CREATE INDEX idx_qs_quotation_id_created_at ON quotation_status(quotation_id, created_at DESC);

-- Customer, Event, Vessel, Port, User
CREATE INDEX idx_customer_id ON customer(customer_id);
CREATE INDEX idx_port_id ON port(port_id);
CREATE INDEX idx_event_id ON event(event_id);
CREATE INDEX idx_event_status ON event(STATUS);
CREATE INDEX idx_vessel_id ON vessel(vessel_id);
CREATE INDEX idx_user_id ON user(user_id);



-- Opening Stock Detail Indexes
CREATE INDEX idx_opening_stock_detail_opening_stock_id ON opening_stock_detail(opening_stock_id);
CREATE INDEX idx_opening_stock_detail_product_type_id ON opening_stock_detail(product_type_id);
CREATE INDEX idx_opening_stock_detail_product_id ON opening_stock_detail(product_id);
CREATE INDEX idx_opening_stock_detail_base_currency_id ON opening_stock_detail(base_currency_id);
CREATE INDEX idx_opening_stock_detail_unit_id ON opening_stock_detail(unit_id);
CREATE INDEX idx_opening_stock_detail_warehouse_id ON opening_stock_detail(warehouse_id);

-- Opening Stock Indexes
CREATE INDEX idx_opening_stock_company_id ON opening_stock(company_id);
CREATE INDEX idx_opening_stock_company_branch_id ON opening_stock(company_branch_id);
CREATE INDEX idx_opening_stock_document_type_id ON opening_stock(document_type_id);
CREATE INDEX idx_opening_stock_document_no ON opening_stock(document_no);
CREATE INDEX idx_opening_stock_document_identity ON opening_stock(document_identity);
CREATE INDEX idx_opening_stock_created_by ON opening_stock(created_by);
CREATE INDEX idx_opening_stock_updated_by ON opening_stock(updated_by);
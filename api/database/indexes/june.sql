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

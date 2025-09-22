TRUNCATE TABLE `head_accounts`;

INSERT INTO
  `head_accounts`(
    `head_account_id`,
    `company_id`,
    `head_account_name`,
    `head_account_type`
  )
VALUES
  (1, '', 'Sales Revenue Accounts', 1),
  (2, '', 'Sale Revenue/Discount Accounts', 1),
  (3, '', 'COGS Accounts', 1),
  (4, '', 'Admin Expense Accounts', 1),
  (5, '', 'Earnest Money & Guarantees Accounts', 1),
  (6, '', 'Security Deposits Accounts', 1),
  (7, '', 'Current Liabilities Accounts', 1),
  (8, '', 'Non Current Liabilities Accounts', 1),
  (9, '', 'Owner Equity Accounts', 1),
  (10, '', 'Owner Drawing Accounts', 1),
  (11, '', 'Reserves Accounts', 1),
  (12, '', 'Profit & Loss A/c', 1),
  (13, '', 'Current Assets Accounts', 2),
  (14, '', 'Non Current Assets Accounts', 2),
  (15, '', 'Financial Charges Accounts', 2),
  (16, '', 'Sales & Marketing Expense Accounts', 2),
  (17, '', 'Non Operating Income Accounts', 2),
  (18, '', 'Income Tax Expense Accounts', 2);
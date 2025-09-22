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
  (5, '', 'Financial Charges Accounts', 1),
  (6, '', 'Sales & Marketing Expense Accounts', 1),
  (7, '', 'Non Operating Income Accounts', 1),
  (8, '', 'Income Tax Expense Accounts', 1),
  (9, '', 'Current Assets Accounts', 2),
  (10, '', 'Non Current Assets Accounts', 2),
  (11, '', 'Earnest Money & Guarantees Accounts', 2),
  (12, '', 'Security Deposits Accounts', 2),
  (13, '', 'Current Liabilities Accounts', 2),
  (14, '', 'Non Current Liabilities Accounts', 2),
  (15, '', 'Owner Equity Accounts', 2),
  (16, '', 'Owner Drawing Accounts', 2),
  (17, '', 'Reserves Accounts', 2),
  (18, '', 'Profit & Loss A/c', 2);
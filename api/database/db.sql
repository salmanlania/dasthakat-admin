/*
SQLyog Ultimate v10.00 Beta1
MySQL - 8.0.30 : Database - gms2
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`gms2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `gms2`;

/*Table structure for table `company` */

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `company_id` char(36) NOT NULL,
  `company_logo` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `fax_no` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
  `gst_no` varchar(255) NOT NULL,
  `base_currency_id` int NOT NULL,
  `round_decimal_places` varchar(255) NOT NULL,
  `sale_tax_account_id` char(40) NOT NULL,
  `purchase_discount_account_id` char(40) NOT NULL,
  `sale_discount_account_id` char(40) NOT NULL,
  `other_charges_account_id` char(40) NOT NULL,
  `auto_generate_product_id` tinyint DEFAULT NULL,
  `out_of_stock` tinyint DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `partner_types` text,
  `form_access` text,
  `company_branch_id` char(36) NOT NULL,
  `fiscal_year_id` int NOT NULL,
  `user_permission_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `user_branch_access_id` char(36) NOT NULL,
  `time_zone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 CHECKSUM=1 DELAY_KEY_WRITE=1 ROW_FORMAT=DYNAMIC;

/*Data for the table `company` */

insert  into `company`(`company_id`,`company_logo`,`name`,`address`,`phone_no`,`fax_no`,`email`,`gst_no`,`base_currency_id`,`round_decimal_places`,`sale_tax_account_id`,`purchase_discount_account_id`,`sale_discount_account_id`,`other_charges_account_id`,`auto_generate_product_id`,`out_of_stock`,`status`,`partner_types`,`form_access`,`company_branch_id`,`fiscal_year_id`,`user_permission_id`,`user_id`,`user_branch_access_id`,`time_zone`,`created_at`,`created_by`,`updated_at`,`updated_by`) values ('0e683be4-af16-44eb-8bad-db9fbebee88c','bsd_logo.jpg','Bharmal Systems','Address 1','Phone 1','Fax','email','gst',3,'2','{8F72694B-2E5E-FF58-F78F-8B4079509579}','{BCF120C8-72C9-4219-DC71-0F9F6ED661CA}','{18875C33-F205-8598-4257-4CDDE75D1585}','a',0,1,1,'a:7:{i:0;a:3:{s:8:\"selected\";s:1:\"1\";s:15:\"partner_type_id\";s:1:\"1\";s:4:\"name\";s:8:\"Supplier\";}i:1;a:3:{s:8:\"selected\";s:1:\"1\";s:15:\"partner_type_id\";s:1:\"2\";s:4:\"name\";s:8:\"Customer\";}i:2;a:2:{s:15:\"partner_type_id\";s:1:\"3\";s:4:\"name\";s:8:\"Employee\";}i:3;a:2:{s:15:\"partner_type_id\";s:1:\"4\";s:4:\"name\";s:7:\"Student\";}i:4;a:2:{s:15:\"partner_type_id\";s:1:\"5\";s:4:\"name\";s:6:\"Doctor\";}i:5;a:2:{s:15:\"partner_type_id\";s:1:\"6\";s:4:\"name\";s:7:\"Patient\";}i:6;a:2:{s:15:\"partner_type_id\";s:1:\"7\";s:4:\"name\";s:8:\"Salesman\";}}','a:85:{s:15:\"common/function\";s:1:\"1\";s:18:\"gl/advance_payment\";s:1:\"1\";s:18:\"gl/advance_receipt\";s:1:\"1\";s:15:\"gl/bank_payment\";s:1:\"1\";s:15:\"gl/bank_receipt\";s:1:\"1\";s:15:\"gl/cash_payment\";s:1:\"1\";s:15:\"gl/cash_receipt\";s:1:\"1\";s:13:\"gl/coa_level1\";s:1:\"1\";s:13:\"gl/coa_level2\";s:1:\"1\";s:13:\"gl/coa_level3\";s:1:\"1\";s:11:\"gl/copy_coa\";s:1:\"1\";s:17:\"gl/credit_invoice\";s:1:\"1\";s:12:\"gl/dashboard\";s:1:\"1\";s:16:\"gl/debit_invoice\";s:1:\"1\";s:18:\"gl/journal_voucher\";s:1:\"1\";s:17:\"gl/module_setting\";s:1:\"1\";s:18:\"gl/opening_account\";s:1:\"1\";s:22:\"gl/transaction_account\";s:1:\"1\";s:19:\"inventory/dashboard\";s:1:\"1\";s:26:\"inventory/delivery_challan\";s:1:\"1\";s:24:\"inventory/goods_received\";s:1:\"1\";s:15:\"inventory/grade\";s:1:\"1\";s:16:\"inventory/length\";s:1:\"1\";s:24:\"inventory/module_setting\";s:1:\"1\";s:23:\"inventory/opening_stock\";s:1:\"1\";s:21:\"inventory/pos_invoice\";s:1:\"1\";s:17:\"inventory/product\";s:1:\"1\";s:26:\"inventory/product_category\";s:1:\"1\";s:26:\"inventory/purchase_invoice\";s:1:\"1\";s:24:\"inventory/purchase_order\";s:1:\"1\";s:25:\"inventory/purchase_return\";s:1:\"1\";s:22:\"inventory/sale_inquiry\";s:1:\"1\";s:20:\"inventory/sale_order\";s:1:\"1\";s:21:\"inventory/sale_return\";s:1:\"1\";s:26:\"inventory/sale_tax_invoice\";s:1:\"1\";s:17:\"inventory/sawmill\";s:1:\"1\";s:26:\"inventory/stock_adjustment\";s:1:\"1\";s:24:\"inventory/stock_transfer\";s:1:\"1\";s:19:\"inventory/thickness\";s:1:\"1\";s:14:\"inventory/unit\";s:1:\"1\";s:19:\"inventory/warehouse\";s:1:\"1\";s:15:\"inventory/width\";s:1:\"1\";s:14:\"production/bom\";s:1:\"1\";s:20:\"production/dashboard\";s:1:\"1\";s:18:\"production/expense\";s:1:\"1\";s:21:\"production/production\";s:1:\"1\";s:25:\"report/academy_receivable\";s:1:\"1\";s:24:\"report/activity_schedule\";s:1:\"1\";s:20:\"report/balance_sheet\";s:1:\"1\";s:10:\"report/coa\";s:1:\"1\";s:26:\"report/collection_register\";s:1:\"1\";s:16:\"report/dashboard\";s:1:\"1\";s:30:\"report/delivery_challan_report\";s:1:\"1\";s:22:\"report/document_ledger\";s:1:\"1\";s:28:\"report/goods_received_report\";s:1:\"1\";s:22:\"report/ground_schedule\";s:1:\"1\";s:23:\"report/income_statement\";s:1:\"1\";s:35:\"report/inventory_consumption_report\";s:1:\"1\";s:20:\"report/ledger_report\";s:1:\"1\";s:24:\"report/member_attendance\";s:1:\"1\";s:20:\"report/opening_stock\";s:1:\"1\";s:19:\"report/party_ledger\";s:1:\"1\";s:30:\"report/purchase_invoice_report\";s:1:\"1\";s:28:\"report/purchase_order_report\";s:1:\"1\";s:17:\"report/receivable\";s:1:\"1\";s:18:\"report/sale_report\";s:1:\"1\";s:12:\"report/stock\";s:1:\"1\";s:20:\"report/trial_balance\";s:1:\"1\";s:13:\"setup/company\";s:1:\"1\";s:20:\"setup/company_branch\";s:1:\"1\";s:21:\"setup/company_setting\";s:1:\"1\";s:14:\"setup/currency\";s:1:\"1\";s:14:\"setup/customer\";s:1:\"1\";s:15:\"setup/dashboard\";s:1:\"1\";s:14:\"setup/document\";s:1:\"1\";s:17:\"setup/fiscal_year\";s:1:\"1\";s:22:\"setup/partner_category\";s:1:\"1\";s:14:\"setup/supplier\";s:1:\"1\";s:11:\"tool/backup\";s:1:\"1\";s:14:\"tool/error_log\";s:1:\"1\";s:13:\"tool/reminder\";s:1:\"1\";s:14:\"user/dashboard\";s:1:\"1\";s:9:\"user/user\";s:1:\"1\";s:20:\"user/user_permission\";s:1:\"1\";s:17:\"user/user_profile\";s:1:\"1\";}','1',1,'1','1','1','Asia/Karachi','2015-01-27 00:00:00','1',NULL,NULL),('0e683be4-af16-44eb-8bad-db9fbebee88d','i6s4.jpg','GMS Portal','','','','','',4,'2','','','','',NULL,NULL,1,'a:7:{i:0;a:3:{s:8:\"selected\";s:1:\"1\";s:15:\"partner_type_id\";s:1:\"1\";s:4:\"name\";s:8:\"Supplier\";}i:1;a:3:{s:8:\"selected\";s:1:\"1\";s:15:\"partner_type_id\";s:1:\"2\";s:4:\"name\";s:8:\"Customer\";}i:2;a:2:{s:15:\"partner_type_id\";s:1:\"3\";s:4:\"name\";s:8:\"Employee\";}i:3;a:2:{s:15:\"partner_type_id\";s:1:\"4\";s:4:\"name\";s:7:\"Student\";}i:4;a:2:{s:15:\"partner_type_id\";s:1:\"5\";s:4:\"name\";s:6:\"Doctor\";}i:5;a:2:{s:15:\"partner_type_id\";s:1:\"6\";s:4:\"name\";s:7:\"Patient\";}i:6;a:2:{s:15:\"partner_type_id\";s:1:\"7\";s:4:\"name\";s:8:\"Salesman\";}}','a:58:{s:15:\"gl/bank_payment\";s:1:\"1\";s:15:\"gl/bank_receipt\";s:1:\"1\";s:15:\"gl/cash_payment\";s:1:\"1\";s:15:\"gl/cash_receipt\";s:1:\"1\";s:13:\"gl/coa_level1\";s:1:\"1\";s:13:\"gl/coa_level2\";s:1:\"1\";s:13:\"gl/coa_level3\";s:1:\"1\";s:16:\"gl/fund_transfer\";s:1:\"1\";s:18:\"gl/journal_voucher\";s:1:\"1\";s:17:\"gl/module_setting\";s:1:\"1\";s:18:\"gl/opening_account\";s:1:\"1\";s:31:\"inventory/branch_stock_transfer\";s:1:\"1\";s:15:\"inventory/brand\";s:1:\"1\";s:24:\"inventory/classification\";s:1:\"1\";s:15:\"inventory/color\";s:1:\"1\";s:24:\"inventory/module_setting\";s:1:\"1\";s:23:\"inventory/opening_stock\";s:1:\"1\";s:17:\"inventory/product\";s:1:\"1\";s:26:\"inventory/product_category\";s:1:\"1\";s:24:\"inventory/product_search\";s:1:\"1\";s:30:\"inventory/product_sub_category\";s:1:\"1\";s:26:\"inventory/purchase_invoice\";s:1:\"1\";s:24:\"inventory/purchase_order\";s:1:\"1\";s:25:\"inventory/purchase_return\";s:1:\"1\";s:19:\"inventory/quotation\";s:1:\"1\";s:21:\"inventory/sale_order1\";s:1:\"1\";s:21:\"inventory/sale_return\";s:1:\"1\";s:26:\"inventory/sale_tax_invoice\";s:1:\"1\";s:26:\"inventory/stock_adjustment\";s:1:\"1\";s:29:\"inventory/stock_recalculation\";s:1:\"1\";s:24:\"inventory/stock_transfer\";s:1:\"1\";s:14:\"inventory/unit\";s:1:\"1\";s:19:\"inventory/warehouse\";s:1:\"1\";s:14:\"production/bom\";s:1:\"1\";s:21:\"production/production\";s:1:\"1\";s:10:\"report/coa\";s:1:\"1\";s:20:\"report/ledger_report\";s:1:\"1\";s:20:\"report/opening_stock\";s:1:\"1\";s:25:\"report/outstanding_report\";s:1:\"1\";s:19:\"report/party_ledger\";s:1:\"1\";s:30:\"report/purchase_invoice_report\";s:1:\"1\";s:22:\"report/purchase_return\";s:1:\"1\";s:18:\"report/sale_return\";s:1:\"1\";s:22:\"report/sale_tax_report\";s:1:\"1\";s:12:\"report/stock\";s:1:\"1\";s:22:\"report/stock_financial\";s:1:\"1\";s:28:\"report/stock_transfer_report\";s:1:\"1\";s:19:\"report/transactions\";s:1:\"1\";s:20:\"report/trial_balance\";s:1:\"1\";s:20:\"setup/company_branch\";s:1:\"1\";s:21:\"setup/company_setting\";s:1:\"1\";s:14:\"setup/customer\";s:1:\"1\";s:22:\"setup/partner_category\";s:1:\"1\";s:14:\"setup/supplier\";s:1:\"1\";s:11:\"setup/terms\";s:1:\"1\";s:9:\"user/user\";s:1:\"1\";s:20:\"user/user_permission\";s:1:\"1\";s:17:\"user/user_profile\";s:1:\"1\";}','24',14,'40','48','277','Asia/Karachi','2023-03-20 07:49:38','1',NULL,NULL);

/*Table structure for table `company_branch` */

DROP TABLE IF EXISTS `company_branch`;

CREATE TABLE `company_branch` (
  `company_branch_id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL,
  `branch_code` char(3) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` text,
  `phone_no` varchar(255) DEFAULT NULL,
  `branch_account_id` char(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` char(36) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`company_branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

/*Data for the table `company_branch` */

insert  into `company_branch`(`company_branch_id`,`company_id`,`branch_code`,`name`,`address`,`phone_no`,`branch_account_id`,`created_at`,`created_by`,`updated_at`,`updated_by`) values ('0e683be4-af16-44eb-8bad-db9fbebee88c','0e683be4-af16-44eb-8bad-db9fbebee88c','KHI','KHI Branch','Address 1','',NULL,'0000-00-00 00:00:00',NULL,NULL,NULL);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `company_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_name` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `login_password` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `from_time` time DEFAULT NULL,
  `to_time` time DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `user` */

insert  into `user`(`company_id`,`user_id`,`permission_id`,`login_name`,`login_password`,`api_token`,`user_name`,`email`,`image`,`status`,`from_time`,`to_time`,`last_login`,`created_by`,`created_at`,`updated_at`,`updated_by`) values ('0e683be4-af16-44eb-8bad-db9fbebee88c','0e683be4-af16-44eb-8bad-db9fbebee88c','8b705554-d9e6-4586-a404-4a55d9b601c3','admin','21232f297a57a5a743894a0e4a801fc3','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9uX2lkIjoiXCI4YjcwNTU1NC1kOWU2LTQ1ODYtYTQwNC00YTU1ZDliNjAxYzNcIiIsInIiOjcyOTA0OSwiZXhwIjoyNDk1NzMxOTEzMjgwfQ.iyfgQpi7UdaPnlU23OVbkRM1VUWpb_SGey2sJrkCq-w',NULL,NULL,NULL,1,'08:59:59','23:59:59','2024-12-02 13:46:02',NULL,'2024-08-26 09:40:11','2024-12-02 13:46:02',NULL);

/*Table structure for table `user_branch_access` */

DROP TABLE IF EXISTS `user_branch_access`;

CREATE TABLE `user_branch_access` (
  `user_branch_access_id` char(36) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `company_id` char(36) NOT NULL,
  `company_branch_id` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `created_by` char(36) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `updated_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`user_branch_access_id`)
) ENGINE=MEMORY DEFAULT CHARSET=utf8mb3;

/*Data for the table `user_branch_access` */

/*Table structure for table `user_permission` */

DROP TABLE IF EXISTS `user_permission`;

CREATE TABLE `user_permission` (
  `user_permission_id` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `permission` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_deleted` tinyint NOT NULL DEFAULT '0',
  `created_by` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `user_permission` */

insert  into `user_permission`(`user_permission_id`,`name`,`description`,`permission`,`is_deleted`,`created_by`,`created_at`,`updated_by`,`updated_at`) values ('8b705554-d9e6-4586-a404-4a55d9b601c3','Internal Team','Team Accounts','{\"user_permission\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"user\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"parlour-request\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"parlour-master\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"quote-request\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"product-category\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"product\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1},\"setting\":{\"list\":1,\"add\":1,\"edit\":1,\"delete\":1}}',0,NULL,'2024-08-06 08:44:23',NULL,'2024-09-11 11:39:35');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

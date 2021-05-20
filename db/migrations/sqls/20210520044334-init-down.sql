ALTER TABLE `customer` DROP FOREIGN KEY `FK_7697a356e1f4b79ab3819839e95`
;
ALTER TABLE `customer` DROP FOREIGN KEY `FK_a9d874b83a7879be8538bf08b09`
;
ALTER TABLE `company` DROP FOREIGN KEY `FK_3737905699894299444476dd79c`
;
DROP INDEX `REL_7697a356e1f4b79ab3819839e9` ON `customer`
;
DROP INDEX `idx_customer_unique_email` ON `customer`
;
DROP TABLE `customer`
;
DROP INDEX `REL_3737905699894299444476dd79` ON `company`
;
DROP INDEX `idx_company_unique_email` ON `company`
;
DROP TABLE `company`
;
DROP TABLE `address`
;

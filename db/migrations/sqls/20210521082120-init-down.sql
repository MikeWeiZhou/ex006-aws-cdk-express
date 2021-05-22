ALTER TABLE `product` DROP FOREIGN KEY `fk_product_companyId`
;
ALTER TABLE `customer` DROP FOREIGN KEY `fk_customer_addressId`
;
ALTER TABLE `customer` DROP FOREIGN KEY `fk_customer_companyId`
;
ALTER TABLE `company` DROP FOREIGN KEY `fk_company_addressId`
;
DROP INDEX `idx_product_companyId_sku` ON `product`
;
DROP TABLE `product`
;
DROP INDEX `rel_customer_addressId` ON `customer`
;
DROP INDEX `idx_customer_companyId_email` ON `customer`
;
DROP TABLE `customer`
;
DROP INDEX `rel_company_addressId` ON `company`
;
DROP INDEX `idx_company_email` ON `company`
;
DROP TABLE `company`
;
DROP TABLE `address`
;

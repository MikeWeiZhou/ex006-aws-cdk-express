ALTER TABLE `sale` DROP FOREIGN KEY `fk_sale_customer_id`
;
ALTER TABLE `sale` DROP FOREIGN KEY `fk_sale_company_id`
;
ALTER TABLE `sale_item` DROP FOREIGN KEY `fk_sale_item_product_id`
;
ALTER TABLE `sale_item` DROP FOREIGN KEY `fk_sale_item_sale_id`
;
ALTER TABLE `product` DROP FOREIGN KEY `fk_product_company_id`
;
ALTER TABLE `customer` DROP FOREIGN KEY `fk_customer_address_id`
;
ALTER TABLE `customer` DROP FOREIGN KEY `fk_customer_company_id`
;
ALTER TABLE `company` DROP FOREIGN KEY `fk_company_address_id`
;
ALTER TABLE `company_user` DROP FOREIGN KEY `fk_company_user_user_id`
;
ALTER TABLE `company_user` DROP FOREIGN KEY `fk_company_user_company_id`
;
DROP INDEX `idx_user_unique_email` ON `user`
;
DROP TABLE `user`
;
DROP TABLE `sale`
;
DROP INDEX `idx_sale_item_unique_product` ON `sale_item`
;
DROP TABLE `sale_item`
;
DROP INDEX `idx_product_unique_sku` ON `product`
;
DROP TABLE `product`
;
DROP INDEX `rel_customer_address_id` ON `customer`
;
DROP INDEX `idx_customer_unique_email` ON `customer`
;
DROP TABLE `customer`
;
DROP INDEX `rel_company_address_id` ON `company`
;
DROP TABLE `company`
;
DROP INDEX `rel_company_user_user_id` ON `company_user`
;
DROP INDEX `idx_company_user_unique` ON `company_user`
;
DROP TABLE `company_user`
;
DROP TABLE `address`
;

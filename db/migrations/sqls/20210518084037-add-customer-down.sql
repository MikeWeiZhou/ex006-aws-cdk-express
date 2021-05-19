ALTER TABLE `customer` DROP FOREIGN KEY `FK_a9d874b83a7879be8538bf08b09`
;
DROP INDEX `idx_customer_unique_email` ON `customer`
;
DROP TABLE `customer`
;

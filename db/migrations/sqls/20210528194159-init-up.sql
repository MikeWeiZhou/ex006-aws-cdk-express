CREATE TABLE `address` (
`id` char(25) NOT NULL,
`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`line1` varchar(150) NOT NULL,
`postcode` varchar(10) NOT NULL,
`city` varchar(100) NOT NULL,
`province` varchar(100) NOT NULL,
`country` varchar(100) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `company` (
`id` char(25) NOT NULL,
`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`name` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
`address_id` char(25) NOT NULL,
UNIQUE INDEX `idx_company_unique_email` (`email`),
UNIQUE INDEX `rel_company_address_id` (`address_id`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `customer` (
`id` char(25) NOT NULL,
`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`first_name` varchar(50) NOT NULL,
`last_name` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
`company_id` char(25) NOT NULL,
`address_id` char(25) NOT NULL,
UNIQUE INDEX `idx_customer_unique_email` (`company_id`, `email`),
UNIQUE INDEX `rel_customer_address_id` (`address_id`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `product` (
`id` char(25) NOT NULL,
`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`name` varchar(100) NOT NULL,
`description` varchar(255) NOT NULL,
`sku` varchar(100) NOT NULL,
`price` int UNSIGNED NOT NULL,
`company_id` char(25) NOT NULL,
UNIQUE INDEX `idx_product_unique_sku` (`company_id`, `sku`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `sale_item` (
`id` char(25) NOT NULL,
`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`quantity` int UNSIGNED NOT NULL,
`price_per_unit` int UNSIGNED NOT NULL,
`total` int UNSIGNED NOT NULL,
`sale_id` char(25) NOT NULL,
`product_id` char(25) NOT NULL,
UNIQUE INDEX `idx_sale_item_unique_product` (`sale_id`, `product_id`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `sale` (
`id` char(25) NOT NULL,
`created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`status_code` varchar(25) NOT NULL,
`comments` varchar(255) NOT NULL,
`total` int UNSIGNED NOT NULL,
`company_id` char(25) NOT NULL,
`customer_id` char(25) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
ALTER TABLE `company`
ADD CONSTRAINT `fk_company_address_id` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `customer`
ADD CONSTRAINT `fk_customer_company_id` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `customer`
ADD CONSTRAINT `fk_customer_address_id` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `product`
ADD CONSTRAINT `fk_product_company_id` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `sale_item`
ADD CONSTRAINT `fk_sale_item_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `sale_item`
ADD CONSTRAINT `fk_sale_item_product_id` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `sale`
ADD CONSTRAINT `fk_sale_company_id` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `sale`
ADD CONSTRAINT `fk_sale_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;

CREATE TABLE `address` (
`id` char(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`address` varchar(150) NOT NULL,
`postcode` varchar(10) NOT NULL,
`city` varchar(100) NOT NULL,
`province` varchar(100) NOT NULL,
`country` varchar(100) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `company` (
`id` char(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`addressId` char(25) NOT NULL,
`name` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
UNIQUE INDEX `idx_company_email` (`email`),
UNIQUE INDEX `rel_company_addressId` (`addressId`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `customer` (
`id` char(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`companyId` char(25) NOT NULL,
`addressId` char(25) NOT NULL,
`firstName` varchar(50) NOT NULL,
`lastName` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
UNIQUE INDEX `idx_customer_companyId_email` (`companyId`, `email`),
UNIQUE INDEX `rel_customer_addressId` (`addressId`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `product` (
`id` char(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`companyId` char(25) NOT NULL,
`name` varchar(100) NOT NULL,
`description` varchar(255) NULL,
`sku` varchar(100) NOT NULL,
`price` int UNSIGNED NOT NULL,
`currency` char(3) NOT NULL,
UNIQUE INDEX `idx_product_companyId_sku` (`companyId`, `sku`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `sale` (
`id` char(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`customerId` char(25) NOT NULL,
`statusCode` char(3) NOT NULL,
`comments` varchar(255) NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
ALTER TABLE `company`
ADD CONSTRAINT `fk_company_addressId` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `customer`
ADD CONSTRAINT `fk_customer_companyId` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `customer`
ADD CONSTRAINT `fk_customer_addressId` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `product`
ADD CONSTRAINT `fk_product_companyId` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `sale`
ADD CONSTRAINT `fk_sale_customerId` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;

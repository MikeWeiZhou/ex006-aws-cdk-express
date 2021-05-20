CREATE TABLE `address` (
`id` varchar(25) NOT NULL,
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
`id` varchar(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`addressId` varchar(25) NOT NULL,
`name` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
UNIQUE INDEX `idx_company_unique_email` (`email`),
UNIQUE INDEX `REL_3737905699894299444476dd79` (`addressId`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
CREATE TABLE `customer` (
`id` varchar(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`companyId` varchar(25) NOT NULL,
`addressId` varchar(25) NOT NULL,
`firstName` varchar(50) NOT NULL,
`lastName` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
UNIQUE INDEX `idx_customer_unique_email` (`email`, `companyId`),
UNIQUE INDEX `REL_7697a356e1f4b79ab3819839e9` (`addressId`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
ALTER TABLE `company`
ADD CONSTRAINT `FK_3737905699894299444476dd79c` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `customer`
ADD CONSTRAINT `FK_a9d874b83a7879be8538bf08b09` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;
ALTER TABLE `customer`
ADD CONSTRAINT `FK_7697a356e1f4b79ab3819839e95` FOREIGN KEY (`addressId`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;

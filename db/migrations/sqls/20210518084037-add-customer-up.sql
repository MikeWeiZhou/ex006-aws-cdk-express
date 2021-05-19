CREATE TABLE `customer` (
`id` varchar(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`firstName` varchar(50) NOT NULL,
`lastName` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
`streetAddress` varchar(100) NOT NULL,
`city` varchar(100) NOT NULL,
`state` varchar(100) NOT NULL,
`country` varchar(100) NOT NULL,
`companyId` varchar(25) NULL,
UNIQUE INDEX `idx_customer_unique_email` (`email`, `companyId`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;
ALTER TABLE `customer`
ADD CONSTRAINT `FK_a9d874b83a7879be8538bf08b09` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
;

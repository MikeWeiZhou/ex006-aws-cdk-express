CREATE TABLE `company` (
`id` varchar(25) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`name` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
`streetAddress` varchar(100) NOT NULL,
`city` varchar(100) NOT NULL,
`state` varchar(100) NOT NULL,
`country` varchar(100) NOT NULL,
UNIQUE INDEX `idx_company_unique_email` (`email`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;

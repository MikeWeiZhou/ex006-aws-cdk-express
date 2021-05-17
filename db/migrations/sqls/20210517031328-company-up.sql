CREATE TABLE `company` (
`id` varchar(36) NOT NULL,
`name` varchar(255) NOT NULL,
`address` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
`updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
`secret` varchar(255) NOT NULL DEFAULT 'no show',
UNIQUE INDEX `IDX_b0fc567cf51b1cf717a9e8046a` (`email`),
PRIMARY KEY (`id`)
) ENGINE = InnoDB
;

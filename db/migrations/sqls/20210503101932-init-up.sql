CREATE TABLE `roles` (
  `role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`role_id`)
);

CREATE TABLE `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `role_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `users_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
);

CREATE TABLE `companies` (
  `company_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME,
  `created_user_id` INT(11) NOT NULL,
  `updated_user_id` INT(11),
  PRIMARY KEY (`company_id`),
  CONSTRAINT `companies_created_user_id` FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `companies_updated_user_id` FOREIGN KEY (`updated_user_id`) REFERENCES `users` (`user_id`)
);

CREATE TABLE `customers` (
  `customer_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `notes` TEXT,
  `email` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME,
  `created_user_id` INT(11) NOT NULL,
  `updated_user_id` INT(11),
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `customers_company_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  CONSTRAINT `customers_created_user_id` FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `customers_updated_user_id` FOREIGN KEY (`updated_user_id`) REFERENCES `users` (`user_id`)
);

CREATE TABLE `products` (
  `product_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` INT(11) NOT NULL,
  `sku` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(20,4) NOT NULL,
  `discount` DECIMAL(20,4) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME,
  `created_user_id` INT(11) NOT NULL,
  `updated_user_id` INT(11),
  PRIMARY KEY (`product_id`),
  CONSTRAINT `products_sku` UNIQUE (`sku`),
  CONSTRAINT `products_company_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  CONSTRAINT `products_created_user_id` FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `products_updated_user_id` FOREIGN KEY (`updated_user_id`) REFERENCES `users` (`user_id`)
);

CREATE TABLE `sales` (
  `sale_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` INT(11) NOT NULL,
  `customer_id` INT(11) NOT NULL,
  `discount` DECIMAL(20,4) NOT NULL,
  `paid` TINYINT(1) NOT NULL,
  `notes` TEXT,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME,
  `created_user_id` INT(11) NOT NULL,
  `updated_user_id` INT(11),
  PRIMARY KEY (`sale_id`),
  CONSTRAINT `sales_company_id` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`),
  CONSTRAINT `sales_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `sales_created_user_id` FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `sales_updated_user_id` FOREIGN KEY (`updated_user_id`) REFERENCES `users` (`user_id`)
);

CREATE TABLE `sales_products` (
  `sale_product_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sale_id` INT(11) NOT NULL,
  `product_id` INT(11) NOT NULL,
  `price` DECIMAL(20,4) NOT NULL,
  `quantity` INT(11) NOT NULL,
  `discount` DECIMAL(20,4) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME,
  `created_user_id` INT(11) NOT NULL,
  `updated_user_id` INT(11),
  PRIMARY KEY (`sale_product_id`),
  CONSTRAINT `sales_products_sale_id` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`),
  CONSTRAINT `sales_products_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `sales_products_created_user_id` FOREIGN KEY (`created_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `sales_products_updated_user_id` FOREIGN KEY (`updated_user_id`) REFERENCES `users` (`user_id`)
);

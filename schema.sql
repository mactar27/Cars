-- ============================================================
-- MAISON AUTO — Schéma MySQL (base: car)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- Table: categories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `slug`        VARCHAR(50)  NOT NULL,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: vehicules
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vehicules` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `slug`         VARCHAR(100)  NOT NULL UNIQUE,
  `brand`        VARCHAR(100)  NOT NULL,
  `model`        VARCHAR(100)  NOT NULL,
  `category_slug` VARCHAR(50)  NOT NULL,
  `fuel`         ENUM('Essence','Diesel','Électrique','Hybride') NOT NULL,
  `transmission` ENUM('Manuelle','Automatique') NOT NULL,
  `seats`        TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `power`        SMALLINT UNSIGNED NOT NULL,
  `image`        VARCHAR(255),
  `gallery`      JSON,
  `tagline`      VARCHAR(255),
  `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_slug`) REFERENCES `categories`(`slug`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: services_vehicule (location / vente)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services_vehicule` (
  `vehicule_id`  INT UNSIGNED NOT NULL,
  `service_type` ENUM('location','vente') NOT NULL,
  PRIMARY KEY (`vehicule_id`, `service_type`),
  FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: location_info
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `location_info` (
  `vehicule_id`   INT UNSIGNED NOT NULL,
  `price_per_day` DECIMAL(12,2) NOT NULL,
  `included_km`   SMALLINT UNSIGNED NOT NULL DEFAULT 200,
  `available`     BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`vehicule_id`),
  FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: vente_info
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vente_info` (
  `vehicule_id` INT UNSIGNED NOT NULL,
  `price`       DECIMAL(10,2) NOT NULL,
  `model_year`  YEAR NOT NULL,
  `mileage`     INT UNSIGNED NOT NULL DEFAULT 0,
  `condition`   ENUM('Neuf','Occasion') NOT NULL DEFAULT 'Occasion',
  PRIMARY KEY (`vehicule_id`),
  FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(255)  NOT NULL UNIQUE,
  `password_hash` VARCHAR(255)  NOT NULL,
  `role`          ENUM('client','admin') NOT NULL DEFAULT 'client',
  `first_name`    VARCHAR(100),
  `last_name`     VARCHAR(100),
  `address`       VARCHAR(255),
  `phone`         VARCHAR(30),
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table: reservations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reservations` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`      INT UNSIGNED NOT NULL,
  `vehicule_id`  INT UNSIGNED NOT NULL,
  `service_type` ENUM('location','vente') NOT NULL,
  `date_debut`   DATE,
  `date_fin`     DATE,
  `statut`       ENUM('en_attente','confirmee','annulee','terminee') NOT NULL DEFAULT 'en_attente',
  `total_amount` DECIMAL(10,2),
  `message`      TEXT,
  `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`)     REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vehicule_id`) REFERENCES `vehicules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

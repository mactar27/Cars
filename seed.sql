-- ============================================================
-- MAISON AUTO — Données initiales (seed)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Catégories
INSERT IGNORE INTO `categories` (`slug`, `name`, `description`) VALUES
  ('citadines',   'Citadines',     'Compactes, agiles et économiques pour la ville.'),
  ('berlines',    'Berlines',      'Confort et élégance pour les longs trajets.'),
  ('suv',         'SUV / Crossover','Position de conduite haute et polyvalence.'),
  ('utilitaires', 'Utilitaires',   'Volume de chargement pour les professionnels.');

-- Véhicules
INSERT IGNORE INTO `vehicules` (`slug`, `brand`, `model`, `category_slug`, `fuel`, `transmission`, `seats`, `power`, `image`, `gallery`, `tagline`) VALUES
  ('peugeot-208',      'Peugeot',       '208',       'citadines',   'Essence',    'Manuelle',   5, 100, '/cars/peugeot-208.png',      '[]', "L'icône citadine, redessinée."),
  ('renault-clio',     'Renault',       'Clio',      'citadines',   'Diesel',     'Manuelle',   5,  90, '/cars/renault-clio.png',     '[]', 'La référence française.'),
  ('tesla-model-3',    'Tesla',         'Model 3',   'berlines',    'Électrique', 'Automatique',5, 283, '/cars/tesla-model3.png',     '[]', "L'électrique sans compromis."),
  ('bmw-serie-3',      'BMW',           'Série 3',   'berlines',    'Hybride',    'Automatique',5, 245, '/cars/bmw-serie3.png',       '[]', 'Le plaisir de conduire.'),
  ('mercedes-classe-c','Mercedes-Benz', 'Classe C',  'berlines',    'Diesel',     'Automatique',5, 200, '/cars/mercedes-classe-c.png','[]', 'Le luxe au quotidien.'),
  ('audi-q5',          'Audi',          'Q5',        'suv',         'Hybride',    'Automatique',5, 265, '/cars/audi-q5.png',          '[]', "L'élégance prend de la hauteur."),
  ('porsche-macan',    'Porsche',       'Macan',     'suv',         'Essence',    'Automatique',5, 380, '/cars/porsche-macan.png',    '[]', 'Le sport, sans concession.'),
  ('renault-master',   'Renault',       'Master',    'utilitaires', 'Diesel',     'Manuelle',   3, 150, '/cars/renault-master.png',   '[]', 'Le volume au service des pros.');

-- Services par véhicule
INSERT IGNORE INTO `services_vehicule` (`vehicule_id`, `service_type`)
SELECT v.id, 'location' FROM vehicules v WHERE v.slug IN ('peugeot-208','renault-clio','tesla-model-3','mercedes-classe-c','audi-q5','renault-master');
INSERT IGNORE INTO `services_vehicule` (`vehicule_id`, `service_type`)
SELECT v.id, 'vente' FROM vehicules v WHERE v.slug IN ('peugeot-208','tesla-model-3','bmw-serie-3','mercedes-classe-c','audi-q5','porsche-macan');

-- Infos location
INSERT IGNORE INTO `location_info` (`vehicule_id`, `price_per_day`, `included_km`, `available`)
SELECT v.id, 39,  200, TRUE  FROM vehicules v WHERE v.slug = 'peugeot-208';
INSERT IGNORE INTO `location_info` (`vehicule_id`, `price_per_day`, `included_km`, `available`)
SELECT v.id, 35,  200, TRUE  FROM vehicules v WHERE v.slug = 'renault-clio';
INSERT IGNORE INTO `location_info` (`vehicule_id`, `price_per_day`, `included_km`, `available`)
SELECT v.id, 89,  300, TRUE  FROM vehicules v WHERE v.slug = 'tesla-model-3';
INSERT IGNORE INTO `location_info` (`vehicule_id`, `price_per_day`, `included_km`, `available`)
SELECT v.id, 95,  300, FALSE FROM vehicules v WHERE v.slug = 'mercedes-classe-c';
INSERT IGNORE INTO `location_info` (`vehicule_id`, `price_per_day`, `included_km`, `available`)
SELECT v.id, 110, 250, TRUE  FROM vehicules v WHERE v.slug = 'audi-q5';
INSERT IGNORE INTO `location_info` (`vehicule_id`, `price_per_day`, `included_km`, `available`)
SELECT v.id, 79,  250, TRUE  FROM vehicules v WHERE v.slug = 'renault-master';

-- Infos vente
INSERT IGNORE INTO `vente_info` (`vehicule_id`, `price`, `model_year`, `mileage`, `condition`)
SELECT v.id, 18900, 2023, 14500, 'Occasion' FROM vehicules v WHERE v.slug = 'peugeot-208';
INSERT IGNORE INTO `vente_info` (`vehicule_id`, `price`, `model_year`, `mileage`, `condition`)
SELECT v.id, 42990, 2024,     0, 'Neuf'     FROM vehicules v WHERE v.slug = 'tesla-model-3';
INSERT IGNORE INTO `vente_info` (`vehicule_id`, `price`, `model_year`, `mileage`, `condition`)
SELECT v.id, 38500, 2022, 28000, 'Occasion' FROM vehicules v WHERE v.slug = 'bmw-serie-3';
INSERT IGNORE INTO `vente_info` (`vehicule_id`, `price`, `model_year`, `mileage`, `condition`)
SELECT v.id, 45900, 2023, 19000, 'Occasion' FROM vehicules v WHERE v.slug = 'mercedes-classe-c';
INSERT IGNORE INTO `vente_info` (`vehicule_id`, `price`, `model_year`, `mileage`, `condition`)
SELECT v.id, 52900, 2023, 12000, 'Occasion' FROM vehicules v WHERE v.slug = 'audi-q5';
INSERT IGNORE INTO `vente_info` (`vehicule_id`, `price`, `model_year`, `mileage`, `condition`)
SELECT v.id, 78900, 2024,     0, 'Neuf'     FROM vehicules v WHERE v.slug = 'porsche-macan';

-- Compte admin de démonstration (mot de passe: Admin1234!)
-- Hash bcrypt de 'Admin1234!' généré en dehors du SQL
-- À créer via POST /api/auth/register ou via le script seed.js
INSERT IGNORE INTO `users` (`email`, `password_hash`, `role`, `first_name`, `last_name`) VALUES
  ('admin@admin.com', '$2a$12$placeholder_run_seed_script', 'admin', 'Administrateur', 'MAISON AUTO');

SET FOREIGN_KEY_CHECKS = 1;

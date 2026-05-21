CREATE TABLE IF NOT EXISTS airports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(5) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  airport_name VARCHAR(200) NOT NULL,
  state VARCHAR(100) NULL,
  city_group VARCHAR(120) NULL,
  popularity INT DEFAULT 0,
  UNIQUE KEY uq_airports_code (code),
  KEY idx_airports_city (city),
  KEY idx_airports_country (country),
  KEY idx_airports_popularity (popularity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

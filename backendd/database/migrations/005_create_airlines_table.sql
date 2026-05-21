CREATE TABLE IF NOT EXISTS airlines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  airline_name VARCHAR(120) NOT NULL,
  airline_code VARCHAR(10) NOT NULL,
  logo VARCHAR(255) NULL,
  UNIQUE KEY uq_airlines_code (airline_code),
  KEY idx_airlines_name (airline_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

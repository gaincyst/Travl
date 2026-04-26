CREATE TABLE IF NOT EXISTS co_travellers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NULL,
  gender ENUM('Male', 'Female', 'Other') NULL,
  date_of_birth DATE NULL,
  nationality VARCHAR(100) NULL,
  relationship VARCHAR(50) NULL,
  meal_preference VARCHAR(50) NULL,
  train_berth_preference VARCHAR(50) NULL,
  passport_no VARCHAR(30) NULL,
  passport_expiry_date DATE NULL,
  issuing_country VARCHAR(100) NULL,
  mobile VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_co_travellers_user_id (user_id),
  KEY idx_co_travellers_email (email),
  UNIQUE KEY uq_co_traveller_user_email (user_id, email),
  CONSTRAINT fk_co_travellers_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

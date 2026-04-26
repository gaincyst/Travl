CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_middle_name VARCHAR(150) NULL,
  last_name VARCHAR(100) NULL,
  gender ENUM('Male', 'Female', 'Other') NULL,
  date_of_birth DATE NULL,
  nationality VARCHAR(100) NULL,
  city_of_residence VARCHAR(100) NULL,
  state_name VARCHAR(100) NULL,
  country_code VARCHAR(10) NULL DEFAULT '+91',
  mobile VARCHAR(20) NULL,
  passport_no VARCHAR(30) NULL,
  passport_expiry_date DATE NULL,
  passport_issuing_country VARCHAR(100) NULL,
  pan_card_number VARCHAR(20) NULL,
  avatar_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_profiles_user_id (user_id),
  KEY idx_user_profiles_mobile (mobile),
  KEY idx_user_profiles_pan (pan_card_number),
  CONSTRAINT fk_user_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

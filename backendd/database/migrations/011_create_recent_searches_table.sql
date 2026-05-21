CREATE TABLE IF NOT EXISTS recent_searches (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_airport VARCHAR(5) NOT NULL,
  to_airport VARCHAR(5) NOT NULL,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_recent_searches_time (searched_at),
  CONSTRAINT fk_recent_searches_from
    FOREIGN KEY (from_airport) REFERENCES airports(code),
  CONSTRAINT fk_recent_searches_to
    FOREIGN KEY (to_airport) REFERENCES airports(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

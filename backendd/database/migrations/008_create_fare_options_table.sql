CREATE TABLE IF NOT EXISTS fare_options (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  flight_id BIGINT NOT NULL,
  fare_name VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  refundable TINYINT(1) NOT NULL DEFAULT 0,
  free_meals TINYINT(1) NOT NULL DEFAULT 0,
  free_seats TINYINT(1) NOT NULL DEFAULT 0,
  cancellation_fee INT NOT NULL DEFAULT 0,
  date_change_fee INT NOT NULL DEFAULT 0,
  refund_type VARCHAR(50) NOT NULL,
  refund_amount INT NOT NULL DEFAULT 0,
  KEY idx_fare_flight (flight_id),
  KEY idx_fare_name (fare_name),
  CONSTRAINT fk_fare_flight
    FOREIGN KEY (flight_id) REFERENCES flights(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_type VARCHAR(20) NOT NULL,
  departure_flight_id BIGINT NOT NULL,
  return_flight_id BIGINT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  total_price INT NOT NULL,
  booking_status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bookings_status (booking_status),
  CONSTRAINT fk_bookings_departure_flight
    FOREIGN KEY (departure_flight_id) REFERENCES flights(id),
  CONSTRAINT fk_bookings_return_flight
    FOREIGN KEY (return_flight_id) REFERENCES flights(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

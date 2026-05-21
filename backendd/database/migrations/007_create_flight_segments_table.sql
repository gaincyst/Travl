ALTER TABLE flights
  MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

CREATE TABLE IF NOT EXISTS flight_segments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  flight_id BIGINT NOT NULL,
  segment_order INT NOT NULL,
  from_airport VARCHAR(5) NOT NULL,
  to_airport VARCHAR(5) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration INT NOT NULL,
  layover_time INT NULL,
  aircraft VARCHAR(100) NULL,
  terminal VARCHAR(50) NULL,
  KEY idx_segments_flight (flight_id),
  CONSTRAINT fk_segments_flight
    FOREIGN KEY (flight_id) REFERENCES flights(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_segments_from_airport
    FOREIGN KEY (from_airport) REFERENCES airports(code),
  CONSTRAINT fk_segments_to_airport
    FOREIGN KEY (to_airport) REFERENCES airports(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

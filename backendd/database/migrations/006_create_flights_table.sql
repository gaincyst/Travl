CREATE TABLE IF NOT EXISTS flights (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  airline_id INT NOT NULL,
  flight_number VARCHAR(20) NOT NULL,
  from_airport VARCHAR(5) NOT NULL,
  to_airport VARCHAR(5) NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  duration INT NOT NULL,
  price INT NOT NULL,
  stops INT NOT NULL DEFAULT 0,
  cabin_class VARCHAR(50) NOT NULL,
  refundable TINYINT(1) NOT NULL DEFAULT 0,
  seats_left INT NOT NULL DEFAULT 0,
  trip_type VARCHAR(20) NOT NULL DEFAULT 'oneway',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_flights_route (from_airport, to_airport),
  KEY idx_flights_price (price),
  KEY idx_flights_stops (stops),
  CONSTRAINT fk_flights_airline
    FOREIGN KEY (airline_id) REFERENCES airlines(id),
  CONSTRAINT fk_flights_from_airport
    FOREIGN KEY (from_airport) REFERENCES airports(code),
  CONSTRAINT fk_flights_to_airport
    FOREIGN KEY (to_airport) REFERENCES airports(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE bookings
  MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

CREATE TABLE IF NOT EXISTS passengers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NULL,
  gender ENUM('Male', 'Female', 'Other') NULL,
  age INT NULL,
  KEY idx_passengers_booking (booking_id),
  CONSTRAINT fk_passengers_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

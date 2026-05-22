SET @db_name := DATABASE();

SET @col_airline_id := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'airline_id'
);
SET @sql_airline_id := IF(
  @col_airline_id = 0,
  'ALTER TABLE flights ADD COLUMN airline_id INT NOT NULL DEFAULT 1',
  'SELECT 1'
);
PREPARE stmt FROM @sql_airline_id;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_flight_number := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'flight_number'
);
SET @sql_flight_number := IF(
  @col_flight_number = 0,
  'ALTER TABLE flights ADD COLUMN flight_number VARCHAR(20) NOT NULL DEFAULT \''\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_flight_number;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_from_airport := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'from_airport'
);
SET @sql_from_airport := IF(
  @col_from_airport = 0,
  'ALTER TABLE flights ADD COLUMN from_airport VARCHAR(5) NOT NULL DEFAULT \''\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_from_airport;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_to_airport := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'to_airport'
);
SET @sql_to_airport := IF(
  @col_to_airport = 0,
  'ALTER TABLE flights ADD COLUMN to_airport VARCHAR(5) NOT NULL DEFAULT \''\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_to_airport;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_departure_time := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'departure_time'
);
SET @sql_departure_time := IF(
  @col_departure_time = 0,
  'ALTER TABLE flights ADD COLUMN departure_time TIME NOT NULL DEFAULT \''00:00:00\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_departure_time;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_arrival_time := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'arrival_time'
);
SET @sql_arrival_time := IF(
  @col_arrival_time = 0,
  'ALTER TABLE flights ADD COLUMN arrival_time TIME NOT NULL DEFAULT \''00:00:00\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_arrival_time;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_duration := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'duration'
);
SET @sql_duration := IF(
  @col_duration = 0,
  'ALTER TABLE flights ADD COLUMN duration INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql_duration;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_price := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'price'
);
SET @sql_price := IF(
  @col_price = 0,
  'ALTER TABLE flights ADD COLUMN price INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql_price;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_stops := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'stops'
);
SET @sql_stops := IF(
  @col_stops = 0,
  'ALTER TABLE flights ADD COLUMN stops INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql_stops;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_cabin_class := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'cabin_class'
);
SET @sql_cabin_class := IF(
  @col_cabin_class = 0,
  'ALTER TABLE flights ADD COLUMN cabin_class VARCHAR(50) NOT NULL DEFAULT \''Economy\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_cabin_class;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_refundable := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'refundable'
);
SET @sql_refundable := IF(
  @col_refundable = 0,
  'ALTER TABLE flights ADD COLUMN refundable TINYINT(1) NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql_refundable;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_seats_left := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'seats_left'
);
SET @sql_seats_left := IF(
  @col_seats_left = 0,
  'ALTER TABLE flights ADD COLUMN seats_left INT NOT NULL DEFAULT 0',
  'SELECT 1'
);
PREPARE stmt FROM @sql_seats_left;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_trip_type := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'trip_type'
);
SET @sql_trip_type := IF(
  @col_trip_type = 0,
  'ALTER TABLE flights ADD COLUMN trip_type VARCHAR(20) NOT NULL DEFAULT \''oneway\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_trip_type;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_from_city := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'from_city'
);
SET @sql_from_city := IF(
  @col_from_city = 0,
  'ALTER TABLE flights ADD COLUMN from_city VARCHAR(100) NOT NULL DEFAULT \''\'',
  'ALTER TABLE flights MODIFY COLUMN from_city VARCHAR(100) NOT NULL DEFAULT \''\''
);
PREPARE stmt FROM @sql_from_city;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_to_city := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'to_city'
);
SET @sql_to_city := IF(
  @col_to_city = 0,
  'ALTER TABLE flights ADD COLUMN to_city VARCHAR(100) NOT NULL DEFAULT \''\'',
  'ALTER TABLE flights MODIFY COLUMN to_city VARCHAR(100) NOT NULL DEFAULT \''\''
);
PREPARE stmt FROM @sql_to_city;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_date := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'date'
);
SET @sql_date := IF(
  @col_date = 0,
  'ALTER TABLE flights ADD COLUMN date DATE NOT NULL DEFAULT \''2000-01-01\'',
  'ALTER TABLE flights MODIFY COLUMN date DATE NOT NULL DEFAULT \''2000-01-01\''
);
PREPARE stmt FROM @sql_date;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_created_at := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'created_at'
);
SET @sql_created_at := IF(
  @col_created_at = 0,
  'ALTER TABLE flights ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  'SELECT 1'
);
PREPARE stmt FROM @sql_created_at;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT INTO flights (
  id,
  airline_id,
  flight_number,
  from_airport,
  to_airport,
  departure_time,
  arrival_time,
  duration,
  price,
  stops,
  cabin_class,
  refundable,
  seats_left,
  trip_type
) VALUES
  (1001, 1, '6E201', 'DEL', 'BOM', '06:00:00', '08:05:00', 125, 5200, 0, 'Economy', 0, 24, 'oneway'),
  (1002, 2, 'AI865', 'DEL', 'BOM', '07:30:00', '09:45:00', 135, 6100, 0, 'Economy', 1, 18, 'oneway'),
  (1003, 3, 'QP508', 'DEL', 'BOM', '09:10:00', '13:30:00', 260, 4950, 1, 'Economy', 0, 12, 'oneway'),
  (1004, 4, 'SG170', 'DEL', 'BOM', '12:00:00', '14:10:00', 130, 5600, 0, 'Economy', 0, 21, 'oneway'),
  (1005, 1, '6E225', 'DEL', 'BOM', '15:30:00', '20:05:00', 275, 4700, 1, 'Economy', 1, 9, 'oneway'),
  (1006, 2, 'AI813', 'DEL', 'BOM', '18:40:00', '20:50:00', 130, 6900, 0, 'Economy', 1, 16, 'oneway'),
  (1007, 3, 'QP512', 'DEL', 'BOM', '21:15:00', '23:20:00', 125, 5600, 0, 'Economy', 0, 30, 'oneway'),
  (1008, 1, '6E202', 'BOM', 'DEL', '06:15:00', '08:20:00', 125, 5300, 0, 'Economy', 0, 26, 'oneway'),
  (1009, 2, 'AI866', 'BOM', 'DEL', '07:50:00', '10:05:00', 135, 6200, 0, 'Economy', 1, 17, 'oneway'),
  (1010, 4, 'SG171', 'BOM', 'DEL', '09:25:00', '13:55:00', 270, 5000, 1, 'Economy', 0, 11, 'oneway'),
  (1011, 3, 'QP509', 'BOM', 'DEL', '12:35:00', '14:45:00', 130, 5500, 0, 'Economy', 0, 19, 'oneway'),
  (1012, 1, '6E226', 'BOM', 'DEL', '15:10:00', '19:35:00', 265, 4800, 1, 'Economy', 1, 8, 'oneway'),
  (1013, 2, 'AI814', 'BOM', 'DEL', '18:20:00', '20:35:00', 135, 7000, 0, 'Economy', 1, 20, 'oneway'),
  (1014, 4, 'SG172', 'BOM', 'DEL', '21:40:00', '23:55:00', 135, 5800, 0, 'Economy', 0, 29, 'oneway'),
  (1015, 1, '6E333', 'DEL', 'BLR', '05:55:00', '08:35:00', 160, 6200, 0, 'Economy', 0, 25, 'oneway'),
  (1016, 2, 'AI804', 'DEL', 'BLR', '07:15:00', '09:55:00', 160, 7200, 0, 'Economy', 1, 20, 'oneway'),
  (1017, 3, 'QP221', 'DEL', 'BLR', '09:00:00', '13:45:00', 285, 5600, 1, 'Economy', 0, 14, 'oneway'),
  (1018, 4, 'SG510', 'DEL', 'BLR', '11:30:00', '14:10:00', 160, 6400, 0, 'Economy', 0, 22, 'oneway'),
  (1019, 1, '6E338', 'DEL', 'BLR', '14:20:00', '19:05:00', 285, 5900, 1, 'Economy', 1, 10, 'oneway'),
  (1020, 2, 'AI806', 'DEL', 'BLR', '17:40:00', '20:20:00', 160, 7800, 0, 'Economy', 1, 16, 'oneway'),
  (1021, 3, 'QP225', 'DEL', 'BLR', '20:10:00', '22:50:00', 160, 6700, 0, 'Economy', 0, 28, 'oneway'),
  (1022, 1, '6E334', 'BLR', 'DEL', '06:10:00', '08:50:00', 160, 6300, 0, 'Economy', 0, 24, 'oneway'),
  (1023, 2, 'AI805', 'BLR', 'DEL', '07:35:00', '10:15:00', 160, 7300, 0, 'Economy', 1, 19, 'oneway'),
  (1024, 4, 'SG511', 'BLR', 'DEL', '09:15:00', '13:55:00', 280, 5700, 1, 'Economy', 0, 13, 'oneway'),
  (1025, 3, 'QP222', 'BLR', 'DEL', '12:05:00', '14:45:00', 160, 6500, 0, 'Economy', 0, 21, 'oneway'),
  (1026, 1, '6E339', 'BLR', 'DEL', '15:25:00', '20:05:00', 280, 6000, 1, 'Economy', 1, 9, 'oneway'),
  (1027, 2, 'AI807', 'BLR', 'DEL', '18:05:00', '20:45:00', 160, 7900, 0, 'Economy', 1, 15, 'oneway'),
  (1028, 4, 'SG512', 'BLR', 'DEL', '21:30:00', '00:10:00', 160, 6800, 0, 'Economy', 0, 27, 'oneway'),
  (1029, 5, 'EK513', 'DEL', 'DXB', '02:10:00', '05:25:00', 195, 18500, 0, 'Economy', 1, 12, 'oneway'),
  (1030, 2, 'AI917', 'DEL', 'DXB', '06:30:00', '10:00:00', 210, 17200, 0, 'Economy', 1, 20, 'oneway'),
  (1031, 1, '6E1451', 'DEL', 'DXB', '09:20:00', '16:40:00', 440, 15800, 1, 'Economy', 0, 16, 'oneway'),
  (1032, 4, 'SG019', 'DEL', 'DXB', '12:45:00', '16:10:00', 205, 16200, 0, 'Economy', 0, 18, 'oneway'),
  (1033, 5, 'EK517', 'DEL', 'DXB', '16:00:00', '19:20:00', 200, 21000, 0, 'Economy', 1, 8, 'oneway'),
  (1034, 2, 'AI921', 'DEL', 'DXB', '19:30:00', '23:05:00', 215, 19800, 0, 'Economy', 1, 14, 'oneway'),
  (1035, 1, '6E1455', 'DEL', 'DXB', '22:15:00', '05:40:00', 445, 16500, 1, 'Economy', 0, 10, 'oneway'),
  (1036, 5, 'EK514', 'DXB', 'DEL', '01:45:00', '06:05:00', 200, 19000, 0, 'Economy', 1, 11, 'oneway'),
  (1037, 2, 'AI918', 'DXB', 'DEL', '04:20:00', '08:00:00', 220, 17500, 0, 'Economy', 1, 17, 'oneway'),
  (1038, 1, '6E1452', 'DXB', 'DEL', '07:10:00', '14:30:00', 420, 16000, 1, 'Economy', 0, 15, 'oneway'),
  (1039, 4, 'SG020', 'DXB', 'DEL', '10:55:00', '14:25:00', 210, 16500, 0, 'Economy', 0, 19, 'oneway'),
  (1040, 5, 'EK518', 'DXB', 'DEL', '15:25:00', '19:45:00', 200, 21200, 0, 'Economy', 1, 9, 'oneway'),
  (1041, 2, 'AI922', 'DXB', 'DEL', '19:10:00', '23:00:00', 230, 19900, 0, 'Economy', 1, 13, 'oneway'),
  (1042, 1, '6E1456', 'DXB', 'DEL', '22:40:00', '06:15:00', 455, 16800, 1, 'Economy', 0, 10, 'oneway'),
  (1043, 1, '6E617', 'BOM', 'LKO', '06:20:00', '08:35:00', 135, 5100, 0, 'Economy', 0, 23, 'oneway'),
  (1044, 2, 'AI411', 'BOM', 'LKO', '08:10:00', '10:35:00', 145, 5900, 0, 'Economy', 1, 18, 'oneway'),
  (1045, 3, 'QP701', 'BOM', 'LKO', '10:05:00', '14:45:00', 280, 4800, 1, 'Economy', 0, 12, 'oneway'),
  (1046, 4, 'SG342', 'BOM', 'LKO', '12:50:00', '15:10:00', 140, 5200, 0, 'Economy', 0, 20, 'oneway'),
  (1047, 1, '6E620', 'BOM', 'LKO', '15:40:00', '20:15:00', 275, 4700, 1, 'Economy', 1, 9, 'oneway'),
  (1048, 2, 'AI415', 'BOM', 'LKO', '18:25:00', '20:55:00', 150, 6400, 0, 'Economy', 1, 15, 'oneway'),
  (1049, 3, 'QP704', 'BOM', 'LKO', '21:10:00', '23:30:00', 140, 5600, 0, 'Economy', 0, 28, 'oneway'),
  (1050, 1, '6E618', 'LKO', 'BOM', '06:45:00', '09:05:00', 140, 5200, 0, 'Economy', 0, 22, 'oneway'),
  (1051, 2, 'AI412', 'LKO', 'BOM', '08:30:00', '11:00:00', 150, 6000, 0, 'Economy', 1, 17, 'oneway'),
  (1052, 4, 'SG343', 'LKO', 'BOM', '10:20:00', '15:05:00', 285, 4900, 1, 'Economy', 0, 11, 'oneway'),
  (1053, 3, 'QP702', 'LKO', 'BOM', '12:15:00', '14:35:00', 140, 5300, 0, 'Economy', 0, 19, 'oneway'),
  (1054, 1, '6E621', 'LKO', 'BOM', '15:55:00', '20:25:00', 270, 4800, 1, 'Economy', 1, 8, 'oneway'),
  (1055, 2, 'AI416', 'LKO', 'BOM', '18:50:00', '21:20:00', 150, 6500, 0, 'Economy', 1, 14, 'oneway'),
  (1056, 4, 'SG344', 'LKO', 'BOM', '21:35:00', '00:05:00', 150, 5700, 0, 'Economy', 0, 26, 'oneway'),
  (1057, 5, 'EK210', 'JFK', 'LHR', '08:30:00', '20:35:00', 425, 52000, 0, 'Economy', 1, 6, 'oneway'),
  (1058, 6, 'QR702', 'JFK', 'LHR', '10:15:00', '01:10:00', 895, 48500, 1, 'Economy', 1, 7, 'oneway'),
  (1059, 5, 'EK214', 'JFK', 'LHR', '13:40:00', '01:50:00', 430, 54000, 0, 'Economy', 1, 5, 'oneway'),
  (1060, 6, 'QR704', 'JFK', 'LHR', '16:05:00', '08:20:00', 975, 47000, 1, 'Economy', 1, 6, 'oneway'),
  (1061, 5, 'EK216', 'JFK', 'LHR', '18:20:00', '06:35:00', 435, 56000, 0, 'Economy', 1, 8, 'oneway'),
  (1062, 6, 'QR708', 'JFK', 'LHR', '20:10:00', '11:05:00', 895, 46500, 1, 'Economy', 1, 7, 'oneway'),
  (1063, 5, 'EK218', 'JFK', 'LHR', '22:30:00', '10:45:00', 435, 58000, 0, 'Economy', 1, 4, 'oneway'),
  (1064, 5, 'EK211', 'LHR', 'JFK', '08:10:00', '11:00:00', 470, 51000, 0, 'Economy', 1, 6, 'oneway'),
  (1065, 6, 'QR703', 'LHR', 'JFK', '10:00:00', '03:10:00', 1030, 48000, 1, 'Economy', 1, 7, 'oneway'),
  (1066, 5, 'EK215', 'LHR', 'JFK', '13:25:00', '16:15:00', 470, 53500, 0, 'Economy', 1, 5, 'oneway'),
  (1067, 6, 'QR705', 'LHR', 'JFK', '15:55:00', '08:20:00', 985, 47500, 1, 'Economy', 1, 6, 'oneway'),
  (1068, 5, 'EK217', 'LHR', 'JFK', '18:40:00', '21:30:00', 470, 55500, 0, 'Economy', 1, 8, 'oneway'),
  (1069, 6, 'QR709', 'LHR', 'JFK', '20:30:00', '12:10:00', 940, 47200, 1, 'Economy', 1, 7, 'oneway'),
  (1070, 5, 'EK219', 'LHR', 'JFK', '22:50:00', '01:40:00', 470, 57500, 0, 'Economy', 1, 4, 'oneway');

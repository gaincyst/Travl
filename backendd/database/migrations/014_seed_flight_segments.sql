INSERT INTO flight_segments (
  flight_id,
  segment_order,
  from_airport,
  to_airport,
  departure_time,
  arrival_time,
  duration,
  layover_time,
  aircraft,
  terminal
)
SELECT
  id,
  1,
  from_airport,
  to_airport,
  departure_time,
  arrival_time,
  duration,
  NULL,
  CASE
    WHEN from_airport IN ('JFK', 'LHR', 'DXB') OR to_airport IN ('JFK', 'LHR', 'DXB') THEN 'Boeing 777'
    ELSE 'Airbus A320'
  END,
  CASE
    WHEN from_airport IN ('DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU') THEN 'T2'
    WHEN from_airport IN ('JFK', 'LHR', 'DXB') THEN 'T3'
    ELSE 'T1'
  END
FROM flights
WHERE stops = 0;

INSERT INTO flight_segments (
  flight_id,
  segment_order,
  from_airport,
  to_airport,
  departure_time,
  arrival_time,
  duration,
  layover_time,
  aircraft,
  terminal
) VALUES
  (1003, 1, 'DEL', 'JAI', '09:10:00', '10:25:00', 75, 60, 'Airbus A320', 'T2'),
  (1003, 2, 'JAI', 'BOM', '11:25:00', '13:30:00', 125, NULL, 'Airbus A320', 'T1'),
  (1005, 1, 'DEL', 'AMD', '15:30:00', '16:55:00', 85, 75, 'Airbus A320', 'T2'),
  (1005, 2, 'AMD', 'BOM', '18:10:00', '20:05:00', 115, NULL, 'Airbus A320', 'T1'),
  (1010, 1, 'BOM', 'AMD', '09:25:00', '10:55:00', 90, 60, 'Boeing 737', 'T1'),
  (1010, 2, 'AMD', 'DEL', '11:55:00', '13:55:00', 120, NULL, 'Boeing 737', 'T2'),
  (1012, 1, 'BOM', 'JAI', '15:10:00', '16:45:00', 95, 70, 'Airbus A320', 'T1'),
  (1012, 2, 'JAI', 'DEL', '17:55:00', '19:35:00', 100, NULL, 'Airbus A320', 'T3'),
  (1017, 1, 'DEL', 'HYD', '09:00:00', '11:05:00', 125, 90, 'Airbus A320', 'T2'),
  (1017, 2, 'HYD', 'BLR', '12:35:00', '13:45:00', 70, NULL, 'Airbus A320', 'T1'),
  (1019, 1, 'DEL', 'BOM', '14:20:00', '16:25:00', 125, 80, 'Airbus A320', 'T2'),
  (1019, 2, 'BOM', 'BLR', '17:45:00', '19:05:00', 80, NULL, 'Airbus A320', 'T1'),
  (1024, 1, 'BLR', 'HYD', '09:15:00', '10:25:00', 70, 85, 'Airbus A320', 'T1'),
  (1024, 2, 'HYD', 'DEL', '11:50:00', '13:55:00', 125, NULL, 'Airbus A320', 'T2'),
  (1026, 1, 'BLR', 'BOM', '15:25:00', '16:55:00', 90, 85, 'Airbus A320', 'T1'),
  (1026, 2, 'BOM', 'DEL', '18:20:00', '20:05:00', 105, NULL, 'Airbus A320', 'T2'),
  (1031, 1, 'DEL', 'BOM', '09:20:00', '11:25:00', 125, 120, 'Airbus A320', 'T2'),
  (1031, 2, 'BOM', 'DXB', '13:25:00', '16:40:00', 195, NULL, 'Boeing 777', 'T3'),
  (1035, 1, 'DEL', 'BOM', '22:15:00', '00:20:00', 125, 90, 'Airbus A320', 'T2'),
  (1035, 2, 'BOM', 'DXB', '01:50:00', '05:40:00', 230, NULL, 'Boeing 777', 'T3'),
  (1038, 1, 'DXB', 'BOM', '07:10:00', '11:40:00', 250, 95, 'Boeing 777', 'T3'),
  (1038, 2, 'BOM', 'DEL', '13:15:00', '14:30:00', 75, NULL, 'Airbus A320', 'T2'),
  (1042, 1, 'DXB', 'MCT', '22:40:00', '23:55:00', 75, 80, 'Boeing 777', 'T3'),
  (1042, 2, 'MCT', 'DEL', '01:15:00', '06:15:00', 300, NULL, 'Boeing 777', 'T3'),
  (1045, 1, 'BOM', 'DEL', '10:05:00', '12:05:00', 120, 85, 'Airbus A320', 'T2'),
  (1045, 2, 'DEL', 'LKO', '13:30:00', '14:45:00', 75, NULL, 'Airbus A320', 'T2'),
  (1047, 1, 'BOM', 'JAI', '15:40:00', '17:15:00', 95, 75, 'Airbus A320', 'T1'),
  (1047, 2, 'JAI', 'LKO', '18:30:00', '20:15:00', 105, NULL, 'Airbus A320', 'T2'),
  (1052, 1, 'LKO', 'DEL', '10:20:00', '11:35:00', 75, 90, 'Airbus A320', 'T2'),
  (1052, 2, 'DEL', 'BOM', '13:05:00', '15:05:00', 120, NULL, 'Airbus A320', 'T1'),
  (1054, 1, 'LKO', 'JAI', '15:55:00', '17:10:00', 75, 80, 'Airbus A320', 'T2'),
  (1054, 2, 'JAI', 'BOM', '18:30:00', '20:25:00', 115, NULL, 'Airbus A320', 'T1'),
  (1058, 1, 'JFK', 'DOH', '10:15:00', '19:15:00', 540, 120, 'Boeing 777', 'T4'),
  (1058, 2, 'DOH', 'LHR', '21:15:00', '01:10:00', 235, NULL, 'Boeing 777', 'T5'),
  (1060, 1, 'JFK', 'CDG', '16:05:00', '05:05:00', 780, 90, 'Boeing 777', 'T4'),
  (1060, 2, 'CDG', 'LHR', '06:35:00', '08:20:00', 105, NULL, 'Airbus A320', 'T2'),
  (1062, 1, 'JFK', 'AMS', '20:10:00', '08:10:00', 720, 90, 'Boeing 777', 'T4'),
  (1062, 2, 'AMS', 'LHR', '09:40:00', '11:05:00', 85, NULL, 'Airbus A320', 'T2'),
  (1065, 1, 'LHR', 'DOH', '10:00:00', '19:30:00', 570, 120, 'Boeing 777', 'T4'),
  (1065, 2, 'DOH', 'JFK', '21:30:00', '03:10:00', 340, NULL, 'Boeing 777', 'T4'),
  (1067, 1, 'LHR', 'CDG', '15:55:00', '18:05:00', 130, 90, 'Airbus A320', 'T2'),
  (1067, 2, 'CDG', 'JFK', '19:35:00', '08:20:00', 765, NULL, 'Boeing 777', 'T4'),
  (1069, 1, 'LHR', 'AMS', '20:30:00', '22:10:00', 100, 90, 'Airbus A320', 'T2'),
  (1069, 2, 'AMS', 'JFK', '23:40:00', '12:10:00', 750, NULL, 'Boeing 777', 'T4');

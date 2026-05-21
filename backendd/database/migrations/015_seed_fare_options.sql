INSERT INTO fare_options (
  flight_id,
  fare_name,
  price,
  refundable,
  free_meals,
  free_seats,
  cancellation_fee,
  date_change_fee,
  refund_type,
  refund_amount
)
SELECT
  id,
  'Saver',
  price,
  refundable,
  0,
  0,
  3500,
  2500,
  CASE WHEN refundable = 1 THEN 'partial' ELSE 'non-refundable' END,
  CASE WHEN refundable = 1 THEN ROUND(price * 0.6) ELSE 0 END
FROM flights;

INSERT INTO fare_options (
  flight_id,
  fare_name,
  price,
  refundable,
  free_meals,
  free_seats,
  cancellation_fee,
  date_change_fee,
  refund_type,
  refund_amount
)
SELECT
  id,
  'Flexi',
  price + 1200,
  1,
  1,
  1,
  1500,
  800,
  'partial',
  ROUND((price + 1200) * 0.75)
FROM flights;

INSERT INTO fare_options (
  flight_id,
  fare_name,
  price,
  refundable,
  free_meals,
  free_seats,
  cancellation_fee,
  date_change_fee,
  refund_type,
  refund_amount
)
SELECT
  id,
  'Premium',
  price + 2500,
  1,
  1,
  1,
  500,
  300,
  'full',
  ROUND((price + 2500) * 0.9)
FROM flights;

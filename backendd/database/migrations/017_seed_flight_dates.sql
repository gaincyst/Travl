SET @db_name := DATABASE();

SET @col_date := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db_name AND TABLE_NAME = 'flights' AND COLUMN_NAME = 'date'
);
SET @sql_date := IF(
  @col_date = 0,
  'ALTER TABLE flights ADD COLUMN `date` DATE NOT NULL DEFAULT \''2000-01-01\'',
  'SELECT 1'
);
PREPARE stmt FROM @sql_date;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE flights
SET `date` = DATE_ADD(CURDATE(), INTERVAL (id % 9) DAY);

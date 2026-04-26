import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../database/migrations');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
    ? { rejectUnauthorized: false }
    : undefined
};

const dbName = process.env.DB_NAME || 'travel_db';

const ensureDatabaseExists = async () => {
  const connection = await mysql.createConnection({
    ...dbConfig,
    multipleStatements: true
  });

  try {
    await connection.query(
      'CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
      [dbName]
    );
  } finally {
    await connection.end();
  }
};

const ensureMigrationsTable = async (connection) => {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      migration_name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

const getMigrationFiles = async () => {
  const files = await fs.readdir(migrationsDir);
  return files
    .filter((file) => /^\d+_.*\.sql$/.test(file))
    .sort((a, b) => a.localeCompare(b));
};

const getAppliedMigrations = async (connection) => {
  const [rows] = await connection.query(
    'SELECT migration_name FROM schema_migrations ORDER BY migration_name ASC'
  );

  return new Set(rows.map((row) => row.migration_name));
};

const applyMigration = async (connection, migrationFile) => {
  const filePath = path.join(migrationsDir, migrationFile);
  const sql = await fs.readFile(filePath, 'utf8');

  if (!sql.trim()) {
    console.log(`- Skipping empty migration: ${migrationFile}`);
    return;
  }

  await connection.beginTransaction();

  try {
    await connection.query(sql);
    await connection.query(
      'INSERT INTO schema_migrations (migration_name) VALUES (?)',
      [migrationFile]
    );

    await connection.commit();
    console.log(`+ Applied migration: ${migrationFile}`);
  } catch (error) {
    await connection.rollback();
    throw new Error(`Failed migration ${migrationFile}: ${error.message}`);
  }
};

const runMigrations = async () => {
  await ensureDatabaseExists();

  const connection = await mysql.createConnection({
    ...dbConfig,
    database: dbName,
    multipleStatements: true
  });

  try {
    await ensureMigrationsTable(connection);

    const migrationFiles = await getMigrationFiles();
    const appliedMigrations = await getAppliedMigrations(connection);

    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }

    let appliedCount = 0;

    for (const migrationFile of migrationFiles) {
      if (appliedMigrations.has(migrationFile)) {
        console.log(`- Already applied: ${migrationFile}`);
        continue;
      }

      await applyMigration(connection, migrationFile);
      appliedCount += 1;
    }

    if (appliedCount === 0) {
      console.log('Database is up to date.');
    } else {
      console.log(`Migrations completed. Applied ${appliedCount} migration(s).`);
    }
  } finally {
    await connection.end();
  }
};

runMigrations().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});

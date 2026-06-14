import { Pool, PoolConfig } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var zenithfitPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var zenithfitDatabaseReady: Promise<void> | undefined;
}

function getPgConfig(): PoolConfig {
  return {
    host: process.env.PGHOST ?? 'localhost',
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE ?? 'ZenithFit',
    user: process.env.PGUSER ?? 'postgres',
    password: process.env.PGPASSWORD ?? '12345',
  };
}

function getMaintenancePgConfig(): PoolConfig {
  return {
    host: process.env.PGHOST ?? 'localhost',
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGMAINTENANCE_DATABASE ?? 'postgres',
    user: process.env.PGUSER ?? 'postgres',
    password: process.env.PGPASSWORD ?? '12345',
  };
}

function quoteIdentifier(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function ensureDatabaseReady() {
  if (!globalThis.zenithfitDatabaseReady) {
    globalThis.zenithfitDatabaseReady = (async () => {
      const database = process.env.PGDATABASE ?? 'ZenithFit';
      const maintenancePool = new Pool(getMaintenancePgConfig());

      try {
        const result = await maintenancePool.query<{ exists: boolean }>(
          'SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1) AS exists',
          [database]
        );

        if (!result.rows[0]?.exists) {
          await maintenancePool.query(`CREATE DATABASE ${quoteIdentifier(database)}`);
        }
      } finally {
        await maintenancePool.end();
      }
    })().catch((error) => {
      globalThis.zenithfitDatabaseReady = undefined;
      throw error;
    });
  }

  return globalThis.zenithfitDatabaseReady;
}

export function getDbPool() {
  if (!globalThis.zenithfitPgPool) {
    globalThis.zenithfitPgPool = new Pool({
      ...getPgConfig(),
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return globalThis.zenithfitPgPool;
}

export function getDatabaseErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : '';
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null;

  if (code === '28P01') {
    return 'Неправильний пароль PostgreSQL. Перевірте PGPASSWORD для користувача postgres.';
  }

  if (code === '3D000') {
    return 'Базу даних ZenithFit не знайдено. Перевірте PGDATABASE або створіть її в PostgreSQL.';
  }

  if (code === 'ECONNREFUSED' || message.includes('ECONNREFUSED')) {
    return 'PostgreSQL не запущений або недоступний на localhost:5432.';
  }

  if (message.includes('client password must be a string')) {
    return 'PostgreSQL вимагає пароль. Перевірте PGPASSWORD у start_server.bat.';
  }

  return fallback;
}

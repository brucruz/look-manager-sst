import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import pg from "pg";
import { promises as fs } from "fs";
import path from "path";

export async function migrateToLatest() {
  const __dirname = path.resolve(path.dirname(""));

  const db = new Kysely({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "postgres",
        database: "postgres",
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "packages/core/migrations"),
    }),
  });
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  // return db;
  await db.destroy();
}

migrateToLatest();

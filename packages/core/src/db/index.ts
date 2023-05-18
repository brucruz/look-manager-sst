import { RDSData } from "@aws-sdk/client-rds-data";
import { Kysely, PostgresDialect } from "kysely";
import { DataApiDialect } from "kysely-data-api";
import { ProductDb } from "./product/product.types";
import { RDS } from "sst/node/rds";
import { Pool } from "pg";

// export * from "./product/product.queries";

export interface Database {
  product: ProductDb;
}

async function getDb() {
  const isLocal = process.env.IS_LOCAL;

  if (isLocal) {
    const db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: "localhost",
          port: 5432,
          user: "postgres",
          password: "postgres",
          database: "postgres",
        }),
      }),
    });

    return db;
  }

  return new Kysely<Database>({
    dialect: new DataApiDialect({
      mode: "postgres",
      driver: {
        // @ts-ignore
        database: RDS.db.defaultDatabaseName,
        // @ts-ignore
        secretArn: RDS.db.secretArn,
        // @ts-ignore
        resourceArn: RDS.db.clusterArn,
        client: new RDSData({}),
      },
    }),
  });
}

const rds = await getDb();

export default rds;

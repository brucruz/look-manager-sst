import { Kysely, sql } from "kysely";

export async function up(db) {
  // create extension for uuid
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  // create product table
  // await db.schema
  //   .createTable("product")
  //   .addColumn("id", "uuid", (col) =>
  //     col.primaryKey().defaultTo(sql`uuid_generate_v4()`)
  //   )
  //   .addColumn("name", "text", (col) => col.notNull())
  //   .addColumn("sku", "text")
  //   .addColumn("brand", "text")
  //   .addColumn("store", "text", (col) => col.notNull())
  //   .addColumn("store_url", "text", (col) => col.notNull())
  //   .addColumn("description", "text")
  //   // .addColumn("old_price", "decimal(12,2)", (col) => col.notNull())
  //   // .addColumn("price", "decimal(12,2)", (col) => col.notNull())
  //   .addColumn("old_price", "decimal", (col) => col.notNull())
  //   .addColumn("price", "decimal", (col) => col.notNull())
  //   .addColumn("currency", "text", (col) => col.notNull())
  //   .addColumn("installments_quantity", "integer")
  //   .addColumn("installments_value", "decimal(12,2")
  //   .addColumn("available", "boolean", (col) => col.defaultTo(false))
  //   .addColumn("sizes", "jsonb", (col) => col.defaultTo([]))
  //   .addColumn("images", "jsonb", (col) => col.defaultTo([]))
  //   .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`))
  //   .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`))
  //   .$call((qb) => {
  //     console.log(qb.compile());
  //     return qb;
  //   })
  //   .execute();

  // create product table
  await sql`CREATE TABLE IF NOT EXISTS "product" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" text NOT NULL,
    "sku" text,
    "brand" text,
    "store" text NOT NULL,
    "store_url" text NOT NULL,
    "description" text,
    "old_price" decimal(12,2) NOT NULL,
    "price" decimal(12,2) NOT NULL,
    "currency" text NOT NULL,
    "installments_quantity" integer,
    "installments_value" decimal(12,2),
    "available" boolean DEFAULT false,
    "sizes" jsonb DEFAULT '[]',
    "images" jsonb DEFAULT '[]',
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()

  )`.execute(db);
}

export async function down(db) {
  await db.schema.dropTable("product").execute(db);
}

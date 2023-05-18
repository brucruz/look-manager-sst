import { RDS, StackContext } from "sst/constructs";

export function Database({ stack }: StackContext) {
  const rds = new RDS(stack, "db", {
    engine: "postgresql11.13",
    defaultDatabaseName: "postgres",
    migrations: "packages/core/migrations",
  });

  return rds;
}

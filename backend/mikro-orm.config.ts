import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export default {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
  entities: [".dist/**/*.entity.js"],
  entitiesTs: ["**/*.entity.ts"],
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    path: "./migrations"
  }
} satisfies Options;

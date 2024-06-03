import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise({});
type DatabaseParams = null | Record<string, any>;

let dbInstance: pgPromise.IDatabase<DatabaseParams> | null = null;

const getConnection = (): pgPromise.IDatabase<DatabaseParams> => {
  if (!dbInstance) {
    const cn = `${process.env.DATABASE_PROVIDER}://${process.env.DATABASE_USER}`
      + `:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:`
      + `${process.env.DATABASE_PORT}/${process.env.DATABASE}`;
    dbInstance = pgp(cn);
  }
  return dbInstance;
};

export default getConnection;

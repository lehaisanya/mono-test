import { Database } from './schema';
import * as mysql from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';

const dialect = new MysqlDialect({
  pool: mysql.createPool({
    host: 'localhost',
    user: 'testing_user',
    password: 'hello_world',
    database: 'testing_stack',
    port: 3306,
    connectionLimit: 10
  })
});

export const db = new Kysely<Database>({ dialect });

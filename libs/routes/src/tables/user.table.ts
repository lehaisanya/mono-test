import {
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  varchar,
  boolean
} from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  age: int('age'),
  gender: mysqlEnum('gender', ['male', 'female']),
  company: varchar('company', { length: 256 }),
  isActive: boolean('isActive')
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferSelect;

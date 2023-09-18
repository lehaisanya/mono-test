import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable
} from 'kysely';

type Gender = 'male' | 'female';

export interface UserTable {
  id: Generated<number>;
  name: string;
  age: number;
  gender: Gender;
  company: string;
  isActive: ColumnType<boolean, never, boolean>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface Database {
  user: UserTable;
}

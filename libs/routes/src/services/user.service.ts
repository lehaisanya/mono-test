import { asc, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  GetUserByIdInput,
  UserCreateInput,
  UserDeleteInput,
  UserUpdateInput,
  UsersQueryInput
} from '@mono-test/schemas';
import { usersTable } from '../tables/user.table';

export const getManyUsers = async (query: UsersQueryInput) => {
  const countRequest = db
    .select({ count: sql<number>`count(*)` })
    .from(usersTable);
  let usersRequest = db
    .select()
    .from(usersTable)
    .offset(query.offset ?? 0)
    .limit(query.limit ?? 15);

  if (query.search) {
    usersRequest = usersRequest.where(ilike(usersTable.name, `%an%`));
  }

  if (query.sorting) {
    console.log(query.sorting);
    const field = query.sorting.columnAccessor;
    if (['name', 'gender', 'age', 'company', 'isActive'].includes(field)) {
      const dir = query.sorting.direction === 'desc' ? desc : asc;
      usersRequest = usersRequest.orderBy(dir(usersTable[field]));
    }
  }

  // usersRequest = usersRequest

  const [count, users] = await Promise.all([countRequest, usersRequest]);

  return { count: count[0].count, users };
};

export const getUserById = async ({ id }: GetUserByIdInput) => {
  return await db.select().from(usersTable).where(eq(usersTable.id, id));
};

export const createUser = async (data: UserCreateInput) => {
  await db.insert(usersTable).values(data);
};

export const updateUser = async ({ id, update }: UserUpdateInput) => {
  await db.update(usersTable).set(update).where(eq(usersTable.id, id));
};

export const deleteUser = async ({ id }: UserDeleteInput) => {
  await db.delete(usersTable).where(eq(usersTable.id, id));
};

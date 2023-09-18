/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  GetUserByIdInput,
  UserCreateInput,
  UserDeleteInput,
  UserUpdateInput,
  UsersQueryInput
} from '@mono-test/schemas';
import { db } from './db';
import { Expression, SqlBool, expressionBuilder } from 'kysely';
import { Database, User } from './schema';

function buildQuery(query: UsersQueryInput) {
  const eb = expressionBuilder<Database, 'user'>();
  const ands: Expression<SqlBool>[] = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    ands.push(
      eb.or([eb('name', 'like', pattern), eb('company', 'like', pattern)])
    );
  }

  if (query.gender) {
    ands.push(eb('gender', '=', query.gender));
  }

  if ('isActive' in query) {
    ands.push(eb('isActive', '=', query.isActive!));
  }

  if (query.ageFrom) {
    ands.push(eb('age', '>=', query.ageFrom));
  }

  if (query.ageTo) {
    ands.push(eb('age', '<=', query.ageTo));
  }

  return eb.and(ands);
}

export const getManyUsers = async (query: UsersQueryInput) => {
  const where = buildQuery(query);

  const countRequest = db
    .selectFrom('user')
    .select((eb) => {
      return eb.fn.count('id').as('count');
    })
    .where(where);

  const usersRequest = db
    .selectFrom('user')
    .select(['id', 'name', 'age', 'gender', 'company', 'isActive'])
    .where(where)
    .offset(query.offset ?? 0)
    .limit(query.limit ?? 15)
    .$if(!!query.sorting, (qb) => {
      return qb.orderBy(
        query.sorting!.column as keyof User,
        query.sorting?.direction
      );
    });

  const [count, users] = await Promise.all([
    countRequest.execute(),
    usersRequest.execute()
  ]);

  return {
    count: count[0].count,
    users
  };
};

export const getUserById = async ({ id }: GetUserByIdInput) => {
  return await db
    .selectFrom('user')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow();
};

export const createUser = async (data: UserCreateInput) => {
  await db.insertInto('user').values(data).execute();
};

export const updateUser = async ({ id, update }: UserUpdateInput) => {
  await db.updateTable('user').set(update).where('id', '=', id).execute();
};

export const deleteUser = async ({ id }: UserDeleteInput) => {
  await db.deleteFrom('user').where('id', '=', id).execute();
};

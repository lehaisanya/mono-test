import type { User } from '@mono-test/routes';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { api } from '../api';
import {
  UserCreateInput,
  UserUpdateData,
  UsersQueryInput
} from '@mono-test/schemas';
import { DataTableSortStatus } from 'mantine-datatable';
import { useDebouncedValue } from '@mantine/hooks';

export const PAGE_SIZE = 10;

// interface UsersContextD {
//   loadingUsers: boolean;
//   loadingEditableUser: boolean;
//   users: User[];
//   editableUser: User | null;
//   page: number;
//   count: number;
//   sorting: DataTableSortStatus;
//   search: string;
//   genderFilter: 'male' | 'female' | null;

//   initUsers: () => Promise<void>;
//   createUser: (user: UserCreateInput) => Promise<void>;
//   updateUser: (id: number, update: UserUpdateData) => Promise<void>;
//   deleteUser: (id: number) => Promise<void>;
//   setPage: (newPage: number) => Promise<void>;
//   setEditingUser: (id: number) => Promise<void>;
//   setSorting: (sorting: DataTableSortStatus) => Promise<void>;
//   setSearch: (search: string) => Promise<void>;
//   setGenderFilter: (gender: 'male' | 'female' | null) => Promise<void>;
// }

interface UsersContextState {
  loadingUsers: boolean;
  loadingEditableUser: boolean;
  users: User[];
  editableUser: User | null;
  page: number;
  count: number;
  sorting: DataTableSortStatus | null;
  search: string;
  genderFilter: 'male' | 'female' | null;
}

interface UsersContextValue extends UsersContextState {
  createUser: (user: UserCreateInput) => Promise<void>;
  updateUser: (id: number, update: UserUpdateData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setPage: (newPage: number) => Promise<void>;
  setEditingUser: (id: number) => Promise<void>;
  setSorting: (sorting: DataTableSortStatus) => Promise<void>;
  setSearch: (search: string) => Promise<void>;
  // setGenderFilter: (gender: 'male' | 'female' | null) => Promise<void>
}

const UsersContext = createContext<UsersContextValue>(null!);

export const UsersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<UsersContextState>({
    loadingUsers: true,
    loadingEditableUser: false,
    users: [],
    editableUser: null,
    page: 1,
    count: 0,
    sorting: null,
    search: '',
    genderFilter: null
  });
  const [searchValue] = useDebouncedValue(state.search, 200);

  const syncUsers = async () => {
    setState((prev) => ({ ...prev, loadingUsers: true }));

    const query: UsersQueryInput = {
      limit: PAGE_SIZE,
      offset: (state.page - 1) * PAGE_SIZE
    };

    if (searchValue) {
      query.search = searchValue;
    }

    if (state.sorting) {
      query.sorting = state.sorting;
    }

    const { count, users } = await api.user.getUsers.query(query);

    setState((prev) => ({
      ...prev,
      count,
      users,
      loadingUsers: false
    }));
  };

  useEffect(() => {
    syncUsers();
  }, [state.page, state.sorting, searchValue]);

  const createUser = async (user: UserCreateInput) => {
    await api.user.createUser.mutate(user);
    await syncUsers();
  };

  const updateUser = async (id: number, update: UserUpdateData) => {
    await api.user.updateUser.mutate({ id, update });
    await syncUsers();
  };

  const deleteUser = async (id: number) => {
    await api.user.deleteUser.mutate({ id });
    await syncUsers();
  };

  const setPage = async (newPage: number) => {
    setState((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  const setEditingUser = async (id: number) => {
    setState((prev) => ({
      ...prev,
      loadingEditableUser: true
    }));
    const user = await api.user.getUserById.query({ id });
    setState((prev) => ({
      ...prev,
      loadingEditableUser: false,
      editableUser: user
    }));
  };

  const setSorting = async (sorting: DataTableSortStatus) => {
    setState((prev) => ({ ...prev, sorting }));
  };

  const setSearch = async (val: string) => {
    setState((prev) => ({ ...prev, search: val }));
  };

  const context: UsersContextValue = {
    ...state,
    createUser,
    updateUser,
    deleteUser,
    setPage,
    setEditingUser,
    setSorting,
    setSearch
  };

  return (
    <UsersContext.Provider value={context}>{children}</UsersContext.Provider>
  );
};

export function useUsers() {
  return useContext(UsersContext);
}

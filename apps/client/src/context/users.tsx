import type { User } from '@mono-test/routes';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../api';
import {
  UserCreateInput,
  UserUpdateData,
  UsersQueryInput,
} from '@mono-test/schemas';
import { DataTableSortStatus } from 'mantine-datatable';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';

interface UsersContextState {
  loadingUsers: boolean;
  loadingEditableUser: boolean;
  users: User[];
  editableUser: User | null;
  page: number;
  pageSize: number;
  count: number;
  sorting: DataTableSortStatus | null;
  genderFilter: 'male' | 'female' | null;
  isActiveFilter: 'active' | 'unactive' | null;
}

interface UsersContextValue extends UsersContextState {
  search: string;
  ageFrom: number;
  ageTo: number;
  createUser: (user: UserCreateInput) => Promise<void>;
  updateUser: (id: number, update: UserUpdateData) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setEditingUser: (id: number) => Promise<void>;
  setPage: (newPage: number) => void;
  setPageSize: (pageSize: number) => void;
  setSorting: (sorting: DataTableSortStatus) => void;
  setSearch: (search: string) => void;
  setGenderFilter: (gender: 'male' | 'female' | null) => void;
  setIsActiveFilter: (isActive: 'active' | 'unactive' | null) => void;
  setAgeFrom: (age: number) => void;
  setAgeTo: (age: number) => void;
  setAgeRange: (range: [number, number]) => void;
  clearAgeFilters: () => void;
}

const UsersContext = createContext<UsersContextValue>(null!);

const defaultContextState: UsersContextState = {
  loadingUsers: true,
  loadingEditableUser: false,
  users: [],
  editableUser: null,
  page: 1,
  pageSize: 15,
  count: 0,
  sorting: null,
  genderFilter: null,
  isActiveFilter: null,
};

export const UsersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<UsersContextState>(defaultContextState);
  const [search, setSearch] = useDebouncedState('', 300);
  // const [ageFrom, setAgeFrom] = useDebouncedState(18, 300);
  // const [ageTo, setAgeTo] = useDebouncedState(200, 300);
  const [ageFrom, setAgeFrom] = useState(18);
  const [ageTo, setAgeTo] = useState(200);

  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, loadingUsers: true }));

    const query: UsersQueryInput = {
      limit: state.pageSize,
    };

    if (state.page !== 1) {
      query.offset = (state.page - 1) * state.pageSize;
    }

    if (search) {
      query.search = search;
    }

    if (state.sorting) {
      query.sorting = {
        column: state.sorting.columnAccessor,
        direction: state.sorting.direction,
      };
    }

    if (state.genderFilter) {
      query.gender = state.genderFilter;
    }

    if (state.isActiveFilter) {
      query.isActive = state.isActiveFilter === 'active';
    }

    if (ageFrom !== 18) {
      query.ageFrom = ageFrom;
    }

    if (ageTo !== 200) {
      query.ageTo = ageTo;
    }

    const { count, users } = await api.user.getUsers.query(query);

    setState((prev) => ({
      ...prev,
      count,
      users,
      loadingUsers: false,
    }));
  }, [
    state.page,
    state.pageSize,
    state.sorting,
    search,
    state.genderFilter,
    state.isActiveFilter,
    ageFrom,
    ageTo,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (user: UserCreateInput) => {
      await api.user.createUser.mutate(user);
      await fetchUsers();
    },
    [fetchUsers]
  );

  const updateUser = useCallback(
    async (id: number, update: UserUpdateData) => {
      await api.user.updateUser.mutate({ id, update });
      await fetchUsers();
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      await api.user.deleteUser.mutate({ id });
      await fetchUsers();
    },
    [fetchUsers]
  );

  const setEditingUser = useCallback(async (id: number) => {
    setState((prev) => ({
      ...prev,
      loadingEditableUser: true,
    }));
    const user = await api.user.getUserById.query({ id });
    setState((prev) => ({
      ...prev,
      loadingEditableUser: false,
      editableUser: user,
    }));
  }, []);

  const setPage = useCallback((newPage: number) => {
    setState((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({
      ...prev,
      pageSize,
    }));
  }, []);

  const setSorting = useCallback((sorting: DataTableSortStatus) => {
    setState((prev) => ({ ...prev, sorting }));
  }, []);

  // const setSearch = useCallback((val: string) => {
  //   setState((prev) => ({ ...prev, search: val }));
  // }, []);

  const setGenderFilter = useCallback((gender: 'male' | 'female' | null) => {
    setState((prev) => ({ ...prev, genderFilter: gender }));
  }, []);

  const setIsActiveFilter = useCallback(
    (isActive: 'active' | 'unactive' | null) => {
      setState((prev) => ({ ...prev, isActiveFilter: isActive }));
    },
    []
  );

  // const setAgeFrom = useCallback((age: number) => {
  //   setState((prev) => ({ ...prev, ageFrom: age }));
  // }, []);

  // const setAgeTo = useCallback((age: number) => {
  //   setState((prev) => ({ ...prev, ageTo: age }));
  // }, []);

  const setAgeRange = useCallback(
    ([from, to]: [number, number]) => {
      setAgeFrom(from);
      setAgeTo(to);
      // setState((prev) => ({ ...prev, ageFrom: from, ageTo: to }));
    },
    [setAgeFrom, setAgeTo]
  );

  const clearAgeFilters = useCallback(() => {
    setAgeFrom(18);
    setAgeTo(200);
    // setState((prev) => ({ ...prev, ageFrom: 18, ageTo: 200 }));
  }, [setAgeFrom, setAgeTo]);

  const context: UsersContextValue = {
    ...state,
    search,
    ageFrom,
    ageTo,
    createUser,
    updateUser,
    deleteUser,
    setPage,
    setPageSize,
    setEditingUser,
    setSorting,
    setSearch,
    setGenderFilter,
    setIsActiveFilter,
    setAgeFrom,
    setAgeTo,
    setAgeRange,
    clearAgeFilters,
  };

  return (
    <UsersContext.Provider value={context}>{children}</UsersContext.Provider>
  );
};

export function useUsers() {
  return useContext(UsersContext);
}

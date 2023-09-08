import { AppRouter, User } from '@mono-test/routes';
import { inferRouterInputs } from '@trpc/server';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';
import { api } from '../api/testApi';

export const PAGE_SIZE = 10;

type InputType = inferRouterInputs<AppRouter>['users']['userList'];

interface UsersContextState {
  loading: boolean;
  users: User[];
  count: number;
  page: number;
}

interface UsersContextValue extends UsersContextState {
  setPage: (newPage: number) => void;
  loadUsers: () => void;
}

const UsersContext = createContext<UsersContextValue>(null!);

export const UsersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<UsersContextState>({
    loading: true,
    users: [],
    count: 0,
    page: 1
  });

  const setPage = (newPage: number) =>
    setState((prev) => ({ ...prev, page: newPage }));

  const loadUsers = useCallback(async () => {
    const input: InputType = {
      offset: (state.page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    };

    setState((prev) => ({ ...prev, loading: true }));

    const { count, users } = await api.users.userList.query(input);

    setState((prev) => ({ ...prev, count, users, loading: false }));
  }, [state.page]);

  const context: UsersContextValue = {
    ...state,
    setPage,
    loadUsers
  };

  return (
    <UsersContext.Provider value={context}>{children}</UsersContext.Provider>
  );
};

export function useUsers() {
  return useContext(UsersContext);
}

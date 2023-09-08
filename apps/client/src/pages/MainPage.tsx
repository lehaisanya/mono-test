import { UsersTable } from '../components/UsersTable';
import { UsersProvider } from '../context/users';

export const MainPage = () => {
  return (
    <UsersProvider>
      <UsersTable />
    </UsersProvider>
  );
};

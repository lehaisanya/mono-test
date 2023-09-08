import { useEffect } from 'react';
import { MainPage } from '../pages/MainPage';
import { LoginPage } from '../pages/LoginPage';
import { useAuth } from '../context/auth';
import { AppShell, Button, Group, Header, Text } from '@mantine/core';
import { LoadingPage } from '../pages/LoadingPage';

export function App() {
  const { loading, user, loadUser, logout } = useAuth();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <LoginPage />;
  }

  const header = (
    <Header height={60} p="sm">
      <Group position="right" spacing="lg">
        <Text>{user.name}</Text>

        <Button color="red.4" onClick={logout}>
          Logout
        </Button>
      </Group>
    </Header>
  );

  return (
    <AppShell fixed header={header}>
      <MainPage />
    </AppShell>
  );
}

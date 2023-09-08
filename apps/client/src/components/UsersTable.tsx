import { useEffect } from 'react';
import { DataTable } from 'mantine-datatable';
import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  TextInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AddUserModal } from './AddUserModal';
import { PAGE_SIZE, useUsers } from '../context/users';
import { api } from '../api/testApi';

export const UsersTable = () => {
  const { loading, count, page, users, setPage, loadUsers } = useUsers();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Stack>
      <AddUserModal opened={opened} onClose={close} />
      <Stack>
        <Flex>
          <Group>
            <TextInput w={300} />
            <Button>Search</Button>
          </Group>
          <Box sx={{ flexGrow: 1 }} />
          <Group>
            <Button onClick={open}>Add User</Button>
          </Group>
        </Flex>
      </Stack>
      <DataTable
        withBorder
        withColumnBorders
        striped
        shadow="sm"
        idAccessor="id"
        fetching={loading}
        recordsPerPage={PAGE_SIZE}
        totalRecords={count}
        page={page}
        onPageChange={setPage}
        records={users}
        columns={[
          { accessor: 'name', noWrap: true },
          { accessor: 'age' },
          { accessor: 'gender' },
          { accessor: 'company' },
          {
            accessor: 'isActive',
            render(record) {
              return (
                <Badge color={record.isActive ? 'green' : 'red'}>
                  {record.isActive ? 'active' : 'unactive'}
                </Badge>
              );
            }
          },
          {
            accessor: 'actions',
            width: 175,
            render(record) {
              return (
                <Group noWrap spacing="xs" position="right">
                  <Button color="yellow.4">Edit</Button>
                  <Button
                    color="red.4"
                    onClick={async () => {
                      await api.users.userDelete.mutate(record.id);
                      loadUsers();
                    }}
                  >
                    Delete
                  </Button>
                </Group>
              );
            }
          }
        ]}
      />
    </Stack>
  );
};

import { DataTable } from 'mantine-datatable';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  TextInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PAGE_SIZE, useUsers } from '../context/users';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export const UsersTable = () => {
  const {
    loadingUsers,
    count,
    page,
    users,
    sorting,
    search,
    setSearch,
    setSorting,
    setPage,
    setEditingUser,
    deleteUser
  } = useUsers();

  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  return (
    <Stack>
      <AddUserModal opened={opened} onClose={close} />
      <EditUserModal opened={openedEdit} onClose={closeEdit} />
      <Stack>
        <Flex>
          <Group>
            <TextInput
              w={300}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
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
        fetching={loadingUsers}
        recordsPerPage={PAGE_SIZE}
        totalRecords={count}
        page={page}
        onPageChange={setPage}
        sortStatus={sorting!}
        onSortStatusChange={setSorting}
        records={users}
        columns={[
          { accessor: 'name', noWrap: true, sortable: true },
          { accessor: 'age', sortable: true },
          { accessor: 'gender', sortable: true },
          { accessor: 'company', sortable: true },
          {
            accessor: 'isActive',
            sortable: true,
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
            width: 100,
            textAlignment: 'right',
            render(record) {
              return (
                <Group noWrap spacing="xs" position="right">
                  <ActionIcon
                    color="yellow"
                    onClick={() => {
                      openEdit();
                      setEditingUser(record.id);
                    }}
                  >
                    <IconEdit />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={async () => {
                      await deleteUser(record.id);
                    }}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              );
            }
          }
        ]}
      />
    </Stack>
  );
};

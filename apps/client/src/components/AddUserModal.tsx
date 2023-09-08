import {
  Button,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { FC } from 'react';
import { z } from 'zod';
import { api } from '../api/testApi';
import { useUsers } from '../context/users';

type AddUserModelProps = {
  opened: boolean;
  onClose: () => void;
};

const schema = z.object({
  name: z.string().min(2).max(256),
  age: z.number().min(18),
  gender: z.enum(['male', 'female']),
  company: z.string().min(2).max(256)
});

export const AddUserModal: FC<AddUserModelProps> = ({ opened, onClose }) => {
  const { loadUsers } = useUsers();
  const form = useForm({
    initialValues: {
      name: '',
      age: undefined,
      gender: undefined,
      company: ''
    },
    validate: zodResolver(schema)
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Add new user">
      <form
        onSubmit={form.onSubmit(async (values) => {
          await api.users.userCreate.mutate(values as any);
          onClose();
          loadUsers();
        })}
      >
        <Stack>
          <TextInput label="Name" {...form.getInputProps('name')} />
          <NumberInput label="Age" {...form.getInputProps('age')} />
          <Select
            label="Gender"
            data={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' }
            ]}
            {...form.getInputProps('gender')}
          />
          <TextInput label="Company" {...form.getInputProps('company')} />
          <Button type="submit">Add</Button>
        </Stack>
      </form>
    </Modal>
  );
};

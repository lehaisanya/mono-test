import {
  Button,
  Center,
  Checkbox,
  Loader,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput
} from '@mantine/core';
import { FC, useEffect } from 'react';
import { useUsers } from '../context/users';
import { useForm, zodResolver } from '@mantine/form';
import { userUpdateDataSchema } from '@mono-test/schemas';

type EditUserModalProps = {
  opened: boolean;
  onClose: () => void;
};

export const EditUserModal: FC<EditUserModalProps> = ({ opened, onClose }) => {
  const { loadingEditableUser, editableUser, updateUser } = useUsers();
  const form = useForm({
    initialValues: {
      name: '',
      age: undefined,
      gender: undefined,
      company: '',
      isActive: true
    },
    validate: zodResolver(userUpdateDataSchema)
  });

  useEffect(() => {
    if (!editableUser) return;
    const { id, ...values } = editableUser;
    form.setValues(values as any);
    form.resetDirty();
  }, [editableUser]);

  if (loadingEditableUser) {
    return (
      <Modal opened={opened} onClose={onClose} title="Edit user">
        <Center>
          <Loader variant="oval" />
        </Center>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Edit user">
      <form
        onSubmit={form.onSubmit(async (values) => {
          onClose();
          await updateUser(editableUser!.id, values);
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
          <Checkbox
            label="Is active"
            {...form.getInputProps('isActive', { type: 'checkbox' })}
          />
          <Button type="submit">Update</Button>
        </Stack>
      </form>
    </Modal>
  );
};

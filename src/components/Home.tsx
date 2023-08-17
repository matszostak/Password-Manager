import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, Dialog, TextInput } from "@mantine/core";
import { useDisclosure, useId, useInputState } from "@mantine/hooks";
import { IconCheck, IconLock, IconX } from "@tabler/icons-react";
import { saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false); // Modal stuff
  const [dbName, setDbName] = useInputState('')
  const [password, setPassword] = useInputState('')
  const [p, setP] = useState<string | null>()

  const openExistingDatabase = async () => {
    console.log('open existing')
  }

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    setP(pathOfNewDB)
    console.log("Password: " + password)
    console.log("Path: " + p)
  }

  const form = useForm({
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : setPassword(String(value)),
    },
  });

  return (
    <>
      <Title>Home</Title>
      <Modal opened={opened} onClose={close} title="Create new password database" size="md">
        <Box maw={340} mx="auto">
          <form onSubmit={form.onSubmit(() => {
            createDatabase()
            close()
          })}>
            <PasswordInput
              label="Password"
              placeholder="Password"
              {...form.getInputProps('password')}
            />

            <PasswordInput
              mt="sm"
              label="Confirm password"
              placeholder="Confirm password"
              {...form.getInputProps('confirmPassword')}
            />

            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Center>
        <Button onClick={open} color="green" size="md">Create Database</Button>
        <Space w="md" />
        <Button onClick={openExistingDatabase} size="md">Open Database</Button>
      </Center>
      <Space h='md' />
      <Title size='md'>Available databases:</Title>
      {/* TODO: save paths of the created databases in order to display them here, in file OR in localStorage */}
      <Text>{p}</Text> {/* TODO: List databases with 'open' buttons */}
      <Button
        variant="outline"
        onClick={() =>
          notifications.show({
            message: '',
            title: 'Database created',
            color: "green",
            icon: <IconCheck size="0.9rem" />,
            autoClose: 3600,
          })
        }
      >
        Show
      </Button>
    </>
  );
}

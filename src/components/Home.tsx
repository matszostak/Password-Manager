import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";
import { useForm } from "@mantine/form";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false); // Modal stuff
  const [password, setPassword] = useInputState('')
  const [p, setP] = useState<string | null>() // TODO: make it into a list, currently it only shows the latest db

  const openExistingDatabase = async () => {
    console.log('open existing')
  }

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    setP(pathOfNewDB)
    console.log("Password: " + password)
    console.log("Path: " + pathOfNewDB)
  }

  const form = useForm({
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : setPassword(String(values.password)),
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
              <Button type="submit" onClick={() => {
                setPassword(String(form.values.confirmPassword))
                console.log('test' + password)
              }
              }>Submit</Button>
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
    </>
  );
}

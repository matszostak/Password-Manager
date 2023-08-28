import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, Flex, SimpleGrid, Card } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { openExistingDatabase, saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false); // Modal stuff
  const [password, setPassword] = useInputState('') // Keep it a hook for now
  const [p, setP] = useState<string[]>([]) // TODO: make it into a list, currently it only shows the latest db

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    p.push(String(pathOfNewDB))
    console.log("Password: " + password)
    console.log("Path: " + pathOfNewDB)
    form.reset();
  }

  const form = useForm({
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : setPassword(String(values.password)),
    },
  });

  const openDatabase = async () => { // TODO: choose path first, then ask for password
    let openpass: string = ''
    modals.open({
      title: 'Subscribe to newsletter',
      children: (
        <>
          <Box maw={340} mx="auto">
            <PasswordInput
              label="Password"
              placeholder="Password"
              onChange={(e) => {
                openpass = e.target.value
                console.log(openpass)
              }}
            />
            <Group position="right" mt="md">
              <Button onClick={() => {
                modals.closeAll()
                openExistingDatabase(openpass)
              }}>
                Submit
              </Button>
            </Group>
          </Box>
        </>
      ),
    })
    console.log(openpass)
    return openpass
  }

  const mapDatabaseFiles = () => {
    return (
      p.map(
        (databasePath) =>
          <>
            <Flex
              mih={40}
              gap="xl"
              justify="flex-start"
              align="center"
              direction="row"
              wrap="nowrap"
            >
              <Text key={databasePath}>{databasePath}</Text> { /* TODO: List databases with 'open' buttons */}
              <Space w={120} />
              <Button variant="outline" color="green" size="sm" w={80}>Open</Button> { /* TODO: Open database using this path specifically */}
            </Flex>
          </>
      )
    )
  }

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
              }}>
                Submit
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Center>
        <Button onClick={open} color="green" size="md">Create Database</Button>
        <Space w="md" />
        <Button onClick={() => openDatabase()} size="md">Open Database</Button>
      </Center>
      <Space h='xl' />
      <Title size={20}>Available databases:</Title>
      {/* TODO: save paths of the created databases in order to display them here, in file OR in localStorage <== local storage is better */}
      {/* TODO: also save paths when successful open */}
      {mapDatabaseFiles()}
    </>
  );
}

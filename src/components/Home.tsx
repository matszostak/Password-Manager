import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, Flex } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { openExistingDatabase, saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { open as open_tauri } from '@tauri-apps/api/dialog';
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false); // Modal stuff
  const [password, setPassword] = useInputState('') // Keep it a hook for now
  const [p, setP] = useState<string[]>([]) // TODO: make it into a list, currently it only shows the latest db

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password) /* TODO: check if pathOfNewDB is null (or just make it work) */
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
    const selected = await open_tauri({
      multiple: false,
      filters: [{
        name: '.secpass',
        extensions: ['secpass']
      }]
    });
    console.log('selected:', selected)
    if (selected) {
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
                  openExistingDatabase(openpass, String(selected))
                }}>
                  Submit
                </Button>
              </Group>
            </Box>
          </>
        ),
      })
    } else {
      console.log('no file selected')
      notifications.show({
        message: 'Please select a valid database file.',
        title: 'You have to choose a database file!',
        color: "red",
        icon: <IconX  size="0.9rem" />,
        autoClose: 3600,
      })
    }
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

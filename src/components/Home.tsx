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
  // TODO: Save it to lacalStorage or something to get persistence AND if saved, check if file still exists on application startup (in case user deleted file manually)
  const [paths] = useState<string[]>([])
  const [isDatabaseOpened, setIsDatabaseOpened] = useState(false)

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    if (pathOfNewDB) {
      paths.push(String(pathOfNewDB))
      console.log("Password: " + password)
      console.log("Path: " + pathOfNewDB)
      form.reset()
      setIsDatabaseOpened(true)
    } else {
      notifications.show({
        message: 'Please create a database file.',
        title: 'Database file not created!',
        color: "red",
        icon: <IconX size="0.9rem" />,
        autoClose: 3600,
      })
      console.log("Path is empty", pathOfNewDB)
      form.reset();
    }

  }

  const form = useForm({
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : setPassword(String(values.password)),
    },
  });

  const openDatabase = async () => {
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
        title: 'Open database',
        children: (
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
                setIsDatabaseOpened(true)
              }}>
                Open
              </Button>
            </Group>
          </Box>
        ),
      })
    } else {
      console.log('no file selected')
      notifications.show({
        message: 'Please select a valid database file.',
        title: 'You have to choose a database file!',
        color: "red",
        icon: <IconX size="0.9rem" />,
        autoClose: 3600,
      })
    }
    return openpass
  }

  const mapDatabaseFiles = () => {
    // TODO: return something else if paths array is empty
    return (
      paths.map(
        (databasePath) =>
          <Flex
            mih={40}
            gap="xl"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="nowrap"
          >
            <Group w={360}>
              <Text key={databasePath}>{databasePath}</Text>
            </Group>
            <Button variant="outline" color="green" size="sm" w={80}>Open</Button> { /* TODO: Open database using this path specifically */}
          </Flex>
      )
    )
  }

  return (
    <>
      <Title>Home</Title>
      {!isDatabaseOpened ? (
        <>
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
          {/* TODO: also save paths when successful open */}
          {mapDatabaseFiles()}
        </>
      ) : (
        <>
          <Button color='red' onClick={
            () => {
              setIsDatabaseOpened(false)
              console.log('database closed.')
            }
          }>Close database</Button>
          <Text>DB Opened.</Text>
        </>
      )}

    </>
  );
}

import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, Flex } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { openExistingDatabase, saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { open as open_tauri } from '@tauri-apps/api/dialog';
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";
import { fileExtensionWithDot, fileExtensionWithoutDot } from "../utils/constants";

import * as Constants from '../utils/constants'
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import Database from "./Database";


export default function Home() {
  const [opened, { open, close }] = useDisclosure(false); // Modal stuff
  const [password, setPassword] = useInputState('') // Keep it a hook for now
  // TODO: Save it to lacalStorage or something to get persistence AND if saved, check if file still exists on application startup (in case user deleted file manually)
  // paths also get cleared when using navbar so it has to be changed.
  const [paths] = useState<string[]>([])
  const [dbContent, setDbContent] = useState('')
  const [_refreshKey, setRefreshKey] = useState(0);

  // TODO: save created paths or opened paths to file
  useState(() => {
    const handleRead = async () => {
      const f: string = Constants.profileFile
      const contents: string = await (readTextFile(f, { dir: BaseDirectory.AppData }))
      console.log(JSON.parse(contents).savedPaths)
      for (const p of JSON.parse(contents).savedPaths) {
        paths.push(p) // TODO: push only if element does not exist in array
      }
    }
    handleRead().then(() => setRefreshKey(oldKey => oldKey + 1)) // REFRESH KEY FOR THE WIN THIS IS AMAZING!!!
  })

  const [isDatabaseOpened, setIsDatabaseOpened] = useState(false)

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    console.log('this notification 0')
    if (pathOfNewDB) {
      console.log('this notification 1')
      paths.indexOf(String(pathOfNewDB)) === -1 ? paths.push(String(pathOfNewDB)) : console.log("This item already exists");
      form.reset()
      // setIsDatabaseOpened(true) <- maybe TODO - right now the database is immediately encrypted on create so it cannot return a nice JSON, but it works pretty well now
      // (note: user creates db, db is encrypted, user has to open db to start.)
      notifications.show({
        message: 'Database was created. Open it using Your password!',
        title: 'Database created!',
        color: 'green',
        icon: <IconCheck size="0.9rem" />,
        autoClose: 3600,
      })
    } else {
      console.log('this notification 2')
      notifications.show({
        message: 'Please create a database file.',
        title: 'Database file not created!',
        color: "red",
        icon: <IconX size="0.9rem" />,
        autoClose: 3600,
      })
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
        name: fileExtensionWithDot,
        extensions: [fileExtensionWithoutDot]
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
              }}
            />
            <Group position="right" mt="md">
              <Button onClick={async () => {
                modals.closeAll()
                let check: string = String(await openExistingDatabase(openpass, String(selected)))
                if (check === "Database does not exist." || check === "Wrong password!") {
                  notifications.show({
                    message: 'Reason: ' + check,
                    title: 'Could not open database!',
                    color: "red",
                    icon: <IconX size="0.9rem" />,
                    autoClose: 3600,
                  })
                } else {
                  setIsDatabaseOpened(true)
                  setDbContent(check)
                  return check
                }
                paths.indexOf(String(selected)) === -1 ? paths.push(String(selected)) : console.log("This item already exists");
              }}>
                Open
              </Button>
            </Group>
          </Box>
        ),
      })
    } else {
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

  const openDatabaseWithExactPath = async (exactPath: string) => {
    let openpass: string = ''
    let tempArr: string[] = exactPath.split('\\')
    let dbName = tempArr.at(-1)
    modals.open({
      title: `Opening database ${dbName}`,
      children: (
        <Box maw={340} mx="auto">
          <PasswordInput
            label="Password"
            placeholder="Password"
            onChange={(e) => {
              openpass = e.target.value
            }}
          />
          <Group position="right" mt="md">
            <Button onClick={async () => {
              console.log('asdadadsadsadasdas')
              modals.closeAll()
              let check: string = String(await openExistingDatabase(openpass, String(exactPath)))
              if (check === "Database does not exist." || check === "Wrong password!") {
                notifications.show({
                  message: 'Reason: ' + check,
                  title: 'Could not open database!',
                  color: "red",
                  icon: <IconX size="0.9rem" />,
                  autoClose: 3600,
                })
              } else {
                setIsDatabaseOpened(true)
                setDbContent(check)
                return check
              }
            }}>
              Open
            </Button>
          </Group>
        </Box>
      ),
    })
    return openpass
  }

  const mapDatabaseFiles = () => {
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
            key={databasePath}
          >
            <Group w={360}>
              <Text key={databasePath}>{databasePath}</Text>
            </Group>
            <Button key={databasePath} onClick={() => openDatabaseWithExactPath(databasePath)} variant="outline" color="green" size="sm" w={80}>Open</Button>
          </Flex>
      )
    )
  }

  let availableOrCreateNew = <></>
  if (paths.length !== 0) {
    availableOrCreateNew = <Title size={20}>Available databases:</Title>
  } else {
    availableOrCreateNew = <Title size={16}>No databases found. Please create a new database or open existing</Title>
  }

  return (
    <>
      <Space h={60}/>
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
          {availableOrCreateNew}
          {mapDatabaseFiles()}
        </>
      ) : (
        <>
          <Button color='red' onClick={
            () => {
              setIsDatabaseOpened(false)
              console.log('database closed.')
              setDbContent('')
            }
          }>Close database</Button>
          <Database databaseContent={String(dbContent)} />
        </>
      )}
    </>
  );
}

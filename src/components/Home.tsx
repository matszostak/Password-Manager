import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, Flex, rem, Popover, Progress } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { openExistingDatabase, saveNewDatabase } from "../utils/fileOperations";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
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
  const [confirmPassword, setConfirmPassword] = useInputState('')
  // TODO: Save it to lacalStorage or something to get persistence AND if saved, check if file still exists on application startup (in case user deleted file manually)
  // paths also get cleared when using navbar so it has to be changed.
  const [paths] = useState<string[]>([])
  // TODO: Save it to lacalStorage or something to get persistence
  //const [dbContent, setDbContent] = useState('')
  const [_refreshKey, setRefreshKey] = useState(0);

  const [parentState, setParentState] = useState(false);

  // TODO: save created paths or opened paths to file
  useState(() => {
    const handleRead = async () => {
      const f: string = Constants.profileFile
      const contents: string = await (readTextFile(f, { dir: BaseDirectory.AppData }))
      const databases = JSON.parse(contents).databases
      for (const p of databases) {
        if (p.path !== "") {
          paths.push(p.path) // TODO: push only if element does not exist in array
        }
      }
    }
    handleRead().then(() => setRefreshKey(oldKey => oldKey + 1)) // REFRESH KEY FOR THE WIN THIS IS AMAZING!!!
  })

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    if (password !== confirmPassword) {
      form.reset()
      return
    }
    if (pathOfNewDB) {
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
            <Group mt="md">
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
                  localStorage.setItem('isDbOpened', 'true')
                  localStorage.setItem('dbContent', check)
                  setRefreshKey(oldKey => oldKey + 1)
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
          <Group mt="md">
            <Button onClick={async () => {
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
                localStorage.setItem('isDbOpened', 'true')
                localStorage.setItem('dbContent', check)
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

  function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
      <Text
        c={meets ? 'teal' : 'red'}
        style={{ display: 'flex', alignItems: 'center' }}
        mt={7}
        size="sm"
      >
        {meets ? (
          <IconCheck style={{ width: rem(14), height: rem(14) }} />
        ) : (
          <IconX style={{ width: rem(14), height: rem(14) }} />
        )}{' '}
        <Box ml={10}>{label}</Box>
      </Text>
    );
  }

  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
  ];

  function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }

  const [popoverOpened, setPopoverOpened] = useState(false);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));

  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <>
      <Space h={60} />
      {(localStorage.getItem('isDbOpened') === 'false') ? (
        <>
          <Modal opened={opened} onClose={close} title="Create new password database" size="md">
            <Box maw={340} mx="auto">
              <form onSubmit={form.onSubmit(() => {
                createDatabase()
                close()
                setRefreshKey(oldKey => oldKey + 1)
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

                <Group mt="md">
                  <Button type="submit">
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

          <Database parentState={parentState} setParentState={setParentState} />
        </>
      )}
    </>
  );
}
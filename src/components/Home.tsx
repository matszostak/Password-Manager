import { Button, Center, Group, Text, Modal, PasswordInput, Space, TextInput, Title } from "@mantine/core";
import { useDisclosure, useId, useInputState } from "@mantine/hooks";
import { IconLock, IconPassword } from "@tabler/icons-react";
import { invoke } from '@tauri-apps/api/tauri'
import { saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);
  const id = useId();


  const createNewDatabase = async () => {
    console.log('create new')
  }

  const openExistingDatabase = async () => {
    console.log('open existing')
  }

  const [dbName, setDbName] = useInputState('')
  const [password, setPassword] = useInputState('')
  const [rePassword, setRePassword] = useInputState('')
  const [p, setP] = useState<string | null>()


  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    setP(pathOfNewDB)
    console.log(p)
  }

  return (
    <>
      <Title>Home</Title>

      <Modal opened={opened} onClose={close} title="Create new password database" size="md">
        {/*<TextInput
          placeholder="Database name"
          label="Database name"
          withAsterisk
          required
          onChange={(e) => {
            setDbName(e.target.value)
            console.log(e.target.value)
          }}
        /> TODO: get the name... or not */} 

        <Space h='sm' />
        <PasswordInput
          icon={<IconLock size={20} />}
          placeholder="Password"
          label="Master Password"
          //description="Password should be strong."
          withAsterisk
          required
          onChange={(e) => {
            setPassword(e.target.value)
            console.log(e.target.value)
            // check if password is strong enough
          }}
        />

        <Space h='sm' />
        <PasswordInput
          icon={<IconLock size={20} />}
          placeholder="Password"
          label="Repeat Master Password"
          withAsterisk
          required
          onChange={(e) => {
            setRePassword(e.target.value)
            console.log(e.target.value)
            // check if password is strong enough and matches first password
          }}
        />
        <Space h='sm' />
        <Group position="center">
          <Button color='green' onClick={() => {
            createDatabase();
            close();
          }}>Submit</Button>
          <Button color='red' onClick={() => {
            close();
            setDbName('');
            setPassword('');
            setRePassword('');
          }}>Cancel</Button>
        </Group>
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
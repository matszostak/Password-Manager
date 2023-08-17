import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title } from "@mantine/core";
import { useDisclosure, useId, useInputState } from "@mantine/hooks";
import { IconLock } from "@tabler/icons-react";
import { saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);
  const [ passwordMatch, setPasswordMatch ] = useState(true)
  const [dbName, setDbName] = useInputState('')
  const [password, setPassword] = useInputState('')
  const [rePassword, setRePassword] = useInputState('')
  const [p, setP] = useState<string | null>()

  const openExistingDatabase = async () => {
    console.log('open existing')
  }

  const createDatabase = async () => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    setP(pathOfNewDB)
    console.log(p)
  }

  const handlePasswordChange = (rePass: string) => {
    setRePassword(rePass)
    validatePassword(rePass)
  }

  const validatePassword = (rePassword: string) => {
    if (password === rePassword) {
      setPasswordMatch(true)
    } else {
      setPasswordMatch(false)
    }
  }
  // TODO: validation uses previous state of RePassword (for example: aaa = aaa+(one letter))


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
          withAsterisk
          required
          onChange={(e) => {
            setPassword(e.target.value)
            console.log(e.target.value)
          }}
        />

        <Space h='sm' />
        <PasswordInput
          icon={<IconLock size={20} />}
          placeholder="Password"
          label="Repeat Master Password"
          withAsterisk
          required
          error={passwordMatch ? '' : 'Password does not match.'}
          onChange={(e) => {
            handlePasswordChange(e.target.value)
            
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

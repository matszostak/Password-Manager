import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, TextInput, Checkbox } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { saveNewDatabase } from "../utils/fileOperations";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { open as tauri_open } from '@tauri-apps/api/dialog';

export default function NewDatabase() {
  const [password, setPassword] = useInputState('')
  const [p, setP] = useState<string | null>()

  const createDatabase = async (pass: any) => {
    let pathOfNewDB: string | null = await saveNewDatabase(password)
    setP(pathOfNewDB)
    console.log("Password: " + password)
    console.log("Path: " + p)
  }

  const form = useForm({
    validate: {
      confirmPassword: (value, values) => {
        value !== values.password ? 'Passwords did not match' : setPassword(String(values.password))
      }
    },
  });

  return (
    <>
      <Title>Create new databse</Title>
        <Box maw={340} mx="auto">
          <form onSubmit={form.onSubmit(() => {
            form.validate()
            setPassword(String(form.values.confirmPassword))
            createDatabase(form.values.confirmPassword)
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
    </>
  );
}

/**
 * 
 * 
 * Create database in a new component - can add more options this way
 * 
 * Open database using the one Modal I can work with.
 * 
 * 
 */
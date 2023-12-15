import { Box, Group, Button, Collapse, Table, ScrollArea, Drawer, TextInput, PasswordInput, ActionIcon, Textarea, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconEye, IconEyeOff, IconRefresh } from "@tabler/icons-react"
import { useState } from "react"
import { generatePassphrase } from "../utils/passwordGeneration"

export default function Database({ parentState, setParentState } : { parentState: boolean, setParentState: React.Dispatch<React.SetStateAction<boolean>> }) {
    let parsedContent = JSON.parse(String(localStorage.getItem('dbContent')))
    let name: string = parsedContent.name // database name from JSON
    let creationDate: string = parsedContent.creationdate // database creationdate from JSON
    let dbVault = parsedContent.vault // database vault
    const [opened, { open, close }] = useDisclosure(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>('')

    const map_password = dbVault.map(
        (entry: any) =>
            <Table.Tr key={entry.id}>
                <Table.Td>{entry.username}</Table.Td>
                <Table.Td>
                    <PasswordInput
                        variant="unstyled"
                        value={entry.password}
                        onChange={() => { }} // onChange to supress a warning
                        w={160}
                        pointer
                    />
                </Table.Td>
                <Table.Td>{entry.urls}</Table.Td>
            </Table.Tr>
    )

    async function generatePassphraseInterface(length: number, numbers: boolean, specialCharacter: string) {
        let x: any = await generatePassphrase(length, numbers, specialCharacter)
        setGeneratedPassword(String(x))
    }

    const [visible, { toggle }] = useDisclosure(false);
    return (
        <>
            <ScrollArea>
                <Box>
                    <Text>{name}</Text>
                    <Button 
                        color='red' 
                        onClick={
                            () => {
                                localStorage.setItem('isDbOpened', 'false')
                                localStorage.setItem('dbContent', '')
                                setParentState(!parentState);
                            }
                        }
                    >Close database</Button>
                    <Drawer
                        opened={opened}
                        onClose={close}
                        title="Create new entry"
                        position="right"
                    >
                        {
                            <Box>
                                <TextInput
                                    label="Entry name"
                                    placeholder="Name"
                                />
                                <TextInput
                                    label="Username"
                                    placeholder="Username"
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="Password"
                                    rightSection={
                                        <Group grow wrap="nowrap" gap={6} ml={-40}>
                                            <ActionIcon
                                                variant="subtle"
                                                color="indigo"
                                                onClick={() => generatePassphraseInterface(4, true, '_')}
                                            >
                                                <IconRefresh style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }} />
                                            </ActionIcon>
                                            <ActionIcon
                                                color="indigo"
                                                onClick={toggle}
                                                variant="subtle"
                                            >
                                                {visible ? (
                                                    <IconEyeOff style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }} />
                                                ) : (
                                                    <IconEye style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }} />
                                                )}
                                            </ActionIcon>
                                        </Group>
                                    }
                                    value={String(generatedPassword)}
                                    onChange={(e) => setGeneratedPassword(e.target.value)}
                                    visible={visible}
                                />

                                <TextInput
                                    label="URL"
                                    placeholder="URL"
                                />
                                <Textarea
                                    label="Notes"
                                    placeholder="Notes"
                                    autosize
                                    minRows={4}
                                    maxRows={8}
                                />
                            </Box>
                        }
                    </Drawer>

                    <Button onClick={open}>Open Drawer</Button>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Username</Table.Th>
                                <Table.Th>Password</Table.Th>
                                <Table.Th>More</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{map_password}</Table.Tbody>
                    </Table>
                </Box>
            </ScrollArea>

        </>
        // TODO: handle change and saving the database here
    );
}
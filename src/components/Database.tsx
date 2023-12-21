import { Box, Group, Button, Collapse, Table, Drawer, TextInput, PasswordInput, ActionIcon, Textarea, Text, Tooltip, Space, Divider } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconEye, IconEyeOff, IconRefresh, IconSettings } from "@tabler/icons-react"
import { useState } from "react"
import { generatePassphrase, generatePassword } from "../utils/passwordGeneration"
import PasswordGenerator from "./PasswordGenerator"

export default function Database({ parentState, setParentState }: { parentState: boolean, setParentState: React.Dispatch<React.SetStateAction<boolean>> }) {
    let parsedContent = JSON.parse(String(localStorage.getItem('dbContent')))
    let name: string = parsedContent.name // database name from JSON
    let creationDate: string = parsedContent.creationdate // database creationdate from JSON
    let dbVault = parsedContent.vault // database vault
    const [opened, { open, close }] = useDisclosure(false);
    const [test, testHandler] = useDisclosure(false);
    const [collapse, collapseHandlers] = useDisclosure(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>('')
    const [currentEntry, setCurrentEntry] = useState<any>()
    const [itemStates, setItemStates] = useState(Array(dbVault.length).fill(false));
    // Function to toggle the state of an item at a specific index
    const toggleItemState = (index: number) => {
        setItemStates((prevStates) =>
            prevStates.map((state, i) => (i === index ? !state : state))
        );
    };

    const handlePasswordSettingFunction = (passwordFromTheGenerator: string) => {
        setGeneratedPassword(passwordFromTheGenerator)
    }

    const map_password = dbVault.map(
        (entry: any, index: number) =>
            <Table.Tr key={entry.id} onClick={() => toggleItemState(index)}>
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
                <Table.Td>
                    <Text truncate="end" w={160}>
                        {entry.urls}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Button.Group>
                        <Button color="indigo" w={80} onClick={() => {
                            setCurrentEntry(entry)
                            testHandler.open()
                        }}>Edit</Button>
                        <Button color="red" w={80}>Delete</Button>
                    </Button.Group>
                </Table.Td>

            </Table.Tr>
    )

    async function generatePassphraseInterface(length: number, numbers: boolean, specialCharacter: string) {
        let x: any = await generatePassphrase(length, numbers, specialCharacter)
        setGeneratedPassword(String(x))
    }

    const [visible, { toggle }] = useDisclosure(false);
    return (
        <>
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
                                label={
                                    <Group grow wrap="nowrap" gap={6}>
                                        Password
                                        <Tooltip label="Password generation settings">
                                            <ActionIcon
                                                variant="subtle"
                                                color="indigo"
                                                onClick={() => collapseHandlers.toggle()}
                                            >
                                                <IconSettings style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>}
                                placeholder="Password"
                                rightSection={
                                    <Group grow wrap="nowrap" gap={6} ml={-40}>
                                        <Tooltip label="Generate with default settings">
                                            <ActionIcon
                                                variant="subtle"
                                                color="indigo"
                                                onClick={() => generatePassphraseInterface(4, true, '_')}
                                            >
                                                <IconRefresh style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }} />
                                            </ActionIcon>
                                        </Tooltip>
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

                            <Collapse in={collapse}>
                                <Divider my="sm" />
                                <PasswordGenerator handlePasswordSetting={handlePasswordSettingFunction}/>
                                <Divider my="sm" />
                            </Collapse>

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
                <Drawer
                    opened={test}
                    onClose={testHandler.close}
                    title="Edit"
                    position="right"
                >
                    {(currentEntry !== undefined) ? (
                        currentEntry.password + '\n' + currentEntry.username
                    ) : (
                        "Error."
                    )}
                </Drawer>
                <Button onClick={open}>Create new</Button>
                <Table.ScrollContainer minWidth={20}>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Username</Table.Th>
                                <Table.Th>Password</Table.Th>
                                <Table.Th>More</Table.Th>
                                <Table.Th>Options</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{map_password}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Box>
        </>
        // TODO: handle change and saving the database here
    );
}
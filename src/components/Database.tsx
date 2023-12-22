import { Box, Group, Button, Collapse, Table, Drawer, TextInput, PasswordInput, ActionIcon, Textarea, Text, Tooltip, Divider, Accordion, Center } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconDots, IconEye, IconEyeOff, IconRefresh, IconSettings } from "@tabler/icons-react"
import { useState } from "react"
import { generatePassphrase } from "../utils/passwordGeneration"
import PasswordGenerator from "./PasswordGenerator"

interface AccordionLabelProps {
    name: string;
    urls: string;
}

function AccordionLabel({ name, urls }: AccordionLabelProps) {
    return (
        <Group wrap="nowrap">
            <div>
                <Text>{name}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                    {urls}
                </Text>
            </div>
        </Group>
    );
}

export default function Database({ parentState, setParentState }: { parentState: boolean, setParentState: React.Dispatch<React.SetStateAction<boolean>> }) {
    let parsedContent = JSON.parse(String(localStorage.getItem('dbContent')))
    let [parsedContentState, setParsedContentState] = useState(parsedContent)
    let name: string = parsedContentState.vaultName // database name from JSON
    let creationDate: string = parsedContentState.creationdate // database creationdate from JSON
    let dbVault = parsedContentState.vault // database vault
    const [opened, { open, close }] = useDisclosure(false);
    const [renameDrawer, renameDrawerHandler] = useDisclosure(false);
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

    const [currentUsername, setCurrentUsername] = useState('')
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
                            setCurrentEntry(entry) // TODO: create a state for every editable variable; then use those instead of a currentEntry
                            setCurrentUsername(entry.username)
                            renameDrawerHandler.open()
                        }}>Edit</Button>
                        <Button color="red" w={80}>Delete</Button>
                    </Button.Group>
                </Table.Td>

            </Table.Tr>
    )

    const items = dbVault.map((item: any, index: number) => (
        <Accordion.Item
            key={item.id}
            value={item.username}
        >
            <Center>
                <Accordion.Control>
                    <AccordionLabel {...item} />
                </Accordion.Control>
                <ActionIcon size="lg" variant="subtle" color="gray" onClick={() => console.log(item.username)}>
                    <IconDots size="1rem" />
                </ActionIcon>
                <ActionIcon size="lg" variant="subtle" color="gray" onClick={() => {
                            setCurrentEntry(item) // TODO: create a state for every editable variable; then use those instead of a currentEntry
                            setCurrentUsername(item.username)
                            renameDrawerHandler.open()
                        }}>
                    <IconDots size="1rem" />
                </ActionIcon>
            </Center>
            <Accordion.Panel>{item.username + ' ' + item.password}</Accordion.Panel>
        </Accordion.Item>
    ));

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
                                <PasswordGenerator handlePasswordSetting={handlePasswordSettingFunction} />
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
                    opened={renameDrawer}
                    onClose={renameDrawerHandler.close}
                    title="Edit"
                    position="right"
                >
                    {(currentEntry !== undefined) ? (
                        <>
                            <TextInput
                                value={currentUsername}
                                onChange={(e) => {
                                    setCurrentUsername(e.currentTarget.value)
                                }}
                            />
                            <Button
                                onClick={() => {
                                    let temp = currentEntry
                                    temp.username = currentUsername
                                    setCurrentEntry(temp)
                                    renameDrawerHandler.close()
                                    console.log(currentEntry)
                                    console.log(parsedContentState) // somehow the parsedContentState gets updated when currentEntry is updated???? but that is kind of good because it will be saved in the end
                                }}
                            >
                                Save
                            </Button>
                        </>
                    ) : (
                        "Error."
                    )}
                </Drawer>
                <Button onClick={open}>Create new</Button>
            </Box>

            <Accordion
                variant="contained"
                radius="md"
                chevronPosition="left"
                defaultValue={[]}
                multiple={true}
            >
                {items}
            </Accordion>
        </>
        // TODO: handle change and saving the database here
    );
}
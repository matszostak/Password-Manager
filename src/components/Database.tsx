import { Box, Group, Button, Collapse, Table, Drawer, TextInput, PasswordInput, ActionIcon, Textarea, Text, Tooltip, Divider, Accordion, Center, keys, UnstyledButton, rem, ScrollArea, Space, Highlight, Paper, SimpleGrid, Grid, Stack, Fieldset } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconBrowser, IconCheck, IconChevronDown, IconChevronUp, IconDots, IconEye, IconEyeOff, IconLink, IconLock, IconNote, IconRefresh, IconSearch, IconSelector, IconSettings, IconUser, IconWorld, IconX } from "@tabler/icons-react"
import { useState } from "react"
import { generatePassphrase } from "../utils/passwordGeneration"
import PasswordGenerator from "./PasswordGenerator"
import { v4 as uuidv4 } from 'uuid'
import { encryptDatabase } from "../utils/fileOperations"
import { notifications } from "@mantine/notifications"

import classes from '../css/Styles.module.css';
interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

interface RowData {
    name: string,
    id: string,
    username: string,
    password: string,
    urls: string[],
    notes: string,
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
    );
}

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return String(b[sortBy]).localeCompare(String(a[sortBy]));
            }

            return String(a[sortBy]).localeCompare(String(b[sortBy]));
        }),
        payload.search
    );
}

export default function Database({ parentState, setParentState }: { parentState: boolean, setParentState: React.Dispatch<React.SetStateAction<boolean>> }) {
    let parsedContent = JSON.parse(atob(String(localStorage.getItem('dbContent'))))
    let [parsedContentState, setParsedContentState] = useState(parsedContent)
    let name: string = parsedContentState.vaultName // database name from JSON
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(parsedContentState.vault);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const [opened, { open, close }] = useDisclosure(false);
    const [renameDrawer, renameDrawerHandler] = useDisclosure(false);
    const [collapse, collapseHandlers] = useDisclosure(false);
    const [currentEntry, setCurrentEntry] = useState<any>()
    const [visible, { toggle }] = useDisclosure(false);
    const [editing, setEditing] = useState(false) // FALSE if new item, TRUE if editing
    const [isNameEmpty, setIsNameEmpty] = useState(false)

    // Used to edit stuff, probably will be used to add new stuff
    const [currentEntryIndex, setCurrentEntryIndex] = useState(-1)
    const [currentID, setcurrentID] = useState('')
    const [currentName, setCurrentName] = useState('')
    const [currentUsername, setCurrentUsername] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [currentUrls, setCurrentUrls] = useState('')
    const [currentNotes, setCurrentNotes] = useState('')

    const [_refreshKey, setRefreshKey] = useState(0);

    function clearCurrentStuff() {
        setIsNameEmpty(false)
        setCurrentEntryIndex(-1)
        setcurrentID('')
        setCurrentName('')
        setCurrentUsername('')
        setCurrentPassword('')
        setCurrentUrls('')
        setCurrentNotes('')
    }

    const handlePasswordSettingFunction = (passwordFromTheGenerator: string) => {
        if (!(passwordFromTheGenerator === 'Any box has to be checked and the password cannot use just spaces.')) {
            setCurrentPassword(passwordFromTheGenerator)
        } else {
            // TODO: add something or not, does not matter.
        }
    }

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(JSON.parse(JSON.stringify(parsedContentState.vault)), { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(JSON.parse(JSON.stringify(parsedContentState.vault)), { sortBy, reversed: reverseSortDirection, search: value }));
    };

    /*
<PasswordInput
                        my={-6}
                        classNames={{ innerInput: classes.inner }}
                        variant="unstyled"
                        value={row.password}
                        c={"indigo"}
                        leftSection={<IconLock size="1rem" stroke={1.5}/>}
                        label={"Password"}
                    />
    */
    function panel(row: any) {
        return (

            <Box>
                <Paper shadow="xs" p={5} className={classes.input}>
                    <TextInput
                        variant="unstyled"
                        label={<Text c="dimmed" size="sm" ml={10}>Username</Text>}
                        spellCheck={false}
                        classNames={{ input: classes.input }}
                        pointer={false} value={row.username}
                        leftSection={<IconUser size="1rem" stroke={1.5} />}
                        onClick={() => console.log()}
                    />
                </Paper>
                <Paper shadow="xs" p={5} mt={5} className={classes.input}>
                    <PasswordInput
                        variant="unstyled"
                        spellCheck={false} mt={"xs"}
                        classNames={{ innerInput: classes.input, input: classes.input }}
                        value={row.password}
                        leftSection={<IconLock size="1rem" stroke={1.5} />}
                        label={<Text c="dimmed" size="sm" ml={10}>Password</Text>}
                    />
                </Paper>
                <Paper shadow="xs" p={5} mt={5} className={classes.input}>
                    <TextInput
                        variant="unstyled"
                        spellCheck={false}
                        mt={"xs"}
                        classNames={{ input: classes.input }}
                        value={row.urls}
                        leftSection={<IconWorld size="1rem" stroke={1.5} />}
                        label={<Text c="dimmed" size="sm" ml={10}>URL</Text>}
                    />
                </Paper>
                <Paper shadow="xs" p={5} mt={5} className={classes.input}>
                    <Textarea
                        variant="unstyled"
                        spellCheck={false}
                        mt={"xs"}
                        autosize
                        minRows={2}
                        value={row.notes}
                        classNames={{ input: classes.input }}
                        leftSection={<IconNote size="1rem" stroke={1.5} />}
                        label={<Text c="dimmed" size="sm" ml={10}>Notes</Text>}
                    />
                </Paper>
            </Box>
        )
    }
    let rows = sortedData.map((row: any, index: number) => (
        <>
            <Table.Tr key={row.name}>
                <Accordion.Item
                    key={row.name}
                    value={row.id}
                    w={"300%"}
                >
                    <Center>
                        <Accordion.Control>
                            <Group wrap="nowrap">
                                <Box>
                                    <Text>{row.name}</Text>
                                    <Text size="sm" c="dimmed" fw={400}>
                                        {row.urls}
                                    </Text>
                                </Box>
                            </Group>
                        </Accordion.Control>
                        <Tooltip label="Edit entry">
                            <ActionIcon size="lg" variant="subtle" color="gray" onClick={() => {
                                open()
                                setEditing(true)
                                setcurrentID(row.id)
                                setCurrentName(row.name)
                                setCurrentUsername(row.username)
                                setCurrentPassword(row.password)
                                setCurrentUrls(row.urls)
                                setCurrentNotes(row.notes)
                                setCurrentEntry(row)
                                setCurrentEntryIndex(index)
                            }}>
                                <IconDots size="1rem" />
                            </ActionIcon>
                        </Tooltip>
                    </Center>
                    <Accordion.Panel>{panel(row)}</Accordion.Panel>
                </Accordion.Item>
            </Table.Tr>
        </>
    ));
    // <Text color="indigo">Editing entry: {currentName}</Text>

    const drawer = (
        <Drawer
            opened={opened}
            onClose={close}
            title={editing ? (
                <>
                    <Highlight
                        ta="center"
                        highlight={[currentName]}
                        color="indigo"
                        highlightStyles={{
                            fontWeight: 700,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {"Editing " + String(currentName)}
                    </Highlight>
                </>

            ) : (
                "Create new entry"
            )}
            position="right"
        >
            {
                <Box>
                    <TextInput
                        label="Entry name"
                        placeholder="Name"
                        value={currentName}
                        onChange={(e) => {
                            setCurrentName(e.currentTarget.value)
                        }}
                    />
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        value={currentUsername}
                        onChange={(e) => {
                            setCurrentUsername(e.currentTarget.value)
                        }}
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
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                        value={currentUrls}
                        onChange={(e) => {
                            setCurrentUrls(e.currentTarget.value)
                        }}
                    />
                    <Textarea
                        label="Notes"
                        placeholder="Notes"
                        autosize
                        minRows={4}
                        maxRows={8}
                        value={currentNotes}
                        onChange={(e) => {
                            setCurrentNotes(e.currentTarget.value)
                        }}
                    />
                    <Button
                        onClick={() => {
                            if (currentName === '') {
                                setIsNameEmpty(true)
                            } else {
                                setIsNameEmpty(false)
                                if (editing) {
                                    let temp = parsedContentState
                                    temp.vault[currentEntryIndex].name = currentName
                                    temp.vault[currentEntryIndex].username = currentUsername
                                    temp.vault[currentEntryIndex].password = currentPassword
                                    temp.vault[currentEntryIndex].urls = currentUrls
                                    temp.vault[currentEntryIndex].notes = currentNotes
                                    clearCurrentStuff()
                                    setParsedContentState(temp)
                                    renameDrawerHandler.close()
                                    // somehow the parsedContentState gets updated when currentEntry is updated???? but that is kind of good because it will be saved in the end
                                    close()
                                } else {
                                    let temp = parsedContentState
                                    let urls: string[] = [currentUrls];
                                    temp.vault = [
                                        ...temp.vault,
                                        { id: String(uuidv4()), name: currentName, username: currentUsername, password: currentPassword, urls: urls, notes: currentNotes }
                                    ]
                                    setParsedContentState(temp)
                                    clearCurrentStuff()
                                    close()
                                    setRefreshKey(oldKey => oldKey + 1)
                                    setSortedData(parsedContentState.vault)
                                }
                            }
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="filled"
                        color="red"
                        onClick={() => {
                            let temp = parsedContentState
                            let temp_vault = temp.vault
                            temp_vault.splice(currentEntryIndex, 1);
                            temp.vault = temp_vault
                            setParsedContentState(temp)
                            clearCurrentStuff()
                            close()
                        }}
                    >
                        Delete
                    </Button>
                    {isNameEmpty ? (<Text c="#fa0000">Entry name cannot be empty!</Text>) : (<></>)}
                </Box>
            }
        </Drawer>
    )

    async function generatePassphraseInterface(length: number, numbers: boolean, specialCharacter: string) {
        let x: any = await generatePassphrase(length, numbers, specialCharacter)
        setCurrentPassword(String(x))
    }

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
                            localStorage.setItem('password', '')
                            setParentState(!parentState);
                        }}
                >Close database</Button>
                {drawer}
                <Button
                    onClick={
                        () => {
                            setEditing(false)
                            setCurrentEntryIndex(-1)
                            clearCurrentStuff()
                            open()
                        }}
                >Create new</Button>
                <Button
                    onClick={
                        () => {
                            localStorage.setItem('dbContent', btoa(JSON.stringify(parsedContentState)))
                            let x: string = String(localStorage.getItem('password'))
                            console.log(x)
                            encryptDatabase(String(localStorage.getItem('openedPath')), String(atob(x))).then(value => {
                                if (String(value) === 'encrypted') {
                                    notifications.show({
                                        message: `Database saved successfully to: ${localStorage.getItem('openedPath')}`,
                                        title: 'Database saved!',
                                        color: 'green',
                                        icon: <IconCheck size="0.9rem" />,
                                        autoClose: 3600,
                                    })
                                } else {
                                    notifications.show({
                                        message: 'Something went wrong while saving the database.',
                                        title: 'Database file not saved!',
                                        color: "red",
                                        icon: <IconX size="0.9rem" />,
                                        autoClose: 3600,
                                    })
                                }
                            })
                        }}
                    color={"green"}
                >Save database</Button>
            </Box>
            <Space h={20} />
            <TextInput
                placeholder="Search by any field"
                mb="md"
                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
            <ScrollArea>
                <Accordion
                    variant="contained"
                    radius="md"
                    chevronPosition="left"
                    defaultValue={[]}
                    multiple={true}
                >
                    <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed">
                        <Table.Tbody>
                            <Table.Tr>
                                <Th
                                    sorted={sortBy === 'name'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('name')}
                                >
                                    Name
                                </Th>
                                <Th
                                    sorted={sortBy === 'username'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('username')}
                                >
                                    Username
                                </Th>
                                <Th
                                    sorted={sortBy === 'urls'}
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting('urls')}
                                >
                                    Urls
                                </Th>
                            </Table.Tr>
                        </Table.Tbody>
                        <Table.Tbody>
                            {rows.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={3}>
                                        <Text fw={500} ta="center">
                                            No passwords found.
                                        </Text>
                                        <Space h={10} />
                                        <Center>
                                            <Button
                                                variant="outline"
                                                color="indigo"
                                                onClick={
                                                    () => {
                                                        setEditing(false)
                                                        setCurrentEntryIndex(-1)
                                                        clearCurrentStuff()
                                                        open()
                                                    }}
                                            >Create new</Button>
                                        </Center>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Accordion>
            </ScrollArea>
        </>
    );
}
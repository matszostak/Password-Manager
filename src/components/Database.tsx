import { Box, Group, Button, Collapse, Table, Drawer, TextInput, PasswordInput, ActionIcon, Textarea, Text, Tooltip, Divider, Accordion, Center, keys, UnstyledButton, rem, ScrollArea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconChevronDown, IconChevronUp, IconDots, IconEye, IconEyeOff, IconRefresh, IconSearch, IconSelector, IconSettings } from "@tabler/icons-react"
import { useState } from "react"
import { generatePassphrase } from "../utils/passwordGeneration"
import PasswordGenerator from "./PasswordGenerator"

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
    let parsedContent = JSON.parse(String(localStorage.getItem('dbContent')))
    let [parsedContentState, setParsedContentState] = useState(parsedContent)
    let name: string = parsedContentState.vaultName // database name from JSON
    let dbVault = parsedContentState.vault

    console.log('========================')
    console.log(parsedContentState)
    console.log('========================')

    const [opened, { open, close }] = useDisclosure(false);
    const [renameDrawer, renameDrawerHandler] = useDisclosure(false);
    const [collapse, collapseHandlers] = useDisclosure(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>('')
    const [currentEntry, setCurrentEntry] = useState<any>()
    const [currentEntryIndex, setCurrentEntryIndex] = useState(-1)

    const handlePasswordSettingFunction = (passwordFromTheGenerator: string) => {
        setGeneratedPassword(passwordFromTheGenerator)
    }

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(dbVault);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

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

    const [currentUsername, setCurrentUsername] = useState('')

    const rows = sortedData.map((row: any, index: number) => (
        <>
            <Table.Tr >

                <Accordion.Item
                    key={row.name}
                    value={row.username}
                    w={"300%"}
                >
                    <Center>
                        <Accordion.Control>

                            <Group wrap="nowrap">
                                <div>
                                    <Text>{row.name}</Text>
                                    <Text size="sm" c="dimmed" fw={400}>
                                        {row.urls}
                                    </Text>

                                </div>
                            </Group>

                        </Accordion.Control>
                        <ActionIcon size="lg" variant="subtle" color="gray" onClick={() => {
                            renameDrawerHandler.open()
                            setCurrentEntry(row)
                            setCurrentEntryIndex(index)
                        }}>
                            <IconDots size="1rem" />
                        </ActionIcon>
                    </Center>
                    <Accordion.Panel>{row.username + ' ' + row.password + ' ' + row.urls}</Accordion.Panel>
                </Accordion.Item>
            </Table.Tr>
        </>
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
                                    let temp = parsedContentState
                                    temp.vault[currentEntryIndex].username = currentUsername
                                    setCurrentUsername('')
                                    setParsedContentState(temp)
                                    renameDrawerHandler.close()
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
                                    <Table.Td colSpan={Object.keys(dbVault[0]).length}>
                                        <Text fw={500} ta="center">
                                            Nothing found
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Accordion>
            </ScrollArea>
        </>
        // TODO: handle change and saving the database here
    );
}
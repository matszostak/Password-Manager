import { Box, Group, Button, Collapse, Table, ScrollArea, SimpleGrid, Grid, Drawer, TextInput, PasswordInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconEye, IconEyeClosed } from "@tabler/icons-react"
import { useState } from "react"


export default function Database({ databaseContent, setDatabaseContent, isDbOpened, setIsDbOpened }: { databaseContent: string, setDatabaseContent: React.Dispatch<React.SetStateAction<string>>, isDbOpened: boolean, setIsDbOpened: React.Dispatch<React.SetStateAction<boolean>> }) {
    let parsedContent = JSON.parse(databaseContent)

    let name: string = parsedContent.name // database name from JSON
    let creationDate: string = parsedContent.creationdate // database creationdate from JSON
    let dbVault = parsedContent.vault // database vault

    const [opened, { open, close }] = useDisclosure(false);

    function ExpandEntry(entry: any) {
        const [opened, { toggle }] = useDisclosure(false);

        return (
            <Box maw={400} mx="auto">
                <Group mb={5}>
                    <Button onClick={toggle}>Toggle with linear transition</Button>
                </Group>

                <Collapse in={opened}>
                    <div>{entry.id + '|' + entry.username + '|' + entry.password + '|' + entry.urls + '|' + entry.notes + '|' + entry.metadata.created}</div>
                </Collapse>
            </Box>
        );
    }

    const [rowClicked, setRowClicked] = useState(true)
    const map_password_old = dbVault.map(
        (entry: any) =>
            <>
                {/*<div>{entry.username}{entry.password}{ExpandEntry(entry)}</div>*/}

                {rowClicked ? (
                    <tr key={entry.id} onClick={() => {
                        setRowClicked(!rowClicked)
                        console.log(rowClicked)
                    }}>
                        <td>{entry.username}</td>
                        <td>{entry.urls}</td>
                        <td>{entry.password}</td>
                    </tr>
                ) : (
                    <tr key={entry.id} onClick={() => {
                        setRowClicked(!rowClicked)
                        console.log(rowClicked)
                    }}>
                        <td>{entry.username}</td>
                        <td>{entry.urls}</td>
                        <td>
                            <Button h={30}>Copy password</Button>
                        </td>

                    </tr>
                )}
            </>
    )

    const [isVisible, setVisible] = useState(false);
    const map_password = dbVault.map(
        (entry: any) =>
            <>
                {/*<div>{entry.username}{entry.password}{ExpandEntry(entry)}</div>*/}

                <tr key={entry.id} onClick={() => {
                    setRowClicked(!rowClicked)
                    console.log(rowClicked)
                }}>
                    <td>{entry.username}</td>
                    <td>
                        <span onClick={() => setVisible(!isVisible)}>
                            {isVisible ?
                                <div>{entry.password}</div>
                                :
                                <div>************</div>
                            }
                        </span>
                    </td>
                    <td>
                        <span onClick={() => setVisible(!isVisible)}>
                            {isVisible ?
                                <IconEyeClosed />
                                :
                                <IconEye />
                            }
                        </span>
                    </td>
                    <td>{entry.urls}</td>
                </tr>
            </>
    )
    return (
        <>
            {/*<div>Name: {name}</div>
            <div>Creation date: {creationDate}</div>
            <div>========================</div>
            <div>vault:</div>
            <div>Vault item ID: {dbVault[0].id}</div>
            <div>Username: {dbVault[0].username}</div>
            <div>Password: {dbVault[0].password}</div>
            <div>URLs: {dbVault[0].urls}</div>
            <div>Notes: {dbVault[0].notes}</div>
            <div>========================</div>
            <div>metadata:</div>
            <div>Created: {dbVault[0].metadata.created}</div>
            <div>Last modified: {dbVault[0].metadata.lastmodified}</div>
            <div>Times modified: {dbVault[0].metadata.timesmodified}</div>
            <div>========================</div>
            <div>========================</div>
            <div>========================</div>*/}

            <ScrollArea w={550} h={400}>

                <Box>
                    <Button color='red' onClick={
                        () => {
                            setIsDbOpened(false)
                            console.log('database closed.')
                            setDatabaseContent('')
                        }
                    }>Close database</Button>
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

                                />
                                <TextInput
                                    label="URL"
                                    placeholder="URL"
                                />
                                <TextInput
                                    label="Notes"
                                    placeholder="Notes"
                                />
                            </Box>
                        }
                    </Drawer>

                    <Button onClick={open}>Open Drawer</Button>
                    <Table highlightOnHover>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Password</th>
                                <th>    </th> {/* empty column for the icon */}
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>{map_password}</tbody>
                    </Table>
                </Box>
            </ScrollArea>

        </>
        // TODO: handle change and saving the database here
    );
}

/*
{
    "name": "",
    "creationdate": "",
    "vault": [
        {
            "id": "",
            "username": "",
            "password": "",
            "urls": [],
            "notes": "",
            "metadata": {
                "created": "",
                "lastmodified": "",
                "timesmodified": 0
            }
        }
    ]
}
*/
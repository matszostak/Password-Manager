import { Button, Center, Group, Text, Modal, PasswordInput, Space, Title, Box, Flex, Popover, Progress, TextInput } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { openExistingDatabase, saveNewDatabase } from "../utils/fileOperations";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { open as open_tauri } from '@tauri-apps/api/dialog';
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck } from "@tabler/icons-react";
import { fileExtensionWithDot, fileExtensionWithoutDot } from "../utils/constants";

import * as Constants from '../utils/constants'
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import Database from "./Database";
import { requirements, PasswordRequirement, getStrength } from "../utils/passwordStrength";
import { sep } from "@tauri-apps/api/path";

export default function Home() {
	const [opened, { open, close }] = useDisclosure(false); // Modal stuff
	// TODO: Save it to lacalStorage or something to get persistence AND if saved, check if file still exists on application startup (in case user deleted file manually)
	// paths also get cleared when using navbar so it has to be changed.
	const [paths] = useState<string[]>([])
	// TODO: Save it to lacalStorage or something to get persistence
	//const [dbContent, setDbContent] = useState('')
	const [_refreshKey, setRefreshKey] = useState(0)
	const [parentState, setParentState] = useState(false)

	const [popoverOpened, setPopoverOpened] = useState(false)
	const [value, setValue] = useState('')
	const [databaseName, setDatabaseName] = useState('')
	const [confirmValue, setConfirmValue] = useState('')
	const [isPasswordMatching, setIsPasswordMatching] = useState(true)
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
	));
	const strength = getStrength(value);
	const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';
	useEffect(() => {
		if (confirmValue === value) {
			setIsPasswordMatching(false)
		} else { setIsPasswordMatching(true) }
	}, [confirmValue, value])

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
		let pathOfNewDB: string | null = await saveNewDatabase(databaseName, value)
		if (pathOfNewDB) {
			paths.indexOf(String(pathOfNewDB)) === -1 ? paths.push(String(pathOfNewDB)) : console.log('item already exists'); // 'null' = item already exists
			setValue('')
			setConfirmValue('')
			setDatabaseName('')
			// (note: user creates db, db is encrypted, user has to open db to start.)
			notifications.show({
				message: 'Database was created. Open it using Your password!',
				title: 'Database created!',
				color: 'green',
				icon: <IconCheck size="0.9rem" />,
				autoClose: 3600,
			})
			setRefreshKey(oldKey => oldKey + 1)
		} else {
			notifications.show({
				message: 'Please create a database file.',
				title: 'Database file not created!',
				color: "red",
				icon: <IconX size="0.9rem" />,
				autoClose: 3600,
			})
			setValue('')
			setConfirmValue('')
			setDatabaseName('')
		}
	}

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
			localStorage.setItem('openedPath', String(selected))
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
									localStorage.setItem('dbContent', btoa(check))
									localStorage.setItem('password', btoa(openpass))
									setRefreshKey(oldKey => oldKey + 1)
									return check
								}
								paths.indexOf(String(selected)) === -1 ? paths.push(String(selected)) : console.log('item already exists'); // 'null' = item already exists
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
		let tempArr: string[] = exactPath.split(sep)
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
								localStorage.setItem('dbContent', btoa(check))
								localStorage.setItem('password', btoa(openpass))
								localStorage.setItem('openedPath', exactPath)
								setRefreshKey(oldKey => oldKey + 1)
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

	return (
		<>
			<Space h={60} />
			{(localStorage.getItem('isDbOpened') === 'false') ? (
				<>
					<Modal opened={opened} onClose={() => {
						setPopoverOpened(false)
						close()
					}}
						title="Create new database" size="md"
					>
						<Box maw={340} mx="auto">
							<TextInput
								maxLength={128}
								withAsterisk
								label="Database Name"
								placeholder="Database Name"
								value={databaseName}
								onChange={(event) => setDatabaseName(event.currentTarget.value)}
							/>
							<Popover opened={popoverOpened} position="bottom" width={340} transitionProps={{ transition: 'pop' }}>
								<Popover.Target>
									<PasswordInput
										maxLength={128}
										withAsterisk
										label="Password"
										placeholder="Password"
										value={value}
										onChange={(event) => setValue(event.currentTarget.value)}
										onFocusCapture={() => setPopoverOpened(true)}
										onBlurCapture={() => setPopoverOpened(false)}
									/>
								</Popover.Target>
								<Popover.Dropdown>
									<Progress color={color} value={strength} size={5} mb="xs" />
									<PasswordRequirement label="Includes at least 16 characters" meets={value.length > 15} />
									{checks}
									<Text size="xs" mt={10} mb={-5} c="dimmed">Strong password is recommended, but not required</Text>
								</Popover.Dropdown>
							</Popover>
							<PasswordInput
								maxLength={128}
								withAsterisk
								label="Confirm Password"
								placeholder="Confirm Password"
								value={confirmValue}
								onChange={(event) => setConfirmValue(event.currentTarget.value)}
								error={isPasswordMatching ? (
									"Password does not match!"
								) : (
									""
								)}
							/>
							<Group mt="md">
								<Button
									color="green"
									onClick={() => {
										setRefreshKey(oldKey => oldKey + 1)
										createDatabase()
										setValue('')
										setDatabaseName('')
										setConfirmValue('')
										close()
										setRefreshKey(oldKey => oldKey + 1)
									}}
								>
									Create
								</Button>
							</Group>
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
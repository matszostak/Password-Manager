import { Button, Text, Title } from '@mantine/core'
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import { useState } from 'react'
import { writeText, readText } from '@tauri-apps/api/clipboard';
import * as Constants from '../utils/constants'
import { invoke } from '@tauri-apps/api';
import { open } from '@tauri-apps/api/dialog';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { generateDefault, generatePassphrase, generatePassword } from '../utils/passwordGeneration'

export default function Tests() {
	const fileContent: any = ''
	const [value, setValue] = useState(fileContent);

	const handleWriteClick = async () => {
		//await (message('File saved.'))
	}

	const handleReadClick = async () => {
		const f: string = Constants.profileFile
		const contents: string = await (readTextFile(f, { dir: BaseDirectory.AppData }))
		setValue(contents)
	}

	const handleCopyToClipboard = async () => {
		await writeText('Tauri is awesome!')
	}

	const clipboardText = ''
	const [clipText, setClipText] = useState<string | null>(clipboardText);
	const handleReadFromClipboard = async () => {
		const tempClipboardText = await readText();
		setClipText(tempClipboardText)
	}


	async function decryptDB() {
		const selected = await open({
			multiple: false,
			filters: [{
				name: Constants.fileExtensionWithDot,
				extensions: [Constants.fileExtensionWithoutDot],
			}]
		});
		await invoke('decrypt_database', { path: selected, password: "aaaa" }).then(msg => {
			setValue(JSON.parse(String(msg)))
		})
	}
	async function genPassphrase(length: number, include_numbers: boolean, specialCharType: string) {
		let generatedPassphrase = await invoke('generate_passphrase', { length: length, numbers: include_numbers, specialCharType: specialCharType })
	}
	return (
		<>
			<Title>Tests</Title>
			<Button onClick={handleWriteClick}>Write</Button>
			<Button onClick={handleReadClick}>Read</Button>
			<Button onClick={() => setValue('')} color='red'>Remove</Button>
			<Button onClick={handleCopyToClipboard}>Copy to clipboard!</Button>
			<Button onClick={handleReadFromClipboard}>Read from clipboard!</Button>
			<Text>{clipText}</Text>
			<Button onClick={() => decryptDB()}>Decrypt DB</Button>
			<Text>{value.encryption}</Text>
			<Text>{typeof (value)}</Text>
			<Button
				variant="outline"
				onClick={() =>
					notifications.show({
						message: '',
						title: 'Database created',
						color: "green",
						icon: <IconCheck size="0.9rem" />,
						autoClose: 3600,
					})
				}
			>
				Show
			</Button>
			<Button onClick={() =>
				generatePassword(32, true, true, true, true, true, true, true)
			}>P</Button>

			<Button onClick={() => {
				genPassphrase(4, true, "_")
			}
			}>RNG Test (passphrase test)</Button>
		</>
	);
}
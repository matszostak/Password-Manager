import { Button, Text, Title } from '@mantine/core'
import { exists, readTextFile, writeFile, BaseDirectory, createDir } from '@tauri-apps/api/fs'
import { useState } from 'react'
import { writeText, readText } from '@tauri-apps/api/clipboard';
import * as Constants from '../utils/constants'
import { saveTest } from '../utils/fileOperations';

export default function Tests() {
    const fileContent: string = ''
  const [value, setValue] = useState(fileContent);

  const handleWriteClick = async () => {

    console.log('old stuff')

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


  interface testData {
    id: number;
    name: string;
    pass: string;
  }
    return (
        <>
            <Title>Tests</Title>
            <Button onClick={handleWriteClick}>Write</Button>
            <Button onClick={handleReadClick}>Read</Button>
            <Button onClick={() => setValue('')} color='red'>Remove</Button>
            <Text>{value}</Text>
            <Button onClick={handleCopyToClipboard}>Copy to clipboard!</Button>
            <Button onClick={handleReadFromClipboard}>Read from clipboard!</Button>
            <Button onClick={saveTest}>Save a file</Button>
            <Text>{clipText}</Text>
        </>
    );
}
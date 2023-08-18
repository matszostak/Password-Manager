import { Button, Table, Title } from '@mantine/core'
import { invoke } from '@tauri-apps/api/tauri'
import { exists, BaseDirectory } from '@tauri-apps/api/fs';
import { useState } from 'react';

export default function Databases() {
    const fileContent: any = ''
    const [value, setValue] = useState(fileContent);
    const [testValue, setTestValue] = useState(fileContent);
    
    async function testInvoke() {
        let doesExist = await exists('aaaa.secpass', { dir: BaseDirectory.Desktop });
        if (doesExist) {
            await invoke('test_command', { fromWhere: "Databases.tsx", fileName: 'aaaa.secpass' }).then(msg => {
                setValue(JSON.parse(String(msg)))
                setTestValue(JSON.parse(String(msg)).vault[0])
            })
            
        } else {
            console.log('File does not exist.')
        }
        console.log(testValue)
    }

    return (
        <>
            <Title>Your databases</Title>
            <Button onClick={() => {
                testInvoke()
            }}>
                Click me!
            </Button>
            <Table>
                <tbody>
                    <tr>
                        <td>{testValue.id}</td>
                        <td>{testValue.id}</td>
                        <td>{testValue.name}</td>
                        <td>{testValue.username}</td>
                        <td>{testValue.password}</td>
                        <td>{testValue.urls}</td>
                        <td>{testValue.notes}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}
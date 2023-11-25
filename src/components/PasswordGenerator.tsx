import { Button, SegmentedControl, Slider, Space } from '@mantine/core'
import { invoke } from '@tauri-apps/api';
import { useState } from 'react';
import { generateDefault, generatePassphrase, generatePassword} from '../utils/passwordGeneration'

export default function PasswordGenerator() {
    const [passwordLength, setPasswordLength] = useState(32);
    const [passphraseLength, setPassphraseLength] = useState(4)
    const [wordOrPhrase, setWordOrPhrase] = useState('passphrase')
    const [generatedPassword, setGeneratedPassword] = useState<string | null>('')
    const marksPassword = [
        { value: 16, label: '16' },
        { value: 24, label: '24' },
        { value: 32, label: '32' },
        { value: 40, label: '40' },
        { value: 48, label: '48' },
    ];
    const marksPassphrase = [
        { value: 2, label: '2' },
        { value: 4, label: '4' },
        { value: 6, label: '6' },
        { value: 8, label: '8' },
        { value: 10, label: '10' },
    ];
    const generatePasswordInterface = async () => {
        let x: any = await generatePassword(32, true, true, true, true, true, true, true)
        setGeneratedPassword(String(x))
    }
    function helper() {
        if (wordOrPhrase === 'passphrase') {
            return (
                <>
                    <Slider
                        w={400}
                        defaultValue={passphraseLength}
                        min={2}
                        max={10}
                        marks={marksPassphrase}
                        step={1}
                        onChange={setPassphraseLength}
                    />
                    <h1>{passphraseLength}</h1>
                    <Button onClick={() =>
                        generatePasswordInterface()
                    }>Generate!</Button>
                    <h4>{generatedPassword}</h4>
                </>
            )
        } else {
            return (
                <>
                    <Space h={0} />
                    <Slider
                        w={400}
                        defaultValue={passwordLength}
                        min={16}
                        max={48}
                        marks={marksPassword}
                        step={1}
                        onChange={setPasswordLength}
                    />
                    <h1>{passwordLength}</h1>
                </>
            )
        }
    }
    return (
        <>
            <SegmentedControl
                value={wordOrPhrase}
                onChange={setWordOrPhrase}
                data={[
                    { label: 'Passphrase', value: 'passphrase' },
                    { label: 'Password', value: 'password' },
                ]}
                defaultValue="Passphrase"
                fullWidth
                color="indigo"
            />
            <Space h={100} />
            {helper()}
        </>
    );
}
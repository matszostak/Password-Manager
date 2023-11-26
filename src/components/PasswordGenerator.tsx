import { Button, Checkbox, SegmentedControl, Slider, Space } from '@mantine/core'
import { invoke } from '@tauri-apps/api';
import { useState } from 'react';
import { generateDefault, generatePassphrase, generatePassword } from '../utils/passwordGeneration'
import { randomId, useListState } from '@mantine/hooks';

export default function PasswordGenerator() {
    const [passwordLength, setPasswordLength] = useState(32);
    const [passphraseLength, setPassphraseLength] = useState(4)
    const [wordOrPhrase, setWordOrPhrase] = useState('passphrase')
    const [generatedPassword, setGeneratedPassword] = useState<string | null>('')
    const [usePassphraseNumbers, setUsePassphraseNumbers] = useState(true);

    const initialValues = [
        { label: 'Use numbers', checked: true, key: randomId() },
        { label: 'Use lowercase letters', checked: true, key: randomId() },
        { label: 'Use uppercase letters', checked: true, key: randomId() },
        { label: 'Use symbols', checked: true, key: randomId() },
        { label: 'Use spaces', checked: true, key: randomId() },
        { label: 'Use similar letters (e.g. l and I)', checked: true, key: randomId() }, // TODO: maybe add strict checkbox
    ];
    const [values, handlers] = useListState(initialValues);
    let checker = (arr: any[]) => arr.every(v => v === false);

    const items = values.map((value, index) => (
        <Checkbox
            mt="xs"
            ml={33}
            label={value.label}
            key={value.key}
            checked={value.checked}
            onChange={(event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
        />
    ));

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
    async function generatePasswordInterface(
        length: number,
        nums: boolean,
        lower: boolean,
        upper: boolean,
        symbols: boolean,
        spaces: boolean,
        similar: boolean,
        strict: boolean
    ) {
        console.log(checker(values)) // TODO: handle error when the user unchecks every box
        let x: any = await generatePassword(length, nums, lower, upper, symbols, spaces, similar, strict)
        setGeneratedPassword(String(x))
    }
    async function generatePassphraseInterface(length: number, numbers: boolean, specialCharacter: string) {
        let x: any = await generatePassphrase(length, numbers, specialCharacter)
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
                    <Checkbox
                        checked={usePassphraseNumbers}
                        onChange={(event) => setUsePassphraseNumbers(event.currentTarget.checked)}
                        label="Use numbers"
                        description="Whether to use numbers in passphrase generation"
                    />

                    <Button onClick={() =>
                        generatePassphraseInterface(passphraseLength, usePassphraseNumbers, '_')
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
                    {items}
                    <Button onClick={() =>
                        generatePasswordInterface(
                            passwordLength,
                            values[0].checked,
                            values[1].checked,
                            values[2].checked,
                            values[3].checked,
                            values[4].checked,
                            values[5].checked,
                            true
                        )
                    }>Generate!</Button>
                    <h4>{generatedPassword}</h4>
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
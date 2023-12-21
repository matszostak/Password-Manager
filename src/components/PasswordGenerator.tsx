import { Button, Checkbox, SegmentedControl, Slider, Space } from '@mantine/core'
import { invoke } from '@tauri-apps/api';
import { useState } from 'react';
import { generateDefault, generatePassphrase, generatePassword } from '../utils/passwordGeneration'
import { randomId, useListState } from '@mantine/hooks';
import { MAX_PASSPHRASE_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSPHRASE_LENGTH, MIN_PASSWORD_LENGTH, marksPassphrase, marksPassword } from '../utils/constants';

export default function PasswordGenerator(props: any) {
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
        // TODO: handle error when the user unchecks every box
        let x: any = await generatePassword(length, nums, lower, upper, symbols, spaces, similar, strict)
        setGeneratedPassword(String(x))
        props.handlePasswordSetting(String(x))
    }
    async function generatePassphraseInterface(length: number, numbers: boolean, specialCharacter: string) {
        let x: any = await generatePassphrase(length, numbers, specialCharacter)
        setGeneratedPassword(String(x))
        props.handlePasswordSetting(String(x))
    }
    function helper() {
        if (wordOrPhrase === 'passphrase') {
            return (
                <>
                    <Slider
                        w={400}
                        defaultValue={passphraseLength}
                        min={MIN_PASSPHRASE_LENGTH}
                        max={MAX_PASSPHRASE_LENGTH}
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
                    <Space h={10} />
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
                        min={MIN_PASSWORD_LENGTH}
                        max={MAX_PASSWORD_LENGTH}
                        marks={marksPassword}
                        step={1}
                        onChange={setPasswordLength}
                    />
                    <h1>{passwordLength}</h1>
                    {items}
                    <Space h={10} />
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
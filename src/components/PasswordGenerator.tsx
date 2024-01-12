import { Button, Checkbox, Paper, SegmentedControl, Slider, Space, TextInput, Text } from '@mantine/core'
import { useState } from 'react';
import { generatePassphrase, generatePassword } from '../utils/passwordGeneration'
import { randomId, useListState } from '@mantine/hooks';
import { MAX_PASSPHRASE_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSPHRASE_LENGTH, MIN_PASSWORD_LENGTH, marksPassphrase, marksPassword } from '../utils/constants';
import { IconLock, IconUser } from '@tabler/icons-react';

import classes from '../css/Styles.module.css';

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
        if (props.handlePasswordSetting) {
            props.handlePasswordSetting(String(x))
        }
    }
    async function generatePassphraseInterface(length: number, numbers: boolean, specialCharacter: string) {
        let x: any = await generatePassphrase(length, numbers, specialCharacter)
        setGeneratedPassword(String(x))
        if (props.handlePasswordSetting) {
            props.handlePasswordSetting(String(x))
        }
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
                    {
                        (props.handlePasswordSetting !== undefined) ? (
                            <></>
                        ) : (
                            <Paper shadow="xs" p={5} className={classes.input}>
                                <TextInput
                                    label={<Text c="dimmed" size="sm" ml={10}>Generated Password</Text>}
                                    spellCheck={false}
                                    classNames={{ input: classes.input }}
                                    pointer={false} value={String(generatedPassword)}
                                    leftSection={<IconLock size="1rem" stroke={1.5} />}
                                    onClick={() => console.log()}
                                />
                            </Paper>
                        )
                    }
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
                    <Button onClick={() => {
                        let isAnyBoxChecked = false
                        for (let i = 0; i < 4; i++) {
                            if (values[i].checked === true) {
                                isAnyBoxChecked = true;
                                break
                            }
                        }
                        if (isAnyBoxChecked) {
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
                        } else {
                            setGeneratedPassword('Any box has to be checked and the password cannot use just spaces.')
                        }
                    }
                    }>Generate!</Button>
                    {
                        (props.handlePasswordSetting !== undefined) ? (
                            <></>
                        ) : (
                            <Paper shadow="xs" p={5} className={classes.input}>
                                <TextInput
                                    label={<Text c="dimmed" size="sm" ml={10}>Generated Password</Text>}
                                    spellCheck={false}
                                    classNames={{ input: classes.input }}
                                    pointer={false} value={String(generatedPassword)}
                                    leftSection={<IconLock size="1rem" stroke={1.5} />}
                                    onClick={() => console.log()}
                                />
                            </Paper>
                        )
                    }
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
import { Button, Divider, Group, Space, Stack, Switch, Title, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon, IconKey } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function Settings() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light')
    const [checked, setChecked] = useState(true);
    
    useEffect(() => {
        if (localStorage.getItem('kdfAlgo') == 'true') {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }, [checked]);

    return (
        <>
            <Title>Settings</Title>
            <Space h={60} />
            <Stack>
                <Group justify="space-between" ml="lg" mr="lg">
                    Theme
                    <Button
                        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                        variant="default"
                        aria-label="Toggle color scheme"
                    >
                        {computedColorScheme === 'dark' ? (
                            <IconSun stroke={1.5} />
                        ) : (
                            <IconMoon stroke={1.5} />
                        )}
                    </Button>
                </Group>
                <Divider my={-5}/>
                <Group justify="space-between" ml="lg" mr="lg">
                    Algorithm: {checked? ('Argon2id') : ('PBKDF2-HMAC-SHA256')}
                    <Switch 
                        size="lg"
                        defaultChecked={true}
                        color="indigo"
                        checked={checked}
                        onChange={(event) => {
                            setChecked(event.currentTarget.checked)
                            if (localStorage.getItem('kdfAlgo') == 'true') {
                                localStorage.setItem('kdfAlgo', 'false')
                            } else {
                                localStorage.setItem('kdfAlgo', 'true')
                            }
                        }}
                    />
                </Group>
            </Stack>
        </>
    );
}
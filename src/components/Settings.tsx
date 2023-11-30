import { Button, Divider, Group, Space, Stack, Title, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function Settings() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light')

    return (
        <>
            <Title>Settings</Title>
            <Space h={60} />
            <Stack>
                <Group justify="space-between" ml="lg" mr="lg">
                    Setting 1
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
                    Setting 2
                    <Button
                        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                        variant="default"
                        aria-label="Toggle color scheme"
                    >
                        {computedColorScheme === 'dark' ? (
                            <IconSun stroke={1.5} />
                        ) : (
                            <IconMoon stroke={1.5} />
                        )

                        }
                    </Button>
                </Group>
                <Divider my={-5}/>
                <Group justify="space-between" ml="lg" mr="lg">
                    Setting 3
                    <Button
                        onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                        variant="default"
                        aria-label="Toggle color scheme"
                    >
                        {computedColorScheme === 'dark' ? (
                            <IconSun stroke={1.5} />
                        ) : (
                            <IconMoon stroke={1.5} />
                        )

                        }
                    </Button>
                </Group>
            </Stack>
        </>
    );
}
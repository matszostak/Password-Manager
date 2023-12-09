/* React Imports */
import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react';
/* Tauri Imports */
import { exists, createDir, copyFile, writeTextFile, readTextFile } from '@tauri-apps/api/fs'

/* Mantine Imports */
import {
    AppShell,
    ActionIcon,
    Group,
    Burger,
    useMantineColorScheme,
    useComputedColorScheme,
    Title,
} from '@mantine/core';

/* App Imports */
import Home from './components/Home';
import { NavbarSimple } from './components/Navbar';
import Security from './components/Security';
import Settings from './components/Settings';
import Tests from './components/Tests';
import PasswordGenerator from './components/PasswordGenerator';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';

export default function App() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true); // just marking this thing because it might be useful in some cases (toggle:)

    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light')
    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify='space-between'>
                    <Group>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                        <Title order={1}>Password Manager</Title>
                    </Group>
                    
                    <ActionIcon
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
                    </ActionIcon>
                </Group>

            </AppShell.Header>
            <AppShell.Navbar p="md">
                <NavbarSimple />
            </AppShell.Navbar>
            <AppShell.Main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/security' element={<Security />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/tests' element={<Tests />} />
                    <Route path='/passwordgenerator' element={<PasswordGenerator />} />
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}
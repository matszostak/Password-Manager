/* React Imports */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react';
/* Tauri Imports */
import { exists, writeFile, createDir } from '@tauri-apps/api/fs'

/* Mantine Imports */
import {
  MantineProvider,
  AppShell,
  ActionIcon,
  Group,
  Title,
  ColorScheme,
  MediaQuery,
  Burger,
  Header,
} from '@mantine/core';
import { useMantineTheme } from '@mantine/styles';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

/* App Imports */
import Home from './components/Home';
import { getAppStyles } from './utils/styles';
import { NavbarSimple } from './components/Navbar';
import Security from './components/Security';
import Settings from './components/Settings';
import * as Constants from './utils/constants'
import Tests from './components/Tests';

export default function App() {
  // TODO: I can start using a default color scheme loaded from the AppData file
  let defaultColorScheme: any = ''
  if (localStorage.getItem('savedColorScheme')) {
    defaultColorScheme = localStorage.getItem('savedColorScheme')
  } else {
    defaultColorScheme = 'dark'
  }
  const toggleColorScheme = (value?: ColorScheme) => {
    let color: any = value || (colorScheme === 'dark' ? 'light' : 'dark')
    localStorage.setItem('savedColorScheme', color)
    setColorScheme(color);
    localStorage.setItem('colorScheme', color)
    // TODO: save preference to file and load it from there OR check if preference in localStorage exists and use it
  }

  const createDataFolder = async () => { // TODO: that folder might no longer be necessary
    console.log('createDataFolder')
    await createDir("data", {
      dir: Constants.folderPath,
      recursive: true,
    });
    createDataFile();
  };

  const createDataFile = async () => {
    console.log('createDataFile')
    try {
      await writeFile(
        {
          contents: "[\"colorScheme\": \"dark\"]",
          path: Constants.profileFile,
        },
        { dir: Constants.folderPath }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const checkFiles = async () => { // TODO: check all files
    let optionsFolderExists = await exists(Constants.profileFile, { dir: Constants.folderPath })
    console.log('checking files')
    console.log(optionsFolderExists)
    if (!optionsFolderExists) {
      createDataFolder();
    }
  }

  const [colorScheme, setColorScheme] = useState(defaultColorScheme);
  const { classes } = getAppStyles();
  const [mobileNavOpened, setMobileNavOpened] = useState(false);

  useEffect(() => {
    console.log('Loading app...')
    checkFiles()
  }, []);

  return (
    <>
      <MantineProvider theme={{ colorScheme: colorScheme, fontFamily: 'Open Sans, sans serif' }} withGlobalStyles >
        <Notifications limit={5} />
        <ModalsProvider>
          <BrowserRouter>
            <AppShell padding='md' navbarOffsetBreakpoint='sm'
              navbar={
                <NavbarSimple isOpened={mobileNavOpened} />
              }
              header={
                <Header height={70} p='md' className={`${classes.header} ` + (classes.headerOverrides)}>
                  <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                    {/*TODO: close navbar when a link is clicked*/}
                    <Burger opened={mobileNavOpened} onClick={() => setMobileNavOpened(o => !o)}
                      size='sm' mr='xl' color={useMantineTheme().colors.gray[6]} />
                  </MediaQuery>
                  <Title>Password Manager</Title>
                  <Group className={classes.headerRightItems}>
                    <ActionIcon variant="default" onClick={() => toggleColorScheme()}>{colorScheme === 'dark' ? <h3>D</h3> : <h3>L</h3>}</ActionIcon>
                  </Group>
                </Header>}
            >
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/security' element={<Security />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/tests' element={<Tests />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
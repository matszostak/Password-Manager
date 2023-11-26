import { useState } from 'react';
import { Navbar } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconSettings,
  IconDatabaseImport,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useStyles } from '../utils/styles';
import { randomId } from '@mantine/hooks';

const data = [
  { link: '/', label: 'Passwords', icon: IconBellRinging, key: randomId() },
  { link: '/security', label: 'Security', icon: IconFingerprint, key: randomId() },
  // { link: '/databases', label: 'Databases', icon: IconDatabaseImport, key: randomId() },
  { link: '/settings', label: 'Settings', icon: IconSettings, key: randomId() },
  { link: '/tests', label: 'Tests', icon: IconSettings, key: randomId() },
  { link: '/passwordgenerator', label: 'Password Generator', icon: IconSettings, key: randomId() },
];

export function NavbarSimple({ isOpened }: { isOpened: any }) {
  const { classes, cx } = useStyles();
  let highlighted: string = data[0].label // set highlited to the home page so it is highlited on startup
  const [active, setActive] = useState(highlighted);

  const links = data.map((item) => (
    <Link
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      to={item.link}
      key={item.label}
      onClick={() => {
        highlighted = item.label
        setActive(highlighted)
      }
      }
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <Navbar height='100%' width={{ sm: 200 }} p='xs' hidden={!isOpened} hiddenBreakpoint='sm' className={classes.wholeNavbar}>
      <Navbar.Section>
        {links}
      </Navbar.Section>
    </Navbar>
  );
}
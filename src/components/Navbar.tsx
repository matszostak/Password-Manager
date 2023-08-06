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


const data = [
  { link: '/', label: 'Passwords', icon: IconBellRinging },
  { link: '/security', label: 'Security', icon: IconFingerprint },
  { link: '/databases', label: 'Databases', icon: IconDatabaseImport },
  { link: '/settings', label: 'Settings', icon: IconSettings },
  { link: '/tests', label: 'Tests', icon: IconSettings },
];

export function NavbarSimple({ isOpened }: { isOpened: any }) {
  const { classes, cx } = useStyles();
  let highlighted: string = ''
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
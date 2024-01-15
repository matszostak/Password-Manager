import { useState } from 'react';
import {
    IconFingerprint,
    IconHome,
    IconLock,
    IconSettings,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { randomId } from '@mantine/hooks';
import { Box, NavLink } from '@mantine/core';

const data = [
    { link: '/', label: 'Home', icon: <IconHome size="1rem" stroke={1.5} />, key: randomId() },
    { link: '/passwordgenerator', label: 'Password Generator', icon: <IconLock size="1rem" stroke={1.5} />, key: randomId() },
    // { link: '/security', label: 'Security', icon: <IconFingerprint size="1rem" stroke={1.5} />, key: randomId() },
    { link: '/settings', label: 'Settings', icon: <IconSettings size="1rem" stroke={1.5} />, key: randomId() },
    // { link: '/tests', label: 'Tests', icon: <IconSettings size="1rem" stroke={1.5} />, key: randomId() },
];

export function NavbarSimple() {
    const [active, setActive] = useState(0);

    const items = data.map((item, index) => (
        <NavLink
            component={Link}
            to={item.link}
            key={item.label}
            active={index === active}
            label={item.label}
            leftSection={item.icon}
            onClick={() => setActive(index)}
            color="indigo"
            variant="filled"
        />
    ));

    return (
        <Box mih={220}>
            {items}
        </Box>
    );
}
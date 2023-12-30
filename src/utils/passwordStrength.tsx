import { rem, Box, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

export function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
	return (
		<Text
			c={meets ? 'teal' : 'red'}
			style={{ display: 'flex', alignItems: 'center' }}
			mt={7}
			size="sm"
		>
			{meets ? (
				<IconCheck style={{ width: rem(14), height: rem(14) }} />
			) : (
				<IconX style={{ width: rem(14), height: rem(14) }} />
			)}{' '}
			<Box ml={10}>{label}</Box>
		</Text>
	);
}

export const requirements = [
	{ re: /[0-9]/, label: 'Includes number' },
	{ re: /[a-z]/, label: 'Includes lowercase letter' },
	{ re: /[A-Z]/, label: 'Includes uppercase letter' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

export function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}
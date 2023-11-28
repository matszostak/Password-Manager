import { sep } from '@tauri-apps/api/path'
import { BaseDirectory } from '@tauri-apps/api/fs'

export const folderPath = BaseDirectory.AppData // in case I need to change something
export const profileFile: string = `profile.json`
export const fileExtensionWithoutDot: string = 'secpass'
export const fileExtensionWithDot: string = `.${fileExtensionWithoutDot}`

export const MAX_PASSWORD_LENGTH: number = 128
export const MIN_PASSWORD_LENGTH: number = 16

export const MAX_PASSPHRASE_LENGTH: number = 10
export const MIN_PASSPHRASE_LENGTH: number = 2

export const marksPassword: {value: number; label: string}[] = [];

for(let i = MIN_PASSWORD_LENGTH; i <= MAX_PASSWORD_LENGTH; i += 16) {
    marksPassword.push({value: i, label: String(i)})
}

export const marksPassphrase = [
    { value: 2, label: '2' },
    { value: 4, label: '4' },
    { value: 6, label: '6' },
    { value: 8, label: '8' },
    { value: 10, label: '10' },
];
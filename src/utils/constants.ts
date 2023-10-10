import { sep } from '@tauri-apps/api/path'
import { BaseDirectory } from '@tauri-apps/api/fs'

export const folderPath = BaseDirectory.AppData // in case I need to change something
export const profileFile: string = `data${sep}profile.json`
export const fileExtensionWithoutDot: string = 'secpass'
export const fileExtensionWithDot: string = `.${fileExtensionWithoutDot}`
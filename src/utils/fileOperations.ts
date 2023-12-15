import { save, open as open_tauri } from '@tauri-apps/api/dialog'
import { invoke } from "@tauri-apps/api/tauri"
import { fileExtensionWithDot, fileExtensionWithoutDot } from './constants';

export async function saveNewDatabase(password: string) {
    const filePath = await save({
        filters: [{
            name: fileExtensionWithDot,
            extensions: [fileExtensionWithoutDot],
        }]
    })
    if (filePath) {
        await invoke("create_new_database", { path: filePath, password: password })
        return filePath
    }
    else {
        return null
    }
    // save the path to some kind of file so that the app can access it later
    // https://www.youtube.com/watch?v=WDPZb_zVrd8
}

export async function openExistingDatabase(password: string, selected: string) {
    const database_content = await invoke('decrypt_database', { path: selected, password: password })
    if (database_content === "Path does not exist") {
        return "Database does not exist."
    }
    else if (database_content === "\"{}\"") {
        return "Wrong password!"
    } else {
        return database_content
    }
}

export async function saveDbInfoToFile(path: string) {
    
}
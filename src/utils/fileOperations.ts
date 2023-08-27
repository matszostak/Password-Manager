import { save, open as open_tauri } from '@tauri-apps/api/dialog';
import { invoke } from "@tauri-apps/api/tauri";

export const saveTest = async () => {
    const filePath = await save({
        filters: [{
            name: '.json',
            extensions: ['json', 'txt'],
        }]
    });
    console.log(filePath)
    if (filePath != null) {
        await invoke("create_new_database", { path: filePath, password: "verysecurepasswordthatwillbehandledlater" }); // TODO: passwords
    }
    else {
        // TODO: Do something with it (display to user that file was not specified)
        console.log('File path not specified.')
    }
    // save the path to some kind of file so that the app can access it later
    // https://www.youtube.com/watch?v=WDPZb_zVrd8
}

export async function saveNewDatabase(password: string) {
    console.log(password)
    const filePath = await save({
        filters: [{
            name: '.secpass', //TODO: some extension or something
            extensions: ['secpass'],
        }]
    });
    console.log(filePath)
    if (filePath != null) {
        await invoke("create_new_database", { path: filePath, password: password }); // TODO: passwords
    }
    else {
        // TODO: Do something with it (display to user that file was not specified)
        console.log('File path not specified.')
    }
    // save the path to some kind of file so that the app can access it later
    // https://www.youtube.com/watch?v=WDPZb_zVrd8
    return filePath
}

export async function openExistingDatabase(password: string) {
    const selected = await open_tauri({
        multiple: false,
        filters: [{
          name: '.secpass',
          extensions: ['secpass']
        }]
      });
    console.log('hello grom fileOps! password:', password, selected)
    const database_content = await invoke('decrypt_database', { path: selected, password: password })
    if (database_content === "\"{}\"") {
        console.log('wrong password!')
        return "Wrong password!"
    } else {
        console.log('good password!')
        console.log(database_content)
        return database_content
    }
}
import { save } from '@tauri-apps/api/dialog';
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
    console.log('hello grom fileOps! password:', password)

    return password
}
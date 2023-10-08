import { invoke } from '@tauri-apps/api';

export async function generateDefault() {
    let generated = await invoke('generate_default_options', {})
    console.log(generated)
}

export async function generatePassword(
        len: number,
        nums: boolean,
        lower: boolean,
        upper: boolean,
        symbols: boolean,
        special: boolean,
        similar: boolean,
        strict: boolean
    ) {
    let generated = await invoke('generate_password', {
        passwordLength: len,
        passwordNumbers: nums,
        passwordLowercase: upper,
        passwordUppercase: lower,
        passwordSymbols: symbols,
        passwordSpaces: special,
        passwordSimilar: similar,
        passwordStrict: strict, // leave it to true
    })
    console.log(generated)
    return generated
}

export async function generatePassphrase() {

}
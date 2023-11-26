import { invoke } from '@tauri-apps/api';

export async function generateDefault() {
    let generated = await invoke('generate_default_options', {})
    console.log(generated)
    return String(generated)
}

export async function generatePassword(
    len: number,
    nums: boolean,
    lower: boolean,
    upper: boolean,
    symbols: boolean,
    special: boolean,
    similar: boolean,
    _strict: boolean
) {
    let generated = await invoke('generate_password', {
        passwordLength: len,
        passwordNumbers: nums,
        passwordLowercase: upper,
        passwordUppercase: lower,
        passwordSymbols: symbols,
        passwordSpaces: special,
        passwordSimilar: similar,
        passwordStrict: true, // TODO: leave it to true for now
    })
    console.log(generated)
    return generated
}
//passphrase_length: u32, passphrase_numbers: bool, passphrase_special_char_type: String
export async function generatePassphrase(
    len: number,
    nums: boolean,
    specialCharacter: string
) {
    let generated = await invoke('generate_passphrase', {
        passphraseLength: len,
        passphraseNumbers: nums,
        passphraseSpecialCharType: specialCharacter
    })
    console.log(len)
    console.log(generated)
    return generated
}
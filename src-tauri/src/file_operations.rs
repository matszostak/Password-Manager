use rand::RngCore;
use rand::SeedableRng;
use rand::rngs::StdRng;
use serde_json;
use std::process;
use std::{fs, path::Path, str};

use super::aes_encryption::decrypt;
use super::aes_encryption::encrypt;
use super::key_derivation::generate_key_from_password_argon2;

#[tauri::command]
pub fn create_new_database(path: String, password: String) {
    let mut source_rng = rand::thread_rng();
    let mut rng: StdRng = SeedableRng::from_rng(&mut source_rng).unwrap(); 
    let mut salt: [u8; 16] = [0u8; 16];
    rng.fill_bytes(&mut salt); 

    let key = generate_key_from_password_argon2(password.as_bytes(), &salt);

    // TODO: encrypt file with password and basically handle key creation
    let template_path = Path::new("resources\\db_template.json");
    if template_path.exists() {
        let data: String = fs::read_to_string(template_path).expect("Unable to read file");
        let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
        let pretty: String = serde_json::to_string_pretty(&res).unwrap();
        let iv: [u8; 16] = [0; 16];
        let mut salt_and_iv: Vec<u8> = [&salt[..], &iv].concat();
        // TODO: save salt, IV and all the important stuff to file
        let mut encrypted: Vec<u8> = encrypt(pretty.as_bytes(), &key, &iv).unwrap();
        salt_and_iv.append(&mut encrypted);
        fs::write(&path, &salt_and_iv).unwrap();
    } else {
        println!("Something went wrong.");
        process::exit(1);
    }
}

#[tauri::command]
pub fn decrypt_database(path: String, password: String) -> String {
    // TODO: finish decryption
    if !Path::new(&path).exists() {
        return "Path does not exist".to_string();
    }
    let file_contents = fs::read(path).unwrap();
    let salt = &file_contents[0..16]; // TODO: change salt, see 'somehow generate it'
    let iv = &file_contents[16..32]; // TODO: change IV?
    let data = &file_contents[32..];

    let key = generate_key_from_password_argon2(password.as_bytes(), salt);

    let decrypted_result = decrypt(data, &key, iv);
    if decrypted_result.is_ok() {
        let decrypted = decrypted_result.ok().unwrap();
        let decrypted_string = str::from_utf8(&decrypted).unwrap();
        return decrypted_string.to_string();
    } else {
        let err_string = "{}";
        return serde_json::to_string_pretty(&err_string).unwrap();
    }
}

#[tauri::command]
pub fn encrypt_database(
    path: String,
    _password: String, /* password will be stored somewhere when DB is successfully decrypted */
) {
    // TODO: finish encryption
    let old_file_contents = fs::read(path).unwrap();
    let _salt = &old_file_contents[0..16]; // TODO: change salt, see 'somehow generate it'
    let _iv = &old_file_contents[16..32]; // TODO: change IV?
    let _data = &old_file_contents[32..];
}

pub fn create_useful_files() {
    let appdata_dir = tauri::api::path::data_dir().unwrap().display().to_string();
    let combined_string = format!("{}{}", appdata_dir, "\\PasswordManager");
    if !Path::new(combined_string.as_str()).exists() {
        println!("PasswordManager directory does not exist... creating");
        let _ = fs::create_dir(combined_string);
    }
    let combined_string2 = format!("{}{}", appdata_dir, "\\PasswordManager");
    let file = format!("{}{}", combined_string2, "\\profile.json");
    if !Path::new(file.as_str()).exists() {
        println!("Config file does not exist... creating");
        let _ = fs::copy("resources\\profile.json", file);
    }
}
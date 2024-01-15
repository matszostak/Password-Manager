use rand::rngs::StdRng;
use rand::RngCore;
use rand::SeedableRng;
use serde_json;
use serde_json::json;
use std::process;
use std::time::SystemTime;
use std::{fs, path::Path, str, path::MAIN_SEPARATOR_STR};
use chrono::prelude::{DateTime, Utc};

use super::aes_encryption::decrypt;
use super::aes_encryption::encrypt;
use super::key_derivation::generate_key_from_password_argon2;
use super::key_derivation::generate_key_from_password_pbkdf;

#[tauri::command]
pub fn create_new_database(path: String, password: String, name: String, kdf_algo: bool) {
    let mut source_rng = rand::thread_rng();
    let mut rng: StdRng = SeedableRng::from_rng(&mut source_rng).unwrap();
    let mut salt: [u8; 16] = [0u8; 16];
    rng.fill_bytes(&mut salt);
    let key: [u8; 32];
    if kdf_algo {
        key = generate_key_from_password_argon2(password.as_bytes(), &salt);
    } else {
        key = generate_key_from_password_pbkdf(password.as_bytes(), &salt).unwrap();
    }
    let complete = format!("{}{}{}", "resources", MAIN_SEPARATOR_STR, "db_template.json");
    let template_path = Path::new(&complete);
    if template_path.exists() {
        let data: String = fs::read_to_string(template_path).expect("Unable to read file");
        let mut res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
        if let Some(obj) = res.as_object_mut() {
            if let Some(value) = obj.get_mut("vaultName") {
                *value = json!(name);
            }
            if let Some(value) = obj.get_mut("creationDate") {
                let now: SystemTime = SystemTime::now();
                let now: DateTime<Utc> = now.into();
                let now_string_rfc: String = now.to_rfc3339();
                *value = json!(now_string_rfc);
            }
        }
        let pretty: String = serde_json::to_string_pretty(&res).unwrap();
        let mut iv: [u8; 16] = [0; 16];
        rng.fill_bytes(&mut iv);
        let mut salt_and_iv: Vec<u8> = [&salt[..], &iv].concat();
        let mut encrypted: Vec<u8> = encrypt(pretty.as_bytes(), &key, &iv).unwrap();
        salt_and_iv.append(&mut encrypted);
        fs::write(&path, &salt_and_iv).unwrap();
    } else {
        process::exit(1);
    }
}

#[tauri::command]
pub fn decrypt_database(path: String, password: String, kdf_algo: bool) -> String {
    if !Path::new(&path).exists() {
        return "Path does not exist".to_string();
    }
    let file_contents = fs::read(path).unwrap();
    let salt = &file_contents[0..16];
    let iv = &file_contents[16..32];
    let data = &file_contents[32..];

    //println!("{}", hex::encode(salt));
    //println!("{}", hex::encode(iv));

    let key: [u8; 32];
    if kdf_algo {
        key = generate_key_from_password_argon2(password.as_bytes(), &salt);
    } else {
        key = generate_key_from_password_pbkdf(password.as_bytes(), &salt).unwrap();
    }
    //println!("{}", hex::encode(key));
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
    password: String, /* password will be stored somewhere when DB is successfully decrypted */
    data: String,
    kdf_algo: bool
) -> String {
    let mut source_rng = rand::thread_rng();
    let mut rng: StdRng = SeedableRng::from_rng(&mut source_rng).unwrap();
    let mut salt: [u8; 16] = [0u8; 16];
    rng.fill_bytes(&mut salt);

    let key: [u8; 32];
    if kdf_algo {
        key = generate_key_from_password_argon2(password.as_bytes(), &salt);
    } else {
        key = generate_key_from_password_pbkdf(password.as_bytes(), &salt).unwrap();
    }

    let mut iv: [u8; 16] = [0; 16];
    rng.fill_bytes(&mut iv);

    let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
    let pretty: String = serde_json::to_string_pretty(&res).unwrap();
    let mut salt_and_iv: Vec<u8> = [&salt[..], &iv].concat();
    let mut encrypted: Vec<u8> = encrypt(pretty.as_bytes(), &key, &iv).unwrap();
    salt_and_iv.append(&mut encrypted);
    fs::write(&path, &salt_and_iv).unwrap();
    return "encrypted".to_string();
}

pub fn create_useful_files() {
    let appdata_dir = tauri::api::path::data_dir().unwrap().display().to_string();
    let combined_string = format!("{}{}{}", appdata_dir, MAIN_SEPARATOR_STR, "PasswordManager");
    if !Path::new(combined_string.as_str()).exists() {
        let _ = fs::create_dir(combined_string);
    }
    let combined_string2 = format!("{}{}{}", appdata_dir, MAIN_SEPARATOR_STR, "PasswordManager");
    let file = format!("{}{}{}", combined_string2, MAIN_SEPARATOR_STR, "profile.json");
    if !Path::new(file.as_str()).exists() {
        let complete = format!("{}{}{}", "resources", MAIN_SEPARATOR_STR, "profile.json");
        let _ = fs::copy(complete, file);
    }
}

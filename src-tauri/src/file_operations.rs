use serde_json;
use std::{fs, path::Path, str};

use super::aes_encryption::encrypt;
use super::aes_encryption::decrypt;
use super::key_derivation::generate_key_from_password_argon2;


#[tauri::command]
pub fn create_new_database(path: String, password: String) {
    let salt = b"dmVyeXNlY3VyZXNh"; //TODO: change salt stuff, somehow generate it and save it to file!!!
    let key = generate_key_from_password_argon2(password.as_bytes(), salt);

    println!("Key: {}", hex::encode(key));
    println!("PASSWORD: {}", password);

    // TODO: encrypt file with password and basically handle key creation
    let template_path = Path::new("src\\db_template.json");
    if template_path.exists() {
        let data: String = fs::read_to_string(template_path).expect("Unable to read file");
        let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
        let pretty: String = serde_json::to_string_pretty(&res).unwrap();
        let iv: [u8; 16] = [0; 16];
        let mut salt_and_iv: Vec<u8> = [&salt[..], &iv].concat();
        println!("Salt: {}", hex::encode(salt));
        println!("IV: {}", hex::encode(iv));
        // TODO: save salt, IV and all the important stuff to file
        let mut encrypted: Vec<u8> = encrypt(pretty.as_bytes(), &key, &iv).unwrap();
        println!("{}", hex::encode(&encrypted));

        salt_and_iv.append(&mut encrypted);

        println!("{}", hex::encode(&salt_and_iv));

        fs::write(&path, &salt_and_iv).unwrap();
    } else {
        println!("Something went wrong.");
    }
}

#[tauri::command]
pub fn decrypt_database(path: String, password: String)  -> String { // TODO: finish decryption
    let file_contents = fs::read(path).unwrap();
    let salt = &file_contents[0..16]; // TODO: change salt, see 'somehow generate it'
    let iv = &file_contents[16..32]; // TODO: change IV?
    let data = &file_contents[32..];

    let key = generate_key_from_password_argon2(password.as_bytes(), salt);

    println!("\n\n\n");
    println!("SALT: {}", hex::encode(&salt));
    println!("IV: {}", hex::encode(&iv));
    println!("DATA: {}", hex::encode(&data));
    println!("PASSWORD: {}", password);
    println!("KEY: {}", hex::encode(&key));
    println!("\n\n\n");

    let decrypted_result = decrypt(data, &key, iv);
    if decrypted_result.is_ok() {
        let decrypted = decrypted_result.ok().unwrap();
        let decrypted_string = str::from_utf8(&decrypted).unwrap();
        println!("Decrypted response: {:?}", decrypted_string);
        let res: serde_json::Value = serde_json::from_str(&decrypted_string).expect("Unable to parse");
        let pretty: String = serde_json::to_string_pretty(&res).unwrap();
        print!("{}", pretty);
        return pretty;
    } else {
        let err_string = "{}";
        return serde_json::to_string_pretty(&err_string).unwrap();
    }
}

#[tauri::command]
pub fn encrypt_database(path: String, password: String /* password will be stored somewhere when DB is successfully decrypted */) { // TODO: finish encryption
    let old_file_contents = fs::read(path).unwrap();
    let salt = &old_file_contents[0..16]; // TODO: change salt, see 'somehow generate it'
    let iv = &old_file_contents[16..32]; // TODO: change IV?
    let data = &old_file_contents[32..];
    println!("SALT: {}", hex::encode(&salt));
    println!("IV: {}", hex::encode(&iv));
    println!("DATA: {}", hex::encode(&data));
    println!("PASSWORD: {}", password);
}
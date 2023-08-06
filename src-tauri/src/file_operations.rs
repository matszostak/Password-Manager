use serde_json;
use std::{fs, path::Path};

use super::encryption::encrypt;
use super::encryption::decrypt;
use super::key_derivation::generate_key_from_password_argon2;


#[tauri::command]
pub fn create_new_database(path: String, password: String) {
    let salt = b"dmVyeXNlY3VyZXNh"; //TODO: change salt stuff, somehow generate it and save it to file!!!
    let key = generate_key_from_password_argon2(password.as_bytes(), salt);

    println!("Key: {}", hex::encode(key));
    println!("{}", password);
    println!("{}", path);

    // TODO: encrypt file with password and basically handle key creation
    let template_path = Path::new("src\\db_template.json");
    if template_path.exists() {
        let data: String = fs::read_to_string(template_path).expect("Unable to read file");
        let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
        let pretty: String = serde_json::to_string_pretty(&res).unwrap();
        let iv: [u8; 16] = [0; 16];
        let mut salt_and_iv = [&salt[..], &iv].concat();
        

        println!("Salt: {}", hex::encode(salt));
        println!("IV: {}", hex::encode(iv));


        // TODO: save salt, IV and all the important stuff to file
        let mut encrypted = encrypt(pretty.as_bytes(), &key, &iv).unwrap();
        println!("{}", hex::encode(&encrypted));

        salt_and_iv.append(&mut encrypted);

        println!("{}", hex::encode(&salt_and_iv));

        fs::write(&path, &salt_and_iv).unwrap();
    } else {
        println!("Something went wrong.");
    }
}

#[tauri::command]
pub fn decrypt_database(path: String, password: String) { // TODO: finish decryption
    let file_contents = fs::read(path).unwrap();
    println!("SALT: {}", hex::encode(&file_contents[0..16]));
    println!("IV: {}", hex::encode(&file_contents[16..32]));
    println!("DATA: {}", hex::encode(&file_contents[32..]));
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
}

#[tauri::command]
pub fn test_command(from_where: String) -> String {
    println!("Command invoked from {}!", from_where);

    let path: &str = "C:\\Users\\Mateusz\\Desktop\\test.json";
    if Path::new("C:\\Users\\Mateusz\\Desktop\\test.json").exists() {
        let data: String = fs::read_to_string(path).expect("Unable to read file");

        let res: serde_json::Value = serde_json::from_str(&data).expect("Unable to parse");
        let pretty: String = serde_json::to_string_pretty(&res).unwrap();
        print!("{}", pretty);
        return pretty;
    } else {
        let res: serde_json::Value =
            serde_json::from_str("{\"name\": \"abc\"}").expect("Unable to parse");
        let failed_to_open: String = serde_json::to_string_pretty(&res).unwrap();
        print!("{}", failed_to_open);
        return failed_to_open;
    }
}
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_operations;
mod key_derivation;
mod hash;
mod aes_encryption;
mod password_generator;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            file_operations::create_new_database, 
            file_operations::decrypt_database,
            file_operations::encrypt_database,
            password_generator::generate_password,
            password_generator::generate_passphrase,
            password_generator::generate_default_options
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod aes_encryption;
mod file_operations;
mod hash;
mod key_derivation;
mod password_generator;

#[macro_use]
extern crate lazy_static;

#[tauri::command]
fn test() {
    println!("CLOSED NOW");
}
fn main() {
    file_operations::create_useful_files();
    tauri::Builder::default()
        
        .invoke_handler(tauri::generate_handler![
            file_operations::create_new_database,
            file_operations::decrypt_database,
            file_operations::encrypt_database,
            password_generator::generate_password,
            password_generator::generate_passphrase,
            password_generator::generate_default_options,
            test
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

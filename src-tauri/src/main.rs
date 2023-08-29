// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_operations;
mod key_derivation;
mod hash;
mod encryption;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            file_operations::create_new_database, 
            file_operations::decrypt_database,
            file_operations::encrypt_database
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

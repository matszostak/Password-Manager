
// TODO: look into https://crates.io/crates/passwords
// this crate has almost everything
// also look at scoring

use passwords::PasswordGenerator;
use rand::Rng;

#[tauri::command]
pub fn generate_password(
    password_length: usize,
    password_numbers: bool,
    password_lowercase: bool,
    password_uppercase: bool,
    password_symbols: bool,
    password_spaces: bool,
    password_similar: bool
) -> String {
    let pg = PasswordGenerator {
        length: password_length,
        numbers: password_numbers,
        lowercase_letters: password_lowercase,
        uppercase_letters: password_uppercase,
        symbols: password_symbols,
        spaces: password_spaces,
        exclude_similar_characters: password_similar,
        strict: true, // leave it to true
    };
    let generated: Result<String, &str> = pg.generate_one();
    // TODO: check strength here
    println!("{}", generated.clone().unwrap().to_string());
    return generated.unwrap().to_string();
}

#[tauri::command]
pub fn generate_default_options() -> String {
    let pg = PasswordGenerator {
        length: 32,
        numbers: true,
        lowercase_letters: true,
        uppercase_letters: true,
        symbols: false,
        spaces: false,
        exclude_similar_characters: true,
        strict: true, // leave it to true
    };
    let generated: Result<String, &str> = pg.generate_one();
    println!("{}", generated.clone().unwrap().to_string());
    // TODO: check strength here
    return generated.unwrap().to_string();
}

// TODO
#[tauri::command]
pub fn generate_passphrase(length: u32) -> String {
    for _i in 0..length {
        let num = rand::thread_rng().gen_range(0..100);
        println!("{}", num)
    }
    return "".to_string();
}
// TODO: Look into https://docs.rs/zxcvbn/latest/zxcvbn/ and https://github.com/ctsrc/Pgen
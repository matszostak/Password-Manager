
// TODO: look into https://crates.io/crates/passwords
// this crate has almost everything
// also look at scoring

use passwords::PasswordGenerator;


#[tauri::command]
pub fn generate_random_password(
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
    return generated.unwrap().to_string();
}

#[tauri::command]
pub fn generate_random_passphrase() -> String {
    return "".to_string();
}

// TODO: look into https://crates.io/crates/passwords
// this crate has almost everything
// also look at scoring

use passwords::PasswordGenerator;
use rand::Rng;
use std::{fs, collections::HashMap};

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

// TODO: this code is absolutely disgusting.
#[tauri::command]
pub fn generate_passphrase(length: u32) -> String {
    let file_path = "src\\res\\eff_large_wordlist.txt";

    let contents = fs::read_to_string(file_path).unwrap();

    let mut map = HashMap::new();

    for line in contents.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        map.insert(parts[0].to_string().parse::<i32>().unwrap(), parts[1].to_string());
    }

    let mut password = "".to_string();

    for _i in 0..length {
        let mut index: i32 = 0;
        for _j in 1..6 {
            let num = rand::thread_rng().gen_range(1..7);
            let _t: i32 = 10;
            index = index + (num * _t.pow(5 - _j));
        }
        let word = capitalize_first_letter(&map.get(&index).unwrap());
        password = password.to_owned() + "_" + word.as_str();
    }

    let mut tmp_password = password.chars();
    tmp_password.next();
    password = tmp_password.as_str().to_string();

    println!("Pass: {}", password);
    return password;
}
// TODO: Look into https://docs.rs/zxcvbn/latest/zxcvbn/ and https://github.com/ctsrc/Pgen

fn capitalize_first_letter(word: &str) -> String {
    let mut chars: std::str::Chars<'_> = word.chars();
    if let Some(c) = chars.next() {
        let first_char: String = c.to_uppercase().collect::<String>();
        return first_char + chars.as_str();
    }
    return String::new()
}
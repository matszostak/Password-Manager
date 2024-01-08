// TODO: Look into https://docs.rs/zxcvbn/latest/zxcvbn/ and https://github.com/ctsrc/Pgen

use passwords::PasswordGenerator;
use rand::Rng;
use std::{fs, collections::HashMap, time::Instant};
use std::path::MAIN_SEPARATOR_STR;


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
    // TODO: check strength here
    return generated.unwrap().to_string();
}

lazy_static! {
    static ref HASHMAP: HashMap<i32, String> = {
        let m = load_database();
        m
    };
}
fn load_database() -> HashMap<i32, String> {
    let file_path = format!("{}{}{}", "resources", MAIN_SEPARATOR_STR, "eff_large_wordlist.txt");
    let contents = fs::read_to_string(file_path).unwrap();
    let mut map = HashMap::new();
    

    for line in contents.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        map.insert(parts[0].to_string().parse::<i32>().unwrap(), parts[1].to_string());
    }
    return map;
}

// TODO: this code is absolutely disgusting.
#[tauri::command]
pub fn generate_passphrase(passphrase_length: u32, passphrase_numbers: bool, passphrase_special_char_type: String) -> String {
    let _before = Instant::now();
    let mut password = "".to_string();

    for _i in 0..passphrase_length {
        let mut index: i32 = 0;
        for _j in 1..6 {
            let num = rand::thread_rng().gen_range(1..7);
            let t: i32 = 10;
            index = index + (num * t.pow(5 - _j));
        }
        let mut word: String = capitalize_first_letter(&HASHMAP.get(&index).unwrap());
        if passphrase_numbers {
            word = word + rand::thread_rng().gen_range(0..10).to_string().as_str();
        } 
        password = password.to_owned() + passphrase_special_char_type.as_str() + word.as_str();
    }

    let mut tmp_password = password.chars(); // this here cleans up the password
    tmp_password.next();
    password = tmp_password.as_str().to_string();
    return password;
}

fn capitalize_first_letter(word: &str) -> String {
    let mut chars: std::str::Chars<'_> = word.chars();
    if let Some(c) = chars.next() {
        let first_char: String = c.to_uppercase().collect::<String>();
        return first_char + chars.as_str();
    }
    return String::new()
}
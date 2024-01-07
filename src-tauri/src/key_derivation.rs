use pbkdf2::hmac;
use sha2::Sha256;

use argon2::Argon2;

#[allow(dead_code)] // TODO: maybe user wants to choose method
pub fn generate_key_from_password_pbkdf(password: &[u8], salt: &[u8]) -> Result<[u8; 32], String> {
    let rounds = 600_000; //change to more later or just stop using pbkdf2
    let mut key = [0_u8; 32];

    let res = pbkdf2::pbkdf2::<hmac::Hmac<Sha256>>(
        password,
        salt,
        rounds,
        &mut key,
    );

    match res {
        Ok(_) => return Ok(key),
        Err(err) => return Err(err.to_string()),
    };
}

pub fn generate_key_from_password_argon2(password: &[u8], salt: &[u8]) -> [u8; 32] {
    let mut output_key = [0u8; 32]; // Can be any desired size
    let _ = Argon2::default().hash_password_into(password, salt, &mut output_key);
    return output_key;
}
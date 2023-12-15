use argon2::{
    password_hash::{PasswordHasher, SaltString},
    Argon2, PasswordHash
};
use argon2::{Algorithm, Params, Version};

#[allow(dead_code)] 
pub fn argon2_hash<'a>(password: &'a [u8], salt: &'a SaltString) -> PasswordHash<'a> {
    let argon2: Argon2<'_> = Argon2::new(
        Algorithm::Argon2id,
        Version::V0x13, // 0x13 == 19
        Params::new(19456, 2, 1, None).unwrap(),
    );

    let password_hash = argon2.hash_password(password, salt).unwrap();
    
    return password_hash;
}
// src\adapters\bcrypt.js
import bcrypt from 'bcryptjs'

export class PasswordHasherAdapter {
    execute(password) {
        // const salt = bcrypt.genSalt(10)
        // return bcrypt.hash(password, salt)
        return bcrypt.hash(password, 10)
    }

    // async compare(value, hashed) {
    //     return bcrypt.compare(value, hashed)
    // }
}

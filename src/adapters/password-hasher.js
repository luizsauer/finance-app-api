// src\adapters\bcrypt.js
import bcrypt from 'bcryptjs'

export class PasswordHasherAdapter {
    async execute(password) {
        // const salt = await bcrypt.genSalt(10)
        // return await bcrypt.hash(password, salt)
        await bcrypt.hash(password, 10)
    }
    // async compare(value, hashed) {
    //     return bcrypt.compare(value, hashed)
    // }
}

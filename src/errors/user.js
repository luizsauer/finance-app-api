// src\errors\user.js
class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The email ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
export default EmailAlreadyInUseError

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with ID ${userId} not found.`)
        this.name = 'UserNotFoundError'
    }
}

export class InvalidPasswordError extends Error {
    constructor() {
        super('Invalid password.')
        this.name = 'InvalidPasswordError'
    }
}

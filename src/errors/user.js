class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The email ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
export default EmailAlreadyInUseError

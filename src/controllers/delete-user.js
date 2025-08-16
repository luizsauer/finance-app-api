// src\controllers\delete-user.js
import {
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from './helpers/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const idError = checkIfIdIsValid(userId)
            if (idError) {
                return idError
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (deletedUser.length === 0) {
                return userNotFoundResponse()
            }
            return ok({ message: 'User deleted successfully' })
        } catch (error) {
            console.error('Error executing delete user', error)
            return serverError(error)
        }
    }
}

// src\controllers\delete-user.js
import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

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

            return ok(deletedUser)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error('Error executing delete user', error)
            return serverError(error)
        }
    }
}

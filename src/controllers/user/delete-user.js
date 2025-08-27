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
            const user_id = httpRequest.params.user_id

            const idError = checkIfIdIsValid(user_id)
            if (idError) {
                return idError
            }

            const deletedUser = await this.deleteUserUseCase.execute(user_id)

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

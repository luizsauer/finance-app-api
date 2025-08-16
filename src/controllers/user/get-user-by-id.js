// src\controllers\get-user-by-id.js
import {
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const idError = checkIfIdIsValid(userId)
            if (idError) {
                return idError
            }

            const user = await this.getUserByIdUseCase.execute(userId)

            if (!user) {
                return userNotFoundResponse()
            }
            return ok(user)
        } catch (error) {
            console.error('Error executing query', error)
            return serverError(error)
        }
    }
}

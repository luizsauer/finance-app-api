// src\controllers\get-user-by-id.js
import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const idError = checkIfIdIsValid(userId)
            if (idError) {
                return idError
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(userId)

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

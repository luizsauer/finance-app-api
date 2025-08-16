// src\controllers\get-user-by-id.js
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { notFound, ok, serverError } from './helpers/http.js'
import { checkIfIdIsValid } from './helpers/user.js'

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
                return notFound({ message: 'User not found' })
            }
            return ok(user)
        } catch (error) {
            console.error('Error executing query', error)
            return serverError(error)
        }
    }
}

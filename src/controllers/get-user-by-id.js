// src\controllers\get-user-by-id.js
import validator from 'validator'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, notFound, ok, serverError } from './helpers.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!validator.isUUID(userId)) {
                return badRequest({ message: 'Invalid user ID' })
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

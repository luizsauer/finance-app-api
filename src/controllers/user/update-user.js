// src\controllers\update-user.js
import { ZodError } from 'zod'
import EmailAlreadyInUseError, { UserNotFoundError } from '../../errors/user.js'
import { updateUserSchema } from '../../schemas/user.js'
import {
    badRequest,
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const idError = checkIfIdIsValid(userId)
            if (idError) {
                return idError
            }

            const updateUserParams = httpRequest.body

            await updateUserSchema.parseAsync(updateUserParams)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            if (!updatedUser) {
                return badRequest({ message: 'User not found or not updated' })
            }
            return ok(updatedUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }

            if (error.code === 'P2025') {
                // Prisma update/delete não encontrou registro
                return userNotFoundResponse() // retorna 404
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            console.error('Error validating update user params', error)
            return serverError({ message: 'Error updating user', error })
        }
    }
}

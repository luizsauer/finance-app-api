import validator from 'validator'
import EmailAlreadyInUseError from '../errors/user.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, ok, serverError } from './helpers.js'
export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badRequest({ message: 'Invalid user ID format' })
            }

            const updateUserParams = httpRequest.body

            const allowedFields = [
                'email',
                'first_name',
                'last_name',
                'password',
            ]

            const notAllowedField = Object.keys(updateUserParams).find(
                (field) => !allowedFields.includes(field),
            )

            if (notAllowedField) {
                return badRequest({
                    message: `Some fields are not allowed: ${notAllowedField}`,
                })
            }

            if (updateUserParams.password) {
                if (updateUserParams.password.length < 6) {
                    return badRequest({
                        message: 'A senha deve ter pelo menos 6 caracteres',
                    })
                }
            }

            if (updateUserParams.first_name || updateUserParams.last_name) {
                if (
                    !updateUserParams.first_name ||
                    !updateUserParams.last_name
                ) {
                    return badRequest({
                        message:
                            'O nome completo deve incluir nome e sobrenome',
                    })
                }
            }

            // validar o formato do email
            if (updateUserParams.email) {
                // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                // if (!emailRegex.test(updateUserParams.email)) {
                //     return badRequest({
                //         message: 'O email deve ser um email válido',
                //     })
                // }
                if (
                    updateUserParams.email &&
                    !validator.isEmail(updateUserParams.email)
                ) {
                    return badRequest({ message: 'Invalid email format' })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updatedUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            if (!updatedUser) {
                return badRequest({ message: 'User not found or not updated' })
            }
            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error('Error validating update user params', error)
            return serverError({ message: 'Error updating user', error })
        }
    }
}

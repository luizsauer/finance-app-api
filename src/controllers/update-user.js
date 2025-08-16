// src\controllers\update-user.js
import validator from 'validator'
import EmailAlreadyInUseError from '../errors/user.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, ok, serverError } from './helpers/http.js'
import {
    checkIfEmailIsValid,
    checkIfFullNameIsValid,
    checkIfPasswordIsValid,
    emailAlreadyInUseResponse,
    invalidIdResponse,
} from './helpers/user.js'
export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return invalidIdResponse()
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
                const passwordError = checkIfPasswordIsValid(
                    updateUserParams.password,
                )
                if (passwordError) {
                    return passwordError
                }
            }

            if (updateUserParams.first_name || updateUserParams.last_name) {
                const nameError = checkIfFullNameIsValid(
                    `${updateUserParams.first_name} ${updateUserParams.last_name}`,
                )
                if (nameError) {
                    return nameError
                }
            }

            // validar o formato do email
            if (updateUserParams.email) {
                const emailError = checkIfEmailIsValid(updateUserParams.email)
                if (emailError) {
                    return emailError
                }
                if (
                    updateUserParams.email &&
                    !validator.isEmail(updateUserParams.email)
                ) {
                    return emailAlreadyInUseResponse()
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

// src\controllers\create-user.js
import EmailAlreadyInUseError from '../../errors/user.js'

import {
    badRequest,
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    created,
    internalServerError,
    requiredFieldIsMissingResponse,
    validateRequiredFields,
} from '../helpers/index.js'
export class CreateUserController {
    constructor(createUserUseCase) {
        // Initialize any dependencies if needed
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            // validar a requisição (ex: campos obrigatórios, formato, etc.)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            // validar os dados do usuário
            const { missingField, ok: requiredFieldsWereProvided } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            // validar o formato do email
            const emailError = checkIfEmailIsValid(params.email)
            if (emailError) {
                return emailError
            }

            // validar o tamanho da senha
            const passwordError = checkIfPasswordIsValid(params.password)
            if (passwordError) {
                return passwordError
            }

            // // validar a confirmação da senha
            // const confirmPasswordError = checkIfConfirmPasswordIsValid(
            //     params.password,
            //     params.confirm_password
            // )
            // if (confirmPasswordError) {
            //     return confirmPasswordError
            // }

            // chamar o usecase para criar o usuário

            const createUser = await this.createUserUseCase.execute(params)

            // retornar a resposta apropriada (ex: sucesso, erro, etc.)
            return created(createUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error('Error creating user', error)
            return internalServerError(error)
        }
    }
}

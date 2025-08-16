// src\controllers\create-user.js
import validator from 'validator'
import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, internalServerError } from './helpers.js'

export class CreateUserController {
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
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `Missing required field: ${field}`,
                    })
                }
            }
            // validar o tamanho da senha
            if (params.password.length < 6) {
                return badRequest({
                    message: 'Password must be at least 6 characters long',
                })
            }
            // validar a complexidade da senha
            if (
                params.password &&
                !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(params.password)
            ) {
                return badRequest({
                    message:
                        'Password must contain at least one letter, one number, and be at least 6 characters long',
                })
            }

            // validar a confirmação da senha
            // if (params.password !== params.confirm_password) {
            //     return badRequest({
            //         message: 'Passwords do not match',
            //     })
            // }

            // validar o formato do email
            if (params.email && !validator.isEmail(params.email)) {
                return badRequest({ message: 'Invalid email format' })
            }
            // chamar o usecase para criar o usuário
            const createUserUseCase = new CreateUserUseCase()
            const createUser = await createUserUseCase.execute(params)

            // retornar a resposta apropriada (ex: sucesso, erro, etc.)
            return created(createUser)
        } catch (error) {
            console.error('Error creating user', error)
            return internalServerError({ message: 'Internal Server Error' })
        }
    }
}

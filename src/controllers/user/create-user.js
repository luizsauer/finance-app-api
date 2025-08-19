// src\controllers\create-user.js
import EmailAlreadyInUseError from '../../errors/user.js'

import { ZodError } from 'zod'
import { createUserSchema } from '../../schemas/user.js'
import { badRequest, created, serverError } from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        // Initialize any dependencies if needed
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            // validar a requisição (ex: campos obrigatórios, formato, etc.)

            const params = httpRequest.body // carrega o params com oq foi passado no body

            await createUserSchema.parseAsync(params) // valida a requisição como schema com o params q foi pego no body

            const createUser = await this.createUserUseCase.execute(params)

            return created(createUser)
        } catch (error) {
            // lidar com erros e retornar a resposta apropriada
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error('Error creating user', error)
            return serverError(error)
        }
    }
}

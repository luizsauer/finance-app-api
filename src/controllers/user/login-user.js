// src\controllers\user\login-user.js

import { ZodError } from 'zod'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import { loginSchema } from '../../schemas/user.js'
import {
    badRequest,
    notFound,
    ok,
    serverError,
    unauthorized,
} from '../helpers/index.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        const params = httpRequest.body
        try {
            await loginSchema.parseAsync(params)
            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )
            return ok(user)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof InvalidPasswordError) {
                return unauthorized({
                    message: error.message,
                })
            }

            if (error instanceof UserNotFoundError) {
                return notFound({
                    message: error.message,
                })
            }

            return serverError(error)
        }
    }
}

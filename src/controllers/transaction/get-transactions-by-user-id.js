// src\controllers\transaction\get-transactions-by-user-id.js
import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }
    async execute(httpRequest) {
        try {
            // verificar se o userId foi passado como parametro
            const { user_id } = httpRequest.query
            if (!user_id) {
                return requiredFieldIsMissingResponse('user_id')
            }
            // verificar se o userId é um Id valido
            const idError = checkIfIdIsValid(user_id)
            if (idError) {
                return idError
            }
            // chamar o use case
            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({
                    user_id,
                })

            return ok(transactions)

            // retornar resposta http
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}

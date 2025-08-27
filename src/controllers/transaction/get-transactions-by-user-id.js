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
            const userId = httpRequest.query.userId
            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }
            // verificar se o userId é um Id valido
            const idError = checkIfIdIsValid(userId)
            if (idError) {
                return idError
            }
            // chamar o use case
            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId)

            return ok(transactions)

            // retornar resposta http
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError(error)
        }
    }
}

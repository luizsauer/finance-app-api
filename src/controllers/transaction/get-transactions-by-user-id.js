import { userNotFoundError } from '../../errors/index.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
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
            const { user_id } = httpRequest.query.user_id
            if (!user_id) {
                return requiredFieldIsMissingResponse('user_id')
            }
            // verificar se o userId é um Id valido
            const userIdIsValid = checkIfIdIsValid(user_id)
            if (!userIdIsValid) {
                return invalidIdResponse()
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

            if (error instanceof userNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}

// src\controllers\transaction\update-transaction.js
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { updateTransactionSchema } from '../../schemas/transactions.js'
import {
    badRequest,
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idError = checkIfIdIsValid(httpRequest.params.transactionId)

            if (idError) {
                return idError
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    httpRequest.params.transactionId,
                    params,
                )

            return ok(updatedTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error)
            }
            // Adicione esta verificação
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError(error)
        }
    }
}

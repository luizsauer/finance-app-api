// src\controllers\transaction\update-transaction.js
import { ZodError } from 'zod'
import { ForbiddenError } from '../../errors/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { updateTransactionSchema } from '../../schemas/transactions.js'
import {
    badRequest,
    checkIfIdIsValid,
    forbidden,
    ok,
    serverError,
    transactionNotFoundResponse,
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
                return badRequest([{ message: error.issues[0].message }])
            }

            if (error.code === 'P2025') {
                // Prisma update/delete não encontrou registro
                return transactionNotFoundResponse() // retorna 404
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }

            // Adicione esta verificação
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.error(error)
            return serverError(error)
        }
    }
}

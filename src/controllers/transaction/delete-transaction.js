// src\controllers\transaction\delete-transaction.js
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { checkIfIdIsValid, ok, serverError } from '../helpers/index.js'
import { transactionNotFoundResponse } from '../helpers/transaction.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (idIsValid) {
                console.warn('ID:', httpRequest.params.transactionId)
                return idIsValid
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(
                    httpRequest.params.transactionId,
                )

            console.log('o:', deletedTransaction)

            return ok(deletedTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.error(error)
            return serverError(error)
        }
    }
}

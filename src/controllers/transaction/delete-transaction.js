// src\controllers\transaction\delete-transaction.js
import {
    checkIfIdIsValid,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async handle(httpRequest) {
        try {
            const { id, user_id } = httpRequest.body

            if (!id || !user_id) {
                return requiredFieldIsMissingResponse(['id', 'user_id'])
            }

            const idError = checkIfIdIsValid(id)

            if (idError) {
                return idError
            }

            await this.deleteTransactionUseCase.execute(httpRequest.body)

            return ok({ success: true })
        } catch (error) {
            return serverError(error)
        }
    }
}

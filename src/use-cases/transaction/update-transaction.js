// src\use-cases\transaction\update-transaction.js

import { ForbiddenError } from '../../errors/index.js'

export class UpdateTransactionUseCase {
    constructor(updatedtransactionRepository, getTransactionByIdRepository) {
        this.updatedtransactionRepository = updatedtransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

    async execute(transactionId, params) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (params.userId && transaction.user_id !== params.user_id) {
            throw new ForbiddenError()
        }

        return await this.updatedtransactionRepository.execute(
            transactionId,
            params,
        )
    }
}

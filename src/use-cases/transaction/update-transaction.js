// src\use-cases\transaction\update-transaction.js

export class UpdateTransactionUseCase {
    constructor(updatedtransactionRepository) {
        this.updatedtransactionRepository = updatedtransactionRepository
    }

    async execute(transactionId, params) {
        const updatedTransaction =
            await this.updatedtransactionRepository.execute(
                transactionId,
                params,
            )

        return updatedTransaction
    }
}

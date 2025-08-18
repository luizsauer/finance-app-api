// src\use-cases\transaction\delete-transaction.js

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId) {
        const transaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return transaction
    }
}

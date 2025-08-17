// src\use-cases\transaction\delete-transaction.js
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteTransactionUseCase {
    constructor(transactionRepository, getUserByIdRepository) {
        this.transactionRepository = transactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(deleteTransactionParams) {
        const userId = deleteTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction = await this.transactionRepository.findById(
            deleteTransactionParams.id,
        )

        if (!transaction) {
            throw new UserNotFoundError('Transaction not found')
        }

        await this.transactionRepository.delete(deleteTransactionParams.id)

        return { success: true }
    }
}

// src\use-cases\transaction\get-transactions-by-user-id.js
import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(user_id) {
        const user = await this.getUserByIdRepository.execute(user_id)
        if (!user) {
            throw new UserNotFoundError(user_id)
        }
        const transactions =
            await this.getTransactionsByUserIdRepository.execute(user_id)
        return transactions
    }
}

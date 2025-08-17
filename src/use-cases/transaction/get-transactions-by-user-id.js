// src\use-cases\transaction\get-transactions-by-user-id.js
import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.user_id)
        if (!user) {
            return new UserNotFoundError()
        }
        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.user_id)
        return transactions
    }
}

// src\use-cases\transaction\create-transaction.js
import { v4 as uuidv4 } from 'uuid'
import { UserNotFoundError } from '../../errors/user'

export class CreateTransactionUseCase {
    constructor(createdTransactionRepository, getUserByIdRepository) {
        this.createdTransactionRepository = createdTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        const createdTransaction =
            await this.createdTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return createdTransaction
    }
}

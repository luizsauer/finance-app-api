// src\use-cases\transaction\create-transaction.js
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(
        createdTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createdTransactionRepository = createdTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = this.idGeneratorAdapter.execute()

        const createdTransaction =
            await this.createdTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return createdTransaction
    }
}

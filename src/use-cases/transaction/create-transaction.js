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
        const user_id = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(user_id)

        if (!user) {
            throw new UserNotFoundError(user_id)
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

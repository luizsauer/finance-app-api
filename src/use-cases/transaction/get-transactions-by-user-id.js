import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserId {
    constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.user_id)
        if (!user) {
            return new userNotFoundResponse()
        }
        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.user_id)
        return transactions
    }
}

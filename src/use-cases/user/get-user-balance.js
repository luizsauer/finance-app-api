import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCase {
    constructor(getUserBalanceRepository, getUserByIdRepository) {
        this.getUserBalanceRepository = getUserBalanceRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(user_id) {
        const user = await this.getUserByIdRepository.execute(user_id)
        if (!user) {
            throw new UserNotFoundError(user_id)
        }

        const balance = await this.getUserBalanceRepository.execute(user_id)
        return balance
    }
}

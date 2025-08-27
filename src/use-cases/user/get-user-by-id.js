// src\use-cases\get-user-by-id.js

export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(user_id) {
        const user = await this.getUserByIdRepository.execute(user_id)

        return user
    }
}

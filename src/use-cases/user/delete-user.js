// src\use-cases\delete-user.js

export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(user_id) {
        const deletedUser = await this.deleteUserRepository.execute(user_id)

        return deletedUser
    }
}

// src\use-cases\get-user-by-id.js
import { PostgresGetUserByIdRepository } from '../db/postgres/repositories/postgres/index.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()

        const user = await getUserByIdRepository.execute(userId)

        return user
    }
}

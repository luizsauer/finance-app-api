// src\repositories\postgres\get-user-by-id.js
import { prisma } from '../../../../prisma/prisma.js'
export class PostgresGetUserByIdRepository {
    async execute(user_id) {
        return await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        })
    }
}

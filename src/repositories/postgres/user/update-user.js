// src\repositories\postgres\update-user.js
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/user.js'

export class PostgresUpdateUserRepository {
    async execute(user_id, updateUserParams) {
        try {
            return await prisma.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    ...updateUserParams,
                },
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(user_id)
                }
            }
            throw error
        }
    }
}

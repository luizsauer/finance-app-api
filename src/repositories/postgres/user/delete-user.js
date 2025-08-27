// src\repositories\postgres\delete-user.js
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/user.js'

export class PostgresDeleteUserRepository {
    async execute(user_id) {
        try {
            return await prisma.user.delete({
                where: {
                    id: user_id,
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

// import { UserNotFoundError } from '../../../errors/user.js'

// throw new UserNotFoundError()

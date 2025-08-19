// src\repositories\postgres\delete-user.js
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (error) {
            if (error.code === 'P2003') {
                throw new Error('Cannot delete user with existing transactions')
            }
            console.error('Prisma delete error:', error)
            throw error
        }
    }
}

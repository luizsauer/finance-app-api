// src\repositories\postgres\transaction\get-transactions-by-user-id.js

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId) {
        try {
            return await prisma.transaction.findMany({
                where: {
                    user_id: userId,
                },
            })
        } catch (error) {
            return null
        }
    }
}

// async execute(userId) {
//     const transactions = await PostgresHelper.query(
//         'SELECT * FROM transactions WHERE user_id = $1',
//         [userId],
//     )
//     return transactions
// }

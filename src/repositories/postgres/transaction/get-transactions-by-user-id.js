// src\repositories\postgres\transaction\get-transactions-by-user-id.js

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId) {
        return await prisma.transaction.findMany({
            where: { user_id: userId },
        })
    }
}

// async execute(userId) {
//     const transactions = await PostgresHelper.query(
//         'SELECT * FROM transactions WHERE user_id = $1',
//         [userId],
//     )
//     return transactions
// }

// src\repositories\postgres\transaction\get-transactions-by-user-id.js

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(user_id) {
        return await prisma.transaction.findMany({
            where: { user_id: user_id },
        })
    }
}

// async execute(user_id) {
//     const transactions = await PostgresHelper.query(
//         'SELECT * FROM transactions WHERE user_id = $1',
//         [user_id],
//     )
//     return transactions
// }

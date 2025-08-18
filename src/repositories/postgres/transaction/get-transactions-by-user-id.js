// src\repositories\postgres\transaction\get-transactions-by-user-id.js
import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId) {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        )
        return transactions
    }
}

import { PostgresHelper } from '../../../helper.js'

export class PostgresGetTransactionByUserId {
    async execute(userId) {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        )
        return transactions
    }
}

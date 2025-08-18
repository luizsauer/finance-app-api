import { PostgresHelper } from '../../../helper.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const balance = await PostgresHelper.query(
            `SELECT 
                SUM(CASE WHEN TYPE = 'EARNING' THEN amount ELSE 0 END) AS earnings,
                SUM(CASE WHEN TYPE = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
                SUM(CASE WHEN TYPE = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,

                (
                    SUM(CASE WHEN TYPE = 'EARNING' THEN amount ELSE 0 END)
                    - SUM(CASE WHEN TYPE = 'EXPENSE' THEN amount ELSE 0 END)
                    - SUM(CASE WHEN TYPE = 'INVESTMENT' THEN amount ELSE 0 END)
                ) AS total
            FROM transactions
            WHERE user_id = $1`,
            [userId],
        )

        return {
            userId,
            ...balance[0],
        }
    }
}

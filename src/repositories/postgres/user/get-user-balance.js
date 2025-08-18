// src\repositories\postgres\user\get-user-balance.js
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpenseAmount },
        } = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                user_id: userId,
                type: 'EXPENSE',
            },
        })

        const {
            _sum: { amount: totalEarningsAmount },
        } = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                user_id: userId,
                type: 'EARNING',
            },
        })

        const {
            _sum: { amount: totalInvestmentsAmount },
        } = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                user_id: userId,
                type: 'INVESTMENT',
            },
        })

        const balance =
            (totalEarningsAmount || 0) -
            (totalExpenseAmount || 0) -
            (totalInvestmentsAmount || 0)
        console.log('balance', balance)
        return {
            earnings: totalEarningsAmount,
            expenses: totalExpenseAmount,
            investments: totalInvestmentsAmount,
            balance,
        }
    }
}

// async execute(userId) {
//     const balance = await PostgresHelper.query(
//         `SELECT * FROM get_user_balance($1)`,
//         [userId],
//     )

//     return {
//         userId,
//         ...balance[0],
//     }
// }

// src\repositories\postgres\user\get-user-balance.js
import { Prisma, TransactionType } from '@prisma/client'
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
                type: TransactionType.EXPENSE,
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
                type: TransactionType.EARNING,
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
                type: TransactionType.INVESTMENT,
            },
        })
        const _totalEarningsAmount =
            totalEarningsAmount || new Prisma.Decimal(0)
        const _totalExpenseAmount = totalExpenseAmount || new Prisma.Decimal(0)
        const _totalInvestmentsAmount =
            totalInvestmentsAmount || new Prisma.Decimal(0)

        const balance = new Prisma.Decimal(
            _totalEarningsAmount -
                _totalExpenseAmount -
                _totalInvestmentsAmount,
        )

        return {
            earnings: _totalEarningsAmount,
            expenses: _totalExpenseAmount,
            investments: _totalInvestmentsAmount,
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

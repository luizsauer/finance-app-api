// src\repositories\postgres\transaction\update-transaction.js
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactionParams,
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }
            throw error
        }
    }
}

// async execute(transactionId, updateTransactionParams) {
//     const updateFields = []
//     const updateValues = []

//     Object.keys(updateTransactionParams).forEach((key) => {
//         updateFields.push(`${key} = $${updateFields.length + 1}`)
//         updateValues.push(updateTransactionParams[key])
//     })

//     updateValues.push(transactionId)

//     const updateQuery = `
//     UPDATE transactions
//     SET ${updateFields.join(', ')}
//     WHERE id = $${updateFields.length + 1}
//     RETURNING *
// `

//     const updateUser = await PostgresHelper.query(updateQuery, updateValues)

//     return updateUser[0]
// }

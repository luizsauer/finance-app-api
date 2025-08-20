// src\repositories\postgres\transaction\create-transaction.js

import { PrismaClientKnownRequestError } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
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

//     async execute(transactionId) {
//         try {
//             const deletedTransaction = await PostgresHelper.query(
//                 `DELETE FROM transactions
//                  WHERE id = $1
//                  RETURNING *`,
//                 [transactionId],
//             )
//             if (!deletedTransaction || deletedTransaction.length === 0) {
//                 return null
//             }
//             return deletedTransaction[0]
//         } catch (error) {
//             console.error(
//                 'Error in PostgresDeleteTransactionRepository:',
//                 error,
//             )
//             throw error
//         }
//     }
// }

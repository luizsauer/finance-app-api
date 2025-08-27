// src\repositories\postgres\transaction\get-transaction-by-id.js
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionByIdRepository {
    async execute(transactionId) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        })
        return transaction
    }
}

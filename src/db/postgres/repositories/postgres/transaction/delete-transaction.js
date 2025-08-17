// src\db\postgres\repositories\postgres\transaction\delete-transaction.js
import { PostgresHelper } from '../../../helper.js' // Importing PostgresHelper for database operations

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const deletedTransaction = await PostgresHelper.query(
            `DELETE FROM transactions
            WHERE id = $1
            RETURNING *`,
            [transactionId],
        )
        return deletedTransaction[0] // retorna o primeiro campo da consulta
    }
}

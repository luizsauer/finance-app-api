// src\repositories\postgres\transaction\update-transaction.js
import { PostgresHelper } from '../../../db/postgres/helper.js' // Importing PostgresHelper for database operations

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        const updateFields = []
        const updateValues = []

        Object.keys(updateTransactionParams).forEach((key) => {
            updateFields.push(`${key} = $${updateFields.length + 1}`)
            updateValues.push(updateTransactionParams[key])
        })

        updateValues.push(transactionId)

        const updateQuery = `
        UPDATE transactions
        SET ${updateFields.join(', ')}
        WHERE id = $${updateFields.length + 1}
        RETURNING *
    `

        const updateUser = await PostgresHelper.query(updateQuery, updateValues)

        return updateUser[0]
    }
}

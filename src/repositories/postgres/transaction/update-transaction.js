// src\repositories\postgres\transaction\update-transaction.js
import { prisma } from '../../../../prisma/prisma.js'

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
            return null
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

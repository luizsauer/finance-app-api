// src\repositories\postgres\update-user.js
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...updateUserParams,
            },
        })
    }

    // async execute(
    //     userId,
    //     updateUserParams = {
    //         first_name: '',
    //         last_name: '',
    //         email: '',
    //         password: '',
    //     },
    // ) {
    //     const updateFields = []
    //     const updateValues = []

    //     Object.keys(updateUserParams).forEach((key) => {
    //         updateFields.push(`${key} = $${updateFields.length + 1}`)
    //         updateValues.push(updateUserParams[key])
    //     })

    //     updateValues.push(userId)

    //     const updateQuery = `
    //         UPDATE users SET ${updateFields.join(', ')} WHERE id = $${updateFields.length + 1} RETURNING *
    //     `
    //     const updatedUser = await PostgresHelper.query(
    //         updateQuery,
    //         updateValues,
    //     )
    //     return updatedUser[0]
    // }
}

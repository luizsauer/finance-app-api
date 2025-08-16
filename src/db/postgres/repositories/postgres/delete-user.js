// src\db\postgres\repositories\postgres\delete-user.js
import { PostgresHelper } from '../../helper.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        const deleteUser = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser
    }
}

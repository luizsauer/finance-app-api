// src\db\postgres\repositories\postgres\get-user-by-id.js
import { PostgresHelper } from '../../../helper.js'
export class PostgresGetUserByIdRepository {
    async execute(userId) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE id = $1',
            [userId],
        )
        return user[0] // retorna o primeiro campo da consulta
    }
}

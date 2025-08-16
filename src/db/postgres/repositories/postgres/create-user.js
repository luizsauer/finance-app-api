// src\db\postgres\repositories\postgres\create-user.js
import { PostgresHelper } from '../../helper.js' // Importing PostgresHelper for database operations
export class PostgresCreateUserRepository {
    async execute(userData) {
        const { id, first_name, last_name, email, password } = userData
        await PostgresHelper.query(
            'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, first_name, last_name, email, password],
        )
        const createdUser = await PostgresHelper.query(
            'SELECT * FROM users WHERE id = $1',
            [id],
        )
        return createdUser
    }
}
export default PostgresCreateUserRepository // Exporting the class for use in other modules

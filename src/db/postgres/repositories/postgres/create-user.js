import { PostgresHelper } from '../helper.js' // Importing PostgresHelper for database operations
export class PostgresCreateUserRepository {
    async execute(userData) {
        const { ID, first_name, last_name, email, password } = userData
        const result = await PostgresHelper.query(
            'INSERT INTO users (ID, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ID, first_name, last_name, email, password],
        )
        return result
    }
}
export default PostgresCreateUserRepository // Exporting the class for use in other modules

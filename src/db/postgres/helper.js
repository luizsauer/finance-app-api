import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})

export const PostgresHelper = {
    query: async (query, params) => {
        // This function executes a SQL query
        const client = await pool.connect() // Get a client from the pool
        try {
            const result = await client.query(query, params) // Execute the query
            await client.release() // Release the client back to the pool
            return result.rows // Return the rows from the result
        } catch (error) {
            console.error('Error executing query', error)
            throw error // Rethrow the error after logging it
        }
    },
}

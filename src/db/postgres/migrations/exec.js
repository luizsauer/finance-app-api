import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url' // For resolving __dirname in ES modules
import { pool } from '../helper.js'

const __filename = fileURLToPath(import.meta.url) // Get the current file name
const __dirname = path.dirname(__filename) // Get the current directory name

const executeMigration = async () => {
    const client = await pool.connect() // Get a database client from the pool
    try {
        const files = fs
            .readdirSync(__dirname)
            .filter((file) => file.endsWith('.sql')) // read all SQL files

        for (const file of files) {
            const filePath = path.join(__dirname, file) // Path to the SQL script file
            const script = fs.readFileSync(filePath, 'utf8') // Read the SQL script file

            await client.query(script)

            console.log(`Migration ${file} executed successfully`)
        }

        console.log('All migrations executed successfully')
    } catch (error) {
        console.error('Error executing migration:', error)
    } finally {
        await client.release()
    }
}

executeMigration()

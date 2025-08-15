import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js

const app = express()

app.get('/', async (req, res) => {
    // Root endpoint - returns a greeting - /

    try {
        const result = await PostgresHelper.query('SELECT * FROM users')
        res.send(JSON.stringify(result)) // Return the rows as JSON
    } catch (error) {
        console.error('Error executing query', error)
        res.status(500).send('Internal Server Error')
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

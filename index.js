import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js

const app = express() // Initialize Express app

app.use(express.json()) // Middleware to parse JSON bodies

// Root endpoint - returns a greeting
app.get('/api/users', async (req, res) => {
    try {
        const result = await PostgresHelper.query('SELECT * FROM users') // Query the users table
        res.send(JSON.stringify(result)) // Return the rows as JSON
    } catch (error) {
        console.error('Error executing query', error)
        res.status(500).send('Internal Server Error')
    }
})

app.post('/api/users', async (req, res) => {
    // const { first_name, last_name, email, password } = req.body
    // try {
    //     const result = await PostgresHelper.query(
    //         'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
    //         [first_name, last_name, email, password],
    //     )
    //     res.status(201).send(JSON.stringify(result))
    // } catch (error) {
    //     console.error('Error executing query', error)
    //     res.status(500).send('Internal Server Error')
    // }
    console.log(req.body)
    res.status(201).send('User created successfully') // Placeholder response
})

// Start the Express server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

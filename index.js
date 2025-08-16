// index.js
import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import express from 'express'

import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js' // Importing the CreateUserController

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

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
    const getUserByIdController = new GetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

// Create user
app.post('/api/users', async (req, res) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update user
app.patch('/api/users/:userId', async (req, res) => {
    const updateUserController = new UpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).send(body)
})

// Start the Express server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

// index.js
import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import express from 'express'

import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js
import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
} from './src/factories/controllers/transactions.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeUpdateUserController,
    makeUserByIdController,
} from './src/factories/controllers/user.js' // Importing the factory function to create the GetUserByIdController

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
    const getUserByIdController = makeUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

// Create user
app.post('/api/users', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update user
app.patch('/api/users/:userId', async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).send(body)
})

// Delete User
app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).send(body)
})

// Get Transactions
app.get('/api/transactions', async (req, res) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(req)

    res.status(statusCode).send(body)
})

// Create Transaction
app.post('/api/transactions', async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute(req)

    res.status(statusCode).send(body)
})

// Start the Express server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

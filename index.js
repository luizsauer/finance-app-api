// index.js
import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import express from 'express'

import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js' // Importing the CreateUserController
import { PostgresHelper } from './src/db/postgres/helper.js' // Importing the pool from helper.js
import { PostgresDeleteUserRepository } from './src/db/postgres/repositories/postgres/delete-user.js' // Importing the PostgresDeleteUserRepository
import { PostgresGetUserByIdRepository } from './src/db/postgres/repositories/postgres/get-user-by-id.js' // Importing the PostgresGetUserByIdRepository
import {
    PostgresCreateUserRepository,
    PostgresUpdateUserRepository,
} from './src/db/postgres/repositories/postgres/index.js' // Importing the PostgresCreateUserRepository
import { CreateUserUseCase } from './src/use-cases/create-user.js' // Import
import { DeleteUserUseCase } from './src/use-cases/delete-user.js' // Import
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js' // Importing the GetUserByIdUseCase
import { UpdateUserUseCase } from './src/use-cases/update-user.js' // Import

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
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

// Create user
app.post('/api/users', async (req, res) => {
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(createUserRepository)
    const createUserController = new CreateUserController(createUserUseCase)

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update user
app.patch('/api/users/:userId', async (req, res) => {
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(updateUserRepository)
    const updateUserController = new UpdateUserController(updateUserUseCase)

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).send(body)
})

// Delete User
app.delete('/api/users/:userId', async (req, res) => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserUseCase)

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).send(body)
})

// Start the Express server on the specified port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

// src\routes\users.js
import { Router } from 'express'
import { makeGetUserBalanceController } from '../factories/controllers/transactions.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeLoginUserController,
    makeUpdateUserController,
    makeUserByIdController,
} from '../factories/controllers/user.js' // Importing the factory function to create the GetUserByIdController

export const usersRouter = Router()

// Get user by ID
usersRouter.get('/:userId', async (req, res) => {
    const getUserByIdController = makeUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).send(body)
})

// Get user balance
usersRouter.get('/:userId/balance', async (req, res) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute(req)

    res.status(statusCode).send(body)
})

// Create user
usersRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update user
usersRouter.patch('/:userId', async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).send(body)
})

// Delete User
usersRouter.delete('/:userId', async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).send(body)
})

usersRouter.post('/login', async (req, res) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(req)

    res.status(statusCode).send(body)
})

// src\routes\users.js
import { Router } from 'express'
import { makeGetUserBalanceController } from '../factories/controllers/transactions.js'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeUpdateUserController,
    makeUserByIdController,
} from '../factories/controllers/user.js' // Importing the factory function to create the GetUserByIdController
import { auth } from '../middlewares/auth.js'

export const usersRouter = Router()

// Get user by ID
usersRouter.get('/', auth, async (req, res) => {
    const getUserByIdController = makeUserByIdController()

    // console.log('User Authenticated:', req.user.id)
    const { statusCode, body } = await getUserByIdController.execute({
        ...req,
        params: { user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

// Get user balance
usersRouter.get('/balance', auth, async (req, res) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute({
        ...req,
        params: { user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

// Create user
usersRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Update user
usersRouter.patch('/', auth, async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute({
        ...req,
        params: { user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

// Delete User
usersRouter.delete('/', auth, async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        params: { user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

usersRouter.post('/login', async (req, res) => {
    console.log('Body recebido:', req.body)
    if (!req.body) return res.status(400).send({ message: 'Body vazio' })
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(req)

    res.status(statusCode).send(body)
})

usersRouter.post('/refresh-token', async (req, res) => {
    // console.log('Body recebido:', req.body)
    // if (!req.body) return res.status(400).send({ message: 'Body vazio' })
    const refreshTokenController = makeRefreshTokenController()

    const { statusCode, body } = await refreshTokenController.execute(req)

    res.status(statusCode).send(body)
})

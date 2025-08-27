// src\routes\transactions.js
import 'dotenv/config.js' // Ensure dotenv is configured before importing other modules
import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '../factories/controllers/transactions.js'
import { auth } from '../middlewares/auth.js'

export const transactionsRouter = Router()

// Get Transactions
transactionsRouter.get('/', auth, async (req, res) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            ...req,
            query: { ...req.query, user_id: req.user_id },
        })

    res.status(statusCode).send(body)
})

// Create Transaction
transactionsRouter.post('/', auth, async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute({
        ...req,
        body: { ...req.body, user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

// Update Transaction
transactionsRouter.patch('/:transactionId', auth, async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } = await updateTransactionController.execute({
        ...req,
        body: { ...req.body, user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

// Delete Transaction
transactionsRouter.delete('/:transactionId', auth, async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } = await deleteTransactionController.execute({
        ...req,
        params: { ...req.params, user_id: req.user_id },
    })

    res.status(statusCode).send(body)
})

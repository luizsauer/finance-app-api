import { TransactionType } from '@prisma/client'
import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when transaction is created', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                id: undefined,
                user_id: createdUser.id,
            })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.type).toBe(transaction.type)
        expect(response.body.amount).toBe(String(transaction.amount))
    })

    it('GET /api/transactions/:id should return 200 when transaction is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                id: undefined,
                user_id: createdUser.id,
            })

        const response = await request(app).get(
            `/api/transactions?user_id=${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body).toEqual([createdTransaction])
    })

    it('PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                id: undefined,
                user_id: createdUser.id,
            })

        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send({ amount: 200, type: TransactionType.EXPENSE })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('200')
        expect(response.body.type).toBe(TransactionType.EXPENSE)
    })

    it('DELETE /api/transactions/:transactionId should return 200 when deleting a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                id: undefined,
                user_id: createdUser.id,
            })

        const response = await request(app).delete(
            `/api/transactions/${createdTransaction.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transaction/:transactionId should return 404 when updating a non-existing transaction', async () => {
        const response = await request(app)
            .patch(`/api/transactions/${transaction.id}`)
            .send({ amount: 200, type: TransactionType.EXPENSE })

        expect(response.status).toBe(404)
    })

    it('DELETE /api/transaction/:transactionId should return 404 when deleting a non-existing transaction', async () => {
        const response = await request(app).delete(
            `/api/transactions/${transaction.id}`,
        )

        expect(response.status).toBe(404)
    })

    it('GET /api/transaction?user_id should return 404 when fetching transaction from a non-existing user', async () => {
        const response = await request(app).get(
            `/api/transactions?user_id=${transaction.user_id}`,
        )

        expect(response.status).toBe(404)
    })
})

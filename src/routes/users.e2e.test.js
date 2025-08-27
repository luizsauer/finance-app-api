// src\routes\users.e2e.test.js
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/index.js'

describe('User Routes E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.status).toBe(201)
    })

    it('GET /api/users should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .get(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('PATCH /api/users should return 200 when user is updated', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 8,
            }),
        }

        const response = await request(app)
            .patch(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(updateUserParams)

        expect(response.status).toBe(200)
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
            id: createdUser.id,
            first_name: updateUserParams.first_name,
            last_name: updateUserParams.last_name,
            email: updateUserParams.email,
        })
        expect(response.body.password).not.toBe(updateUserParams.password) // deve estar hasheada
    })

    it('DELETE /api/users should return 200 when user is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .delete(`/api/users`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('GET /api/users/:user_id/balance should return 200 when user balance is fetched', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        // Cria transação de earning
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: TransactionType.EARNING,
                amount: 10000,
            })

        // Cria transação de expense
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: TransactionType.EXPENSE,
                amount: 2000,
            })

        // Cria transação de investment
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: TransactionType.INVESTMENT,
                amount: 2000,
            })

        // Consulta saldo
        const response = await request(app)
            .get(`/api/users/balance`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
        })
    })

    // it('GET /api/users/:user_id should return 404 when user is not found', async () => {
    //     const response = await request(app).get(
    //         `/api/users/${faker.string.uuid()}`,
    //     )

    //     expect(response.status).toBe(404)
    // })

    // it('GET /api/users/:user_id/balance should return 404 when user is not found', async () => {
    //     const response = await request(app).get(
    //         `/api/users/${faker.string.uuid()}/balance`,
    //     )

    //     expect(response.status).toBe(404)
    // })

    // it('GET /api/users/:user_id should return 404 when user is not found', async () => {
    //     const response = await request(app).get(
    //         `/api/users/${faker.string.uuid()}`,
    //     )

    //     expect(response.status).toBe(404)
    // })

    // it('GET /api/users/:user_id/balance should return 404 when user is not found', async () => {
    //     const response = await request(app).get(
    //         `/api/users/${faker.string.uuid()}/balance`,
    //     )

    //     expect(response.status).toBe(404)
    // })

    // it('PATCH /api/users/:user_id should return 404 when user is not found', async () => {
    //     const response = await request(app)
    //         .patch(`/api/users/${faker.string.uuid()}`)
    //         .send({
    //             first_name: faker.person.firstName(),
    //             last_name: faker.person.lastName(),
    //             email: faker.internet.email(),
    //             password: faker.internet.password({
    //                 length: 8,
    //             }),
    //         })

    //     expect(response.status).toBe(404)
    // })

    it('POST /api/users should return 400 when the provided email is already in use', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: createdUser.email,
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/users/login should return 200 and tokens when user credentials are valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.status).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })
})

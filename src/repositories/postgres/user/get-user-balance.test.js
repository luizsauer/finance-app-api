import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakerUser } from '../../../tests'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date: faker.date.past(),
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date: faker.date.past(),
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    date: faker.date.past(),
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    date: faker.date.past(),
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 2000,
                    date: faker.date.past(),
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 2000,
                    date: faker.date.past(),
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('4000')
        expect(result.balance.toString()).toBe('4000')
    })

    // it('should return user balance', async () => {
    //     const user = await prisma.user.create({ data: fakerUser })

    //     await prisma.transaction.create({
    //         data: {
    //             userId: user.id,
    //             amount: 5000,
    //             type: 'EARNING',
    //         },
    //     })

    //     const sut = new PostgresGetUserBalanceRepository()

    //     const balance = await sut.getUserBalance(user.id)

    //     expect(balance).toEqual(5000)
    // })

    // it('should call Prisma with correct params', async () => {
    //     const user = await prisma.user.create({ data: fakerUser })

    //     await prisma.transaction.create({
    //         data: {
    //             userId: user.id,
    //             amount: 5000,
    //             type: 'EARNING',
    //         },
    //     })

    //     const sut = new PostgresGetUserBalanceRepository()

    //     const balance = await sut.getUserBalance(user.id)

    //     expect(balance).toEqual(5000)
    // })

    // it('should throw if user does not exist', async () => {
    //     const sut = new PostgresGetUserBalanceRepository()

    //     const balance = await sut.getUserBalance('non-existing-user-id')

    //     expect(balance).toBeNull()
    // })
})

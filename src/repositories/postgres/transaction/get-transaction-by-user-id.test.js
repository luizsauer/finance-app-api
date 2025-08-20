import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests'
import { PostgresGetTransactionByUserIdRepository } from './get-transactions-by-user-id.js'

describe('PostgresGetTransactionByUserIdRepository', () => {
    it('should return a transaction if it exists', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        const sut = new PostgresGetTransactionByUserIdRepository()

        const result = await sut.execute(user.id)

        expect(result.length).toBe(1)
        expect(result[0]).toBeDefined()
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionByUserIdRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: { user_id: user.id },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetTransactionByUserIdRepository()
        jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user.id)

        // expect(promise).toBeNull()
        await expect(promise).rejects.toThrow()
    })

    // it('should return null if user has no transactions', async () => {
    //     const sut = new PostgresGetTransactionByUserIdRepository()

    //     const result = await sut.execute(user.id)

    //     expect(result).toBeNull()
    // })

    // it('should return null if transaction does not exist', async () => {
    //     const sut = new PostgresGetTransactionByUserIdRepository()

    //     const result = await sut.execute(transaction.id)

    //     expect(result).toBeNull()
    // })
})

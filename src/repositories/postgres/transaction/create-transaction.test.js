import { jest } from '@jest/globals'
import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests'
import { PostgresCreateTransactionRepository } from './create-transaction.js'
describe('PostgresCreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        await prisma.user.create({ data: user })

        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({ ...transaction, user_id: user.id })

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({ ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
            new Error('Prisma error'),
        )

        const promise = sut.execute(transaction)

        await expect(promise).rejects.toThrow('Prisma error')
    })
})

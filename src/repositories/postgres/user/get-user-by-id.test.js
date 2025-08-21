import { jest } from '@jest/globals'
import { prisma } from '../../../../prisma/prisma'
import { user as fakerUser } from '../../../tests'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'
describe('PostgresGetUserByIdRepository', () => {
    it('should return user if id exists', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    // it('should return null if id does not exist', async () => {
    //     const sut = new PostgresGetUserByIdRepository()

    //     const result = await sut.execute(faker.datatype.uuid())

    //     expect(result).toBeNull()
    // })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByIdRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakerUser.id)

        expect(prismaSpy).toHaveBeenCalledTimes(1)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: fakerUser.id },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresGetUserByIdRepository()

        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
            new Error('Prisma error'),
        )

        const promise = sut.execute(fakerUser.id)

        await expect(promise).rejects.toThrow('Prisma error')
    })
})

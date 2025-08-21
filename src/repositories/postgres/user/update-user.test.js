import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma'
import { UserNotFoundError } from '../../../errors/user.js'
import { user as fakerUser } from '../../../tests'
import { PostgresUpdateUserRepository } from './update-user.js'
describe('PostgresUpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it('should return user if id exists', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    it('should return user on db', async () => {
        const user = await prisma.user.create({ data: fakerUser })

        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, updateUserParams)

        expect(result).toEqual(updateUserParams)
    })

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakerUser })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(user.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledTimes(1)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: { id: user.id },
            data: updateUserParams,
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()

        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new Error('Prisma error'),
        )

        const promise = sut.execute(fakerUser.id, updateUserParams)

        await expect(promise).rejects.toThrow('Prisma error')
    })

    it('should throw UserNotFoundError if Prisma does not find record to update', async () => {
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )
        const promise = sut.execute(updateUserParams.id)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(updateUserParams.id),
        )
    })

    // it('should return null if id does not exist', async () => {
    //     const sut = new PostgresUpdateUserRepository()

    //     const result = await sut.execute(faker.datatype.uuid())

    //     expect(result).toBeNull()
    // })
})

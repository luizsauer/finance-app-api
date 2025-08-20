import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma'
import { UserNotFoundError } from '../../../errors/user.js'
import { user } from '../../../tests'
import { PostgresDeleteUserRepository } from './delete-user.js'

describe('PostgresDeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        // Test implementation
        // Arrange
        await prisma.user.create({ data: user }) // Create user before deleting
        const sut = new PostgresDeleteUserRepository()

        // Act
        const result = await sut.execute(user.id) // Call the delete method

        // Assert
        expect(result).toStrictEqual(user) // Expect the deleted user to be returned
    })

    it('should call Prisma with correct params', async () => {
        // Test implementation
        // Arrange
        await prisma.user.create({ data: user }) // Create user before deleting
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest
            .spyOn(prisma.user, 'delete')
            .mockResolvedValue(user) // Mock Prisma delete method

        // Act
        await sut.execute(user.id) // Call the delete method

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresDeleteUserRepository()

        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new Error('Prisma error'),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow('Prisma error')
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        const sut = new PostgresDeleteUserRepository()

        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new Error('Generic Prisma error'),
        )

        const promise = sut.execute(user.id)

        await expect(promise).rejects.toThrow('Generic Prisma error')
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )
        const promise = sut.execute(user.id)
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

    // it('should throw if user does not exist', async () => {
    //     // Test implementation
    //     // Arrange
    //     const sut = new PostgresDeleteUserRepository()

    //     // Act & Assert
    //     await expect(sut.execute('non-existing-id')).rejects.toThrow(
    //         'User not found',
    //     )
    // })
})

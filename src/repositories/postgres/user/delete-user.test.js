import { prisma } from '../../../../prisma/prisma'
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
        const sut = new PostgresDeleteUserRepository()
        const prismaSpy = jest
            .spyOn(prisma.user, 'delete')
            .mockResolvedValue(user) // Mock Prisma delete method

        // Act
        await sut.execute(user.id) // Call the delete method

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } })
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

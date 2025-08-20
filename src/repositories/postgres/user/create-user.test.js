import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests'
import { PostgresCreateUserRepository } from './create-user'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        // Test implementation
        // Arrange
        const sut = new PostgresCreateUserRepository()

        // Act
        const result = await sut.execute(user)

        // Assert
        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call Prisma with correct params', async () => {
        // Test implementation
        // Arrange
        const sut = new PostgresCreateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'create')

        // Act
        await sut.execute(user)

        // Assert
        expect(prismaSpy).toHaveBeenCalledWith({ data: user })
    })

    // it('should throw if user already exists', async () => {
    //     // Test implementation
    //     // Arrange
    //     const sut = new PostgresCreateUserRepository()
    //     await sut.execute(user)

    //     // Act & Assert
    //     await expect(sut.execute(user)).rejects.toThrow('User already exists')
    // })
})

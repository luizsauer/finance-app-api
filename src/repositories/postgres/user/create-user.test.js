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
        expect(result).toEqual(user)
    })

    // it('should throw an error if user data is invalid', async () => {
    //     // Test implementation
    //     // Arrange
    //     const { createUserRepository } = makeSut()

    //     // Act
    //     const promise = createUserRepository.create({ ...user, email: 'invalid-email' })

    //     // Assert
    //     await expect(promise).rejects.toThrow()
    // })
})

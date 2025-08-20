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
        expect(result).toBeTruthy()
    })
})

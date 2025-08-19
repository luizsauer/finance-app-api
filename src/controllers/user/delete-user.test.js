import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'
import { DeleteUserController } from './delete-user.js'

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8, // Ensure password is at least 8 characters
                }),
            }
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)
        return { sut, deleteUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when deleting a user successfully', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(200)
        // expect(result.body).toBe(httpRequest.params.id)
    })

    it('should return 400 if user is not found', async () => {
        // Test implementation
        // Arrange
        const { sut, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(httpRequest.params.id),
        )

        // Act
        const result = await sut.execute({ params: { userId: 'invalid-id' } })

        // Assert
        expect(result.statusCode).toBe(400)
        // expect(result.body).toEqual({
        //     error: `User with ID ${httpRequest.params.id} not found.`,
        // })
    })

    it('should return 404 if user is not found', async () => {
        // Test implementation
        // Arrange
        const { sut, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(null)

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(404)
        // expect(result.body).toEqual({
        //     error: `User with ID ${httpRequest.params.id} not found.`,
        // })
    })

    it('should return 500 if DeleteUserUseCase throws', async () => {
        // Test implementation
        // Arrange
        const { sut, deleteUserUseCase } = makeSut()

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(
            new Error('Internal Server Error'),
        )

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(500)
        // expect(result.body).toEqual({
        //     error: 'Internal Server Error',
        // })
    })
})

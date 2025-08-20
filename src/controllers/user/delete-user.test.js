import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/index.js'
import { DeleteUserController } from './delete-user.js'

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return user
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

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(httpRequest.params.userId),
        )

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

    it('should call DeleteUserUseCase with correct params', async () => {
        const { sut, deleteUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(deleteUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})

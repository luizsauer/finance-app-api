import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { user } from '../../tests'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    const baseHttpRequest = {
        params: {
            user_id: faker.string.uuid(),
        },
    }

    it('should return 200 if a user is found', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(baseHttpRequest)

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid id is provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { user_id: 'invalid-id' },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if no user is found', async () => {
        // Test implementation
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        // Act
        const result = await sut.execute(baseHttpRequest)

        // Assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIDUseCase throws an error', async () => {
        // Test implementation
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(
            new Error('Internal Server Error'),
        )

        // Act
        const result = await sut.execute(baseHttpRequest)

        // Assert
        expect(result.statusCode).toBe(500)
        // expect(result.body).toEqual({
        //     error: 'Internal Server Error',
        // })
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(baseHttpRequest)

        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.params.user_id)
    })
})

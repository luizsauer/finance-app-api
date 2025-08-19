import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { GetUserBalanceController } from './get-user-balance'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int()
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)
        return { sut, getUserBalanceUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when getting user balance successfully', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(200)
        // expect(result.body).toEqual({
        //     userId: httpRequest.params.userId,
        //     balance: expect.any(Number),
        // })
    })

    it('should return 400 if user is invalid', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({ params: { userId: 'invalid-id' } })

        // Assert
        expect(result.statusCode).toBe(400)
        // expect(result.body).toEqual({
        //     error: `User with ID ${httpRequest.params.userId} invalid.`,
        // })
    })

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        // Test implementation
        // Arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            // new Error('Internal Server Error'),
            () => Promise.reject(new Error('Internal Server Error')),
        )

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(500)
        // expect(result.body).toEqual({
        //     error: 'Internal Server Error',
        // })
    })

    it('should return 404 if user is invalid', async () => {
        // Test implementation
        // Arrange
        const { sut, getUserBalanceUseCase } = makeSut()

        // Act

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(httpRequest.params.userId),
        )

        // Act
        const result = await sut.execute(httpRequest)
        // Assert
        expect(result.statusCode).toBe(404)
        // expect(result.body).toEqual({
        //     error: `User with ID ${httpRequest.params.userId} invalid.`,
        // })
    })
})

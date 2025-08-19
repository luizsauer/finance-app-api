import { faker } from '@faker-js/faker'

import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8,
                }),
            }
        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 if a user is found', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid id is provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: 'invalid-id' },
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
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

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
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(500)
        // expect(result.body).toEqual({
        //     error: 'Internal Server Error',
        // })
    })
})

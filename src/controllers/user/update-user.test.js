import { faker } from '@faker-js/faker'
import EmailAlreadyInUseError from '../../errors/user'
import { UpdateUserController } from './update-user'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user
        }
    }
    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)

        return { sut, updateUserUseCase }
    }
    const httpRequest = {
        params: { userId: faker.string.uuid() },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 8,
            }),
        },
    }

    it('should return 200 if a user is updated successfully', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

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

    it('should return 400 when an invalid email is provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
            body: {
                email: 'invalid-email',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid password is provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
            body: {
                password: faker.internet.password({
                    length: 5,
                }),
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid id is provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: 'invalid_id' },
            body: httpRequest.body,
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed field is provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unallowed_field: faker.lorem.sentence(),
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        // Test implementation
        // Arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
            new Error('Internal Server Error'),
        )

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: httpRequest.body,
        })

        // Assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        // Test implementation
        // Arrange
        const { sut, updateUserUseCase } = makeSut()
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        const { sut, updateUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })

    // it('should return 404 if no user is found', async () => {
    //     // Test implementation
    //     // Arrange
    //     const { sut, updateUserUseCase } = makeSut()
    //     jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(null)

    //     // Act
    //     const result = await sut.execute({
    //         params: { userId: faker.string.uuid() },
    //     })

    //     // Assert
    //     expect(result.statusCode).toBe(404)
    // })

    // it('should return 500 if UpdateUserUseCase throws an error', async () => {
    //     // Test implementation
    //     // Arrange
    //     const { sut, updateUserUseCase } = makeSut()
    //     jest.spyOn(updateUserUseCase, 'execute').mockRejectedValue(
    //         new Error('Internal Server Error'),
    //     )

    //     // Act
    //     const result = await sut.execute({
    //         params: { userId: faker.string.uuid() },
    //     })

    //     // Assert
    //     expect(result.statusCode).toBe(500)
    //     // expect(result.body).toEqual({
    //     //     error: 'Internal Server Error',
    //     // })
    // })
})

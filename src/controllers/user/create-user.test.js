// src\controllers\user\create-user.test.js

import { faker } from '@faker-js/faker'
import EmailAlreadyInUseError from '../../errors/user.js'
import { user } from '../../tests/index.js'
import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)
        return { sut, createUserUseCase }
    }

    const httpRequest = {
        body: {
            ...user,
            id: undefined,
        },
    }

    it('should return 201 when creating a user successfully', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(user)
    })

    it('should return 400 if first_name is not provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: { ...httpRequest.body, email: undefined },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is invalid', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid-email',
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        // Test implementation
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        const { sut, createUserUseCase } = makeSut()

        // altera o comportamento da função 'execute' para lançar um erro
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error('Use case error'),
        )

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(500) // verifica se o statusCode é 500 - erro interno do servidor
    })

    it('should call CreateUserUseCase with correct values', async () => {
        // Test implementation
        // Arrange
        const { sut, createUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute') // espiona a função execute,

        // Act
        await sut.execute(httpRequest)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body) // verifica se foi chamado com os parâmetros corretos
        expect(executeSpy).toHaveBeenCalledTimes(1) // verifica se foi chamado apenas uma vez
    })

    it('should return 500 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        // Test implementation
        // Arrange
        const { sut, createUserUseCase } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 8, // Ensure password is at least 8 characters
                }),
            },
        }

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )

        // Act
        const result = await sut.execute(httpRequest)

        // Assert
        expect(result.statusCode).toBe(400)
    })
})

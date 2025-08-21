import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import EmailAlreadyInUseError from '../../errors/user.js'
import { user } from '../../tests'
import { UpdateUserUseCase } from './update-user.js'
describe('UpdateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const updateUserRepository = new UpdateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const sut = new UpdateUserUseCase(
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            updateUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
        }
    }

    it('should update user successfully (without email and password)', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )

        const email = faker.internet.email()

        const result = await sut.execute(faker.string.uuid(), {
            email,
        })

        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )

        const password = faker.internet.password()

        const result = await sut.execute(faker.string.uuid(), {
            password,
        })

        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use', () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const email = faker.internet.email()

        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            user,
        )

        const promise = sut.execute(faker.string.uuid(), {
            email,
        })

        expect(promise).rejects.toThrow(new EmailAlreadyInUseError(email))
    })

    it('should call updateUserRepository with correct params', async () => {
        const { sut, updateUserRepository } = makeSut()
        const updateUserRepositorySpy = jest.spyOn(
            updateUserRepository,
            'execute',
        )
        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        }

        await sut.execute(user.id, updateUserParams)

        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'hashed_password',
        })
    })

    it('should throw if getUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid(), user)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if updateUserRepository throws', async () => {
        const { sut, updateUserRepository } = makeSut()

        jest.spyOn(updateUserRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid(), user)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid(), user)

        await expect(promise).rejects.toThrow()
    })

    it('should return null if user is not found', async () => {
        const { sut, updateUserRepository } = makeSut()

        jest.spyOn(updateUserRepository, 'execute').mockResolvedValueOnce(null)

        const result = await sut.execute(faker.string.uuid(), user)

        expect(result).toBeNull()
    })
})

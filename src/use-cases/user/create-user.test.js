import { jest } from '@jest/globals'
import EmailAlreadyInUseError from '../../errors/user'
import { user as fixtureUser } from '../../tests'
import { CreateUserUseCase } from './create-user'
describe('CreateUserUseCase', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null // Simulate no user found
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const createUserRepository = new CreateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasher = new PasswordHasherAdapterStub()
        const idGenerator = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            createUserRepository,
            getUserByEmailRepository,
            passwordHasher,
            idGenerator,
        )

        return {
            sut,
            createUserRepository,
            getUserByEmailRepository,
            passwordHasher,
            idGenerator,
        }
    }

    it('should create a user successfully', async () => {
        const { sut } = makeSut()

        const createdUser = await sut.execute(user)

        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            user,
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        const { sut, idGenerator, createUserRepository } = makeSut()
        const generateSpy = jest.spyOn(idGenerator, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(generateSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: user.id,
        })
    })

    it('should call PasswordHasherAdapter to hash the password', async () => {
        const { sut, createUserRepository, passwordHasher } = makeSut()
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )
        const hashSpy = jest.spyOn(passwordHasher, 'execute')

        await sut.execute(user)

        expect(hashSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: user.id,
        })
    })

    it('should throw an error if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error('Database error'),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow('Database error')
    })

    it('should throw an error if IdGeneratorAdapter throws', async () => {
        const { sut, idGenerator } = makeSut()
        jest.spyOn(idGenerator, 'execute').mockImplementationOnce(() => {
            throw new Error('Database error')
        })

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow('Database error')
    })

    it('should throw an error if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasher } = makeSut()
        jest.spyOn(passwordHasher, 'execute').mockImplementationOnce(() => {
            throw new Error('Database error')
        })

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow('Database error')
    })

    it('should throw an error if CreateUserRepository throws', async () => {
        const { sut, createUserRepository } = makeSut()
        jest.spyOn(createUserRepository, 'execute').mockImplementationOnce(
            () => {
                throw new Error('Database error')
            },
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow('Database error')
    })
})

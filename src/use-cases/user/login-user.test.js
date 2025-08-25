import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests/fixtures/user.js'
import { LoginUserUseCase } from './login-user'

describe('LoginUserUseCase', () => {
    class getUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }
    class passwordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class tokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new getUserByEmailRepositoryStub()
        const passwordComparator = new passwordComparatorAdapterStub()
        const tokensGenerator = new tokensGeneratorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparator,
            tokensGenerator,
        )
        return {
            sut,
            getUserByEmailRepository,
            passwordComparator,
            tokensGenerator,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValue(null)

        const promise = sut.execute('any_email', 'any_password')
        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparator } = makeSut()
        import.meta.jest
            .spyOn(passwordComparator, 'execute')
            .mockReturnValue(false)

        const promise = sut.execute('any_email', 'any_password')
        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user data and tokens on success', async () => {
        const { sut } = makeSut()

        const result = await sut.execute('any_email', 'any_password')
        expect(result.tokens.accessToken).toBeDefined()
        expect(result.tokens.refreshToken).toBeDefined()
    })
})

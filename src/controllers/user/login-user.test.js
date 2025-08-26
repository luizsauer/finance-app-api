import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/index.js'
import { LoginUserController } from './login-user'

describe('LoginUserController', () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'access_token',
                    refreshToken: 'refresh_token',
                },
            }
        }
    }
    const httpRequest = {
        body: {
            email: user.email,
            password: user.password,
        },
    }

    const makeSut = () => {
        const loginUserUseCaseStub = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCaseStub)
        return { sut, loginUserUseCaseStub }
    }
    // Your tests go here

    it('should return 200 with user and tokens', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBe('access_token')
        expect(response.body.tokens.refreshToken).toBe('refresh_token')
    })

    it('should return 401 if params are invalid', async () => {
        const { sut, loginUserUseCaseStub } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCaseStub, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())
        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
    })

    it('should return 404 if params are invalid', async () => {
        const { sut, loginUserUseCaseStub } = makeSut()

        import.meta.jest
            .spyOn(loginUserUseCaseStub, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())
        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(404)
    })
})

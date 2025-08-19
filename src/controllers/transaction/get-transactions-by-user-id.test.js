import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'

describe('GetTransactionsByUserIdController', () => {
    class GetUserIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    date: faker.date.anytime().toISOString(),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ]
        }
    }

    const makeSut = () => {
        const getUserIdUseCase = new GetUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(getUserIdUseCase)
        return { sut, getUserIdUseCase }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: {
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when missing user_id params', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: {
                user_id: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when user_id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: {
                user_id: 'invalid_uuid',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        const { sut, getUserIdUseCase } = makeSut()

        jest.spyOn(getUserIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const response = await sut.execute({
            query: {
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByIdUseCase throws generic error', async () => {
        const { sut, getUserIdUseCase } = makeSut()

        jest.spyOn(getUserIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const response = await sut.execute({
            query: {
                user_id: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(500)
    })

    it('should call GetUserIdUseCase with correct params', async () => {
        const { sut, getUserIdUseCase } = makeSut()

        const executeSpy = jest.spyOn(getUserIdUseCase, 'execute')

        const userId = faker.string.uuid()
        await sut.execute({
            query: {
                user_id: userId,
            },
        })

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})

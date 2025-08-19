import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'
import { UpdateTransactionController } from './update-transaction.js'

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)
        return { sut, updateTransactionUseCase }
    }

    const baseHttpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 200 when updating transaction successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when missing id params', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: {
                id: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when transaction id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: {
                transactionId: 'id_invalid',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                unallowedField: 'unallowed_value',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                date: 'invalid_date',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when UpdateTransactionUseCase throws UserNotFoundError', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when UpdateTransactionUseCase throws generic error', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        await sut.execute(baseHttpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            baseHttpRequest.params.transactionId,
            baseHttpRequest.body,
        )
    })
})

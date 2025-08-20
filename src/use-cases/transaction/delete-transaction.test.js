import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('DeleteTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    // class GetUserByIdRepositoryStub {
    //     async execute(userId) {
    //         return { id: userId }
    //     }
    // }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        // const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            // getUserByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            // getUserByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()
        const id = faker.string.uuid()

        const result = await sut.execute(id)

        expect(result).toEqual({
            ...transaction,
            id: id,
        })
    })
})

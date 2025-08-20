import { faker } from '@faker-js/faker'
// import { UserNotFoundError } from '../../errors/user.js'
import { UpdateTransactionUseCase } from './update-transaction.js'

describe('UpdateTransactionUseCase', () => {
    const updateTransactionParams = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }
    // const user = {
    //     first_name: faker.person.firstName(),
    //     last_name: faker.person.lastName(),
    //     email: faker.internet.email(),
    //     password: faker.internet.password({
    //         length: 8,
    //     }),
    // }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return { id: transactionId, ...updateTransactionParams }
        }
    }

    // class GetUserByIdRepositoryStub {
    //     async execute() {
    //         return user
    //     }
    // }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        // const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            // getUserByIdRepository,
        )

        return {
            sut,
            updateTransactionRepository,
            // getUserByIdRepository,
        }
    }

    // Test cases will go here
    it('should update transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(updateTransactionParams)

        expect(result).toEqual({ ...updateTransactionParams })
    })
})

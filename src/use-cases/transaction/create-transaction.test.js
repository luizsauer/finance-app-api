import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }
    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorStub {
        execute() {
            return 'generated_id'
        }
    }
    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGenerator = new IdGeneratorStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGenerator,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGenerator,
        }
    }
    // Test cases go here
    it('should create transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(createTransactionParams)

        expect(result).toEqual({
            ...createTransactionParams,
            id: 'generated_id',
        })
    })
})

import { jest } from '@jest/globals'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction, user } from '../../tests'
import { CreateTransactionUseCase } from './create-transaction.js'
describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined, // id will be generated
    }

    class CreateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class IdGeneratorStub {
        execute() {
            return 'generated_id'
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
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

        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(createTransactionParams)

        expect(getUserByIdSpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call IdGeneratorAdapter', async () => {
        const { sut, idGenerator } = makeSut()
        const idGeneratorSpy = jest.spyOn(idGenerator, 'execute')

        await sut.execute(createTransactionParams)

        expect(idGeneratorSpy).toHaveBeenCalled()
    })

    it('should call CreateUserRepository with correct params', async () => {
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionSpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(createTransactionSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'generated_id',
        })
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGenerator } = makeSut()
        jest.spyOn(idGenerator, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        const { sut, createTransactionRepository } = makeSut()
        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow()
    })
})

import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'

describe('GetTransactionsByUserIdUseCase', () => {
    class getTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new getTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }

    // Test cases will go here
    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()
        const userId = faker.string.uuid()

        const result = await sut.execute(userId)

        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        await sut.execute(userId)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetTransactionsByUserIdRepository with correct values', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const getTransactionsByUserIdRepositorySpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        await sut.execute(userId)

        expect(getTransactionsByUserIdRepositorySpy).toHaveBeenCalledWith(
            userId,
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )
        const userId = faker.string.uuid()

        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()

        jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        const userId = faker.string.uuid()

        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow()
    })
})

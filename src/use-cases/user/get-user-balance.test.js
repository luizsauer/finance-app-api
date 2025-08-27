import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { UserNotFoundError } from '../../errors/user'
import { user, userBalance } from '../../tests'
import { GetUserBalanceUseCase } from './get-user-balance'
describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        }
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)
        const user_id = faker.string.uuid()

        const promise = sut.execute(user_id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(user_id))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const user_id = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(user_id)

        expect(executeSpy).toHaveBeenCalledWith(user_id)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        const user_id = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

        await sut.execute(user_id)

        expect(executeSpy).toHaveBeenCalledWith(user_id)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const user_id = faker.string.uuid()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error('any_error'),
        )

        const promise = sut.execute(user_id)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        const user_id = faker.string.uuid()
        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValue(
            new Error('any_error'),
        )

        const promise = sut.execute(user_id)

        await expect(promise).rejects.toThrow()
    })
})

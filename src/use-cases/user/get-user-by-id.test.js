import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id.js'

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    it('should get user by id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(user)
    })

    it('should call getUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if getUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow()
    })

    it('should return null if user is not found', async () => {
        const { sut, getUserByIdRepository } = makeSut()

        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const result = await sut.execute(faker.string.uuid())

        expect(result).toBeNull()
    })
})

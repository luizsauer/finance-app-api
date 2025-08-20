import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'

import { user } from '../../tests'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()

        const sut = new DeleteUserUseCase(deleteUserRepository)

        return {
            sut,
            deleteUserRepository,
        }
    }

    it('should delete a user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        const { sut, deleteUserRepository } = makeSut()
        const deleteSpy = jest.spyOn(deleteUserRepository, 'execute')
        const userId = faker.string.uuid()

        await sut.execute(userId)

        expect(deleteSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw an error if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()
        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error('Database error'),
        )

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow('Database error')
    })

    // it('should throw an error if GetUserByIdRepository returns null', async () => {
    //     const { sut, getUserByIdRepository } = makeSut()
    //     jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

    //     const promise = sut.execute('user_id')

    //     await expect(promise).rejects.toThrow('User not found')
    // })

    it('should throw an error if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()
        jest.spyOn(deleteUserRepository, 'execute').mockImplementationOnce(
            () => {
                throw new Error('Database error')
            },
        )

        const promise = sut.execute('user_id')

        await expect(promise).rejects.toThrow('Database error')
    })
})

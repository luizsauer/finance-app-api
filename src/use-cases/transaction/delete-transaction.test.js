import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'
import { transaction } from '../../tests'
import { DeleteTransactionUseCase } from './delete-transaction.js'
describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()
        const id = faker.string.uuid()

        const result = await sut.execute(id)

        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct values', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        await sut.execute(id)

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        const promise = sut.execute(id)

        await expect(promise).rejects.toThrow()
    })
})

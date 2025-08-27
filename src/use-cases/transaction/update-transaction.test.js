// src\use-cases\transaction\update-transaction.test.js
import { jest } from '@jest/globals'
import { transaction } from '../../tests/index.js'
import { UpdateTransactionUseCase } from './update-transaction.js'
describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class GetTransactionByIdStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const getTransactionById = new GetTransactionByIdStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionById,
        )

        return {
            sut,
            updateTransactionRepository,
            getTransactionById,
        }
    }

    // Test cases will go here
    it('should update transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction)

        expect(result).toEqual(transaction)
    })

    it('should call updateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionRepository, 'execute')

        await sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        expect(executeSpy).toHaveBeenCalledWith(transaction.id, {
            amount: transaction.amount,
        })
    })

    it('should throw if updateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()

        jest.spyOn(updateTransactionRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        await expect(promise).rejects.toThrow()
    })
})

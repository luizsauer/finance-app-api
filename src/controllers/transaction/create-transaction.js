// src\controllers\transaction\create-transaction.js
import { ZodError } from 'zod'
import { createTransactionSchema } from '../../schemas/transactions.js'
import { badRequest, created, serverError } from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createTransactionSchema.parseAsync(params)

            const createdTransaction =
                await this.createTransactionUseCase.execute(params)

            return created(createdTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.issues[0].message })
            }
            console.error('Error creating transaction', error)
            return serverError(error)
        }
    }
}

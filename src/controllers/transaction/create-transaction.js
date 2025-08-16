import validator from 'validator'
import { badRequest, serverError } from '../helpers'
import { checkIfIdIsValid } from '../helpers/validators.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            // validar os dados do usuário
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `Missing required field: ${field}`,
                    })
                }
            }

            const isValidId = checkIfIdIsValid(params.id)
            if (isValidId) {
                return isValidId
            }

            if (params.amount <= 0) {
                return badRequest({
                    message:
                        'Invalid amount. Amount must be greater than zero.',
                })
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: 2,
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message:
                        'Invalid amount. Amount must be a positive currency value.',
                })
            }
            const type = params.type.toUpperCase().trim()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )
            if (!typeIsValid) {
                return badRequest({
                    message:
                        'Invalid type. Type must be either "EARNING", "EXPENSE", or "INVESTMENT".',
                })
            }

            const createdTransaction =
                await this.createTransactionUseCase.execute({
                    ...params,
                    type,
                })

            return createdTransaction
        } catch (error) {
            console.error('Error creating transaction', error)
            return serverError(error)
        }
    }
}

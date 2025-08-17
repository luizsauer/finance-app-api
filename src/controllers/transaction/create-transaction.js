// src\controllers\transaction\create-transaction.js
import validator from 'validator'
import {
    badRequest,
    checkIfIdIsValid,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            // validar os dados do usuário
            const { missingField, ok: requiredFieldsWereProvided } =
                validateRequiredFields(params, requiredFields)
            if (!requiredFieldsWereProvided) {
                return requiredFieldIsMissingResponse(missingField)
            }

            const isValidId = checkIfIdIsValid(params.user_id)
            if (isValidId) {
                return isValidId
            }

            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
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

            return ok(createdTransaction)
        } catch (error) {
            console.error('Error creating transaction', error)
            return serverError(error)
        }
    }
}

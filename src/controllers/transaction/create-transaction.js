// src\controllers\transaction\create-transaction.js
import {
    checkIfIdIsValid,
    ok,
    requiredFieldIsMissingResponse,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'
import {
    checkIfAmountIsValid,
    checkIfIsTypeValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/transaction.js'

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

            const amountIsValid = checkIfAmountIsValid(params.amount)

            if (!amountIsValid) {
                return invalidAmountResponse()
            }
            const type = params.type.toUpperCase().trim()

            const typeIsValid = checkIfIsTypeValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse()
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

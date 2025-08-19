// src\controllers\transaction\update-transaction.js
import { UserNotFoundError } from '../../errors/user.js'
import {
    badRequest,
    checkIfAmountIsValid,
    checkIfDateIsValid,
    checkIfIdIsValid,
    checkIfIsTypeValid,
    invalidAmountResponse,
    invalidDateResponse,
    invalidTypeResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idError = checkIfIdIsValid(httpRequest.params.transactionId)

            if (idError) {
                return idError
            }

            const params = httpRequest.body

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields are not allowed',
                })
            }

            // VALIDAÇÃO DA DATA (adicione este bloco)
            if (params.date) {
                const dateIsValid = checkIfDateIsValid(params.date)
                if (!dateIsValid) {
                    return invalidDateResponse()
                }
            }

            if (params.amount) {
                const amountIsValid = checkIfAmountIsValid(params.amount)

                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }

            if (params.type) {
                const typeIsValid = checkIfIsTypeValid(params.type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const updatedTransaction =
                await this.updateTransactionUseCase.execute(
                    httpRequest.params.transactionId,
                    params,
                )

            return ok(updatedTransaction)
        } catch (error) {
            // Adicione esta verificação
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError(error)
        }
    }
}

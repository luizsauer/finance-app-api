import validator from 'validator'
import { badRequest, notFound } from './index.js'

export const checkIfAmountIsValid = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        return false
    }
    return validator.isCurrency(amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    })
}

export const checkIfIsTypeValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)
}

export const invalidAmountResponse = () => {
    return {
        statusCode: 400,
        body: {
            message:
                'Invalid amount. Amount must be a positive currency value.',
        },
    }
}

export const invalidTypeResponse = () => {
    return {
        statusCode: 400,
        body: {
            message:
                'Invalid type. Type must be either "EARNING", "EXPENSE", or "INVESTMENT".',
        },
    }
}

export const transactionNotFoundResponse = () => {
    return notFound('Transaction not found.')
}

export const checkIfDateIsValid = (date) => {
    // Verifica se é uma string e se pode ser convertida para Date válido
    if (typeof date !== 'string') return false

    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime()) // Retorna true se for uma data válida
}

export const invalidDateResponse = () =>
    badRequest({
        message: 'Date must be a valid ISO string',
    })

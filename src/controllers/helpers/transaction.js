import validator from 'validator'

export const checkIfAmountIsValid = (amount) => {
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

// src\controllers\helpers\validation.js
import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => {
    if (!id || !validator.isUUID(id)) {
        return invalidIdResponse()
    }
    return null
}

export const invalidIdResponse = () =>
    badRequest({
        message: 'Invalid user ID format',
    })

export const requiredFieldIsMissingResponse = (field) =>
    badRequest({
        message: `The field ${field} is required.`,
    })

export const checkIfIsString = (value) => {
    return typeof value === 'string' || value instanceof String
}

export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], { ignore_whitespace: true })

        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }
    return {
        ok: true,
        message: undefined,
    }
}

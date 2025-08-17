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

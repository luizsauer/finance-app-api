// src\controllers\helpers\validation.js
import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => {
    if (!id || !validator.isUUID(id)) {
        console.error(`Invalid ID: ${id}`)
        return invalidIdResponse()
    }
    return null
}

export const invalidIdResponse = () =>
    badRequest({
        message: 'The provided Id is not valid.',
    })

export const requiredFieldIsMissingResponse = (field) =>
    badRequest({
        message: `The field ${field} is required.`,
    })

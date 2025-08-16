// src\controllers\helpers\user.js
import validator from 'validator'
import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () =>
    badRequest({
        message: 'Password must be at least 6 characters',
    })

export const invalidPasswordCharactersResponse = () =>
    badRequest({
        message: 'Password must contain at least one letter and one number',
    })

export const emailAlreadyInUseResponse = () =>
    badRequest({
        message: 'Email is already in use',
    })

export const invalidEmailResponse = () =>
    badRequest({
        message: 'Invalid email format',
    })

export const invalidNameResponse = () =>
    badRequest({
        message: 'Full name must include first and last name',
    })

export const invalidIdResponse = () =>
    badRequest({
        message: 'Invalid user ID format',
    })

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })

export const checkIfPasswordIsValid = (password) => {
    if (!password || password.length < 6) {
        return invalidPasswordResponse()
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
        return invalidPasswordCharactersResponse()
    }
    return null
}

export const checkIfEmailIsValid = (email) => {
    if (!email || !validator.isEmail(email)) {
        return invalidEmailResponse()
    }
    return null
}

export const checkIfConfirmPasswordIsValid = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return badRequest({
            message: 'Passwords do not match',
        })
    }
    return null
}
export const checkIfFullNameIsValid = (fullName) => {
    if (!fullName || fullName.split(' ').length < 2) {
        return invalidNameResponse()
    }
    return null
}

export const checkIfIdIsValid = (id) => {
    if (!id || !validator.isUUID(id)) {
        return invalidIdResponse()
    }
    return null
}

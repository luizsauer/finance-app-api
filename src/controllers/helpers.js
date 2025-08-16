// src\controllers\helpers.js
export const badRequest = (body) => ({
    statusCode: 400,
    body,
})

export const notFound = (body) => ({
    statusCode: 404,
    body,
})

export const internalServerError = (error) => ({
    statusCode: 500,
    body: {
        message: 'Internal Server Error',
        error: error?.message || error,
    },
})

export const created = (body) => ({
    statusCode: 201,
    body,
})

export const serverError = (error) => ({
    statusCode: 500,
    body: {
        message: 'Internal Server Error',
        error: error.message,
    },
})

export const ok = (body) => ({
    statusCode: 200,
    body,
})

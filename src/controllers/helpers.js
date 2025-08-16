export const badRequest = (body) => {
    return {
        statusCode: 400,
        body,
    }
}

export const notFound = (body) => {
    return {
        statusCode: 404,
        body,
    }
}

export const internalServerError = () => {
    return {
        statusCode: 500,
        message: 'Internal Server Error',
    }
}

export const created = (body) => {
    return {
        statusCode: 201,
        body,
    }
}

import { notFound } from './index.js'

export const transactionNotFoundResponse = () => {
    return notFound('Transaction not found.')
}

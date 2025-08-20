import { faker } from '@faker-js/faker'

export const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
}

// export const updateTransactionParams = {
//     id: createTransactionParams.id,
//     user_id: createTransactionParams.user_id,
//     date: createTransactionParams.date,
//     type: createTransactionParams.type,
//     amount: createTransactionParams.amount,
// }

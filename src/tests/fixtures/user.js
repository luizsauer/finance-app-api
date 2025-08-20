import { faker } from '@faker-js/faker'

export const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
        length: 8,
        // min: 8,
        // max: 20,
        // numeric: true,
        // special: true,
        // upper: 1,
        // numbers: 1,
    }),
}

export const userBalance = {
    earnings: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
}

// src\factories\controllers\transactions.js
import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresGetTransactionByUserIdRepository,
    PostgresGetUserByIdRepository,
} from '../../db/postgres/repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    GetTransactionsByUserIdUseCase,
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransactionsByUserIdController = () => {
    const getTransactionByUserIdRepository =
        new PostgresGetTransactionByUserIdRepository()

    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionByUserIdRepository,
        getUserByIdRepository,
    )

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)

    return getTransactionsByUserIdController
}

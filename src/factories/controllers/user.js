// src\factories\controllers\user.js
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js' // Importing the CreateUserController
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../db/postgres/repositories/postgres/index.js' // Importing the PostgresGetUserByIdRepository
import { GetUserByEmailRepository } from '../../db/postgres/repositories/postgres/user/get-user-by-email.js' // Importing the GetUserByEmailRepository
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from '../../use-cases/index.js' // Importing the GetUserByIdUseCase

export const makeUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(
        createUserRepository,
        getUserByEmailRepository,
    )
    const createUserController = new CreateUserController(createUserUseCase)
    return createUserController
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByEmailRepository,
    )
    const updateUserController = new UpdateUserController(updateUserUseCase)

    return updateUserController
}

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository()
    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserUseCase)
    return deleteUserController
}

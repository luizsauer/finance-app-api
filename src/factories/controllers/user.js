// src\factories\controllers\user.js
import {
    IdGeneratorAdapter,
    PasswordHasherAdapter,
} from '../../adapters/index.js'
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js' // Importing the CreateUserController
import {
    GetUserByEmailRepository,
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js' // Importing the PostgresGetUserByIdRepository
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
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const idGeneratorAdapter = new IdGeneratorAdapter()
    const createUserUseCase = new CreateUserUseCase(
        createUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    )
    const createUserController = new CreateUserController(createUserUseCase)
    return createUserController
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new GetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const passwordHasherAdapter = new PasswordHasherAdapter()
    const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
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

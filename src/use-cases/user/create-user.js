// src\use-cases\create-user.js

import EmailAlreadyInUseError from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        createUserRepository,
        getUserByEmailRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokenGeneratorAdapter,
    ) {
        this.createUserRepository = createUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
        this.tokenGeneratorAdapter = tokenGeneratorAdapter
    }

    async execute(userData) {
        // verificar se o email já está em uso

        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(userData.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(userData.email)
        }

        // Generate a unique ID for the user
        const userId = this.idGeneratorAdapter.execute()

        // Hash the password before saving
        const hashedPassword = await this.passwordHasherAdapter.execute(
            userData.password,
        )

        // Create the user using the repository
        const user = {
            id: userId,
            ...userData,
            password: hashedPassword,
        }

        // call the repository to create the user

        const createUser = await this.createUserRepository.execute(user)

        return {
            ...createUser,
            tokens: this.tokenGeneratorAdapter.execute(userId),
        }
    }
}
